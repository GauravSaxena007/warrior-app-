import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Settings from "./Components/Settings/Settings"; 
import Addcourses from "./Components/Add-courses/Addcourses";
import Slider from "./Components/Slider/Slider";
import Enquiries from "./Components/Enquiries/Enquiries";
import Contactus from "./Components/Contact-Us/contactus";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>  {/* Flexbox for sidebar and content alignment */}
        <Sidebar />
        <div className="content" style={{ marginLeft: "350px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/addcourses" element={<Addcourses/>} />
            <Route path="/slider" element={<Slider/>} />
            <Route path="/enquiry" element={<Enquiries/>} />
            <Route path="/contactuss" element={<Contactus/>} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
