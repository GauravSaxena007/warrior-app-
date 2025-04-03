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
import Loginlayout from "./Components/Franchisee-profile/Layout/Loginlayout";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isFranchiseeProfile = location.pathname === "/franchprofile";

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      {/* Show Loginlayout only on /franchprofile */}
      {isFranchiseeProfile ? <Loginlayout /> : <Navbar />}

      {/* Show Franchisee Navbar only on /franchprofile */}
      {isFranchiseeProfile && <FranchiseeNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card" element={<Cards />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dropdowncourses" element={<Dropdowncourses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/franchprofile" element={<div />} />
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
