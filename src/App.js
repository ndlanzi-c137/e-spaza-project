import React from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import ShopperDashboard from './components/ShopperDashboard';
import StaffDashboard from './components/StaffDashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Shopper/Checkout';

function App() {
  return (
    <div className="App">
     
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/shopperdashboard" element={<ShopperDashboard/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path="/staffdashboard" element={<StaffDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;