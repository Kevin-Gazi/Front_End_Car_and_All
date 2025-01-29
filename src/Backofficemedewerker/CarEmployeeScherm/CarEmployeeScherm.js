import React, { useEffect, useState } from "react";
import "./CarEmployeeScherm.css"; // Same style as BusinessRequests.css

const CarEmployeeScherm = () => {
    const [employees, setEmployees] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        address: "",
        email: "",
        phoneNumber: "",
        role: "BackOffice",
    });
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/get-employees", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Server error." }));
                throw new Error(errorData.message || "Error fetching employees.");
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("[Frontend] Error fetching employees:", error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Create employee
    const handleCreateEmployee = async () => {
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            address: formData.address,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
        };

        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/register-employee", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error creating employee.");
            }

            alert("Employee successfully registered.");
            setFormData({ firstName: "", lastName: "", password: "", address: "", email: "", phoneNumber: "", role: "BackOffice" });
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Error registering employee:", err.message);
            setError(err.message);
        }
    };

    // Edit employee (only role and password)
    const handleEdit = (employee) => {
        setEditMode(employee.id);
        setFormData({ role: employee.role, password: "" });
    };

    // Save changes
    const handleSave = async (id) => {
        const payload = {
            role: formData.role,
            password: formData.password || "",
        };

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/update-employee/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error updating employee.");
            }

            alert("Employee successfully updated.");
            setEditMode(null);
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Error updating employee:", err.message);
            setError(err.message);
        }
    };

    // Delete an employee
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/delete-employee/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error deleting employee.");
            }

            alert("Employee successfully deleted.");
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Error deleting employee:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="employees-container">
            <h2>Manage CarandAll Employees</h2>
            {error && <p className="error">{error}</p>}
            <div className="employee-form">
                <h3>Add New Employee</h3>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" required />
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" required />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" required />
                <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="BackOffice">BackOffice</option>
                    <option value="FrontOffice">FrontOffice</option>
                </select>
                <button onClick={handleCreateEmployee}>Add</button>
            </div>
            {/* ✅ Employee list */}
            <div className="employee-list">
                <h3>Current Employees</h3>
                <div className="requests-container">
                    {employees.map((employee) => (
                        <div key={employee.id} className="request-card">
                            {editMode === employee.id ? (
                                <div className="edit-form">
                                    <select name="role" value={formData.role} onChange={handleInputChange}>
                                        <option value="BackOffice">BackOffice</option>
                                        <option value="FrontOffice">FrontOffice</option>
                                    </select>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="New password" />
                                    <button className="save-btn" onClick={() => handleSave(employee.id)}>Save</button>
                                    <button className="delete-btn" onClick={() => setEditMode(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <div className="request-details">
                                        <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
                                        <p><strong>Email:</strong> {employee.email}</p>
                                        <p><strong>Role:</strong> {employee.role}</p>
                                    </div>
                                    <div className="request-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarEmployeeScherm;
