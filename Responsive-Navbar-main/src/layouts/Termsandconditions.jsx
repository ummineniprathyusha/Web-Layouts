import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const EditableContent = ({ content, setContent }) => {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);

  const handleSave = () => {
    setContent(newContent);
    setEditing(false);
  };

  return (
    <div
      className="editable-content"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editing ? (
        <>
          <textarea
            className="edit-textarea"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button className="save-button" onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p className="editable-text">{content}</p>
          {hovered && (
            <button className="edit-button" onClick={() => {
              setNewContent(content);
              setEditing(true);
            }}>Edit</button>
          )}
        </>
      )}
    </div>
  );
};

const EditableTitle = ({ title, setTitle }) => {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleSave = () => {
    setTitle(newTitle);
    setEditing(false);
  };

  return (
    <div
      className="editable-title-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editing ? (
        <>
          <input
            className="edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="save-button" onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h2 className="editable-title">{title}</h2>
          {hovered && (
            <button className="edit-button" onClick={() => {
              setNewTitle(title);
              setEditing(true);
            }}>Edit</button>
          )}
        </>
      )}
    </div>
  );
};

const Home = ({ title }) => {
  return (
    <div className="page-container home-page">
      <div className="bottom-link">
        <Link to="/terms" className="goto-terms">{title}</Link>
      </div>
    </div>
  );
};

const Terms = ({ title, setTitle }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
      })
      .catch(err => console.error('Error fetching content:', err));
  }, [setTitle]);

  const handleTitleSave = (newTitle) => {
    setTitle(newTitle);
    updateBackend(newTitle, content);
  };

  const handleContentSave = (newContent) => {
    setContent(newContent);
    updateBackend(title, newContent);
  };

  const updateBackend = (titleToSave, contentToSave) => {
    fetch('http://localhost:8080/api/content', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: titleToSave,
        content: contentToSave,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(data => console.log('Saved to backend:', data))
      .catch(err => console.error('Error saving to backend:', err));
  };

  return (
    <div className="page-container terms-page">
      <EditableTitle title={title} setTitle={handleTitleSave} />
      <div className="content-gap" />
      <EditableContent content={content} setContent={handleContentSave} />
    </div>
  );
};

const TermsAndConditions = () => {
  const [title, setTitle] = useState('Terms & Conditions');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home title={title} />} />
        <Route path="/terms" element={<Terms title={title} setTitle={setTitle} />} />
      </Routes>

      {/* Embedded Styles */}
      <style>{`
        .page-container {
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .page-container.home-page {
          justify-content: flex-end;
          align-items: center;
          text-align: center;
        }

        .bottom-link {
          margin-bottom: 2rem;
        }

        .page-container.terms-page {
          align-items: flex-start;
        }

        .goto-terms {
          font-size: 1.5rem;
          text-decoration: underline;
          color: purple;
          cursor: pointer;
        }

        .editable-title-wrapper {
          position: relative;
        }

        .editable-title {
          font-size: 2rem;
          font-weight: bold;
        }

        .edit-input {
          font-size: 1.5rem;
          padding: 0.5rem;
          width: 100%;
        }

        .edit-button, .save-button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
        }

        .editable-content {
          width: 100%;
          max-width: 800px;
          margin-top: 2rem;
          position: relative;
        }

        .editable-text {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .edit-textarea {
          width: 100%;
          font-size: 1.1rem;
          padding: 1rem;
          border: 1px solid #ccc;
          resize: vertical;
          height: 300px;
        }

        .content-gap {
          height: 2rem;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 1rem;
          }

          .editable-title {
            font-size: 1.5rem;
          }

          .edit-textarea {
            height: 200px;
          }
        }
      `}</style>
    </Router>
  );
};

export default TermsAndConditions;

// import React from 'react';
// import TermsAndConditions from './TermsAndConditions';

// function App() {
//   return <TermsAndConditions />;
// }

// export default App;


