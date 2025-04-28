import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import './Testing.css';
import Loginlayout from '../Components/Franchisee-profile/Layout/Loginlayout'; // Adjust the path accordingly

const Testing = () => {
  const location = useLocation(); // Get the current route

  // Check if the current route is "/testing"
  const isTestingPage = location.pathname === "/testing";

  return (
    <div>
      {isTestingPage && (
        <div>
          {/* Render Loginlayout instead of Navbar */}
          <Loginlayout />
        </div>
      )}
      
      {/* Main content of the Testing component */}
      <h1>hello</h1>
    </div>
  );
};

export default Testing;
