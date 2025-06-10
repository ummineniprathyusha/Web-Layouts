import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle } from 'react-icons/fa';

export default function CtaLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState(content);
  const [editingField, setEditingField] = useState(null);

  const fileInputRefs = {}; // No image fields in CTA, but keeping the structure

  // Keep localData in sync with the content prop
  useEffect(() => {
    setLocalData(content);
  }, [content]);

  // Propagate changes up to a parent handler if provided
  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  // Handle changes for text and textarea fields
  const handleChange = (field) => (e) => {
    const updatedData = { ...localData, [field]: e.target.value };
    setLocalData(updatedData);
  };

  // Handle image file changes (not used in CTA but kept for consistency)
  const handleImageChange = (field) => (e) => {
    // This function might not be needed if there are no image fields in CTA
    console.warn("handleImageChange called in CtaLayout, but no image fields defined.");
    setEditingField(null);
  };

  // Programmatically click hidden file input (not used in CTA)
  const triggerImageUpload = (field) => {
    console.warn("triggerImageUpload called in CtaLayout, but no image fields defined.");
  };

  // Reusable render function for editable fields
  const renderEditableField = (fieldKey, element, type = 'text', customClasses = '') => {
    const isEditingThis = editingField === fieldKey;
    const value = localData[fieldKey] ?? content[fieldKey] ?? '';
    const hasImage = (localData[fieldKey] || content[fieldKey]);

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
                className={`absolute ${type === 'image' ? 'inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100' : 'top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100'} transition-opacity cursor-pointer`}
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
    <section className="py-20 bg-blue-700 text-white text-center ">
      <div className="container mx-auto flex flex-col ">
        <h2 className="text-4xl font-bold mb-6">
          {renderEditableField(
            'ctaTitle',
            <span>{localData.ctaTitle ?? content.ctaTitle ?? 'Ready to Transform Your Business?'}</span>,
            'text'
          )}
        </h2>
        {renderEditableField(
          'ctaText',
          <p className=" block text-xl mb-8 max-w-2xl mx-auto px-3  ">{localData.ctaText ?? content.ctaText ?? 'Contact us today to learn more about our services and how we can help you achieve your goals.'} 
          </p>,
          'textarea'
        )}
        {renderEditableField(
          'ctaButtonText',
          <a
            href="#"
            className=" block bg-white text-blue-700 hover:bg-gray-200 text-lg font-semibold  transition duration-300 rounded-full px-3 py-2"
          >
            {localData.ctaButtonText ?? content.ctaButtonText ?? 'Get in Touch'}
          </a>,
          'text'
        )}
      </div>
    </section>
  );
}