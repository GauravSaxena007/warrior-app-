import React, { useState, useEffect } from 'react';
import './ReelComp.css';

const ReelComp = () => {
  const [texts, setTexts] = useState([
    '🎓 Franchisee Opportunity',
    '📜 Get Certified Today',
    '💼 Job-Ready Courses',
    '🌐 Online & Offline Training',
    '📍 Join the Warrior Family',
    '🎯 Skill-Oriented Programs',
    '🛡️ Trusted by Thousands'
  ]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [font, setFont] = useState('Arial');
  const [showMarquee, setShowMarquee] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/marquee`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch marquee settings');
        return res.json();
      })
      .then(data => {
        setTexts(data.texts && data.texts.length > 0 ? data.texts : texts);
        setBgColor(data.backgroundColor || '#ffffff');
        setFont(data.font || 'Arial');
        setShowMarquee(data.showMarquee !== undefined ? data.showMarquee : true);
      })
      .catch(err => console.error('Error fetching marquee settings:', err));
  }, []);

  // Optional: Polling for real-time updates (commented out)
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/marquee')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch marquee settings');
          return res.json();
        })
        .then(data => {
          setTexts(data.texts && data.texts.length > 0 ? data.texts : texts);
          setBgColor(data.backgroundColor || '#ffffff');
          setFont(data.font || 'Arial');
          setShowMarquee(data.showMarquee !== undefined ? data.showMarquee : true);
        })
        .catch(err => console.error('Error fetching marquee settings:', err));
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [texts]);
  */

  return (
    <div className="reel-comp-container">
      {showMarquee && (
        <div
          className="text-strip-container"
          style={{ backgroundColor: bgColor, fontFamily: font }}
        >
          <div className="text-strip-track">
            <div className="text-strip">
              {texts.map((text, index) => (
                <span key={`text-${index}`}>{text}</span>
              ))}
            </div>
            <div className="text-strip">
              {texts.map((text, index) => (
                <span key={`dup-${index}`}>{text}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelComp;