import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Settings from "./Components/Settings/Settings"; 
import Addcourses from "./Components/Add-courses/Addcourses";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>  {/* Flexbox for sidebar and content alignment */}
        <Sidebar />
        <div className="content" style={{ marginLeft: "350px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/addcourses" element={<Addcourses/>} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
