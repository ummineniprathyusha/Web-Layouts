import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave } from 'react-icons/fa';

export default function NewHeroLayout({ content = {}, isEditing, editData = {}, setEditData }) {
  const [localData, setLocalData] = useState(editData);
  const [editingField, setEditingField] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fix infinite loop by comparing previous and new editData deeply
    if (JSON.stringify(editData) !== JSON.stringify(localData)) {
      setLocalData(editData);
    }
  }, [editData, localData]);

  const handleChange = (field) => (e) => {
    const updated = { ...localData, [field]: e.target.value };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...localData, heroImg: reader.result };
      setLocalData(updated);
      setEditData(updated);
      setEditingField(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderEditableField = (fieldKey, element, as = 'text') => {
    const isEditingThis = editingField === fieldKey;
    const isHoveringThis = hoveredField === fieldKey;
    
    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => isEditing && setHoveredField(fieldKey)}
        onMouseLeave={() => setHoveredField(null)}
      >
        {isEditingThis ? (
          <div className="flex items-center">
            {as === 'text' && (
              <input
                type="text"
                value={localData[fieldKey] ?? ''}
                onChange={handleChange(fieldKey)}
                className="border-b border-blue-500 bg-transparent focus:outline-none"
                autoFocus
              />
            )}
            
            {as === 'textarea' && (
              <textarea
                value={localData[fieldKey] ?? ''}
                onChange={handleChange(fieldKey)}
                className="border p-2 rounded resize-y focus:outline-blue-500"
                rows={3}
                autoFocus
              />
            )}
            
            {as === 'image' && (
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={triggerImageUpload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaUpload /> Upload Image
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setEditingField(null)}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <div className="relative">
            {element}
            {isEditing && isHoveringThis && (
              <button
                onClick={() => setEditingField(fieldKey)}
                className="absolute -right-6 -top-2 text-gray-600 hover:text-blue-500"
                aria-label={`Edit ${fieldKey}`}
              >
                <FaEdit />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 mt-8 md:mt-24">
      {/* Text section */}
      <div className="max-w-lg max-md:mt-7">
        {/* Heading section */}
        <h1 className="font-bold text-5xl md:text-6xl text-black mb-4">
          {renderEditableField(
            'marketplacePrefix', 
            <span>{localData.marketplacePrefix ?? content.marketplacePrefix ?? 'A marketplace for'}</span>
          )}{' '}
          {renderEditableField(
            'hostileTakeoversText', 
            <span className="text-blue-500">
              {localData.hostileTakeoversText ?? content.hostileTakeoversText ?? 'hostile takeovers'}
            </span>
          )}
        </h1>

        {/* Description */}
        <div className="mt-4">
          {renderEditableField(
            'description',
            <p className="text-gray-500 text-sm sm:text-base">
              {localData.description ?? content.description ?? ''}
            </p>,
            'textarea'
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center mt-6">
          <div className="mr-4">
            {renderEditableField(
              'streamNowText',
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-md transition">
                {localData.streamNowText ?? content.streamNowText ?? 'Stream Now'}
              </button>
            )}
          </div>
          
          {renderEditableField(
            'learnMoreText',
            <button className="flex items-center gap-1.5 px-6 py-2.5 border border-gray-300 rounded text-gray-600 hover:text-gray-900 hover:border-gray-500 transition">
              {localData.learnMoreText ?? content.learnMoreText ?? 'Learn more'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Image section */}
      <div className="max-w-lg max-md:mb-12 md:mb-0 relative">
        {(localData.heroImg || content.heroImg) && (
          renderEditableField(
            'heroImg',
            <img
              className="w-full max-w-[600px] rounded-2xl"
              src={localData.heroImg ?? content.heroImg}
              alt="Hero"
              loading="lazy"
            />,
            'image'
          )
        )}
      </div>
    </main>
  );
}
