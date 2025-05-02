import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import logout from '../../assets/logout.png'; 

const Dashboard = () => {
  const [franchiseeCount, setFranchiseeCount] = useState(0);
  const [pendingCertificates, setPendingCertificates] = useState(0); // Not shown
  const [issuedCertificates, setIssuedCertificates] = useState(0);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleReset = async () => {
    const confirm = window.confirm("⚠️ Are you sure you want to RESET all data? This cannot be undone.");
    if (!confirm) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/reset`);
      alert(res.data.message || '✅ RESET successful.');
    } catch (err) {
      console.error(err);
      alert('❌ RESET failed. See console for error.');
    }
  };

  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/`;
  };

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const franchiseeRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee/count`);
        setFranchiseeCount(Number(franchiseeRes.data.count || 0));

        const pendingRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/status/pending`);
        setPendingCertificates(Number(pendingRes.data.count || pendingRes.data.total || 0));

        const issuedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/status/issued`);
        setIssuedCertificates(Number(issuedRes.data.count || issuedRes.data.total || 0));

        const transactionRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions/all`);
        const totalAmount = transactionRes.data.reduce((sum, t) => sum + Number(t.amount || 0), 0);
        setTotalTransactionAmount(totalAmount);

        const coursesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        setTotalCourses(coursesRes.data.length || 0);

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      color: 'blue',
      icon: 'fa-users',
      title: 'Total Registered Franchisee',
      count: franchiseeCount,
    },
    {
      color: 'green',
      icon: 'fa-certificate',
      title: 'Issued Certificates',
      count: issuedCertificates,
    },
    {
      color: 'pink',
      icon: 'fa-book',
      title: 'Courses Registered',
      count: totalCourses,
    },
    {
      color: 'darkgreen',
      icon: 'fa-money',
      title: 'Transaction Done',
      count: totalTransactionAmount,
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="row">
        {cards.map((card, index) => (
          <div className="col" key={index}>
            <div
              className={`card bg-c-${card.color} order-card ${
                card.title === 'Total Registered Franchisee' ? 'tall-card' : ''
              } ${card.title === 'Transaction Done' ? 'transaction-card' : ''}`}
            >
              <div className="card-block">
                <h6 className="m-b-20">{card.title}</h6>
                <h2 className="text-right">
                  <i className={`fa ${card.icon} f-left fa-2x`} />
                  <div className="pending-count">
                    <span className="small-text">
                      {card.title === 'Total Registered Franchisee'
                        ? 'Registered'
                        : card.title === 'Transaction Done'
                        ? 'Total ₹'
                        : card.title === 'Issued Certificates'
                        ? 'Issued'
                        : 'Total'}
                    </span>
                    <span className="count-text">
                      {loading
                        ? 'Loading...'
                        : error
                        ? `Error: ${error}`
                        : card.title === 'Transaction Done'
                        ? `₹ ${card.count.toLocaleString()}`
                        : card.count}
                    </span>
                  </div>
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <button className="btn btn-danger btn-lg" onClick={handleReset}>
          🔄 RESET All Data
        </button>
        <button className="admin-log-out" onClick={handleLogout}>
      <img src={logout} alt="Logout" className="logout-icon" />
      Logout
    </button>

      </div>
    </div>
  );
};

export default Dashboard;
