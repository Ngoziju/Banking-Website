
import { useState } from "react";
import logoImage from "./assets/p logog.png";
import ThemeToggle from "./components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "./api";

function Login({ theme, onThemeToggle }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(apiUrl("auth/login"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (!data.token) {
                throw new Error("Authentication token was not received.");
            }

            localStorage.setItem("paynestToken", data.token);

            navigate("/dashboard");

        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-theme-toggle">
                    <ThemeToggle
                        theme={theme}
                        onToggle={onThemeToggle}
                    />
                </div>

                <div className="login-brand">
                    <span className="logo-icon">
                        <img src={logoImage} alt="PayNest logo" />
                    </span>
                    <span>PayNest</span>
                </div>

                <h1>Welcome Back</h1>
                <p>Sign in to access your Banking account</p>

                <form onSubmit={handleLogin}>

                    <label htmlFor="login-username">
                        Email
                    </label>

                    <input
                        id="login-username"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="login-password">
                        Password
                    </label>

                    <div className="password-field">
                        <input
                            id="login-password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <button
                            className="password-visibility-toggle"
                            type="button"
                            aria-label={passwordVisible ? "Hide password" : "Show password"}
                            aria-pressed={passwordVisible}
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.9 7.7 3 12 3 12s3.5 7 9 7c1 0 2-.2 2.8-.6" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="login-options">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?
                    <Link to="/register"> Create Account</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
