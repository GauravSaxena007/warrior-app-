import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Contactus.css";

const Contactus = () => {
  const [contactData, setContactData] = useState({
    phone: "",
    email: "",
    address: "",
    mapUrl: "",
  });
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/contact/info`)
      .then(response => setContactData(response.data))
      .catch(error => console.error("Error fetching contact info:", error));

    axios.get(`${import.meta.env.VITE_API_URL}/api/contact/submissions`)
      .then(response => setFormSubmissions(response.data))
      .catch(error => console.error("Error fetching submissions:", error));
  }, []);

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactData.mapUrl.startsWith('https://www.google.com/maps/embed')) {
      alert('Please enter a valid Google Maps embed URL');
      return;
    }
    axios.put(`${import.meta.env.VITE_API_URL}/api/contact/info`, contactData)
      .then(() => alert("Contact info updated!"))
      .catch(error => console.error("Error updating contact info:", error));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const startEditing = (submission) => {
    setEditingId(submission._id);
    setEditFormData({ ...submission });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_API_URL}/api/contact/submissions/${editingId}`, editFormData)
      .then(() => {
        setFormSubmissions(formSubmissions.map(sub => sub._id === editingId ? editFormData : sub));
        setEditingId(null);
        setEditFormData(null);
        alert("Submission updated!");
      })
      .catch(error => console.error("Error updating submission:", error));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const deleteSubmission = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/contact/submissions/${id}`)
      .then(() => {
        setFormSubmissions(formSubmissions.filter(sub => sub._id !== id));
        alert("Submission deleted!");
      })
      .catch(error => console.error("Error deleting submission:", error));
  };

  return (
    <div className="contactus-admin">
      <div className="container">
        <h2>Edit Contact Info</h2>
        <form onSubmit={handleSubmit} className="form-section">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={contactData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={contactData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            value={contactData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mapUrl"
            placeholder="Google Map Embed URL"
            value={contactData.mapUrl}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary">Save</button>
        </form>

        <h3>Form Submissions</h3>
        <div className="submissions-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>City</th>
                <th>Area</th>
                <th>Address</th>
                <th>Pin</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formSubmissions.map((item) => (
                <tr key={item._id}>
                  {editingId === item._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="contactPerson"
                          value={editFormData.contactPerson}
                          onChange={handleEditChange}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <select
                          name="state"
                          value={editFormData.state}
                          onChange={handleEditChange}
                          className="input-field"
                        >
                          <option value="">Select State</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Rajasthan">Rajasthan</option>
                        </select>
                      </td>
                      <td>
                        <select
                          name="city"
                          value={editFormData.city}
                          onChange={handleEditChange}
                          className="input-field"
                        >
                          <option value="">Select City</option>
                          <option value="Nagpur">Nagpur</option>
                          <option value="Kota">Kota</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="area"
                          value={editFormData.area}
                          onChange={handleEditChange}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <textarea
                          name="address"
                          value={editFormData.address}
                          onChange={handleEditChange}
                          className="input-field"
                        ></textarea>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="pinCode"
                          value={editFormData.pinCode}
                          onChange={handleEditChange}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="mobileNo"
                          value={editFormData.mobileNo}
                          onChange={handleEditChange}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <button onClick={saveEdit} className="action-btn save-btn">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="action-btn cancel-btn">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.name}</td>
                      <td>{item.state}</td>
                      <td>{item.city}</td>
                      <td>{item.area}</td>
                      <td>{item.address}</td>
                      <td>{item.pin}</td>
                      <td>{item.mobile}</td>
                      <td>{item.email}</td>
                      <td>
                        <button
                          onClick={() => startEditing(item)}
                          className="action-btn edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSubmission(item._id)}
                          className="action-btn delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contactus;