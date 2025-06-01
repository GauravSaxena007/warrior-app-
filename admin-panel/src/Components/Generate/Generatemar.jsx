import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';
import axios from 'axios';

const cursiveFonts = [
  'Great Vibes', 'Dancing Script', 'Pacifico', 'Allura', 'Sacramento',
  'Parisienne', 'Cedarville Cursive', 'Herr Von Muellerhoff', 'Tangerine', 'Pinyon Script',
];

const initialFields = [
  { key: 'name', label: 'Name', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 150 }, locked: false },
  { key: 'course', label: 'Course', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 200 }, locked: false },
  { key: 'registrationNo', label: 'Registration No.', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 250 }, locked: false },
  { key: 'institution', label: 'Institution Name & Code', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 300 }, locked: false },
  { key: 'centre', label: 'Centre', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 350 }, locked: false },
  { key: 'result', label: 'Result', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 700 }, locked: false },
  { key: 'grandTotal', label: 'Grand Total', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 750 }, locked: false },
  { key: 'monthYear', label: 'Month & Year of Examination', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 800 }, locked: false },
  { key: 'classObtained', label: 'Class Obtained', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 850 }, locked: false },
  { key: 'grade', label: 'Grade', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 900 }, locked: false },
];

const Generatemar = () => {
  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const stageRef = useRef(null);
  const [image] = useImage(template);

  useEffect(() => {
    const savedFields = localStorage.getItem('certificateFields');
    const savedTemplate = localStorage.getItem('certificateTemplate');
    if (savedTemplate) setTemplate(savedTemplate);
    setFields(savedFields ? JSON.parse(savedFields) : initialFields);

    // Fetch courses from backend
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => {
        console.log('API Response:', res.data); // Debug: Log API response
        setRegisteredCourses(res.data);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
      });
  }, []);

  const updateField = (key, updates, batch = false) => {
    let updated;
    if (batch) {
      updated = fields.map(f =>
        updates[f.key] !== undefined ? { ...f, text: updates[f.key] } : f
      );
    } else {
      updated = fields.map(f => (f.key === key ? { ...f, ...updates } : f));
    }
    setFields(updated);
    localStorage.setItem('certificateFields', JSON.stringify(updated));
  };

  const handleCourseChange = (value) => {
    updateField('course', { text: value });
    const selected = registeredCourses.find(c => c.title === value);
    let newFields = initialFields.filter(f => !f.key.startsWith('subject_row_'));
    let newSubjects = [];

    if (selected && selected.semesters?.length > 0) {
      // Collect all subjects across all semesters
      const subjectsData = selected.semesters.flatMap(semester => semester.subjects || []);
      console.log('Subjects Data:', subjectsData); // Debug: Log all subjects
      newSubjects = subjectsData.map((subj, index) => ({
        subject: subj.subject || '',
        maxMarks: subj.maxMarks?.toString() || '',
        passingMarks: subj.passingMarks?.toString() || '',
        obtainedMarks: subjects[index]?.obtainedMarks || '',
      }));

      // Create one field per subject with formatted text
      const subjectFields = subjectsData.map((subj, index) => {
        const formattedText = `${subj.subject.padEnd(30)} ${subj.maxMarks.padEnd(10)} ${subj.passingMarks.padEnd(10)} ${newSubjects[index].obtainedMarks || ''}`;
        return {
          key: `subject_row_${index}`,
          label: `Subject Row ${index + 1}`,
          text: formattedText,
          font: 'Great Vibes',
          fontSize: 18,
          position: { x: 100, y: 400 + index * 30 },
          locked: false,
        };
      });
      newFields = [...newFields, ...subjectFields];
      console.log('New Fields:', newFields); // Debug: Log fields for canvas
    }
    setFields(newFields);
    setSubjects(newSubjects);
    console.log('New Subjects:', newSubjects); // Debug: Log subjects for form
    localStorage.setItem('certificateFields', JSON.stringify(newFields));
  };

  const handleObtainedMarksChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].obtainedMarks = value;
    setSubjects(updatedSubjects);
    console.log('Updated Subjects:', updatedSubjects); // Debug: Log subjects state
    // Update the corresponding subject row text using subjects state
    const subj = updatedSubjects[index];
    const formattedText = `${subj.subject.padEnd(30)} ${subj.maxMarks.padEnd(10)} ${subj.passingMarks.padEnd(10)} ${value || ''}`;
    console.log(`Updating subject_row_${index} with text:`, formattedText); // Debug: Log canvas text update
    updateField(`subject_row_${index}`, { text: formattedText });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setTemplate(base64);
        localStorage.setItem('certificateTemplate', base64);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  };

  const downloadCertificate = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'certificate.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Marksheet Generator</h1>
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px', maxWidth: 900, height: 1000 }}>
          {template ? (
            <Stage width={600} height={1000} ref={stageRef}>
              <Layer>
                <KonvaImage image={image} width={600} height={1000} />
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
                width: 600,
                height: 1000,
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
        <div style={{ flex: 1, maxWidth: 400 }}>
          {fields
            .filter((field) => !field.key.startsWith('subject_row_'))
            .map((field) => (
              <div key={field.key} style={{ marginBottom: '20px' }}>
                <label>{field.label}</label>
                {field.key === 'course' ? (
                  <select
                    value={field.text}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Select a Course</option>
                    {registeredCourses.map((course) => (
                      <option key={course._id} value={course.title}>{course.title}</option>
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
                    updateField(field.key, { fontSize: parseInt(e.target.value, 10) })
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
          {subjects.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label>Subjects</label>
              <div className="subjects-section">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Subject</th>
                      <th>Max Marks</th>
                      <th>Passing Marks</th>
                      <th>Obtained Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subj, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{subj.subject}</td>
                        <td>{subj.maxMarks}</td>
                        <td>{subj.passingMarks}</td>
                        <td>
                          <input
                            type="text"
                            value={subj.obtainedMarks}
                            onChange={(e) => handleObtainedMarksChange(index, e.target.value)}
                            style={{ width: '80px', padding: '5px' }}
                            placeholder="Enter marks"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {template && (
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
              }}
            >
              Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generatemar;