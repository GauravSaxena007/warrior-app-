import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const cursiveFonts = [
  'Great Vibes', 'Dancing Script', 'Pacifico', 'Allura', 'Sacramento',
  'Parisienne', 'Cedarville Cursive', 'Herr Von Muellerhoff', 'Tangerine', 'Pinyon Script',
];

const initialFields = [
  { key: 'name', label: 'Name', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 150 }, locked: false },
  { key: 'name2', label: 'Name 2', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 170 }, locked: false },
  { key: 'course', label: 'Course', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 200 }, locked: false },
  { key: 'courseName1', label: 'Course Name 1', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 220 }, locked: false },
  { key: 'courseName2', label: 'Course Name 2', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 240 }, locked: false },
  { key: 'registrationNo', label: 'Registration No.', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 260 }, locked: false },
  { key: 'enrollmentNo1', label: 'Enrollment Number 1', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 280 }, locked: false },
  { key: 'enrollmentNo2', label: 'Enrollment Number 2', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 300 }, locked: false },
  { key: 'institution', label: 'Institution Name & Code', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 320 }, locked: false },
  { key: 'centre', label: 'Centre', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 340 }, locked: false },
  { key: 'credit', label: 'Credit', text: '', font: 'Great Vibes', fontSize: 20, position: { x: 200, y: 360 }, locked: false },
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
    if (savedTemplate) {
      console.log('Loading saved template from localStorage');
      setTemplate(savedTemplate);
    }
    const loadedFields = savedFields ? JSON.parse(savedFields) : initialFields;
    console.log('Initial fields set:', loadedFields);
    setFields(loadedFields);

    // Fetch courses from backend
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => {
        console.log('Fetched courses:', res.data);
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
    console.log(`Updating fields for ${key}:`, updated);
    setFields(updated);
    localStorage.setItem('certificateFields', JSON.stringify(updated));
  };

  const handleCourseChange = (key, value) => {
    console.log(`Course change for ${key}:`, value);
    updateField(key, { text: value });
    if (key === 'course') {
      const selected = registeredCourses.find(c => c.title === value);
      let newFields = fields.filter(f => !f.key.startsWith('subject_row_'));
      let newSubjects = [];

      if (selected && selected.semesters?.length > 0) {
        const subjectsData = selected.semesters.flatMap(semester => semester.subjects || []);
        console.log('Subjects Data for course:', subjectsData);
        newSubjects = subjectsData.map((subj, index) => ({
          subject: subj.subject || '',
          maxMarks: subj.maxMarks?.toString() || '',
          passingMarks: subj.passingMarks?.toString() || '',
          obtainedMarks: subjects[index]?.obtainedMarks || '',
        }));

        const subjectFields = subjectsData.map((subj, index) => {
          const formattedText = `${subj.subject.padEnd(30)} ${subj.maxMarks.toString().padEnd(10)} ${subj.passingMarks.toString().padEnd(10)} ${newSubjects[index].obtainedMarks || ''}`;
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
        console.log('Updated fields with subjects:', newFields);
      }
      setFields(newFields);
      setSubjects(newSubjects);
      console.log('Updated subjects:', newSubjects);
      localStorage.setItem('certificateFields', JSON.stringify(newFields));
    }
  };

  const handleObtainedMarksChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].obtainedMarks = value;
    setSubjects(updatedSubjects);
    console.log('Updated subjects with marks:', updatedSubjects);
    const subj = updatedSubjects[index];
    const formattedText = `${subj.subject.padEnd(30)} ${subj.maxMarks.padEnd(10)} ${subj.passingMarks.padEnd(10)} ${value || ''}`;
    console.log(`Updating subject_row_${index} with text:`, formattedText);
    updateField(`subject_row_${index}`, { text: formattedText });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        console.log('Image uploaded, setting template');
        setTemplate(base64);
        localStorage.setItem('certificateTemplate', base64);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  };

  const downloadCertificate = () => {
    if (!stageRef.current) {
      console.error('Stage reference not available');
      return;
    }

    // Use html2canvas on the container of the Konva stage
    html2canvas(stageRef.current.container(), { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('certificate.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
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
                {['course', 'courseName1', 'courseName2'].includes(field.key) ? (
                  <select
                    value={field.text}
                    onChange={(e) => handleCourseChange(field.key, e.target.value)}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Select a Course</option>
                    {registeredCourses.length > 0 ? (
                      registeredCourses.map((course) => (
                        <option key={course._id} value={course.title}>{course.title}</option>
                      ))
                    ) : (
                      <option value="" disabled>No courses available</option>
                    )}
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
                  value={field.fontSize}
                  onChange={(e) =>
                    updateField(field.key, { fontSize: Number(e.target.value) || 20 })
                  }
                  style={{ width: '100%', marginTop: '8px' }}
                  min={10}
                  max={72}
                />
              </div>
            ))}

          {/* Subject Rows with Obtained Marks inputs */}
          {subjects.length > 0 && (
            <div>
              <h3>Subjects & Marks</h3>
              {subjects.map((subj, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <label>{subj.subject}</label>
                  <input
                    type="number"
                    value={subj.obtainedMarks}
                    onChange={(e) => handleObtainedMarksChange(index, e.target.value)}
                    style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                  />
                </div>
              ))}
            </div>
          )}
          <button
            onClick={downloadCertificate}
            style={{
              marginTop: '30px',
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Generatemar;
