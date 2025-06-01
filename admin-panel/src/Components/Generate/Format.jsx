import React from 'react';
import './Format.css';
import logo from '../../../../admin-panel/public/main-logo.png'

const Format = () => {
  return (
    <div className="Format-container">
      <div className="Format-header">
        <img
          src={logo}
          alt="Logo"
          className="Format-logo"
        />

        <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
        <h3>National Institute of Commerce and Technical Training</h3>
      </div>

      <div className="Format-info">
        <div>
          <strong>Student Name:</strong> Vinod Kumar
        </div>
        <div>
          <strong>Enrollment No:</strong> CHRETD/23YN04/71583
        </div>
        <div>
          <strong>Course Name:</strong> DIPLOMA IN YOGA
        </div>
        <div>
          <strong>Session:</strong> JAN 2024 TO DEC 2024
        </div>
      </div>

      <table className="Format-table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Subject</th>
            <th>Total Marks</th>
            <th>Passing Marks</th>
            <th>Obtain Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>BASICS OF HUMAN PHILOSOPHY AND PHYSIOLOGY</td>
            <td>100</td>
            <td>40</td>
            <td>87</td>
          </tr>
          <tr>
            <td>2</td>
            <td>BASICS OF HUMAN BIOLOGY</td>
            <td>100</td>
            <td>40</td>
            <td>73</td>
          </tr>
          <tr>
            <td>3</td>
            <td>FUNDAMENTAL OF YOGA</td>
            <td>100</td>
            <td>40</td>
            <td>75</td>
          </tr>
          <tr>
            <td>4</td>
            <td>PRACTICAL-II (YOGA PRACTICE)</td>
            <td>100</td>
            <td>40</td>
            <td>74</td>
          </tr>
          <tr>
            <td>5</td>
            <td>PRACTICAL-I (YOGA PRACTICE)</td>
            <td>100</td>
            <td>40</td>
            <td>77</td>
          </tr>
          <tr className="total-row">
            <td colSpan="2">Total</td>
            <td>500</td>
            <td>200</td>
            <td>386</td>
          </tr>
        </tbody>
      </table>

      <div className="Format-summary">
        <p><strong>Percentage:</strong> 77.20%</p>
        <p><strong>Result:</strong> Pass</p>
        <p><strong>Grade:</strong> B+</p>
        <p><strong>Place:</strong> India</p>
      </div>

      <div className="Format-footer">
        <p>🌐 chrdindia.in</p>
        <p>📧 contact.chred@gmail.com</p>
        <p>📞 +91 9960799678</p>
        <button onClick={() => window.print()}>Print Format</button>
      </div>
    </div>
  );
};

export default Format;
