import React from 'react';
import Navbar from './Components/Navbar';
import HomePage from './Components/HomePage';
import UserLogin from './Components/UserLogin';
import UserDashboard from './Components/user_dashobard'; 
import AdminDashboard from './Components/admin_dashboard';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user-dashboard/:username" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/user-details/:username" element={<UserDashboard />} />
        {/* <Route path="/user-details/:user_id" element={<UserDashboard />} /> */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
