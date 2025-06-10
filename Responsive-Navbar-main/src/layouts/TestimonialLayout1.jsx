// src/components/TestimonialLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaSave, FaPlusCircle, FaTimesCircle, FaQuoteLeft } from 'react-icons/fa';

const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export default function TestimonialLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState(() => {
    if (Array.isArray(content.testimonials) && content.testimonials.length > 0) {
      return {
        ...content,
        testimonials: content.testimonials.map(t => ({
          ...t,
          id: t.id || generateUniqueId()
        })),
      };
    }
    return {
      testimonialTitle: 'What Our Clients Say',
      testimonials: [
        {
          id: generateUniqueId(),
          quote: 'This service transformed our business. Highly recommend!',
          author: 'Sarah M., CEO of TechInnovate',
          photo: '',
        },
        {
          id: generateUniqueId(),
          quote: 'The team was incredibly supportive and delivered beyond expectations.',
          author: 'David L., Marketing Director',
          photo: '',
        },
        {
          id: generateUniqueId(),
          quote: 'A truly outstanding experience from start to finish. Professional and efficient.',
          author: 'Emily R., Small Business Owner',
          photo: '',
        },
      ],
    };
  });

  const [editingField, setEditingField] = useState(null);
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (Array.isArray(content.testimonials)) {
      setLocalData({
        ...content,
        testimonials: content.testimonials.map(t => ({
          ...t,
          id: t.id || generateUniqueId(),
        })),
      });
    }
  }, [content]);

  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  const handleTitleChange = (e) => {
    setLocalData(prev => ({ ...prev, testimonialTitle: e.target.value }));
  };

  const handleTestimonialChange = (id, field) => (e) => {
    setLocalData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t =>
        t.id === id ? { ...t, [field]: e.target.value } : t
      ),
    }));
  };

  const handleImageChange = (id) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalData(prev => ({
        ...prev,
        testimonials: prev.testimonials.map(t =>
          t.id === id ? { ...t, photo: reader.result } : t
        ),
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = (id) => {
    fileInputRefs.current[id]?.click();
  };

  const addTestimonial = () => {
    setLocalData(prev => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: generateUniqueId(),
          quote: 'New testimonial quote here.',
          author: 'New Author, Position',
          photo: '',
        },
      ],
    }));
  };

  const deleteTestimonial = (id) => {
    setLocalData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id),
    }));
  };

  const renderEditableField = (key, element, type = 'text', customClasses = '', id = null) => {
    const isThisEditing =
      typeof editingField === 'object'
        ? editingField?.testimonialId === id && editingField?.field === key
        : editingField === key;

    const value = id
      ? localData.testimonials.find(t => t.id === id)?.[key] ?? ''
      : localData[key] ?? '';

    const onChange = id
      ? handleTestimonialChange(id, key)
      : handleTitleChange;

    return (
      <div
        className={`relative inline-block group ${customClasses}`}
        onClick={() => isEditing && setEditingField(id ? { testimonialId: id, field: key } : key)}
      >
        {isThisEditing ? (
          <div className="flex flex-col items-center w-full">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={onChange}
                className="border-b border-blue-500 bg-transparent focus:outline-none w-full p-1"
                autoFocus
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={onChange}
                className="border p-2 rounded resize-y focus:outline-blue-500 w-full"
                rows={Math.max(3, value.split('\n').length)}
                autoFocus
                onBlur={() => setEditingField(null)}
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingField(null);
              }}
              className="bg-gray-200 text-gray-500 hover:bg-gray-300 p-1 mt-1"
              type="button"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <>
            {element}
            {isEditing && (
              <FaEdit
                className="absolute top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0  transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(id ? { testimonialId: id, field: key } : key);
                }}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const renderTestimonialPhoto = (id, photoUrl) => (
    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-gray-300 relative group flex items-center justify-center">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Testimonial Author"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          <FaQuoteLeft className="text-4xl text-gray-400" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange(id)}
        ref={(el) => (fileInputRefs.current[id] = el)}
        className="hidden"
      />

      {isEditing && !photoUrl && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            triggerImageUpload(id);
          }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors duration-200 text-xl rounded-full cursor-pointer"
        >
          <FaPlusCircle className="text-3xl mb-1" />
          <span className="text-xs">Add Photo</span>
        </div>
      )}

      {isEditing && photoUrl && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            triggerImageUpload(id);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
        >
          <FaEdit />
        </div>
      )}
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          {renderEditableField('testimonialTitle', <span>{localData.testimonialTitle}</span>)}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {localData.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 relative"
            >
              {isEditing && (
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl"
                  type="button"
                >
                  <FaTimesCircle />
                </button>
              )}

              {renderTestimonialPhoto(testimonial.id, testimonial.photo)}
              <FaQuoteLeft className="text-5xl text-gray-300 mb-4" />

              <div className="text-gray-700 text-lg italic mb-6 text-center">
                {renderEditableField(
                  'quote',
                  <span>"{testimonial.quote}"</span>,
                  'textarea',
                  '',
                  testimonial.id
                )}
              </div>

              <div className="text-blue-600 font-semibold text-md text-center">
                {renderEditableField(
                  'author',
                  <span>- {testimonial.author}</span>,
                  'text',
                  '',
                  testimonial.id
                )}
              </div>
            </div>
          ))}

          {isEditing && (
            <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 w-full min-h-[300px]">
              <button
                onClick={addTestimonial}
                className="text-gray-500 hover:text-green-600 flex flex-col items-center"
                type="button"
              >
                <FaPlusCircle className="text-6xl mb-4" />
                <span className="text-lg font-semibold">Add New Testimonial</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
