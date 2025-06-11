import React, { useState, useEffect, useRef } from 'react';

const ContactPage = ({ title, setTitle }) => {
  const titleRef = useRef(null);

  const [info, setInfo] = useState({
    location: '',
    phone: '',
    hours: ''
  });
  const [tempInfo, setTempInfo] = useState({ ...info });
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const handleTitleInput = () => {
    const newTitle = titleRef.current.innerText;
    setTitle(newTitle);
    fetch('http://localhost:8080/api/contact-info/title', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
      .then(res => res.json())
      .then(data => console.log('Title updated:', data))
      .catch(error => console.error('Error updating title:', error));
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/contact-info')
      .then(res => res.json())
      .then(data => {
        if (titleRef.current && data.title) {
          titleRef.current.innerText = data.title;
          setTitle(data.title);
        }
        setInfo(data);
        setTempInfo(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleInfoChange = (e) => {
    setTempInfo({ ...tempInfo, [e.target.name]: e.target.value });
  };

  const saveInfoChanges = () => {
    setInfo(tempInfo);
    setEditing(false);
    fetch('http://localhost:8080/api/contact-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tempInfo)
    })
      .then(res => res.json())
      .then(() => console.log('Info saved'))
      .catch(err => console.error('Save failed', err));
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Message sent!');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to send.');
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #222;
          padding: 10px 20px;
          color: white;
        }
        .navbar-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .navbar-toggle {
          font-size: 1.5rem;
          background: none;
          color: white;
          border: none;
          display: none;
          cursor: pointer;
        }
        .navbar-menu {
          display: flex;
          gap: 15px;
          list-style: none;
        }
        .navbar-menu li a {
          color: white;
          text-decoration: none;
        }
        @media (max-width: 768px) {
          .navbar-toggle {
            display: block;
          }
          .navbar-menu {
            display: none;
            flex-direction: column;
            gap: 10px;
            background-color: #333;
            padding: 10px;
          }
          .navbar-menu.open {
            display: flex;
          }
        }
        .contact-section {
          padding: 2rem;
          background-color: #f4f4f4;
        }
        .contact-title-wrapper {
          text-align: center;
          margin-bottom: 2rem;
        }
        .contact-title-editable {
          font-size: 2rem;
          font-weight: bold;
          cursor: text;
        }
        .contact-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .info-section {
          position: relative;
          background: white;
          padding: 1rem;
          border-radius: 8px;
        }
        .edit-btn-wrapper {
          position: absolute;
          top: 10px;
          right: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .info-section:hover .edit-btn-wrapper {
          opacity: 1;
        }
        .edit-btn, .save-btn {
          background-color: #007bff;
          color: white;
          padding: 6px 12px;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }
        .contact-form {
          background: white;
          padding: 1rem;
          border-radius: 8px;
        }
        .input-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        input, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        textarea {
          height: 100px;
        }
        .contact-form button {
          background-color: #28a745;
          color: white;
          padding: 10px 18px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .contact-container {
            flex-direction: row;
            justify-content: space-between;
          }
          .info-section, .contact-form {
            flex: 1;
            max-width: 48%;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-logo">MySite</div>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <li><a href="/">Home</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section id="contact" className="contact-section">
        <div className="contact-title-wrapper">
          <h1
            className="contact-title-editable"
            contentEditable
            suppressContentEditableWarning
            onInput={handleTitleInput}
            ref={titleRef}
          />
        </div>

        <div className="contact-container">
          <div className="info-section">
            <div className="edit-btn-wrapper">
              <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
            </div>
            <div className="info-item">
              {editing ? (
                <input name="location" value={tempInfo.location} onChange={handleInfoChange} />
              ) : (
                <p>{info.location}</p>
              )}
            </div>
            <div className="info-item">
              {editing ? (
                <input name="phone" value={tempInfo.phone} onChange={handleInfoChange} />
              ) : (
                <p>📱 {info.phone}</p>
              )}
            </div>
            <div className="info-item">
              {editing ? (
                <input name="hours" value={tempInfo.hours} onChange={handleInfoChange} />
              ) : (
                <p>⏰ {info.hours}</p>
              )}
            </div>
            {editing && <button onClick={saveInfoChanges} className="save-btn">Save</button>}
          </div>

          <form className="contact-form" onSubmit={handleFormSubmit}>
            <div className="input-row">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleFormChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleFormChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleFormChange}
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleFormChange}
            ></textarea>
            <button type="submit">CONTACT US</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ContactPage;


// import React, { useState } from 'react';
// import ContactPage from './ContactPage';

// function App() {
//   const [title, setTitle] = useState('');
//   return <ContactPage title={title} setTitle={setTitle} />;
// }

// export default App;