import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courierdetail.css';

const Courierdetail = () => {
  const [courierData, setCourierData] = useState([]);
  const [centerHead, setCenterHead] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch franchisee profile to get centerHead
  useEffect(() => {
    const fetchFranchiseeHead = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/franchisee/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const headName = res.data.centerHead;
        setCenterHead(headName);
      } catch (err) {
        console.error("Failed to load franchisee head:", err);
      }
    };

    fetchFranchiseeHead();
  }, []);

  // Fetch courier data once centerHead is set
  useEffect(() => {
    if (!centerHead) return;

    const fetchCourierData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/courier/getCouriers/${encodeURIComponent(centerHead)}`);
        setCourierData(res.data);
      } catch (err) {
        console.error('Failed to fetch courier data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourierData();
  }, [centerHead]);

  return (
      <div className="container-courier-detail" style={{ boxShadow: 'none', background: 'transparent' }}>
      <h4 className="profile-header pro-h mx-auto text-left" style={{ width: '100%', marginTop: '-2px' }}>
        Courier Detail
      </h4>
      <div className="center-head-display">
        <strong>Franchisee Head : {centerHead || "Loading..."}</strong>
        <button onClick={() => window.location.reload()} className="refresh-btn-courier">Refresh</button>
      </div>

      <table className="courier-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Courier Name</th>
            <th>Courier Number</th>
            <th>Courier Date</th>
            <th>Franchisee Head</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5">Loading...</td></tr>
          ) : courierData.length > 0 ? (
            courierData.map((row, index) => (
              <tr key={row._id}>
                <td>{index + 1}</td>
                <td>{row.courierName}</td>
                <td>{row.courierNumber}</td>
                <td>{new Date(row.courierDate).toLocaleDateString()}</td>
                <td>{row.franchiseeHead}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courierdetail;
