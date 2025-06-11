import React, { useState, useEffect } from 'react';

const EditableField = ({ value, onSave, isTextArea = false }) => {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  return (
    <div
      className="editable-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editing ? (
        <>
          {isTextArea ? (
            <textarea
              className="edit-textarea"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          ) : (
            <input
              className="edit-input"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          )}
          <button className="save-button" onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          {isTextArea ? (
            <div className="editable-text">{value || ""}</div>
          ) : (
            <h2 className="editable-title">{value || ""}</h2>
          )}
          {hovered && (
            <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
          )}
        </>
      )}
    </div>
  );
};

const TermsAndConditions = () => {
  const [title, setTitle] = useState('Terms & Conditions');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
      })
      .catch(err => console.error('Error fetching content:', err));
  }, []);

  const updateBackend = (updatedTitle, updatedContent) => {
    fetch('http://localhost:8080/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
    })
      .then(res => res.json())
      .then(data => console.log('Saved:', data))
      .catch(err => console.error('Save failed:', err));
  };

  const handleTitleSave = (newTitle) => {
    setTitle(newTitle);
    updateBackend(newTitle, content);
  };

  const handleContentSave = (newContent) => {
    setContent(newContent);
    updateBackend(title, newContent);
  };

  return (
    <div className="page-container terms-page">
      <EditableField value={title} onSave={handleTitleSave} />
      <div className="content-gap" />
      <EditableField value={content} onSave={handleContentSave} isTextArea={true} />

      <style>{`
        .page-container {
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .editable-wrapper {
          position: relative;
          width: 100%;
          max-width: 900px;
        }

        .editable-title {
          font-size: 2.2rem;
          font-weight: 600;
        }

        .editable-text {
          font-size: 1.1rem;
          line-height: 1.7;
          white-space: pre-line;
          padding: 1rem;
          border-radius: 6px;
          background-color: #f1f1f1;
          min-height: 300px;
        }

        .edit-input {
          font-size: 1.5rem;
          padding: 0.5rem;
          width: 100%;
        }

        .edit-textarea {
          width: 100%;
          font-size: 1.1rem;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          resize: vertical;
          min-height: 300px;
        }

        .edit-button, .save-button {
          margin-top: 0.7rem;
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
        }

        .content-gap {
          height: 2rem;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 1rem;
          }

          .editable-title {
            font-size: 1.6rem;
          }

          .edit-textarea {
            min-height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;


