import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FraCer.css'; // 🔁 Import the CSS

const FraCer = () => {
  const [photo, setPhoto] = useState(null);
  const [franchisees, setFranchisees] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState('');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchFranchisees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/franchisee');
        setFranchisees(res.data);
      } catch (err) {
        console.error('Error fetching franchisees:', err);
      }
    };
    fetchFranchisees();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/fra-certificates');
      setCertificates(res.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo || !selectedFranchisee) {
      return alert("Please select a franchisee and upload a photo.");
    }

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('franchisee', selectedFranchisee);

    try {
      await axios.post('http://localhost:5000/api/fra-certificates', formData);
      alert("Uploaded successfully!");
      setPhoto(null);
      setSelectedFranchisee('');
      fetchCertificates();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        await axios.delete(`http://localhost:5000/api/fra-certificates/${id}`);
        fetchCertificates();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete failed.");
      }
    }
  };

  return (
    <div className="fra-cer-container">
      <h2>Franchisee Certificate Upload</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><strong>Select Franchisee:</strong></label>
          <select
            value={selectedFranchisee}
            onChange={(e) => setSelectedFranchisee(e.target.value)}
          >
            <option value="">-- Choose Franchisee --</option>
            {franchisees.map(f => (
              <option key={f._id} value={f._id}>{f.centerName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label><strong>Upload Certificate:</strong></label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      <hr className="divider" />

      <h3>Uploaded Certificates</h3>
      <table className="certificate-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Franchisee Head Name</th>
            <th>Certificate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert, index) => {
            const franchisee = franchisees.find(f => f._id === cert.franchisee);
            return (
              <tr key={cert._id}>
                <td>{index + 1}</td>
                <td>{franchisee?.centerHead || "Unknown"}</td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/${cert.photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(cert._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FraCer;
