import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import UserManagement from "./Admin/UserManagement";
import Navbar from "./Shopper/Navbar";

function AdminDashboard(){

    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout actions, such as clearing authentication tokens or session data
        // For simplicity, let's just navigate back to the login page
        navigate('/');
    };


    return(
        <div style={{backgroundColor: '#fcf9f9'}}>
        <Navbar />
        <UserManagement />

    </div>
    );
}

export default AdminDashboard;