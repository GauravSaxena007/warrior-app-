import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Applycertificate.css";

const Applycertificate = () => {
  const [data, setData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [franchiseeCache, setFranchiseeCache] = useState({});
  const [centerHead, setCenterHead] = useState(null);
  const [topupAmount, setTopupAmount] = useState(0);
  const [chargePerApply, setChargePerApply] = useState(0);
  const [processedStudents, setProcessedStudents] = useState(() => {
    // Load processed students from localStorage on component mount
    const saved = localStorage.getItem("processedStudents");
    return saved ? JSON.parse(saved) : [];
  });

  const isDisabled = topupAmount === 0;

  useEffect(() => {
    // Save processed students to localStorage whenever it changes
    localStorage.setItem("processedStudents", JSON.stringify(processedStudents));
  }, [processedStudents]);

  useEffect(() => {
    const fetchTopupData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/franchisee/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopupAmount(res.data.topupAmount || 0);
        setChargePerApply(res.data.chargePerApply || 0);
      } catch (err) {
        console.error("Error fetching topup data:", err);
      }
    };

    const fetchFranchiseeProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCenterHead(res.data.centerHead);
      } catch (err) {
        console.error("Error fetching franchisee profile:", err);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/students`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };

    const fetchFranchiseeCache = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee`);
        const franchiseeMap = {};
        res.data.forEach((franchisee) => {
          franchiseeMap[franchisee._id] = franchisee.centerHead || "Unknown";
        });
        setFranchiseeCache(franchiseeMap);
      } catch (err) {
        console.error("Error fetching franchisee data:", err);
      }
    };

    fetchTopupData();
    fetchFranchiseeProfile();
    fetchStudents();
    fetchFranchiseeCache();

    const handleTopupChanged = () => fetchTopupData();
    window.addEventListener("topupChanged", handleTopupChanged);
    return () => window.removeEventListener("topupChanged", handleTopupChanged);
  }, []);

  const getCenterHeadFromId = async (id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee/${id}`);
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

      const totalDeduction = selectedStudents.length * chargePerApply;
      if (totalDeduction > topupAmount) {
        alert("Insufficient top-up amount for this request.");
        return;
      }

      const studentsData = data.filter((student) => selectedStudents.includes(student._id));
      const certificateResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/certificateRequests`, {
        students: studentsData,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert(certificateResponse.data.message);

      if (certificateResponse.data.message !== "All selected students already have pending requests") {
        const deductResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/deduct`, {
          deductionAmount: totalDeduction,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setTopupAmount(deductResponse.data.topupAmount);
        // Add selected students to processedStudents and persist
        setProcessedStudents((prev) => [...prev, ...selectedStudents]);
        setSelectedStudents([]);
        window.dispatchEvent(new Event("topupChanged"));
      }
    } catch (err) {
      console.error("Error processing certificate request:", err);
      alert("An error occurred while requesting certificates.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/students/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      // Optionally remove from processedStudents if deleted
      setProcessedStudents((prev) => prev.filter((studentId) => studentId !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

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
      <h4 className="pro-h text-left" style={{ width: "100%", marginTop: "-45px" }}>
        Apply For Certificates
      </h4>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          className="request-btn-certi"
          onClick={handleRequest}
          disabled={isDisabled}
        >
          REQUEST FOR CERTIFICATE & MARKSHEET
        </button>
        <button className="refresh-btn-certi" onClick={fetchAllData}>
          Refresh
        </button>
      </div>
      {isDisabled && (
        <p className="text-red-500 mt-2">
          Top-up amount is 0. Please add funds to proceed.
        </p>
      )}
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
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {data.filter((row) => {
            if (!centerHead) return false;
            const franchiseeId = row.franchiseeHead?._id || row.franchiseeHead;
            const franchiseeCenterHead =
              typeof row.franchiseeHead === "string"
                ? row.franchiseeHead
                : franchiseeCache[franchiseeId] || "Unknown";
            return franchiseeCenterHead === centerHead;
          }).map((row, index) => (
            <tr key={row._id}>
              <td data-label="Sr. No.">{index + 1}</td>
              <td data-label="Select">
                {processedStudents.includes(row._id) ? (
                  <span className="text-green-500 font-bold">✓</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(row._id)}
                    onChange={(e) => handleSelect(e, row._id)}
                    disabled={isDisabled}
                  />
                )}
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
                    <Link to={`/franchisee/${row.franchiseeHead._id || row.franchiseeHead}`}>
                      {(() => {
                        const franchiseeId =
                          row.franchiseeHead._id || (row.franchiseeHead && row.franchiseeHead.toString());
                        if (row.franchiseeHead && typeof row.franchiseeHead === "object" && row.franchiseeHead.centerHead) {
                          return row.franchiseeHead.centerHead;
                        }
                        return franchiseeCache[franchiseeId] || getCenterHeadFromId(franchiseeId) || "Unknown";
                      })()}
                    </Link>
                  )
                ) : (
                  <span>Unknown</span>
                )}
              </td>
              <td
                data-label="Status"
                className={`status ${row.certificateStatus === "Issued"
                  ? "issued"
                  : row.certificateStatus === "Approved"
                    ? "approved"
                    : "pending"
                  }`}
              >
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
              <td data-label="Marks">
                {row.obtainMarks && row.obtainMarks.length > 0 ? (
                  <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                    {row.obtainMarks.map((mark, idx) => (
                      <li key={idx}>
                        {mark.subject || "N/A"}: {mark.obtained ?? "N/A"} / {mark.maxMarks ?? "N/A"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No marks</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applycertificate;