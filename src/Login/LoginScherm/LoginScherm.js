import React, { useState } from "react";
import "./LoginScreen.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

function LoginScreen({ setIsLoggedIn, setIsEmployee, setRole }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [forgotPassword, setForgotPassword] = useState(false);
    const [verifyCode, setVerifyCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginDetails = { email, password };

        try {
            const response = await fetch('https://localhost:7017/api/user/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginDetails),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully logged in:", data);
                const token = data.token;
                localStorage.setItem("authToken", token);

                const decodedToken = jwtDecode(token);
                const phoneNumber = decodedToken.userPhone || "";
                const address = decodedToken.userAddress || "";
                const postalCode = decodedToken.userPostalCode || "";

                localStorage.setItem("phoneNumber", phoneNumber);
                localStorage.setItem("address", address);
                localStorage.setItem("postalCode", postalCode);
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("customerType", data.customerType);
                localStorage.setItem("userId", data.userId);

                const userData = {
                    token: data.token,
                    userId: data.userId,
                    userName: data.userName,
                    userEmail: data.userEmail,
                    userType: data.userType,
                };
                localStorage.setItem("user", JSON.stringify(userData));
                setIsLoggedIn(true);
                if (data.role) {
                    setRole(data.role);
                    localStorage.setItem('role', data.role);
                }
                navigate("/");
            } else {
                const errorMsg = await response.text();
                setError(errorMsg || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred while logging in. Check your connection and try again.");
        }
    };

    const requestPasswordReset = async () => {
        try {
            const response = await fetch('https://localhost:7017/api/user/request-password-reset', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                alert("Verification code sent to your email.");
                setStep(2);
            } else {
                const errorMsg = await response.text();
                setError(errorMsg || "Error sending verification code.");
            }
        } catch (err) {
            setError("Failed to send verification code.");
        }
    };

    const resetPassword = async () => {
        try {
            const response = await fetch('https://localhost:7017/api/user/reset-password', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Email: confirmEmail, // Make sure this matches what the server expects
                    VerificationCode: verifyCode,
                    NewPassword: newPassword
                })
            });
            if (response.ok) {
                alert("Password reset successfully. You can now log in.");
                setForgotPassword(false);
                setStep(1);
            } else {
                const errorMsg = await response.text();
                setError(errorMsg || "Error resetting password.");
            }
        } catch (err) {
            setError("Failed to reset password.");
        }
    };


    return (
        <div className="login-container">
            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-box">
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FaUserAlt className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <FaLock className="icon"/>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>CarAndAll Employee? <Link to="/EmployeeLogin">Login as Employee</Link></p>
                        <p>Don't have an account? <Link to="/SignUp">Register</Link></p>
                        <button className="forgot-password-btn" onClick={() => setForgotPassword(true)}>Forgot Password?</button>
                    </div>
                </form>
            </div>
            {forgotPassword && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Reset Password</h2>
                        {step === 1 && (
                            <>
                                <p>Enter your email to receive a verification code.</p>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button onClick={requestPasswordReset}>Send Code</button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <p>Enter your email, verification code, and new password.</p>
                                <input type="email" placeholder="Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required />
                                <input type="text" placeholder="Verification Code" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} required />
                                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                <button onClick={resetPassword}>Reset Password</button>
                            </>
                        )}
                        <button className="close-btn" onClick={() => setForgotPassword(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginScreen;
