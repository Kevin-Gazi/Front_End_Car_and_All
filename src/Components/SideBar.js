import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

function Sidebar({ userType }) {
    return (
        <div className="sidebar">
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        Dashboard
                    </NavLink>
                </li>
                {userType !== "Werknemer" && (
                    <li>
                        <NavLink to="/rentals" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            Rentals
                        </NavLink>
                    </li>
                )}
                {userType === "Werknemer" && (
                    <>
                        <li>
                            <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Notifications
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/account-settings" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                Account Settings
                            </NavLink>
                        </li>
                    </>
                )}
                {userType === "Zakelijk" && (
                    <li>
                        <NavLink to="/employees" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            Employees
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default Sidebar;