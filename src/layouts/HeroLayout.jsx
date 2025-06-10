import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle, FaPalette } from 'react-icons/fa';

export default function HeroLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState(content);
  const [editingField, setEditingField] = useState(null);

  const fileInputRefs = {
    heroImage: useRef(null),
  };

  const colorInputRef = useRef(null); // Ref for the color input

  // Keep localData in sync with the content prop
  useEffect(() => {
    if (JSON.stringify(content) !== JSON.stringify(localData)) {
      setLocalData(content);
    }
  }, [content, localData]);

  // Propagate changes up to a parent handler if provided
  useEffect(() => {
    if (onContentChange && Object.keys(localData).length > 0) {
      if (JSON.stringify(localData) !== JSON.stringify(content)) {
        onContentChange(localData);
      }
    }
  }, [localData, onContentChange, content]);

  // Handle changes for text and textarea fields
  const handleChange = (field) => (e) => {
    const updatedData = { ...localData, [field]: e.target.value };
    setLocalData(updatedData);
  };

  // Handle color input changes
  const handleColorChange = (field) => (e) => {
    const colorValue = e.target.value || '#000000'; // Fallback to black if value is empty
    const updatedData = { ...localData, [field]: colorValue };
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
    fileInputRefs[field].current?.click();
  };

  // Reusable render function for editable fields
  const renderEditableField = (fieldKey, element, type = 'text', customClasses = '') => {
    const isEditingThis = editingField === fieldKey;
    const value = localData[fieldKey] ?? content[fieldKey] ?? '';
    const hasImage = (localData[fieldKey] || content[fieldKey]); // Checks if image exists

    const handleClick = (e) => {
      if (isEditing && !isEditingThis) {
        e.stopPropagation();
        setEditingField(fieldKey);
      }
    };

    return (
      <div
        className={`relative group ${customClasses}`}
        onClick={handleClick}
      >
        {isEditingThis ? (
          <div className="flex flex-col items-center justify-center w-full">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={handleChange(fieldKey)}
                className="border-b border-blue-500 bg-transparent focus:outline-none w-full p-1 text-center"
                autoFocus
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={handleChange(fieldKey)}
                className="border p-2 rounded resize-y focus:outline-blue-500 w-full text-center"
                rows={Math.max(3, (value.split('\n').length))}
                autoFocus
              />
            )}
            {type === 'image' && (
              <div className="flex flex-col items-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(fieldKey)}
                  ref={fileInputRefs[fieldKey]}
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
            {type === 'color' && (
              <div className="flex items-center gap-2 w-full justify-center">
                <div
                  className="h-10 w-10 border-2 border-blue-500 rounded-full cursor-pointer relative overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: value || '#3B82F6' }}
                  onClick={() => colorInputRef.current?.click()}
                >
                  <input
                    type="color"
                    value={value || '#3B82F6'}
                    onChange={handleColorChange(fieldKey)}
                    ref={colorInputRef}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <input
                  type="text"
                  value={value || '#3B82F6'}
                  onChange={handleColorChange(fieldKey)}
                  className="border-b border-blue-500 bg-transparent focus:outline-none px-1 py-0.5 text-black w-24 text-center"
                />
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
                className={`absolute ${type === 'image' ? 'inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 ' : 'top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0 '} transition-opacity cursor-pointer`}
                onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }}
                aria-label={`Edit ${fieldKey}`}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const defaultBgColor = '#3B82F6'; // Default background color (Tailwind blue-600)
  const currentBgColor = localData.backgroundColor ?? content.backgroundColor ?? defaultBgColor;


  return (
    <section
      className="relative text-white py-20 overflow-hidden min-h-[400px] flex items-center"
    >
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: currentBgColor }} // MOVED THE STYLE HERE!
      >
        {(localData.heroImage || content.heroImage) ? (
          <img
            src={localData.heroImage ?? content.heroImage}
            alt="About Us Hero"
            className="w-full h-full object-cover opacity-50 border"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full opacity-50 flex items-center justify-center"
            style={{ backgroundColor: currentBgColor }} // ALSO apply to the fallback div
          ></div>
        )}
        {renderEditableField(
          'heroImage',
          null,
          'image',
          'absolute inset-0 z-10'
        )}
      </div>
      <div className="container mx-auto px-6 relative z-20 text-center flex flex-col">
        {renderEditableField(
          'heroTitle',
          <h1 className="text-5xl font-extrabold mb-4">{localData.heroTitle ?? content.heroTitle ?? 'About Our Company '}</h1>,
          'text',
          'block'
        )}
        {renderEditableField(
          'heroSubtitle',
          <p className="text-xl max-w-2xl mx-auto">{localData.heroSubtitle ?? content.heroSubtitle ?? 'We are a dedicated team committed to innovation and excellence.'}</p>,
          'textarea',
          'block'
        )}
      </div>

      {/* New: Background Color Editor */}
      {isEditing && (
        <div className="absolute top-4 right-4 z-30">
          {renderEditableField(
            'backgroundColor',
            <div className="flex items-center gap-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:scale-105 transform transition-transform">
              <FaPalette className="text-gray-600" size={20} />
              <span className="text-gray-700 text-sm hidden sm:inline">Background</span>
            </div>,
            'color',
            'inline-flex items-center'
          )}
        </div>
      )}
    </section>
  );
}