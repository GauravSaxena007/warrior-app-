import React, { useState } from "react";
import "./Applycertificate.css"; // Import the updated CSS file

const Applycertificate = () => {
  const [data] = useState([
    { id: 1, name: "NA", mobile: "NA", email: "NA", registrationDate: "2024-05-07", courseName: "Certificate Course in Tally", courseAmount: 110, franchiseeHead: "DHARMENDRA KUMAR PAHUJA", certificateStatus: "NOT ISSUED", iCard: "PENDING" },
    { id: 2, name: "NA", mobile: "NA", email: "NA", registrationDate: "2024-05-07", courseName: "Certificate Course in Tally", courseAmount: 110, franchiseeHead: "DHARMENDRA KUMAR PAHUJA", certificateStatus: "NOT ISSUED", iCard: "PENDING" },
    { id: 3, name: "NA", mobile: "NA", email: "NA", registrationDate: "2024-05-07", courseName: "Certificate Course in Tally", courseAmount: 110, franchiseeHead: "DHARMENDRA KUMAR PAHUJA", certificateStatus: "NOT ISSUED", iCard: "PENDING" },
  ]);

  return (
    <div className="container">
      <button className="request-btn">REQUEST FOR CERTIFICATE</button>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Select</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Registration Date</th>
            <th>Course Name</th>
            <th>Course Amount</th>
            <th>Franchisee Head</th>
            <th>Certificate Status</th>
            <th>I-Card</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td><input type="checkbox" /></td>
              <td>{row.name}</td>
              <td>{row.mobile}</td>
              <td>{row.email}</td>
              <td>{row.registrationDate}</td>
              <td>{row.courseName}</td>
              <td>{row.courseAmount}</td>
              <td>{row.franchiseeHead}</td>
              <td className="status">{row.certificateStatus}</td>
              <td className="icard-status">{row.iCard}</td>
              <td>
                <button className="edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applycertificate;
