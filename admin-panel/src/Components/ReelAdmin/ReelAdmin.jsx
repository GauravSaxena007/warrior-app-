import React, { useState, useEffect } from 'react';
import './Reeladmin.css';

const Reeladmin = () => {
  const [showMarquee, setShowMarquee] = useState(true);
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

  // Fetch marquee settings on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/marquee`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch marquee settings');
        return res.json();
      })
      .then(data => {
        let fetchedTexts = data.texts || [];
        while (fetchedTexts.length < 7) fetchedTexts.push('');
        setTexts(fetchedTexts.slice(0, 7));
        setBgColor(data.backgroundColor || '#ffffff');
        setFont(data.font || 'Arial');
        setShowMarquee(data.showMarquee !== undefined ? data.showMarquee : true);
      })
      .catch(err => console.error('Error fetching marquee settings:', err));
  }, []);

  // Update marquee settings
  const saveSettings = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/marquee`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, backgroundColor: bgColor, font, showMarquee })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update marquee settings');
        return res.json();
      })
      .then(data => {
        alert('Settings saved successfully!');
      })
      .catch(err => console.error('Error updating marquee settings:', err));
  };

  const handleTextChange = (index, value) => {
    if (index < 0 || index >= 7) return;
    const updated = [...texts];
    updated[index] = value;
    setTexts(updated);
  };

  const toggleMarquee = () => {
    setShowMarquee(prev => !prev);
  };

  return (
    <div className="reel-admin-container">
      <h2>🎛️ Reel Control Panel</h2>

      <div className="toggle-section">
        <label>Show Marquee:</label>
        <button onClick={toggleMarquee}>
          {showMarquee ? 'ON (Click to hide)' : 'OFF (Click to show)'}
        </button>
      </div>

      <div className="style-section">
        <div>
          <label>Background Color:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>

        <div>
          <label>Font:</label>
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="'Courier New', Courier, monospace">Courier</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="Math Sans Bold Italic">Math Sans</option>
            {/* Popular Indian government fonts */}
            <option value="'Noto Sans', sans-serif">Noto Sans</option>
            <option value="'Noto Serif', serif">Noto Serif</option>
            <option value="'Hind', sans-serif">Hind</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Lato', sans-serif">Lato</option>
            <option value="'Mukta', sans-serif">Mukta</option>
            <option value="'Tiro Devanagari Hindi', serif">Tiro Devanagari Hindi</option>
            <option value="'Baloo 2', cursive">Baloo 2</option>
            <option value="'Karma', serif">Karma</option>
          </select>
        </div>
      </div>

      <div className="edit-section">
        <h4>Edit Marquee Texts:</h4>
        {[...Array(7)].map((_, idx) => (
          <input
            key={idx}
            type="text"
            value={texts[idx] || ''}
            onChange={(e) => handleTextChange(idx, e.target.value)}
            placeholder={`Text ${idx + 1}`}
          />
        ))}
      </div>

      <button onClick={saveSettings} className="save-button">Save Settings</button>

      <div className="preview-section">
        <h4>Live Preview:</h4>
        {showMarquee ? (
          <div
            className="text-strip-container"
            style={{ backgroundColor: bgColor, fontFamily: font }}
          >
            <div className="text-strip">
              {texts.map((text, idx) => (
                <span key={idx}>{text}</span>
              ))}
            </div>
          </div>
        ) : (
          <p>Reel is currently hidden.</p>
        )}
      </div>
    </div>
  );
};

export default Reeladmin;
