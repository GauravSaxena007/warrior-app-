import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Navbar from './Components/navbar/Navbar';
import Welcome from './Components/welcome text/Welcome';
import Cards from './Components/cards/Cards';
import Footer from './Components/footer/Footer';
import Dropdowncourses from './Components/Courses/Dropdowncourses';
import Home from "./Components/Home/Home";
import Contact from "./Components/contact/Contact";
import Login from "./Components/Profile/Login";
import FranchiseeNavbar from "./Components/Franchisee-profile/Franchisee-navbar/Franchiseenavbar";
import Loginlayout from "./Components/Franchisee-profile/Layout/Loginlayout";
import Certiverify from "./Components/Franchisee-profile/Certi-verify/Certiverify";
import Testing from "./Components/Testing";
import Courses from "./Components/Courses/Courses";
import Courierdetail from "./Components/Franchisee-profile/Courier-detail/Courierdetail";
import ReelComp from "./Components/ReelComp/ReelComp";
import PrivateRoute from "./Components/PrivateRoute";
import AdminLogin from "./Components/Profile/AdminLogin";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isFranchiseeProfile = location.pathname === "/franchprofile";
  const isAdminLoginPage = location.pathname === "/adminlogin"; // Add this line for admin login

  // ✅ NEW: Add this to control navbar visibility
  const hideNavbarPaths = ["/login", "/adminlogin"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      {/* Show Loginlayout only on /franchprofile */}
      {isFranchiseeProfile ? <Loginlayout /> : null}

      {/* ✅ NEW: Conditionally render Navbar */}
      {!shouldHideNavbar && !isFranchiseeProfile && <Navbar />}

      {/* Show Franchisee Navbar only on /franchprofile */}
      {isFranchiseeProfile && <FranchiseeNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card" element={<Cards />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dropdowncourses" element={<Dropdowncourses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route
  path="/franchprofile"
  element={
    <PrivateRoute>
      <div /> {/* You can keep this as-is. Content is handled by Layout conditionally */}
    </PrivateRoute>
  }
/>
        <Route path="/verify" element={<Certiverify />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/reelcomp" element={<ReelComp/>} />
      </Routes>

      {/* Show Footer on all pages except login */}
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
