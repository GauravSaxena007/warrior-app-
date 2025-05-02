import React, { useState, useEffect } from "react";
import "./FranchiseeManagement.css";

const FranchiseeManagement = () => {
  const [franchisees, setFranchisees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    centerHead: "",
    centerName: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    area: "",
    pincode: "",
    registrationNumber: "",
    password: "",
    startingDate: "",
    renewalDate: "",
    photo: null,
    certificate: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFranchisees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/franchisee`);
  
        // Step 4: Handle HTML error responses
        if (!res.ok) {
          const text = await res.text();
          console.error("Server returned an error:", text);
          throw new Error("Failed to fetch franchisees");
        }
  
        const data = await res.json();
        setFranchisees(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
  
    fetchFranchisees();
  }, []);
  

  useEffect(() => {
    if (formData.name && editingIndex === null) {
      const generatedEmail =
        formData.name.toLowerCase().replace(/\s+/g, ".") + "@franchisee.com";
      const generatedPassword = generatePassword();
      setFormData((prev) => ({
        ...prev,
        email: generatedEmail,
        password: generatedPassword,
      }));
    }
  }, [formData.name, editingIndex]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    return Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDurationSelect = (months) => {
    if (!formData.startingDate) {
      alert("Please select a starting date first.");
      return;
    }
    const startDate = new Date(formData.startingDate);
    const renewalDate = new Date(startDate.setMonth(startDate.getMonth() + months));
    setFormData((prev) => ({
      ...prev,
      renewalDate: renewalDate.toISOString().split("T")[0],
    }));
  };

  const handleAddOrUpdate = async () => {
    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    const url = editingIndex !== null
      ? `${import.meta.env.VITE_API_URL}/api/franchisee/${franchisees[editingIndex]._id}`
      : `${import.meta.env.VITE_API_URL}/api/franchisee`;

    const method = editingIndex !== null ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        if (editingIndex !== null) {
          const updated = [...franchisees];
          updated[editingIndex] = result;
          setFranchisees(updated);
          alert("Franchisee updated successfully.");
        } else {
          setFranchisees([...franchisees, result]);
          alert("Franchisee added successfully.");
        }
        resetForm();
      } else {
        alert("Failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      centerHead: "",
      centerName: "",
      mobile: "",
      email: "",
      state: "",
      city: "",
      area: "",
      pincode: "",
      registrationNumber: "",
      password: "",
      startingDate: "",
      renewalDate: "",
      photo: null,
      certificate: null,
    });
    setEditingIndex(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData({
      ...franchisees[index],
      photo: null,
      certificate: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (index) => {
    const toDelete = franchisees[index];
    if (!window.confirm(`Are you sure you want to delete ${toDelete.name}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/franchisee/${toDelete._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        const updated = franchisees.filter((_, i) => i !== index);
        setFranchisees(updated);
        alert("Franchisee deleted successfully.");
      } else {
        alert("Failed to delete franchisee: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error while deleting franchisee: " + error.message);
    }
  };

  return (
    <div className="container-fra-ma">
      <h2 className="title">Franchisee Management</h2>
      <button className="button" onClick={() => setIsDialogOpen(true)}>
        Add Franchisee
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Center Head</th>
            <th>Center Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>State</th>
            <th>City</th>
            <th>Area</th>
            <th>Pincode</th>
            <th>Reg. Number</th>
            <th>Start Date</th>
            <th>Renewal Date</th>
            <th>Password</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {franchisees.map((franchisee, index) => (
            <tr key={index}>
              <td>{franchisee.name}</td>
              <td>{franchisee.centerHead}</td>
              <td>{franchisee.centerName}</td>
              <td>{franchisee.mobile}</td>
              <td>{franchisee.email}</td>
              <td>{franchisee.state}</td>
              <td>{franchisee.city}</td>
              <td>{franchisee.area}</td>
              <td>{franchisee.pincode}</td>
              <td>{franchisee.registrationNumber}</td>
              <td>{franchisee.startingDate}</td>
              <td>{franchisee.renewalDate}</td>
              <td>{franchisee.password}</td>
              <td>
                {franchisee.photo && (
                  <a href={`${import.meta.env.VITE_API_URL}/uploads/${franchisee.photo}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                )}
              </td>
             
              <td>
                <button className="action-button edit-button" onClick={() => handleEdit(index)}>Edit</button>
                <button className="action-button delete-button" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingIndex !== null ? "Edit Franchisee" : "Add Franchisee"}</h3>
            <form>
              <input className="input" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
              <input className="input" type="text" name="centerHead" placeholder="Center Head" value={formData.centerHead} onChange={handleInputChange} />
              <input className="input" type="text" name="centerName" placeholder="Center Name" value={formData.centerName} onChange={handleInputChange} />
              <input className="input" type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleInputChange} />
              <input className="input" type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
              <input className="input" type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
              <input className="input" type="text" name="area" placeholder="Area" value={formData.area} onChange={handleInputChange} />
              <input className="input" type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} />
              <input className="input" type="text" name="registrationNumber" placeholder="Registration Number" value={formData.registrationNumber} onChange={handleInputChange} />

              <label>
                Starting Date:
                <input className="input" type="date" name="startingDate" value={formData.startingDate} onChange={handleInputChange} />
              </label>

              <div className="duration-buttons">
                <span>Renewal Duration:</span>
                <button type="button" onClick={() => handleDurationSelect(6)}>6 Months</button>
                <button type="button" onClick={() => handleDurationSelect(12)}>1 Year</button>
              </div>

              <label>
                Renewal Date:
                <input className="input" type="date" name="renewalDate" value={formData.renewalDate} onChange={handleInputChange} />
              </label>

              <label>
                Upload Photo:
                <input className="input" type="file" name="photo" accept="image/*" onChange={handleInputChange} />
              </label>

              <label>
                Upload Certificate:
                <input className="input" type="file" name="certificate" accept=".pdf,.jpg,.png" onChange={handleInputChange} />
              </label>

              <input className="input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
<input className="input" type="text" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />


              <div className="modal-actions">
                <button type="button" className="save-button" onClick={handleAddOrUpdate}>
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
                <button type="button" className="cancel-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseeManagement;
