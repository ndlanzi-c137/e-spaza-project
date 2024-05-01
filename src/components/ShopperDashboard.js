import React from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Shopper/Navbar';
import Category from './Shopper/Categories';
import Food from './Shopper/Food';
import Spazas from './Shopper/Spazas';

function ShopperDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions, such as clearing authentication tokens or session data
    // For simplicity, let's just navigate back to the login page
    navigate('/');
};
  return (
    <div style={{backgroundColor: '#fcf9f9'}}>
    <Navbar />
    <Category />
    <Spazas /> 
    <Food />
    {/* <Hero />
    <HeadlineCards />
    
    */}
</div>

  );
}

export default ShopperDashboard;
