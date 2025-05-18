import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Agreement.css';
import Loginlayout from '../Layout/Loginlayout';


const Agreement = () => {
  const location = useLocation();
  const isTestingPage = location.pathname === "/agreement";

  
  const [agreementData, setAgreementData] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/agreement`);
        setAgreementData(res.data);
      } catch (err) {
        console.error('Error fetching agreement:', err);
      }
    };

    fetchAgreement();
  }, []);

  if (!agreementData) {
    return <div>Loading agreement...</div>;
  }

  return (
    <div>
      {isTestingPage && (
        <div>
          <Loginlayout />
        </div>
      )}
      
      <div className="agreement-container">
        {/* Header Section */}
        <header className="agreement-header">
          <h2>{agreementData.agreementTitle}</h2>
        </header>

        {/* Agreement Content */}
        <section className="agreement-content">
          {agreementData.content.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
          <ol>
            {agreementData.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ol>
          <p>IN WITNESS WHEREOF, the parties hereto have executed this agreement...</p>
        </section>

        {/* Course Table Section */}
        <section className="course-table">
          <h3>Course Details</h3>
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Duration</th>
                <th>Royalty Without Material</th>
              </tr>
            </thead>
            <tbody>
              {agreementData.courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.duration}</td>
                  <td>{course.royalty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Agreement;
