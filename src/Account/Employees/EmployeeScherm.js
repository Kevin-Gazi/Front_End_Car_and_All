import React, { useEffect, useState } from "react";
import "./Employees.css";

const EmployeeScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
    });
    const [editMode, setEditMode] = useState(null); // For the current employee in edit mode
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // Fetching employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch("https://localhost:7017/api/employee/GetEmployees", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Server error." }));
                throw new Error(errorData.message || "Error while retrieving employees.");
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("[Frontend] Error retrieving employees:", error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token]);

    // Handling form input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Creating a new employee
    const handleCreateEmployee = async () => {
        const payload = {
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            Email: formData.Email,
            Password: formData.Password,
        };

        console.log("[Frontend] Sent payload:", payload);

        try {
            const response = await fetch("https://localhost:7017/api/employee/CreateEmployee", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Frontend] Error received from backend:", errorData);
                throw new Error(errorData.message || "Error while creating employee.");
            }

            alert("Employee successfully created.");
            setFormData({ FirstName: "", LastName: "", Email: "", Password: "" });
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Error creating employee:", err.message);
            setError(err.message);
        }
    };

    // Deleting an employee
    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/employee/DeleteEmployee/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error while deleting employee.");
            }

            alert("Employee successfully deleted.");
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Error deleting employee:", err.message);
            setError(err.message);
        }
    };

    // Editing an employee
    const handleEdit = (employee) => {
        setEditMode(employee.id); // Set the employee ID in edit mode
        setFormData(employee); // Fill the form with the existing data of the employee
    };

    // Saving changes
    const handleSave = async () => {
        try {
            const payload = {
                FirstName: formData.firstName,
                LastName: formData.lastName,
                Email: formData.email,
                Password: formData.password || "", // Only update if provided
            };

            const response = await fetch(`https://localhost:7017/api/employee/UpdateEmployee/${editMode}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error while updating employee.");
            }

            alert("Employee successfully updated.");
            setEditMode(null); // Close edit mode
            fetchEmployees(); // Update the list
        } catch (err) {
            console.error("[Frontend] Error while updating employee:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="employees-container">
            <h2>Manage Employees</h2>
            {error && <p className="error">{error}</p>}
            <div className="employee-form">
                <h3>Add New Employee</h3>
                <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                />
                <button onClick={handleCreateEmployee}>Add</button>
            </div>

            <div className="employee-list">
                <h3>Current Employees</h3>
                {employees.map((employee) => (
                    <div key={employee.id} className="employee-card">
                        {editMode === employee.id ? (
                            <>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password || ""}
                                    onChange={handleInputChange}
                                    placeholder="New Password (optional)"
                                />
                                <button onClick={handleSave}>Save</button>
                                <button onClick={() => setEditMode(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>Name:</strong> {employee.firstName} {employee.lastName}
                                </p>
                                <p>
                                    <strong>Email:</strong> {employee.email}
                                </p>
                                <button onClick={() => handleEdit(employee)}>Edit</button>
                                <button
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    style={{ backgroundColor: "red", color: "white" }}
                                >
                                    Delete Employee
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeScreen;
