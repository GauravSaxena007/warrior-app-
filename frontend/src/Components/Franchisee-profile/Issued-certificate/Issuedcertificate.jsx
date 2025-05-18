import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Issuedcertificate.css';

const Issuedcertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [centerHead, setCenterHead] = useState(null); // State to store logged-in franchisee's centerHead

  useEffect(() => {
    fetchFranchiseeProfile();
    fetchCertificates();
  }, []);

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

  const fetchCertificates = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin-certi/issuedCertificates`)
      .then((res) => {
        console.log("Certificates fetched (raw):", JSON.stringify(res.data, null, 2));
        setCertificates(res.data);
      })
      .catch((err) => {
        console.error('Error fetching issued certificates:', err);
        alert('Failed to fetch issued certificates.');
      });
  };

  // Filter certificates based on centerHead
  const filteredData = certificates.filter((row) => {
    if (!centerHead) return false; // If centerHead is not yet fetched, show nothing
    const franchiseeHead = row.studentId?.franchiseeHead || '-';
    return franchiseeHead === centerHead;
  }).filter((row) =>
    Object.values(row.studentId || {})
      .concat(row.certificateNumber, row.course)
      .some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleDownload = (filePath) => {
    window.open(`${import.meta.env.VITE_API_URL}/${filePath}`, '_blank');
  };

  return (
    <div>
      <h4 className="pro-h p-2.5 mx-auto text-left m-3" style={{ width: '75%' }}>
        Issued Certificate
      </h4>
      <div className="table-container">
        <div className="table-controls">
          <div>
            <label>Show </label>
            <select
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              value={recordsPerPage}
            >
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
          <button className="btn btn-primary btn-sm isscer" onClick={fetchCertificates}>
            Refresh
          </button>
        </div>

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
              <th>Action</th> {/* Added new column for download action */}
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((row, index) => (
                <tr key={row._id}>
                  <td>{indexOfFirstRecord + index + 1}</td>
                  <td>{row.studentId?.name || '-'}</td>
                  <td>{row.studentId?.mobile || '-'}</td>
                  <td>{row.course || '-'}</td>
                  <td>{row.studentId?.franchiseeHead || '-'}</td>
                  <td>{row.certificateNumber || '-'}</td>
                  <td>
                    {/* Original download button commented out */}
                    {/* <button
                      className="download-btn"
                      onClick={() => handleDownload(row.filePath)}
                    >
                      Download
                    </button> */}
                    Issued {/* Display "Issued" status */}
                  </td>
                  <td>
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(row.filePath)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data"> {/* Updated colSpan to 8 */}
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Issuedcertificate;