import React, { useState } from "react";
import "./Issuedcertificate.css";

const Issuedcertificate = () => {
  // Sample data
  const allData = [
    {
      srNo: 1,
      name: "Resham Singh S/O Avtar Singh",
      mobile: "8764442241",
      courseName: "002 Advanced Diploma in Computer Application",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "535564/RCSAS/19",
    },
    {
      srNo: 10,
      name: "Deeksha Rathod D/O Shankar Singh Rathod",
      mobile: "9314952297",
      courseName: "018 Certificate Course in Tally",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "640703/RCSAS/22",
    },
    {
      srNo: 11,
      name: "Laveena Rathod D/O Shankar Singh Rathod",
      mobile: "9314952297",
      courseName: "018 Certificate Course in Tally",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "640704/RCSAS/22",
    },
    {
      srNo: 12,
      name: "Kailash Chand Gurjar S/O Lodkya Gurjar",
      mobile: "9057214728",
      courseName: "036 Certificate Course in Computer Typing English 40 WPM",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "640764/RCSAS/22",
    },
    {
      srNo: 13,
      name: "Minakshi Mahavar D/O Tejpal",
      mobile: "9314952297",
      courseName: "018 Certificate Course in Tally",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "640765/RCSAS/22",
    },
    {
      srNo: 14,
      name: "Jitesh Yadav S/O Kanhaiya Lal",
      mobile: "9314952297",
      courseName: "018 Certificate Course in Tally",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "640766/RCSAS/22",
    },
    {
      srNo: 15,
      name: "Kunal Garg S/O XYZ",
      mobile: "9314952297",
      courseName: "018 Certificate Course in Tally",
      franchiseeHead: "DHARMENDRA KUMAR PAHUJA",
      certificateNumber: "640767/RCSAS/22",
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered Data based on Search Input
  const filteredData = allData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div>
      <h4 className="pro-h p-2.5 mx-auto text-left m-3" style={{ width: "75%" }}>
  Issued Certificate
</h4>
    <div className="table-container">
      {/* Top Controls: Records per Page and Search */}
      <div className="table-controls">
        <div>
          <label>Show </label>
          <select onChange={(e) => setRecordsPerPage(Number(e.target.value))} value={recordsPerPage}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          <span> records per page</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Course Name</th>
            <th>Franchisee Head</th>
            <th>Certificate Number</th>
            <th>Certificate Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((row, index) => (
              <tr key={index}>
                <td>{row.srNo || "-"}</td>
                <td>{row.name || "-"}</td>
                <td>{row.mobile || "-"}</td>
                <td>{row.courseName || "-"}</td>
                <td>{row.franchiseeHead || "-"}</td>
                <td>{row.certificateNumber || "-"}</td>
                <td>
                  <button className="download-btn">Download</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No records found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default Issuedcertificate;
