
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/db");
const authenticateToken = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// Temporary password-reset storage.
// Move this to PostgreSQL before production.
const resetCodes = new Map();
const resetSessions = new Map();
const resetRequests = new Map();

const RESET_CODE_TTL = 10 * 60 * 1000;
const RESET_SESSION_TTL = 10 * 60 * 1000;
const RESET_REQUEST_INTERVAL = 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

function createCodeHash(email, code) {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${email}:${code}`)
    .digest();
}

function cleanExpiredResetData(now) {
  for (const [email, reset] of resetCodes) {
    if (reset.expiresAt <= now) resetCodes.delete(email);
  }

  for (const [token, session] of resetSessions) {
    if (session.expiresAt <= now) resetSessions.delete(token);
  }

  for (const [email, timestamp] of resetRequests) {
    if (timestamp + RESET_REQUEST_INTERVAL <= now) {
      resetRequests.delete(email);
    }
  }
}

// =====================================
// REGISTER
// =====================================

router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password
    } = req.body ?? {};

    if (![first_name, last_name, email, phone, password].every(
      value => typeof value === "string" && value.trim()
    )) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const existingUser = await pool.query(
      `SELECT id
       FROM public.users
       WHERE LOWER(TRIM(email)) = $1 OR phone = $2`,
      [cleanEmail, cleanPhone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email or phone number already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO public.users
       (first_name, last_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, phone, status, created_at`,
      [
        first_name.trim(),
        last_name.trim(),
        cleanEmail,
        cleanPhone,
        passwordHash
      ]
    );

    return res.status(201).json({
      message: "PayNest account created successfully!",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email or phone number already exists"
      });
    }

    return res.status(500).json({
      message: "Registration failed"
    });
  }
});

// =====================================
// LOGIN
// =====================================

router.post("/login", async (req, res) => {
  console.log("PAYNEST LOGIN ROUTE REACHED");

  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check which database the backend is connected to.
    const dbCheck = await pool.query(
      `SELECT
        inet_server_addr()::text AS server_address,
        inet_server_port() AS server_port,
        current_user AS database_user,
        current_database() AS database,
        current_schema() AS schema,
        (SELECT COUNT(*) FROM public.users) AS total_users,
        (SELECT COUNT(*) FROM public.users
         WHERE LOWER(TRIM(email)) = $1) AS matching_users`,
      [cleanEmail]
    );

    console.log("BACKEND DATABASE CHECK:", dbCheck.rows[0]);

    // Find the user by email.
    const result = await pool.query(
      `SELECT id, first_name, last_name, email,
              password_hash, status
       FROM public.users
       WHERE LOWER(TRIM(email)) = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      console.log("LOGIN EMAIL RECEIVED:", cleanEmail);
      console.log("DATABASE QUERY RESULT:", result.rows);

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      console.error("Login failed: password hash missing");

      return res.status(500).json({
        message: "Account password data is unavailable"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    console.log("Login email:", user.email);
    console.log("Password hash exists:", !!user.password_hash);
    console.log("Password matches:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account is not active"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed"
    });
  }
});

// =====================================
// FORGOT PASSWORD
// =====================================

router.post("/forgot-password", async (req, res) => {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      message: "Enter a valid email address"
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({
      message: "Password reset is temporarily unavailable"
    });
  }

  const now = Date.now();

  cleanExpiredResetData(now);

  const lastRequest = resetRequests.get(email);

  if (lastRequest && now < lastRequest + RESET_REQUEST_INTERVAL) {
    return res.status(429).json({
      message: "Please wait a minute before requesting another code"
    });
  }

  resetRequests.set(email, now);

  try {
    const result = await pool.query(
      `SELECT id
       FROM public.users
       WHERE LOWER(TRIM(email)) = $1`,
      [email]
    );

    if (result.rows.length > 0) {
      const code = crypto.randomInt(0, 1000000)
        .toString()
        .padStart(6, "0");

      resetCodes.set(email, {
        userId: result.rows[0].id,
        codeHash: createCodeHash(email, code),
        expiresAt: now + RESET_CODE_TTL,
        attempts: 0
      });

      try {
        await sendEmail(
          email,
          "Your PayNest password reset code",
          `
            <div style="font-family: Arial, sans-serif;">
              <h2>PayNest Password Reset</h2>
              <p>Your verification code is:</p>
              <h1 style="letter-spacing: 8px;">${code}</h1>
              <p>This code expires in 10 minutes.</p>
              <p>If you did not request this, ignore this email.</p>
            </div>
          `
        );
      } catch (error) {
        resetCodes.delete(email);
        resetRequests.delete(email);

        console.error("Email sending error:", error.message);

        return res.status(502).json({
          message: "We could not send the verification email. Please try again later."
        });
      }
    }

    return res.json({
      message: "If an account exists for that email, a verification code has been sent."
    });

  } catch (error) {
    resetRequests.delete(email);

    console.error("Password reset request error:", error.message);

    return res.status(500).json({
      message: "Could not start the password reset. Please try again."
    });
  }
});

// =====================================
// VERIFY RESET CODE
// =====================================

router.post("/verify-reset-code", (req, res) => {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";

  const code = typeof req.body?.code === "string"
    ? req.body.code
    : "";

  const reset = resetCodes.get(email);

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^\d{6}$/.test(code) ||
    !reset
  ) {
    return res.status(400).json({
      message: "The code is invalid or has expired"
    });
  }

  if (reset.expiresAt <= Date.now()) {
    resetCodes.delete(email);

    return res.status(400).json({
      message: "The code is invalid or has expired"
    });
  }

  const submittedHash = createCodeHash(email, code);

  if (!crypto.timingSafeEqual(reset.codeHash, submittedHash)) {
    reset.attempts += 1;

    if (reset.attempts >= MAX_CODE_ATTEMPTS) {
      resetCodes.delete(email);
    }

    return res.status(400).json({
      message: "The code is invalid or has expired"
    });
  }

  resetCodes.delete(email);

  const resetToken = crypto.randomBytes(32).toString("hex");

  resetSessions.set(resetToken, {
    userId: reset.userId,
    expiresAt: Date.now() + RESET_SESSION_TTL
  });

  return res.json({
    message: "Verification successful",
    resetToken
  });
});

// =====================================
// RESET PASSWORD
// =====================================

router.post("/reset-password", async (req, res) => {
  const { resetToken, password } = req.body ?? {};

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }

  if (typeof resetToken !== "string") {
    return res.status(400).json({
      message: "The reset session is invalid or expired"
    });
  }

  const reset = resetSessions.get(resetToken);

  if (!reset || reset.expiresAt <= Date.now()) {
    resetSessions.delete(resetToken);

    return res.status(400).json({
      message: "The reset session is invalid or expired"
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `UPDATE public.users
       SET password_hash = $1
       WHERE id = $2
       RETURNING id`,
      [passwordHash, reset.userId]
    );

    if (result.rows.length === 0) {
      resetSessions.delete(resetToken);

      return res.status(400).json({
        message: "The reset session is invalid or expired"
      });
    }

    resetSessions.delete(resetToken);

    return res.json({
      message: "Your password has been reset successfully"
    });

  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({
      message: "Could not reset the password. Please try again."
    });
  }
});

// =====================================
// GET USER PROFILE
// =====================================

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email,
              phone, status, created_at
       FROM public.users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json({
      message: "User profile retrieved successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: "Could not retrieve user profile"
    });
  }
});

module.exports = router;
