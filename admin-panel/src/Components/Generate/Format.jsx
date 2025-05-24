import React, { useRef, useState } from "react";

const Format = () => {
  const [templateImage, setTemplateImage] = useState(null);
  const [fields, setFields] = useState([]);
  const [draggingFieldIndex, setDraggingFieldIndex] = useState(null);
  const [resizingFieldIndex, setResizingFieldIndex] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplateImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addField = () => {
    const newField = {
      x: 50,
      y: 50,
      width: 120,
      height: 30,
      label: "Field",
      type: "text",
    };
    setFields([...fields, newField]);
  };

  const startDrag = (e, idx) => {
    setDraggingFieldIndex(idx);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const startResize = (e, idx) => {
    e.stopPropagation();
    setResizingFieldIndex(idx);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (draggingFieldIndex !== null && startPos) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      const newFields = [...fields];
      newFields[draggingFieldIndex].x += dx;
      newFields[draggingFieldIndex].y += dy;
      setFields(newFields);
      setStartPos({ x: e.clientX, y: e.clientY });
    }

    if (resizingFieldIndex !== null && startPos) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      const newFields = [...fields];
      newFields[resizingFieldIndex].width += dx;
      newFields[resizingFieldIndex].height += dy;
      setFields(newFields);
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggingFieldIndex(null);
    setResizingFieldIndex(null);
    setStartPos(null);
  };

  const saveTemplate = () => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const imageWidth = rect.width;
    const imageHeight = rect.height;

    const template = {
      templateImage,
      fields,
      imageWidth,
      imageHeight,
    };
    localStorage.setItem("marksheet-template", JSON.stringify(template));
    alert("Template saved successfully!");
  };

  return (
    <div
      className="p-4 max-w-6xl mx-auto"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h1 className="text-2xl font-bold mb-4">Marksheet Format Designer</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button
        className="ml-4 bg-blue-600 text-white px-3 py-1 rounded"
        onClick={addField}
      >
        Add Field
      </button>
      <button
        className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
        onClick={saveTemplate}
      >
        Save Template
      </button>

      {templateImage && (
        <div className="mt-4 relative border shadow-lg inline-block">
          <img
            src={templateImage}
            alt="Template"
            ref={imageRef}
            className="block"
            style={{ maxWidth: "100%" }}
          />
          {fields.map((field, idx) => (
            <div
              key={idx}
              onMouseDown={(e) => startDrag(e, idx)}
              style={{
                position: "absolute",
                left: field.x,
                top: field.y,
                width: field.width,
                height: field.height,
                border: "1px dashed red",
                backgroundColor: "rgba(255,255,255,0.6)",
                cursor: "move",
                padding: 2,
                fontSize: 12,
              }}
            >
              {field.label}
              <div
                onMouseDown={(e) => startResize(e, idx)}
                style={{
                  position: "absolute",
                  right: -6,
                  bottom: -6,
                  width: 12,
                  height: 12,
                  backgroundColor: "red",
                  cursor: "se-resize",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Format;
