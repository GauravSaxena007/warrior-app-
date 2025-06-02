import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';
import axios from 'axios';
import jsPDF from 'jspdf';

const cursiveFonts = [
  'Great Vibes', 'Dancing Script', 'Pacifico', 'Allura', 'Sacramento',
  'Parisienne', 'Cedarville Cursive', 'Herr Von Muellerhoff', 'Tangerine', 'Pinyon Script',
];

// Your updated fields with new keys and labels
const initialFields = [
  { key: 'name', label: 'Name', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 150 }, locked: false },
  { key: 'name2', label: 'Name 2', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 170 }, locked: false },
  { key: 'course', label: 'Course', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 200 }, locked: false },
  { key: 'registrationNo', label: 'Registration No.', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 220 }, locked: false },
  { key: 'enrollmentNo', label: 'Enrollment Number', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 240 }, locked: false },
  { key: 'institution', label: 'Grade', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 260 }, locked: false },
  { key: 'centre', label: 'From', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 280 }, locked: false },
  { key: 'credit', label: 'To', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 300 }, locked: false },
  { key: 'result', label: 'Date', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 320 }, locked: false },
];

const Generatecer = () => {
  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const stageRef = useRef(null);
  const [image] = useImage(template);

  useEffect(() => {
    // Use updated localStorage keys with _v2 suffix
    const savedFields = localStorage.getItem('certificateFields_v2');
    const savedTemplate = localStorage.getItem('certificateTemplate_v2');

    if (savedTemplate) {
      setTemplate(savedTemplate);
    }

    setFields(savedFields ? JSON.parse(savedFields) : initialFields);

    // Fetch registered courses (no subjects/semester fetch)
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => setRegisteredCourses(res.data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  const updateField = (key, updates) => {
    const updated = fields.map((f) => (f.key === key ? { ...f, ...updates } : f));
    setFields(updated);
    localStorage.setItem('certificateFields_v2', JSON.stringify(updated));
  };

  const handleCourseChange = (key, value) => {
    updateField(key, { text: value });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        setTemplate(reader.result);
        localStorage.setItem('certificateTemplate_v2', reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  };

  const downloadCertificate = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'certificate.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // New: Download as PDF
  const downloadPDF = () => {
    if (!stageRef.current) return;

    // Get high-res data URL from stage
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 });

    // Create jsPDF instance
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [900, 600], // match stage size
    });

    // Add image to PDF
    pdf.addImage(dataURL, 'PNG', 0, 0, 900, 600);

    // Save PDF
    pdf.save('certificate.pdf');
  };

  // Clear all localStorage and reset
  const clearAll = () => {
    localStorage.removeItem('certificateFields_v2');
    localStorage.removeItem('certificateTemplate_v2');
    setFields(initialFields);
    setTemplate(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Certificate Generator</h1>
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '30px' }}>
        {template ? (
          <Stage width={900} height={600} ref={stageRef}>
            <Layer>
              <KonvaImage image={image} width={900} height={600} />
              {fields.map((field) => (
                <Text
                  key={field.key}
                  text={field.text}
                  x={field.position.x}
                  y={field.position.y}
                  fontSize={field.fontSize}
                  fontFamily={field.font}
                  fill="black"
                  draggable={!field.locked}
                  onDragEnd={(e) =>
                    updateField(field.key, {
                      position: { x: e.target.x(), y: e.target.y() },
                    })
                  }
                />
              ))}
            </Layer>
          </Stage>
        ) : (
          <div
            style={{
              width: 900,
              height: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              border: '1px dashed #ccc',
            }}
          >
            Image preview will appear here
          </div>
        )}
      </div>

      {fields.map((field) => (
        <div key={field.key} style={{ marginBottom: '20px' }}>
          <label>{field.label}</label>
          {field.key === 'course' ? (
            <select
              value={field.text}
              onChange={(e) => handleCourseChange(field.key, e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Select a Course</option>
              {registeredCourses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={field.text}
              onChange={(e) => updateField(field.key, { text: e.target.value })}
              style={{ width: '100%', padding: '8px' }}
            />
          )}
          <select
            value={field.font}
            onChange={(e) => updateField(field.key, { font: e.target.value })}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {cursiveFonts.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          <input
            type="number"
            min="10"
            max="100"
            value={field.fontSize}
            onChange={(e) =>
              updateField(field.key, { fontSize: parseInt(e.target.value, 10) || 20 })
            }
            style={{ width: '100%', marginTop: '8px', padding: '8px' }}
          />
          <button
            onClick={() => updateField(field.key, { locked: !field.locked })}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '10px',
              backgroundColor: field.locked ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {field.locked ? 'Unlock Position' : 'Lock Position'}
          </button>
        </div>
      ))}

      {template && (
        <>
          <button
            onClick={downloadCertificate}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '18px',
              marginTop: '20px',
            }}
          >
            Download Certificate (PNG)
          </button>
          <button
            onClick={downloadPDF}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '18px',
              marginTop: '10px',
            }}
          >
            Download Certificate (PDF)
          </button>
          <button
            onClick={clearAll}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '18px',
              marginTop: '10px',
            }}
          >
            Clear All / Reset
          </button>
        </>
      )}
    </div>
  );
};

export default Generatecer;
