import React, { useState, useEffect } from "react";
import axios from "axios";
import './Payments.css'

const Payments = () => {
  const [franchisees, setFranchisees] = useState([]);
  const [franchiseeId, setFranchiseeId] = useState("");
  const [topupAmount, setTopupAmount] = useState("");
  const [chargePerApply, setChargePerApply] = useState("");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchFranchisees();
    fetchPayments();
  }, []);

  const fetchFranchisees = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/franchisee`)
      .then((res) => setFranchisees(res.data))
      .catch((err) => console.error("Error fetching franchisees:", err));
  };

  const fetchPayments = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/payments`)
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Error fetching payments:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/topup`, {
        franchiseeId,
        topupAmount,
        chargePerApply,
      });
      setMessage("Top-up successful!");
      setTopupAmount("");
      setChargePerApply("");
      fetchPayments();
      window.dispatchEvent(new Event("topupChanged"));
    } catch (err) {
      console.error("Error submitting top-up:", err);
      setMessage("Failed to top-up.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/payments/${id}`);
      fetchPayments();
      window.dispatchEvent(new Event("topupChanged"));
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top-Up Franchisee Account</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-8">
        <div>
          <label className="block mb-1">Franchisee</label>
          <select
            className="w-full border rounded p-2"
            value={franchiseeId}
            onChange={(e) => setFranchiseeId(e.target.value)}
            required
          >
            <option value="">Select Franchisee</option>
            {franchisees.map((f) => (
              <option key={f._id} value={f._id}>
                {f.centerName} - {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Top-Up Amount (&#8377;)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label className="block mb-1">Per Apply Charge (&#8377;)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={chargePerApply}
            onChange={(e) => setChargePerApply(e.target.value)}
            required
            min="0"
          />
        </div>
        <button
          type="submit"
          className="payment-submit-btn"
          disabled={!franchiseeId || !topupAmount || !chargePerApply}
        >
          Submit
        </button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Payment History</h3>
      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Franchisee</th>
              <th className="border p-2">Top-Up</th>
              <th className="border p-2">Apply Charge</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments
              .filter((p) => p.topupAdded > 0)
              .map((p) => (
                <tr key={p._id}>

                  <td className="border p-2">{p.franchisee?.centerName}</td>
                  <td className="border p-2">₹{p.topupAdded}</td>
                  <td className="border p-2">₹{p.chargePerApply}</td>
                  <td className="border p-2">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;