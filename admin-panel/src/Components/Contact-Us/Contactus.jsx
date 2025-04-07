import React, { useState } from "react";
import "./Contactus.css";

const Contactus = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: "9422123456 | 07122072727",
    email: "rcsasedu@gmail.com",
    address: "393-A, Indraprastha, Hanuman Nagar, Nagpur - 440009. (Maharashtra)",
    mapSrc:
      localStorage.getItem("mapSrc") ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.102429233749!2d75.82268047528643!3d25.165173377706048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396f84f365e468ed%3A0xa7d6ff6de1677c52!2sDadabari%2C%20Kota%2C%20Rajasthan%20324009!5e0!3m2!1sen!2sin!4v1711555555555"
  });

  const [editing, setEditing] = useState(false);

  const [contactSubmissions, setContactSubmissions] = useState([
    {
      id: 1,
      name: "John Doe",
      state: "Maharashtra",
      city: "Nagpur",
      area: "Hanuman Nagar",
      address: "123 Sample Street",
      pin: "440009",
      mobile: "9876543210",
      email: "john@example.com"
    },
    {
      id: 2,
      name: "Jane Smith",
      state: "Rajasthan",
      city: "Kota",
      area: "Dadabari",
      address: "456 Another Rd",
      pin: "324009",
      mobile: "9123456789",
      email: "jane@example.com"
    }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("mapSrc", contactInfo.mapSrc);
    setEditing(false);
    alert("Contact information updated!");
  };

  const handleDeleteSubmission = (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      setContactSubmissions((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const handleSaveSubmission = (entry) => {
    // Future: Make an API call to save
    console.log("Saving submission:", entry);
    alert(`Saved submission from ${entry.name}`);
  };

  return (
    <div className="contact-admin container">
      <h3>Admin - Contact Info</h3>
      <div className="card p-3 mb-4">
        {editing ? (
          <>
            <div className="form-group mb-2">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={contactInfo.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={contactInfo.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-2">
              <label>Address</label>
              <textarea
                name="address"
                className="form-control"
                value={contactInfo.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-2">
              <label>Google Map Embed Link</label>
              <textarea
                name="mapSrc"
                className="form-control"
                value={contactInfo.mapSrc}
                onChange={handleChange}
                placeholder="Paste Google Maps embed URL here"
              />
            </div>
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Phone:</strong> {contactInfo.phone}</p>
            <p><strong>Email:</strong> {contactInfo.email}</p>
            <p><strong>Address:</strong> {contactInfo.address}</p>
            <p>
              <strong>Google Map:</strong><br />
              <iframe
                src={contactInfo.mapSrc}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Preview Map"
              ></iframe>
            </p>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              Edit
            </button>
          </>
        )}
      </div>

      <h4>Submitted Contact Forms</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
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
            {contactSubmissions.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.name}</td>
                <td>{entry.state}</td>
                <td>{entry.city}</td>
                <td>{entry.area}</td>
                <td>{entry.address}</td>
                <td>{entry.pin}</td>
                <td>{entry.mobile}</td>
                <td>{entry.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleSaveSubmission(entry)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteSubmission(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {contactSubmissions.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-muted">No submissions available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contactus;
