import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Transaction.css";

const Transaction = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortKey, setSortKey] = useState("receiptNo");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view transactions');
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Transactions API response:', res.data);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching transactions:", err.message);
        setError(err.message || "Failed to load transactions. Please try again.");
      }
    };

    fetchTransactions();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (key) => {
    setSortKey(key);
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key] || '';
      const bValue = b[key] || '';
      if (newSortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    setData(sortedData);
  };

  if (error) {
    return (
      <div className="container" style={{ boxShadow: 'none' }}>
        <h4 className="pro-h p-2 w-80 text-left" style={{ width: "100%" }}>
          Transaction List
        </h4>
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-transaction" style={{ boxShadow: 'none', background: 'transparent' }}>
      <h4 className="profile-header pro-h mx-auto text-left" style={{ width: '100%', marginTop: '-15px' }}>
        Transaction List
      </h4>
      <div className="d-flex justify-content-between p-2 bg-light" style={{ width: "100%" }}>
        <select className="form-select w-auto">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-striped table-hover mt-2">
        <thead className="table-dark">
          <tr>
            <th>Sr. No.</th>
            <th onClick={() => handleSort("receiptNo")}>Receipt No.</th>
            <th onClick={() => handleSort("centerName")}>Center Name</th>
            <th onClick={() => handleSort("studentCount")}>No. of Students</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th onClick={() => handleSort("paymentDate")}>Payment Date</th>
            <th>Payment Method</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter(transaction =>
              transaction.centerName?.toLowerCase().includes(search.toLowerCase()) || ''
            )
            .map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{index + 1}</td>
                <td>{transaction.receiptNo || 'N/A'}</td>
                <td>{transaction.centerName || 'N/A'}</td>
                <td>{transaction.studentCount || 0}</td>
                <td>{transaction.amount?.toFixed(2) || '0.00'}</td>
                <td>
                  {transaction.paymentDate
                    ? new Date(transaction.paymentDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{transaction.paymentMethod || 'N/A'}</td>
                <td>
                  {transaction.receiptUpload ? (
                    <a
                      href={`${import.meta.env.VITE_API_URL}/api/transactions/uploads/${transaction.receiptUpload}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-info btn-sm"
                    >
                      Statement
                    </a>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                      No File
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;