import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Navbar from './Components/Navbar/Navbar';
import Welcome from './Components/welcome text/Welcome';
import Cards from './Components/cards/Cards';
import Footer from './Components/footer/Footer';
import Dropdowncourses from './Components/dropdown-courses-menus/dropdowncourses';
import Home from "./Components/Home/Home";
import Contact from "./Components/contact/contact";
import Login from "./Components/Profile/Login";
import FranchiseeNavbar from "./Components/Franchisee-profile/Franchisee-navbar/Franchiseenavbar";

function Layout() {
  const location = useLocation(); // Get current route
  const isLoginPage = location.pathname === "/login"; // Check if on login page
  const isFranchiseeProfile = location.pathname === "/franchprofile"; // Check for franchisee profile page

  return (
    <div className={isLoginPage ? "login-page" : ""}> 
      {/* Always show Main Navbar */}
      {!isLoginPage && <Navbar />}
      
      {/* Show Franchisee Navbar below Main Navbar only on /franchprofile */}
      {isFranchiseeProfile && <FranchiseeNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card" element={<Cards />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dropdowncourses" element={<Dropdowncourses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* No duplicate FranchiseeNavbar, just the correct component */}
        <Route path="/franchprofile" element={<div />} />
      </Routes>

      {/* Show Footer if NOT on login page */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
