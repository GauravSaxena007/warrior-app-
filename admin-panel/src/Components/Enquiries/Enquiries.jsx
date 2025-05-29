import React, { useEffect, useState } from "react";
import axios from "axios";
import './Enquiries.css'; // Import the CSS

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/enquiries`)
      .then(res => setEnquiries(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/enquiries/${id}`)
      .then(() => setEnquiries(enquiries.filter((e) => e._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Franchisee Enquiries</h2>
      {enquiries.length === 0 ? (
        <p>No enquiries to display.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>State</th>
              <th>City</th>
              <th>Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.name}</td>
                <td>{entry.mobile}</td>
                <td>{entry.email}</td>
                <td>{entry.state}</td>
                <td>{entry.city}</td>
                <td>{entry.area}</td>
                <td>
                  <button style={{ background: "red", color: "white" }} onClick={() => handleDelete(entry._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Enquiries;
