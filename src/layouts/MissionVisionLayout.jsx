import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle, FaPalette } from 'react-icons/fa';

export default function MissionVisionLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState(content);
  const [editingField, setEditingField] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(content.backgroundColor || '#ffffff');
  const [editingBackgroundColor, setEditingBackgroundColor] = useState(false);
  const backgroundColorInputRef = useRef(null);

  const fileInputRefs = {
    missionImage: useRef(null),
    visionImage: useRef(null),
  };

  // Keep localData in sync with the content prop
  useEffect(() => {
    setLocalData(content);
    setBackgroundColor(content.backgroundColor || '#ffffff');
  }, [content]);

  // Propagate changes up to a parent handler if provided
  useEffect(() => {
    if (onContentChange) {
      onContentChange({ ...localData, backgroundColor });
    }
  }, [localData, backgroundColor, onContentChange]);

  // Handle changes for text and textarea fields
  const handleChange = (field) => (e) => {
    const updatedData = { ...localData, [field]: e.target.value };
    setLocalData(updatedData);
  };

  // Handle image file changes
  const handleImageChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setEditingField(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedData = { ...localData, [field]: reader.result };
      setLocalData(updatedData);
      setEditingField(null);
    };
    reader.readAsDataURL(file);
  };

  // Programmatically click hidden file input
  const triggerImageUpload = (field) => {
    fileInputRefs.current?.[field]?.click();
  };

  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const handleBackgroundColorEditClick = () => {
    setEditingBackgroundColor(true);
    setTimeout(() => {
      backgroundColorInputRef.current?.focus();
    }, 0);
  };

  const handleBackgroundColorSave = () => {
    setEditingBackgroundColor(false);
  };

  // Reusable render function for editable fields
  const renderEditableField = (fieldKey, element, type = 'text', customClasses = '') => {
    const isEditingThis = editingField === fieldKey;
    const value = localData?.[fieldKey] ?? content?.[fieldKey] ?? '';
    const hasImage = (localData?.[fieldKey] || content?.[fieldKey]);

    const handleClick = (e) => {
      if (type === 'image' && isEditing && !isEditingThis) {
        e.stopPropagation();
      } else if (isEditing && !isEditingThis) {
        setEditingField(fieldKey);
      }
    };

    return (
      <div
        className={`relative inline-block group ${customClasses}`}
        onClick={handleClick}
      >
        {isEditingThis ? (
          <div className="flex flex-col items-center justify-center w-full">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={handleChange(fieldKey)}
                className="border-b border-blue-500 bg-transparent focus:outline-none w-full p-1"
                autoFocus
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={handleChange(fieldKey)}
                className="border p-2 rounded resize-y focus:outline-blue-500 w-full"
                rows={type === 'textarea' ? Math.max(3, (value.split('\n').length)) : undefined}
                autoFocus
              />
            )}
            {type === 'image' && (
              <div className="flex flex-col items-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(fieldKey)}
                  ref={fileInputRefs?.[fieldKey]}
                  className="hidden"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); triggerImageUpload(fieldKey); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
                >
                  <FaUpload /> {hasImage ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
              className="text-green-600 hover:text-green-800 flex-shrink-0 p-1"
              aria-label="Save"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {element}

            {isEditing && type === 'image' && !hasImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(fieldKey);
                }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors duration-200 text-xl rounded-lg cursor-pointer"
                aria-label="Add Image"
              >
                <FaPlusCircle className="text-4xl mb-2" />
                Add Image
              </button>
            )}

            {isEditing && (type !== 'image' || hasImage) && (
              <FaEdit
                className={`absolute ${type === 'image' ? 'inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100' : 'top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100'} transition-opacity duration-200 cursor-pointer`}
                onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }}
                aria-label={`Edit ${fieldKey}`}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20" style={{ backgroundColor: backgroundColor }}>
      {isEditing && (
        <div className="absolute top-4 right-4 z-10 flex items-center">
          {editingBackgroundColor ? (
            <>
              <input
                type="color"
                value={backgroundColor}
                onChange={handleBackgroundColorChange}
                ref={backgroundColorInputRef}
                className="mr-2"
              />
              <button onClick={handleBackgroundColorSave} className="text-green-600 hover:text-green-800">
                <FaSave />
              </button>
            </>
          ) : (
            <button onClick={handleBackgroundColorEditClick} className="text-gray-400 hover:text-blue-500">
              <FaPalette />
            </button>
          )}
        </div>
      )}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Mission */}
        <div className="flex flex-col items-center text-center md:text-left">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">
            {renderEditableField(
              'missionTitle',
              <span>{localData?.missionTitle ?? content?.missionTitle ?? 'Our Mission'}</span>,
              'text'
            )}
          </h2>
          {renderEditableField(
            'missionDescription',
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{localData?.missionDescription ?? content?.missionDescription ?? 'To provide innovative solutions that empower businesses and individuals to achieve their full potential through technology and creative problem-solving.'}</p>,
            'textarea'
          )}
          <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg relative">
            {(localData?.missionImage || content?.missionImage) ? (
              <img
                src={localData?.missionImage ?? content?.missionImage}
                alt="Our Mission"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"></div>
            )}
            {renderEditableField(
              'missionImage',
              null,
              'image',
              'absolute inset-0'
            )}
          </div>
        </div>

        {/* Vision */}
        <div className="flex flex-col items-center text-center md:text-right">
          <h2 className="text-4xl font-bold text-indigo-700 mb-6">
            {renderEditableField(
              'visionTitle',
              <span>{localData?.visionTitle ?? content?.visionTitle ?? 'Our Vision'}</span>,
              'text'
            )}
          </h2>
          {renderEditableField(
            'visionDescription',
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{localData?.visionDescription ?? content?.visionDescription ?? 'To be a global leader in sustainable technology, fostering a future where innovation drives positive impact on society and the environment.'}</p>,
            'textarea'
          )}
          <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg relative">
            {(localData?.visionImage || content?.visionImage) ? (
              <img
                src={localData?.visionImage ?? content?.visionImage}
                alt="Our Vision"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"></div>
            )}
            {renderEditableField(
              'visionImage',
              null,
              'image',
              'absolute inset-0'
            )}
          </div>
        </div>
      </div>
    </section>
  );
}