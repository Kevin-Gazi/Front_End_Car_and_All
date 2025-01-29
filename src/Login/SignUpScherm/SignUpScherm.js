import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpScreen.css";

function SignUpScreen() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        customerType: "Individual",
        companyNumber: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("The password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Account created successfully!");
                navigate("/login");
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("An error occurred during registration.");
        }
    };

    return (
        <div className="login-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Create an Account</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-box">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <select
                            name="customerType"
                            value={formData.customerType}
                            onChange={handleChange}
                            required
                        >
                            <option value="Individual">Individual</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                    {formData.customerType === "Business" && (
                        <div className="input-box">
                            <input
                                type="text"
                                name="companyNumber"
                                placeholder="Company Number (KvK)"
                                value={formData.companyNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">Create Account</button>
                    <div className="register-link">
                        <p>
                            Already have an account? <a href="/login">Log in</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpScreen;
