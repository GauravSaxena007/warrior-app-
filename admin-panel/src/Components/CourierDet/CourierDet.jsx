import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourierDet.css';

const CourierDet = () => {
  const [couriers, setCouriers] = useState([]);
  const [franchisees, setFranchisees] = useState([]);
  const [form, setForm] = useState({
    courierName: '',
    courierNumber: '',
    courierDate: '',
    franchiseeHead: '',
  });

  useEffect(() => {
    fetchFranchisees();
    fetchCouriers();
  }, []);

  const fetchFranchisees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/franchisee`);
      console.log('Franchisees:', res.data);
      setFranchisees(res.data);
    } catch (err) {
      console.error('Franchisee fetch error:', err.response?.data?.error || err.message);
      alert('Failed to fetch franchisees: ' + (err.response?.data?.error || err.message));
    }
  };

  const fetchCouriers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courier`);
      console.log('Couriers:', res.data);
      setCouriers(res.data);
    } catch (err) {
      console.error('Courier fetch error:', err.response?.data?.error || err.message);
      alert('Failed to fetch couriers: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form:', form);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/courier`, form);
      console.log('POST response:', res.data);
      setCouriers([...couriers, res.data]);
      setForm({
        courierName: '',
        courierNumber: '',
        courierDate: '',
        franchiseeHead: '',
      });
    } catch (err) {
      console.error('POST error:', err.response?.data?.error || err.message);
      alert('Failed to add courier: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/courier/${id}`);
      console.log('DELETE response:', res.data);
      setCouriers(couriers.filter(courier => courier._id !== id));
    } catch (err) {
      console.error('DELETE error:', err.response?.data?.error || err.message);
      alert('Failed to delete courier: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="courier-container">
      <h2 className="courier-heading">Courier Details</h2>
      <form onSubmit={handleSubmit} className="courier-form">
        <div className="input-group">
          <input
            type="text"
            name="courierName"
            placeholder="Courier Name"
            value={form.courierName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="courierNumber"
            placeholder="Courier Number"
            value={form.courierNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="date"
            name="courierDate"
            value={form.courierDate}
            onChange={handleChange}
            required
          />
          <select
            name="franchiseeHead"
            value={form.franchiseeHead}
            onChange={handleChange}
            required
          >
            <option value="">Select Franchisee Head</option>
            {franchisees.map((franchisee) => (
              <option key={franchisee._id} value={franchisee.centerHead}>
                {franchisee.centerHead}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Courier</button>
      </form>
      <table className="courier-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Courier Name</th>
            <th>Courier Number</th>
            <th>Courier Date</th>
            <th>Franchisee Head</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {couriers.length > 0 ? (
            couriers.map((courier, index) => (
              <tr key={courier._id}>
                <td>{index + 1}</td>
                <td>{courier.courierName}</td>
                <td>{courier.courierNumber}</td>
                <td>{new Date(courier.courierDate).toLocaleDateString()}</td>
                <td>{courier.franchiseeHead}</td>
                <td>
                  <button onClick={() => handleDelete(courier._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No couriers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourierDet;
