import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import InventoryManagement from "./Staff/InventoryManagement";
import OrderManagement from "./Staff/OrderManagement";
import Navbar from "./Staff/NavbarStaff";

function StaffDashboard(){

    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout actions, such as clearing authentication tokens or session data
        // For simplicity, let's just navigate back to the login page
        navigate('/');
    };


    return(
    <div style={{backgroundColor: '#fcf9f9'}}>
    <Navbar />
    <InventoryManagement/>
    <OrderManagement /> 
    </div>
    );
}

export default StaffDashboard;