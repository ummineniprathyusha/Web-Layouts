import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function FullPageListLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState({
    coreTitle: '',
    coreValues: [],
    ...content,
  });

  const [editingField, setEditingField] = useState(null);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [pendingImage, setPendingImage] = useState(null);

  const fileInputRefs = useRef([]);

  useEffect(() => {
    setLocalData({
      coreTitle: '',
      coreValues: [],
      ...content,
    });
  }, [content]);

  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  const handleChangeCoreTitle = (e) => {
    setLocalData((prev) => ({ ...prev, coreTitle: e.target.value }));
  };

  const handleChangeCardField = (index, field) => (e) => {
    const newCoreValues = [...localData.coreValues];
    newCoreValues[index] = {
      ...newCoreValues[index],
      [field]: e.target.value,
    };
    setLocalData((prev) => ({ ...prev, coreValues: newCoreValues }));
  };

  const handleImageChange = (index) => (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setEditingField(null);
      setEditingCardIndex(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingImage(reader.result); // Save to pending state
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const addNewCard = () => {
    const newCoreValues = [
      ...localData.coreValues,
      { title: '', desc: '', image: null },
    ];
    setLocalData((prev) => ({ ...prev, coreValues: newCoreValues }));
  };

  const deleteCard = (index) => {
    if (window.confirm('Delete this core value card?')) {
      const newCoreValues = localData.coreValues.filter((_, i) => i !== index);
      setLocalData((prev) => ({ ...prev, coreValues: newCoreValues }));
      setEditingField(null);
      setEditingCardIndex(null);
      setPendingImage(null);
    }
  };

  const renderEditableField = (fieldKey, element, type = 'text', customClasses = '', index = null) => {
    const isEditingThis = editingField === fieldKey && editingCardIndex === index;
    let value;
    if (index !== null) {
      value = localData.coreValues[index]?.[fieldKey] ?? '';
    } else {
      value = localData[fieldKey] ?? '';
    }
    const hasImage = type === 'image' ? !!value : true;

    return (
      <div
        className={`relative inline-block group ${customClasses}`}
        onClick={() => {
          if (isEditing) {
            setEditingField(fieldKey);
            setEditingCardIndex(index);
          }
        }}
      >
        {isEditingThis ? (
          <div className="flex flex-col items-center justify-center w-full">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={index !== null ? handleChangeCardField(index, fieldKey) : handleChangeCoreTitle}
                className="border-b border-blue-500 bg-transparent focus:outline-none w-full p-1"
                autoFocus
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={index !== null ? handleChangeCardField(index, fieldKey) : () => {}}
                className="border p-2 rounded resize-y focus:outline-blue-500 w-full"
                rows={Math.max(3, (value?.split('\n')?.length || 3))}
                autoFocus
              />
            )}
            {type === 'image' && index !== null && (
              <div className="flex flex-col items-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(index)}
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  className="hidden"
                />
                {!pendingImage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerImageUpload(index);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
                  >
                    <FaUpload /> Upload Image
                  </button>
                )}
                {pendingImage && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={pendingImage}
                      alt="Preview"
                      className="w-24 h-24 object-cover border rounded mb-2"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newCoreValues = [...localData.coreValues];
                        newCoreValues[index] = {
                          ...newCoreValues[index],
                          image: pendingImage,
                        };
                        setLocalData((prev) => ({ ...prev, coreValues: newCoreValues }));
                        setPendingImage(null); // ✅ Reset image preview
                        setEditingField(null);
                        setEditingCardIndex(null);
                      }}
                      className="text-green-600 hover:text-green-800 flex-shrink-0 p-1"
                    >
                      <FaSave />
                    </button>
                  </div>
                )}
              </div>
            )}
            {type !== 'image' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(null);
                  setEditingCardIndex(null);
                }}
                className="text-green-600 hover:text-green-800 flex-shrink-0 p-1"
                aria-label="Save"
              >
                <FaSave />
              </button>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {element}
            {isEditing && type === 'image' && !hasImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(fieldKey);
                  setEditingCardIndex(index);
                }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors duration-200 text-xl rounded-lg cursor-pointer"
              >
                <FaPlusCircle className="text-4xl mb-2" />
                Add Image
              </button>
            )}
            {isEditing && (type !== 'image' || hasImage) && (
              <FaEdit
                className="absolute top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(fieldKey);
                  setEditingCardIndex(index);
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white space-y-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          {renderEditableField('coreTitle', <span>{localData.coreTitle || 'Core Values'}</span>, 'text')}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {localData.coreValues.length === 0 && !isEditing && (
            <p className="text-gray-500">No core values added yet.</p>
          )}

          {localData.coreValues.map((core, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center relative">
              <div className="w-32 h-32 mb-4 relative rounded-full overflow-hidden">
                {renderEditableField(
                  'image',
                  core.image ? (
                    <img src={core.image} alt={`Core ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  ),
                  'image',
                  'absolute inset-0',
                  i
                )}
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {renderEditableField('title', <span>{core.title || `Value ${i + 1}`}</span>, 'text', '', i)}
              </h3>
              {renderEditableField(
                'desc',
                <p className="text-gray-600 text-sm text-center">{core.desc}</p>,
                'textarea',
                '',
                i
              )}
              {isEditing && (
                <button
                  onClick={() => deleteCard(i)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Delete Card"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={addNewCard}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FaPlusCircle /> Add New Core Value
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
