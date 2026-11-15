import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "./src/assets/p logog.png";
import ThemeToggle from "./src/components/ThemeToggle";
import { apiUrl } from "./src/api";

async function requestReset(path, payload) {
  let response;
  try {
    response = await fetch(apiUrl(`auth/${path}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Could not connect to PayNest. Check that the server is running.");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "Something went wrong. Please try again.");
  }
  return result;
}

function ForgetPassword({ theme, onThemeToggle }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event, action) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await action();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendCode() {
    const result = await requestReset("forgot-password", { email });
    setStep("code");
    setNotice(result.message);
  }

  async function verifyCode() {
    const result = await requestReset("verify-reset-code", { email, code });
    setResetToken(result.resetToken);
    setStep("password");
  }

  async function resetPassword() {
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    const result = await requestReset("reset-password", {
      resetToken,
      password,
    });
    setStep("success");
    setNotice(result.message);
  }

  const headings = {
    email: "Forgot Password",
    code: "Check your email",
    password: "Set a new password",
    success: "Password reset",
  };
  const descriptions = {
    email: "Please enter the email associated with your account and we’ll send you a code.",
    code: `Enter the code we sent to ${email}.`,
    password: "Your new password must be different from your previously used password.",
    success: "Your password has been reset. You can now log in with your new password.",
  };

  return (
    <main className="login-page">
      <section className="login-container forgot-container" aria-labelledby="forgot-heading">
        {onThemeToggle && (
          <div className="login-theme-toggle">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        )}

        <div className="forgot-brand-icon">
          <img alt="" src={logoImage} />
        </div>
        <h1 id="forgot-heading">{headings[step]}</h1>
        <p className="forgot-description">{descriptions[step]}</p>

        {error && <p className="forgot-feedback error" role="alert">{error}</p>}
        {notice && step !== "success" && (
          <p className="forgot-feedback notice" role="status">{notice}</p>
        )}

        {step === "email" && (
          <form className="forgot-form" onSubmit={(event) => submit(event, sendCode)}>
            <label htmlFor="forgot-email">Email</label>
            <input
              autoComplete="email"
              id="forgot-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              type="email"
              value={email}
            />
            <button disabled={busy} type="submit">{busy ? "Sending..." : "Send"}</button>
          </form>
        )}

        {step === "code" && (
          <form className="forgot-form" onSubmit={(event) => submit(event, verifyCode)}>
            <label htmlFor="forgot-code">Verification code</label>
            <div className="forgot-code">
              <input
                autoComplete="one-time-code"
                autoFocus
                id="forgot-code"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                pattern="[0-9]{6}"
                required
                value={code}
              />
              <div aria-hidden="true" className="forgot-code-slots">
                {Array.from({ length: 6 }, (_, index) => (
                  <span key={index}>{code[index] || ""}</span>
                ))}
              </div>
            </div>
            <button disabled={busy || code.length !== 6} type="submit">
              {busy ? "Checking..." : "Continue"}
            </button>
            <p className="forgot-resend">
              Didn’t get a code?{" "}
              <button disabled={busy} onClick={(event) => submit(event, sendCode)} type="button">
                Click to resend
              </button>
            </p>
          </form>
        )}

        {step === "password" && (
          <form className="forgot-form" onSubmit={(event) => submit(event, resetPassword)}>
            <label htmlFor="forgot-new-password">New password</label>
            <div className="password-field">
              <input
                autoComplete="new-password"
                id="forgot-new-password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="password-visibility-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
            <label htmlFor="forgot-confirm-password">Confirm password</label>
            <div className="password-field">
              <input
                autoComplete="new-password"
                id="forgot-confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your new password again"
                required
                type={showConfirmation ? "text" : "password"}
                value={confirmPassword}
              />
              <button
                aria-label={showConfirmation ? "Hide password" : "Show password"}
                className="password-visibility-toggle"
                onClick={() => setShowConfirmation((visible) => !visible)}
                type="button"
              >
                {showConfirmation ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
            <button disabled={busy} type="submit">{busy ? "Resetting..." : "Reset password"}</button>
          </form>
        )}

        {step === "success" && (
          <p className="forgot-feedback notice" role="status">{notice}</p>
        )}

        {step === "success" ? (
          <Link className="forgot-primary-link" to="/">Back to log in</Link>
        ) : (
          <Link className="forgot-back" to="/">
            <ArrowLeft aria-hidden="true" size={15} /> Back to log in
          </Link>
        )}
      </section>
    </main>
  );
}

export default ForgetPassword;
