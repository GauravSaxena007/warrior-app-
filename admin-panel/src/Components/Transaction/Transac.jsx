import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transac.css';

const Transac = () => {
  const [franchisees, setFranchisees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    receiptNo: '',
    centerName: '',
    studentCount: '',
    amount: '',
    paymentDate: '',
    paymentMethod: '',
    receiptUpload: null,
    franchiseeHead: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFranchisees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee`);
        setFranchisees(res.data);
      } catch (err) {
        console.error("Error fetching franchisees:", err);
        setError(err.response?.data?.message || "Failed to load franchisees. Please try again.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions/all`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.response?.data?.message || "Failed to load transactions.");
      }
    };

    fetchFranchisees();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'centerName') {
      const selectedFranchisee = franchisees.find(f => f.name === value);
      setFormData((prev) => ({
        ...prev,
        franchiseeHead: selectedFranchisee ? selectedFranchisee._id : ''
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      receiptUpload: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions`, data);
      alert("Transaction submitted!");
      setTransactions([...transactions, res.data]);
      setFormData({
        receiptNo: '',
        centerName: '',
        studentCount: '',
        amount: '',
        paymentDate: '',
        paymentMethod: '',
        receiptUpload: null,
        franchiseeHead: ''
      });
      setError(null);
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setError(err.response?.data?.message || "Failed to submit transaction. Please check your input.");
    }
  };

  const handleDelete = async (index) => {
    const transaction = transactions[index];
    if (!window.confirm(`Are you sure you want to delete transaction ${transaction.receiptNo}?`)) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/transactions/${transaction._id}`);
      const updated = transactions.filter((_, i) => i !== index);
      setTransactions(updated);
      alert("Transaction deleted!");
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError(err.response?.data?.message || "Failed to delete transaction.");
    }
  };

  return (
    <div className="transac-container">
      <button
        className="transac-topup-btn"
        onClick={() => (window.location.href = '/dashboard/payments')}
      >
        ₹ : TopUp Franchisee
      </button>
      <h2 className="transac-title">Franchisee Transactions Receipt</h2>

      {error && (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      )}

      <form className="transac-form" onSubmit={handleSubmit}>
        <select name="centerName" value={formData.centerName} onChange={handleChange} required>
          <option value="">Select Center</option>
          {franchisees.map((f, i) => (
            <option key={i} value={f.name}>{f.name}</option>
          ))}
        </select>
        <input type="text" name="receiptNo" placeholder="Receipt No." value={formData.receiptNo} onChange={handleChange} required />
        <input type="number" name="studentCount" placeholder="No. of Students" value={formData.studentCount} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
        <span style={{ paddingTop: "9px" }}>Payment Date:</span> <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required />

        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="Netbanking">Netbanking</option>
          <option value="Unified Payments">Unified Payments</option>
          <option value="Wallet">Wallet (PhonePe, GPay)</option>
          <option value="Other">Other</option>
        </select>

        <input type="file" name="receiptUpload" onChange={handleFileChange} required />
        <button type="submit">Send</button>
      </form>

      <div className="table-wrapper">
        <table className="transac-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Receipt No.</th>
              <th>Center Name</th>
              <th>No. of Students</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Receipt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="9">No transactions added yet.</td></tr>
            ) : (
              transactions.map((t, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{t.receiptNo}</td>
                  <td>{t.centerName}</td>
                  <td>{t.studentCount}</td>
                  <td>{t.amount}</td>
                  <td>{new Date(t.paymentDate).toLocaleDateString()}</td>
                  <td>{t.paymentMethod}</td>
                  <td>
                    {t.receiptUpload ? (
                      <a href={`${import.meta.env.VITE_API_URL}/api/transactions/uploads/${t.receiptUpload}`} target="_blank" rel="noopener noreferrer">View</a>
                    ) : 'N/A'}
                  </td>
                  <td><button onClick={() => handleDelete(index)}>Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transac;