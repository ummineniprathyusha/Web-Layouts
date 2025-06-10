import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaTimes, FaPalette, FaImage } from 'react-icons/fa'; // Added FaTimes, FaPalette, FaImage

export default function TestimonialLayout({ content = {}, isEditing, editData = {}, setEditData }) {
    const [localData, setLocalData] = useState(editData);
    const [editingField, setEditingField] = useState(null);

    // Consolidated ref for image inputs, indexed by field name
    const fileInputRefs = {
        authorPhoto: useRef(null),
        companyLogo: useRef(null),
    };

    // Keep localData in sync with editData prop
    useEffect(() => {
        // Only update localData if editData has truly changed, to prevent infinite loops
        if (JSON.stringify(editData) !== JSON.stringify(localData)) {
            setLocalData(editData);
        }
    }, [editData, localData]);

    // Handle changes for text and textarea fields
    const handleChange = (field) => (e) => {
        const updatedData = { ...localData, [field]: e.target.value };
        setLocalData(updatedData);
        setEditData(updatedData); // Propagate changes up
    };

    // Handle color changes
    const handleColorChange = (field) => (e) => {
        const updatedData = { ...localData, [field]: e.target.value };
        setLocalData(updatedData);
        setEditData(updatedData); // Propagate changes up
    };

    // Handle image file changes
    const handleImageChange = (field) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedData = { ...localData, [field]: reader.result };
            setLocalData(updatedData);
            setEditData(updatedData); // Propagate changes up
            setEditingField(null); // Exit editing mode after upload
        };
        reader.readAsDataURL(file);
    };

    // Programmatically click hidden file input
    const triggerImageUpload = (field) => {
        fileInputRefs[field].current?.click();
    };

    // Reusable render function for editable fields
    const renderEditableField = (fieldKey, element, type = 'text', customClasses = '') => {
        const isEditingThis = isEditing && editingField === fieldKey;
        const value = localData[fieldKey] ?? content[fieldKey]; // Use content as fallback

        const handleFieldClick = (e) => {
            if (isEditing && !isEditingThis) {
                e.stopPropagation(); // Prevent parent clicks if needed
                setEditingField(fieldKey);
            }
        };

        return (
            <div
                className={`relative group ${customClasses}`}
                onClick={handleFieldClick}
            >
                {isEditingThis ? (
                    <div className="flex items-center gap-2">
                        {type === 'text' && (
                            <input
                                type="text"
                                value={value ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-b-2 border-blue-400 bg-transparent focus:outline-none w-full px-1 py-0.5 text-lg"
                                autoFocus
                            />
                        )}
                        {type === 'textarea' && (
                            <textarea
                                value={value ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-2 border-blue-400 p-2 rounded-md resize-y focus:outline-none w-full text-base leading-relaxed"
                                rows={3}
                                autoFocus
                            />
                        )}
                        {type === 'image' && (
                            <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange(fieldKey)}
                                    ref={fileInputRefs[fieldKey]}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => triggerImageUpload(fieldKey)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    <FaUpload /> {value ? 'Change Image' : 'Upload Image'}
                                </button>
                            </div>
                        )}
                        {type === 'color' && (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="color"
                                    value={value ?? '#ffffff'} // Default to white if no value
                                    onChange={handleColorChange(fieldKey)}
                                    className="h-10 w-10 border-2 border-blue-400 rounded-full cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={value ?? '#ffffff'}
                                    onChange={handleColorChange(fieldKey)}
                                    className="border-b-2 border-blue-400 bg-transparent focus:outline-none px-1 py-0.5 text-lg w-24"
                                />
                            </div>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
                            className="text-green-500 hover:text-green-700 p-1 rounded-full bg-white shadow-md"
                            title="Save Changes"
                        >
                            <FaSave size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="relative inline-block">
                        {element}
                        {isEditing && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }}
                                className={`absolute -1
                                    ${type === 'image' || type === 'color'
                                        ? 'inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full'
                                        : 'top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity'
                                    } 
                                    text-blue-500 hover:scale-110 transform`}
                                aria-label={`Edit ${fieldKey}`}
                                title={`Edit ${fieldKey}`}
                            >
                                {type === 'image' && <FaImage size={24} />}
                                {type === 'color' && <FaPalette size={24} />}
                                {(type === 'text' || type === 'textarea') && <FaEdit size={14} />}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const testimonialBgColor = localData.backgroundColor ?? content.backgroundColor ?? '#f0f4f8'; // Default light blue-gray

    return (
        <main
            className="flex flex-col md:flex-row items-center justify-center 
                       px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 
                       rounded-2xl shadow-xl transition-all duration-300 relative"
            style={{ backgroundColor: testimonialBgColor }}
        >
            {isEditing && (
                <div className="absolute top-4 right-4 -1">
                    {renderEditableField(
                        'backgroundColor',
                        <div className="flex items-center gap-2 p-2 bg-white rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform">
                            <FaPalette className="text-gray-600" size={20} />
                            <span className="text-gray-700 text-sm">BG Color</span>
                        </div>,
                        'color',
                        'inline-flex items-center'
                    )}
                </div>
            )}

            {/* Left: Testimonial Text */}
            <div className="max-w-xl text-center md:text-left z-1 md:mr-16 mb-10 md:mb-0">
                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl italic font-serif text-gray-800 leading-relaxed mb-6">
                    {renderEditableField(
                        'quote',
                        <p className="before:content-['“'] before:font-bold before:text-5xl before:text-blue-400 before:absolute before:-left-4 before:-top-4 after:content-['”'] after:font-bold after:text-5xl after:text-blue-400 after:absolute after:-right-4 after:-bottom-4 relative pl-8 pr-8">
                            {localData.quote ?? content.quote ?? 'This product fundamentally transformed our operations. '}
                        </p>,
                        'textarea',
                        'block w-full' // Ensure textarea takes full width
                    )}
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="font-bold text-xl text-gray-900 mb-1">
                        {renderEditableField(
                            'authorName',
                            <span>{localData.authorName ?? content.authorName ?? 'Eleanor Vance'}</span>
                        )}
                    </div>
                    <div className="text-md text-gray-600 mb-4">
                        {renderEditableField(
                            'authorTitle',
                            <span>{localData.authorTitle ?? content.authorTitle ?? 'CTO, Tech Innovators Inc.'}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Author Photo */}
            <div className="flex-shrink-0 w-60 h-60 rounded-full overflow-hidden shadow-2xl flex items-center justify-center bg-gray-200 border-4 border-white relative">
                {renderEditableField(
                    'authorPhoto',
                    (localData.authorPhoto || content.authorPhoto) ? (
                        <img
                            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                            src={localData.authorPhoto ?? content.authorPhoto}
                            alt="Author"
                            loading="lazy"
                        />
                    ) : (
                        isEditing && (
                            <div className="text-gray-400 flex flex-col items-center justify-center">
                                <FaImage size={40} />
                                <p className="text-sm mt-2">Upload Photo</p>
                            </div>
                        )
                    ),
                    'image',
                    'absolute inset-0 rounded-full' // Full-area image field overlay
                )}
            </div>
        </main>
    );
}










