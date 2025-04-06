import React, { useState } from "react";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([
    {
      name: "John Doe",
      mobile: "9876543210",
      email: "john@example.com",
      state: "Maharashtra",
      city: "Mumbai",
      area: "Andheri",
    },
    {
      name: "Priya Sharma",
      mobile: "9123456780",
      email: "priya@example.com",
      state: "Delhi",
      city: "New Delhi",
      area: "Saket",
    },
  ]);

  const handleDelete = (index) => {
    const updated = enquiries.filter((_, i) => i !== index);
    setEnquiries(updated);
  };

  const handleSave = (index) => {
    alert(`Enquiry from ${enquiries[index].name} saved!`);
    // Later you can call API here
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
            {enquiries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.mobile}</td>
                <td>{entry.email}</td>
                <td>{entry.state}</td>
                <td>{entry.city}</td>
                <td>{entry.area}</td>
                <td>
                  <button onClick={() => handleSave(index)} style={{ background: "green", color: "white" , marginRight: "8px" }}>Save</button>
                  <button onClick={() => handleDelete(index)} style={{ background: "red", color: "white" }}>Delete</button>
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
