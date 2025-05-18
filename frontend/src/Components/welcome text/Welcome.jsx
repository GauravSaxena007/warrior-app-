import React, { useState, useEffect } from 'react';
import "./Welcome.css"; // Import external CSS
import axios from "axios";

const Welcome = () => {
  const [welcomeData, setWelcomeData] = useState({
    welcomeTitle: "WELCOME TO RCSAS COMPUTER EDUCATION FRANCHISE",
    welcomeText: "RCSAS Education provides Best Computer Education Franchise Business opportunity in India to help people, who are interested in starting their own business and taking a Low Cost Franchise. It is one of the Top Computer Education Franchise Businesses in India.\n\nWe offer more advanced IT education courses that are synchronized with advanced technological revolutions at a global level.\n\nWe offer various courses including Computer Courses, Optical Courses, Hardware Courses, Associate Courses, Tailoring Courses, Nursery Courses, Technical Courses, Fire and Safety Courses, Other Courses, Cinematic Courses, Food Courses, Beauty and Hair Courses, Solar Courses, Medical Courses, Agricultural Courses, Insurance Courses, Diamond Courses, Fashion Designing, Mobile Repairing Courses, Banking Courses, and Special Courses in the field of Information Technology.\n\nRCSAS Education facilitates the creation of a network of Computer Course Franchise Businesses worldwide to empower the workforce with job-oriented skills. We provide the Best Low-Cost Franchise Business in the market. Our franchise programs are customized keeping market trends in mind, thereby developing talent in students.\n\nRCSAS Education provides the opportunity to start your own business in computer education and offers career-training courses in the above-listed industries. We select business franchise partners that share RCSAS's passion and vision to spread in remote areas. We are a market-focused organization that develops and delivers solutions to our Franchise partners.",
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/settings`)
      .then((response) => {
        const data = response.data;
        setWelcomeData({
          welcomeTitle: data.welcomeTitle || "WELCOME TO RCSAS COMPUTER EDUCATION FRANCHISE",
          welcomeText: data.welcomeText || welcomeData.welcomeText,
        });
      })
      .catch((error) => console.error("Error fetching welcome data:", error));
  }, []);

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">{welcomeData.welcomeTitle}</h1>
      <p className="welcome-text">
        {welcomeData.welcomeText.split("\n\n").map((paragraph, index) => (
          <React.Fragment key={index}>
            {paragraph}
            <br /><br />
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}

export default Welcome;