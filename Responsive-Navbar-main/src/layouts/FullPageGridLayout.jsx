import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle, FaPalette, FaTimes } from 'react-icons/fa';

export default function FullPageGridLayout({ content = {}, isEditing, onContentChange }) {
    const [localData, setLocalData] = useState(content);
    const [editingField, setEditingField] = useState(null);

    const fileInputRefs = {
        gridImage: useRef(null),
    };

    // Ref for the color input to programmatically click it
    const colorInputRef = useRef(null);

    useEffect(() => {
        if (JSON.stringify(content) !== JSON.stringify(localData)) {
            setLocalData(content);
        }
    }, [content]);

    useEffect(() => {
        if (onContentChange && Object.keys(localData).length > 0) {
            if (JSON.stringify(localData) !== JSON.stringify(content)) {
                onContentChange(localData);
            }
        }
    }, [localData, onContentChange, content]);

    const handleChange = (field) => (e) => {
        const updatedData = { ...localData, [field]: e.target.value };
        setLocalData(updatedData);
    };

    const handleColorChange = (field) => (e) => {
        const colorValue = e.target.value || '#000000';
        const updatedData = { ...localData, [field]: colorValue };
        setLocalData(updatedData);
    };

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

    const triggerImageUpload = (field) => {
        fileInputRefs[field].current?.click();
    };

    const renderEditableField = (fieldKey, element, type = 'text', customClasses = '') => {
        const isEditingThis = isEditing && editingField === fieldKey;
        const value = localData[fieldKey] ?? content[fieldKey];
        const hasImage = (localData[fieldKey] || content[fieldKey]);

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
                    <div className="flex flex-col items-center justify-center w-full gap-2 p-2">
                        {type === 'text' && (
                            <input
                                type="text"
                                value={value ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-b-2 border-green-500 bg-transparent focus:outline-none w-full p-1 text-black text-center"
                                autoFocus
                            />
                        )}
                        {type === 'textarea' && (
                            <textarea
                                value={value ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-2 border-green-500 p-2 rounded resize-y focus:outline-none w-full text-black text-center"
                                rows={Math.max(3, (value ? value.split('\n').length : 1))}
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
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <FaUpload /> {hasImage ? 'Change Image' : 'Upload Image'}
                                </button>
                                {hasImage && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setLocalData(prev => ({ ...prev, [fieldKey]: null })); setEditingField(null); }}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                    >
                                        <FaTimes /> Remove Image
                                    </button>
                                )}
                            </div>
                        )}
                        {type === 'color' && (
                            <div className="flex items-center gap-2 w-full justify-center">
                                {/* Custom Round Color Swatch */}
                                <div
                                    className="h-10 w-10 border-2 border-green-500 rounded-full cursor-pointer relative overflow-hidden"
                                    style={{ backgroundColor: value ?? '#22c55e' }}
                                    onClick={() => colorInputRef.current?.click()} // Click the hidden input
                                >
                                    {/* Hidden native color input */}
                                    <input
                                        type="color"
                                        value={value ?? '#22c55e'}
                                        onChange={handleColorChange(fieldKey)}
                                        ref={colorInputRef}
                                        className="absolute inset-0 opacity-0 cursor-pointer" // Completely hide it but make it clickable
                                    />
                                </div>
                                {/* Hex Code Input */}
                                <input
                                    type="text"
                                    value={value ?? '#22c55e'}
                                    onChange={handleColorChange(fieldKey)}
                                    className="border-b-2 border-green-500 bg-transparent focus:outline-none px-1 py-0.5 text-black w-24 text-center"
                                />
                            </div>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
                            className="text-green-700 hover:text-green-900 p-1 rounded-full bg-white shadow-md"
                            aria-label="Save"
                            title="Save Changes"
                        >
                            <FaSave size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {element}

                        {isEditing && (type === 'image' || type === 'color') && !hasImage && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingField(fieldKey);
                                }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200 text-xl rounded-lg cursor-pointer"
                                aria-label={`Add ${type === 'image' ? 'Image' : 'Color'}`}
                            >
                                {type === 'image' ? <FaPlusCircle className="text-4xl mb-2" /> : <FaPalette className="text-4xl mb-2" />}
                                {type === 'image' ? 'Add Image' : 'Set Color'}
                            </button>
                        )}

                        {isEditing && (type !== 'image' || hasImage) && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }}
                                className={`absolute z-1 ${type === 'image' || type === 'color'
                                    ? 'inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100'
                                    : 'top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100'
                                    } transition-opacity cursor-pointer text-green-600 hover:scale-110 transform`}
                                aria-label={`Edit ${fieldKey}`}
                                title={`Edit ${fieldKey}`}
                            >
                                {type === 'image' && <FaEdit size={24} />}
                                {type === 'color' && <FaPalette size={24} />}
                                {(type === 'text' || type === 'textarea') && <FaEdit size={14} />}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const defaultBgColor = '#10B981';
    const currentBgColor = localData.backgroundColor || content.backgroundColor || defaultBgColor;

    return (
        <section
            className="relative flex flex-col items-center justify-center
                       min-h-screen text-white text-center py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
                       overflow-hidden shadow-2xl rounded-lg transform perspective-1000
                       transition-all duration-500 ease-in-out"
            style={{ backgroundColor: currentBgColor }}
        >
            <div className="absolute inset-0 z-0">
                {(localData.gridImage || content.gridImage) ? (
                    <img
                        src={localData.gridImage ?? content.gridImage}
                        alt="Background Image"
                        className="w-full h-full object-cover opacity-30 sm:opacity-50 transition-opacity duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 opacity-50 flex items-center justify-center"></div>
                )}
                {renderEditableField(
                    'gridImage',
                    null,
                    'image',
                    'absolute inset-0 z-1'
                )}
            </div>

            <div className="relative z-1 flex flex-col items-center justify-center max-w-4xl mx-auto">
                {renderEditableField(
                    'gridTitle',
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                        {localData.gridTitle ?? content.gridTitle ?? 'Innovative Solutions for a Brighter Future'}
                    </h1>,
                    'text',
                    'w-full'
                )}
                {renderEditableField(
                    'gridSubtitle',
                    <p className="text-lg max-w-3xl mb-8 leading-relaxed  ">
                        {localData.gridSubtitle ?? content.gridSubtitle ?? 'We are a passionate team committed to leveraging cutting-edge technology to create impactful and sustainable solutions for businesses worldwide.'}
                    </p>,
                    'textarea',
                    'w-full'
                )}

                {isEditing && (
                    <button
                        className=" px-4 py-2 bg-white text-green-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
                        onClick={() => { /* Handle button action or make this editable as well */ }}
                    >
                        Learn More
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="absolute top-4 right-4 z-1">
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