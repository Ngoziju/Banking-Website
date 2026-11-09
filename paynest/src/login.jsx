import { useState } from "react";
import logoImage from "./assets/p logog.png";
import ThemeToggle from "./components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";


function Login({ theme, onThemeToggle }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-theme-toggle">
                    <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                </div>
                <div className="login-brand">
                    <span className="logo-icon">
                        <img src={logoImage} alt="" />
                    </span>
                    <span>PayNest</span>
                </div>
                <h1>Welcome Back</h1>
                <p>Sign in to access your Banking account</p>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        navigate("/dashboard");
                    }}
                >
                    <label htmlFor="login-username">Email or Username</label>
                    <input id="login-username" type="text" placeholder="Enter your email or username"/>
                 <label htmlFor="login-password">Password</label>
                 <div className="password-field">
                    <input
                        id="login-password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                    />
                    <button
                        className="password-visibility-toggle"
                        type="button"
                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                        aria-pressed={passwordVisible}
                        onClick={() => setPasswordVisible((visible) => !visible)}
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
                        <input type="checkbox" />Remember me </label>
                    <a href="#">Forgot Password?</a>
                </div>
                <button type="submit">Sign In</button>
                </form>
                <p className="register-text">Don't have an account?
                <Link to="/register"> Create Account</Link>
                </p>
            </div>
        </div>

    );
}
export default Login;