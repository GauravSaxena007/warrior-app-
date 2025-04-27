import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    contactPerson: "",
    state: "",
    city: "",
    area: "",
    address: "",
    pinCode: "",
    mobileNo: "",
    email: "",
  });
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
    mapUrl: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/contact/info")
      .then(response => {
        console.log("Contact Info Response:", response.data);
        setContactInfo(response.data);
      })
      .catch(error => console.error("Error fetching contact info:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/contact/submissions", {
      name: formData.contactPerson,
      state: formData.state,
      city: formData.city,
      area: formData.area,
      address: formData.address,
      pin: formData.pinCode,
      mobile: formData.mobileNo,
      email: formData.email,
    })
      .then(() => {
        alert("Form submitted successfully!");
        setFormData({
          contactPerson: "",
          state: "",
          city: "",
          area: "",
          address: "",
          pinCode: "",
          mobileNo: "",
          email: "",
        });
      })
      .catch(error => console.error("Error submitting form:", error));
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            {contactInfo.mapUrl && contactInfo.mapUrl.startsWith('https://www.google.com/maps/embed') ? (
              <iframe
                title="Google Map"
                className="google-map"
                src={contactInfo.mapUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            ) : (
              <p>Map not available {contactInfo.mapUrl && `(Invalid URL: ${contactInfo.mapUrl})`}</p>
            )}
          </div>
          <div className="col-md-6">
            <div className="contact-form">
              <h4>SEND A MESSAGE</h4>
              <p>Your email address will not be published. Required fields are marked.</p>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="contactPerson"
                      placeholder="Contact Person *"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
  <input
    type="text"
    name="state"
    value={formData.state}
    onChange={handleChange}
    placeholder="Enter State"
    className="form-control"
  />
</div>

<div className="col-md-6">
  <input
    type="text"
    name="city"
    value={formData.city}
    onChange={handleChange}
    placeholder="Enter City"
    className="form-control"
  />
</div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="area"
                      placeholder="Area"
                      value={formData.area}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="pinCode"
                      placeholder="Pin Code"
                      value={formData.pinCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="mobileNo"
                      placeholder="Mobile No. *"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="contact-info">
          <h5>CONTACT INFO</h5>
          <p>We are glad to have you around.</p>
          <div className="info-box">
            <div className="phone">
              <strong>Phone:</strong> {contactInfo.phone}
            </div>
            <div className="email">
              <strong>Email:</strong> {contactInfo.email}
            </div>
            <div className="address">
              <strong>Address:</strong> {contactInfo.address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;