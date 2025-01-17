import React, { useState } from "react";

const DeleteAccount = ({ handleDelete }) => {
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (password.trim() !== "") {
            handleDelete(password);
        } else {
            alert("Please enter your password.");
        }
    };

    return (
        <div>
            <h1>Delete Account</h1>
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Confirm</button>
        </div>
    );
};

export default DeleteAccount;
