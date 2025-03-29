import React from "react";
import "./Contact.css"; // Make sure to add styles here

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <div className="row">
          {/* Google Map Section */}
          <div className="col-md-6">
          <iframe
  title="Google Map"
  className="google-map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.102429233749!2d75.82268047528643!3d25.165173377706048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396f84f365e468ed%3A0xa7d6ff6de1677c52!2sDadabari%2C%20Kota%2C%20Rajasthan%20324009!5e0!3m2!1sen!2sin!4v1711555555555"
  width="100%"
  height="350"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
></iframe>
          </div>

          {/* Contact Form Section */}
          <div className="col-md-6">
            <div className="contact-form">
              <h4>SEND A MESSAGE</h4>
              <p>Your email address will not be published. Required fields are marked.</p>
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <input type="text" placeholder="Contact Person *" required />
                  </div>
                  <div className="col-md-6">
                    <select>
                      <option>Select State</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select>
                      <option>Select City</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="text" placeholder="Area" />
                  </div>
                  <div className="col-12">
                    <textarea placeholder="Address"></textarea>
                  </div>
                  <div className="col-md-6">
                    <input type="text" placeholder="Pin Code" />
                  </div>
                  <div className="col-md-6">
                    <input type="text" placeholder="Mobile No. *" required />
                  </div>
                  <div className="col-12">
                    <input type="email" placeholder="Email *" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="contact-info">
          <h5>CONTACT INFO</h5>
          <p>Welcome to RCSAS Website. We are glad to have you around.</p>
          <div className="info-box">
            <div className="phone">
              <strong>Phone:</strong> 9422123456 | 07122072727
            </div>
            <div className="email">
              <strong>Email:</strong> rcsasedu@gmail.com
            </div>
            <div className="address">
              <strong>Address:</strong> 393-A, Indraprastha, Hanuman Nagar, Nagpur - 440009. (Maharashtra)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
