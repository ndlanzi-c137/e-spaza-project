import React from 'react';
import Login from './components/Login';
import ShopperDashboard from './components/ShopperDashboard';
import StaffDashboard from './components/StaffDashboard';
import SignupOptions from './components/SignupOptions';
import SignupAdmin from './components/Admin/SignupAdmin';
import SignupStaff from './components/Staff/SignupStaff';
import Food from './components//Shopper/Food';
import Spazas from './components/Shopper/Spazas';
import Categories from './components/Shopper/Categories';
import SignupShopper from './components/Shopper/SignupShopper';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Shopper/Checkout';

function App() {
  return (
    <div className="App">
     
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup-options" element={<SignupOptions />} />
          <Route path="/signup-admin" element={<SignupAdmin />} />
          <Route path="/signup-staff" element={<SignupStaff />} />
          <Route path="/signup-shopper" element={<SignupShopper />} />
          <Route path="/shopperdashboard" element={<ShopperDashboard/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path="/staffdashboard" element={<StaffDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard/>} />
          <Route path="/category/:categoryName" element={<Food />} />
          <Route path="/shop/:shopName" element={<Spazas />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;