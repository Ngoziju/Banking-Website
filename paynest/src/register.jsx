import { useState } from "react";
import logoImage from "./assets/p logog.png";
import ThemeToggle from "./components/ThemeToggle";
import { Link } from "react-router-dom";

function Register({ theme, onThemeToggle }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const passwordsDoNotMatch =
        confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <div className="login-page register-page">
            <div className="login-container register-container">
                <div className="login-theme-toggle">
                    <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                </div>
                <div className="login-brand">
                    <span className="logo-icon">
                        <img src={logoImage} alt="" />
                    </span>
                    <span>PayNest</span>
                </div>
                <h1>Create Account</h1>
                <p>Join PayNest and enjoy smarter banking.</p>
                <form onSubmit={(event) => event.preventDefault()}>
                    <div className="register-fields">
                    <label htmlFor="register-first-name">First Name</label>
                    <input id="register-first-name" type="text" placeholder="Enter first name" required />
                    <label htmlFor="register-last-name">Last Name</label>
                    <input id="register-last-name" type="text" placeholder="Enter last name" required />
                    <label htmlFor="register-email">Email</label>
                    <input id="register-email" type="email" placeholder="Enter email address" required />
                    <label htmlFor="register-phone">Phone Number</label>
                    <input id="register-phone" type="tel" placeholder="Enter phone number" required />
                    <label htmlFor="register-country">Country</label>
                    <select
                        id="register-country"
                        required
                        value={selectedCountry}
                        onChange={(event) => setSelectedCountry(event.target.value)}
                    >
                        <option value="" disabled>Select your country</option>
                        <option value="us">United States</option>
                        <option value="ca">Canada</option>
                        <option value="uk">United Kingdom</option>
                        <option value="au">Australia</option>
                        <option value="in">India</option>
                        <option value="de">Germany</option>
                        <option value="fr">France</option>
                        <option value="jp">Japan</option>
                        <option value="cn">China</option>
                        <option value="br">Brazil</option>
                        <option value="za">South Africa</option>
                        <option value="mx">Mexico</option>
                        <option value="es">Spain</option>
                        <option value="it">Italy</option>
                        <option value="ru">Russia</option>
                        <option value="kr">South Korea</option>
                        <option value="se">Sweden</option>
                        <option value="no">Norway</option>
                        <option value="fi">Finland</option>
                        <option value="dk">Denmark</option>
                        <option value="nl">Netherlands</option>
                        <option value="be">Belgium</option>
                        <option value="ch">Switzerland</option>
                        <option value="at">Austria</option>
                        <option value="ie">Ireland</option>
                        <option value="nz">New Zealand</option>
                        <option value="sg">Singapore</option>
                        <option value="my">Malaysia</option>
                        <option value="th">Thailand</option>
                        <option value="id">Indonesia</option>
                        <option value="ph">Philippines</option>
                        <option value="vn">Vietnam</option>
                        <option value="ae">United Arab Emirates</option>
                        <option value="sa">Saudi Arabia</option>
                        <option value="eg">Egypt</option>
                        <option value="ke">Kenya</option>
                        <option value="ng">Nigeria</option>
                        <option value="ar">Argentina</option>
                        <option value="cl">Chile</option>
                        <option value="co">Colombia</option>
                        <option value="pe">Peru</option>
                        <option value="ve">Venezuela</option>
                        <option value="uy">Uruguay</option>
                        <option value="ec">Ecuador</option>
                        <option value="cr">Costa Rica</option>
                        <option value="pa">Panama</option>
                        <option value="do">Dominican Republic</option>
                        <option value="gt">Guatemala</option>
                        <option value="hn">Honduras</option>
                        <option value="sv">El Salvador</option>
                        <option value="ni">Nicaragua</option>
                        <option value="pr">Puerto Rico</option>
                        <option value="other">Other (type your country)</option>
                    </select>
                    {selectedCountry === "other" && (
                        <input
                            id="register-country-other"
                            type="text"
                            placeholder="Type your country"
                            autoComplete="country-name"
                            aria-label="Enter your country"
                            required
                        />
                    )}
                    <label htmlFor="register-gender">Gender</label>
                    <select id="register-gender" required defaultValue="">
                        <option value="" disabled>Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <label htmlFor="register-password">Password</label>
                    <div className="password-field">
                        <input
                            id="register-password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter password"
                            minLength={6}
                            aria-describedby={password.length > 0 && password.length < 6 ? "register-password-hint" : undefined}
                            onChange={(event) => setPassword(event.target.value)}
                            required
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
                    {password.length > 0 && password.length < 6 && (
                        <span className="password-hint" id="register-password-hint" role="status">
                            Password must be at least 6 characters.
                        </span>
                    )}
                    <label htmlFor="register-confirm-password">Confirm Password</label>
                    <div className="password-field">
                        <input
                            id="register-confirm-password"
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="Confirm password"
                            aria-describedby={passwordsDoNotMatch ? "register-confirm-password-hint" : undefined}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                        <button
                            className="password-visibility-toggle"
                            type="button"
                            aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
                            aria-pressed={confirmPasswordVisible}
                            onClick={() => setConfirmPasswordVisible((visible) => !visible)}
                        >
                            {confirmPasswordVisible ? (
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
                    {passwordsDoNotMatch && (
                        <span
                            className="password-hint"
                            id="register-confirm-password-hint"
                            role="status"
                        >
                            Enter the same password.
                        </span>
                    )}
                    </div>
                <button type="submit">Create Account</button>
                </form>
                <p className="register-text">Already have an account?
                <Link to="/"> Sign In</Link>
                </p>
            </div>
        </div>
    );
}
export default Register;