import React from 'react';
import { useNavigate } from "react-router-dom";

function ShopperDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions, such as clearing authentication tokens or session data
    // For simplicity, let's just navigate back to the login page
    navigate('/');
};
  return (
    <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>SHOPPER DASHBOARD</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ShopperDashboard;
