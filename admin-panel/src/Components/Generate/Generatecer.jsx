import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';

const Generatecer = () => {
  const [template, setTemplate] = useState(null);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [namePos, setNamePos] = useState({ x: 200, y: 150 });
  const [coursePos, setCoursePos] = useState({ x: 200, y: 200 });
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [isCourseLocked, setIsCourseLocked] = useState(false);
  const [nameFont, setNameFont] = useState('Great Vibes');
  const [courseFont, setCourseFont] = useState('Great Vibes');
  const stageRef = useRef(null);

  const cursiveFonts = [
    'Great Vibes',
    'Dancing Script',
    'Pacifico',
    'Allura',
    'Sacramento',
    'Parisienne',
    'Cedarville Cursive',
    'Herr Von Muellerhoff',
    'Tangerine',
    'Pinyon Script',
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      setTemplate(URL.createObjectURL(file));
    } else {
      alert('Please upload a PNG or JPEG image.');
    }
  };

  const [image] = useImage(template);

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
      <h1>Certificate Generator</h1>
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ margin: '20px 0' }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
        <select
          value={nameFont}
          onChange={(e) => setNameFont(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          {cursiveFonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsNameLocked(!isNameLocked)}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: isNameLocked ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isNameLocked ? 'Unlock Name' : 'Lock Name'}
        </button>
        <br />
        <label>
          Course:
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={{ marginLeft: '10px', marginTop: '10px', padding: '5px' }}
          />
        </label>
        <select
          value={courseFont}
          onChange={(e) => setCourseFont(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          {cursiveFonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsCourseLocked(!isCourseLocked)}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: isCourseLocked ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isCourseLocked ? 'Unlock Course' : 'Lock Course'}
        </button>
      </div>
      {template && (
        <Stage width={600} height={400} ref={stageRef}>
          <Layer>
            <KonvaImage image={image} width={600} height={400} />
            <Text
              text={name}
              x={namePos.x}
              y={namePos.y}
              fontSize={30}
              fontFamily={nameFont}
              fill="black"
              draggable={!isNameLocked}
              onDragEnd={(e) => {
                setNamePos({ x: e.target.x(), y: e.target.y() });
              }}
            />
            <Text
              text={course}
              x={coursePos.x}
              y={coursePos.y}
              fontSize={20}
              fontFamily={courseFont}
              fill="black"
              draggable={!isCourseLocked}
              onDragEnd={(e) => {
                setCoursePos({ x: e.target.x(), y: e.target.y() });
              }}
            />
          </Layer>
        </Stage>
      )}
      {template && (
        <button
          onClick={downloadCertificate}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Download Certificate
        </button>
      )}
    </div>
  );
};

export default Generatecer;