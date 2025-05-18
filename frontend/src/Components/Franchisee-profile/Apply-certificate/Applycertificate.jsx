import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Applycertificate.css";

const Applycertificate = () => {
  const [data, setData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [franchiseeCache, setFranchiseeCache] = useState({});
  const [centerHead, setCenterHead] = useState(null); // State to store logged-in franchisee's centerHead

  useEffect(() => {
    // Fetch logged-in franchisee's profile to get centerHead
    const fetchFranchiseeProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/franchisee/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Franchisee profile fetched:", res.data);
        setCenterHead(res.data.centerHead); // Store the centerHead
      } catch (err) {
        console.error("Error fetching franchisee profile:", err);
      }
    };

    // Fetch students data
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/students`);
        console.log("Student data fetched (raw):", JSON.stringify(res.data, null, 2));
        setData(res.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    // Pre-fetch all franchisee data to cache
    const fetchFranchiseeCache = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/franchisee`);
        console.log("Franchisee data fetched (raw):", JSON.stringify(res.data, null, 2));
        const franchiseeMap = {};
        res.data.forEach((franchisee) => {
          franchiseeMap[franchisee._id] = franchisee.centerHead || "Unknown";
        });
        console.log("Franchisee cache created:", franchiseeMap);
        setFranchiseeCache(franchiseeMap);
      } catch (err) {
        console.error("Error fetching franchisee data:", err);
      }
    };

    fetchFranchiseeProfile();
    fetchStudents();
    fetchFranchiseeCache();
  }, []);

  const getCenterHeadFromId = async (id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/franchisee/${id}`);
      return res.data.centerHead || "Unknown";
    } catch (err) {
      console.error("Error fetching individual franchisee:", err);
      return "Unknown";
    }
  };

  const handleSelect = (e, studentId) => {
    if (e.target.checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleRequest = async () => {
    try {
      if (selectedStudents.length === 0) {
        alert("Please select at least one student.");
        return;
      }

      const studentsData = data.filter((student) =>
        selectedStudents.includes(student._id)
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/certificateRequests`,
        { students: studentsData }
      );

      alert(response.data.message);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Error requesting certificates:", err);
      alert("An error occurred while requesting certificates.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/students/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  // Filter students based on centerHead
  const filteredData = data.filter((row) => {
    if (!centerHead) return false; // If centerHead is not yet fetched, show nothing
    const franchiseeId = row.franchiseeHead?._id || row.franchiseeHead;
    const franchiseeCenterHead =
      typeof row.franchiseeHead === "string"
        ? row.franchiseeHead
        : franchiseeCache[franchiseeId] || "Unknown";
    return franchiseeCenterHead === centerHead;
  });

  // Added function to fetch all data (for refresh)
  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchFranchiseeProfile(),
        fetchStudents(),
        fetchFranchiseeCache(),
      ]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };
  
  return (
    <div className="container-app-certi">
      <h4
  className="pro-h text-left "
  style={{ width: '100%', marginTop: '-65px' }}>
  Apply For Certificates
</h4>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button className="request-btn-certi" onClick={handleRequest}>
        REQUEST FOR CERTIFICATE
      </button> 
      {/* Added Refresh button */} 
      <button className="refresh-btn-certi" onClick={fetchAllData} >
        Refresh
      </button> </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Select</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Student Registration Date</th>
            <th>Course Name</th>
            <th>Course Amount</th>
            <th>Franchisee Head</th>
            <th>Certificate Status</th>
            <th>Course Completion Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={row._id}>
              <td data-label="Sr. No.">{index + 1}</td>
              <td data-label="Select">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelect(e, row._id)}
                />
              </td>
              <td data-label="Student Name">{row.name}</td>
              <td data-label="Mobile">{row.mobile}</td>
              <td data-label="Email">{row.email}</td>
              <td data-label="Registration Date">{new Date(row.registrationDate).toLocaleDateString()}</td>
              <td data-label="Course">{row.course}</td>
              <td data-label="Course Amount">{row.courseAmount}</td>
              <td data-label="Franchisee Head">
                {row.franchiseeHead ? (
                  typeof row.franchiseeHead === "string" ? (
                    <span>{row.franchiseeHead}</span>
                  ) : (
                    <Link
                      to={`/franchisee/${
                        row.franchiseeHead._id || row.franchiseeHead
                      }`}
                    >
                      {(() => {
                        const franchiseeId =
                          row.franchiseeHead._id ||
                          (row.franchiseeHead &&
                            row.franchiseeHead.toString());
                        console.log(
                          `Row ${index + 1} franchiseeHead:`,
                          JSON.stringify(row.franchiseeHead, null, 2),
                          "ID used:",
                          franchiseeId,
                          "Cache lookup:",
                          franchiseeCache[franchiseeId]
                        );
                        if (
                          row.franchiseeHead &&
                          typeof row.franchiseeHead === "object" &&
                          row.franchiseeHead.centerHead
                        ) {
                          return row.franchiseeHead.centerHead;
                        }
                        return (
                          franchiseeCache[franchiseeId] ||
                          getCenterHeadFromId(franchiseeId) ||
                          "Unknown"
                        );
                      })()}
                    </Link>
                  )
                ) : (
                  <span>Unknown</span>
                )}
              </td>
              <td data-label="Status"
                className={`status ${
                  row.certificateStatus === "Issued"
                    ? "issued"
                    : row.certificateStatus === "Approved"
                    ? "approved"
                    : "pending"
                }`}
              >
                {/* Original status rendering commented out */}
                {/* {row.certificateStatus || "Pending"} */}
                {row.certificateStatus || "Pending"}
              </td>
              <td data-label="Course Completion Date">{new Date(row.courseCompletionDate).toLocaleDateString()}</td>
              <td data-label="Delete certificate Request">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(row._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applycertificate;