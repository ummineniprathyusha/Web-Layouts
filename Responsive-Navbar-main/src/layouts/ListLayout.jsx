import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaTrashAlt, FaImage } from 'react-icons/fa';

export default function NewHeroLayout({ content = {}, isEditing, editData = {}, setEditData }) {
    const [localData, setLocalData] = useState(editData);
    const [editingField, setEditingField] = useState(null);
    const [hoveredField, setHoveredField] = useState(null);
    const fileInputRef = useRef(null);

    // Synchronize local state with prop changes from the parent
    useEffect(() => {
        // Only update localData if editData has truly changed, to prevent infinite loops
        if (JSON.stringify(editData) !== JSON.stringify(localData)) {
            setLocalData(editData);
        }
    }, [editData, localData]);

    // Handles changes for text and textarea input fields
    const handleChange = (field) => (e) => {
        const updated = { ...localData, [field]: e.target.value };
        setLocalData(updated);
        setEditData(updated); // Propagate changes up to the parent component
    };

    // Handles image file selection and updates the hero image
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = { ...localData, heroImg: reader.result };
            setLocalData(updated);
            setEditData(updated);
            setEditingField(null); // Exit editing mode after successful upload
        };
        reader.readAsDataURL(file);
    };

    // Programmatically triggers the hidden file input click
    const triggerImageUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Deletes the currently set hero image
    const handleImageDelete = () => {
        const updated = { ...localData, heroImg: null }; // Remove image
        setLocalData(updated);
        setEditData(updated);
        setEditingField(null);
    };

    // Helper function to render editable fields
    const renderEditableField = (fieldKey, element, as = 'text') => {
        const isEditingThis = editingField === fieldKey;

        return (
            <div
                className={`relative group ${as === 'image' ? 'w-full' : 'inline-block w-full'}`}
                onMouseEnter={() => isEditing && setHoveredField(fieldKey)}
                onMouseLeave={() => setHoveredField(null)}
            >
                {isEditingThis ? (
                    // Render input/textarea/image controls when in editing mode
                    <div className="flex flex-col items-start w-full gap-2">
                        {as === 'text' && (
                            <input
                                type="text"
                                value={localData[fieldKey] ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-b-2 border-blue-500 bg-transparent focus:outline-none px-1 py-0.5 rounded w-full"
                                autoFocus
                            />
                        )}
                        {as === 'textarea' && (
                            <textarea
                                value={localData[fieldKey] ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-2 border-blue-500 p-2 rounded-md resize-y focus:outline-none w-full"
                                rows={3}
                                autoFocus
                            />
                        )}
                        {as === 'image' && (
                            <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                {/* Hidden file input for image upload */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                {/* Button to trigger image upload */}
                                <button
                                    onClick={triggerImageUpload}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    <FaUpload /> {localData.heroImg ? 'Change Image' : 'Upload Image'}
                                </button>
                                {/* Button to delete image, only shown if an image exists */}
                                {localData.heroImg && (
                                    <button
                                        onClick={handleImageDelete}
                                        className="flex items-center gap-2 mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        <FaTrashAlt /> Delete Image
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Save button to exit editing mode for the current field */}
                        <button
                            onClick={() => setEditingField(null)}
                            className="self-end text-green-500 hover:text-green-700 p-1 rounded-full bg-white shadow-md mt-2"
                            title="Save Changes"
                        >
                            <FaSave size={16} />
                        </button>
                    </div>
                ) : (
                    // Render the actual content with an overlay edit button when not editing
                    <div className="relative">
                        {element} {/* The actual content element (h1, p, button, img) */}
                        {isEditing && (hoveredField === fieldKey || (fieldKey === 'heroImg' && !localData.heroImg)) && (
                            <button
                                onClick={() => {
                                    setEditingField(fieldKey); // Set the field to be edited
                                }}
                                // Conditional styling for the edit button/overlay based on field type
                                className={`absolute z-10 ${as === 'image'
                                    ? 'top-0 right-0 w-full h-full opacity-0 cursor-pointer' // Full-area transparent overlay for images
                                    : 'top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md opacity-100' // Small, visible icon for text/textarea
                                    } text-blue-500 hover:scale-110 transition-transform`}
                                aria-label={`Edit ${fieldKey}`}
                                title={`Edit ${fieldKey}`}
                            >
                                {/* Show FaEdit icon for text/textarea fields */}
                                {as !== 'image' && <FaEdit size={14} />}
                                {/* Show FaImage icon centered on an empty image placeholder */}
                                {as === 'image' && !localData.heroImg && (
                                    <FaImage size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100" />
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="relative flex flex-col-reverse md:flex-row items-center justify-center 
                         min-h-screen 
                         px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24 
                         bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-xl overflow-hidden 
                         md:gap-12"> {/* Added md:gap-12 for spacing */}

            {/* Text Content Section */}
            {/* Removed flex-shrink-0. Added md:flex-1 to allow it to grow/shrink. Removed fixed md:mr-12 */}
            <div className="max-w-xl text-center md:text-left z-1 mb-12 md:mb-0 md:flex-1">
                {/* Main Headline */}
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
                    {renderEditableField(
                        'mainHeadline',
                        <span dangerouslySetInnerHTML={{ __html: localData.mainHeadline ?? content.mainHeadline ?? 'Achieve <span class="text-blue-600">Unprecedented Growth</span> for Your Business' }}></span>
                    )}
                </h1>

                {/* Sub-description */}
                <div className="text-lg text-gray-700 mb-8">
                    {renderEditableField(
                        'subDescription',
                        <p>{localData.subDescription ?? content.subDescription ?? 'Our innovative solutions provide the tools and strategies you need to dominate your market and exceed your goals.'}</p>,
                        'textarea'
                    )}
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    {renderEditableField(
                        'primaryButtonText',
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                            {localData.primaryButtonText ?? content.primaryButtonText ?? 'Start here'}
                        </button>
                    )}
                    {renderEditableField(
                        'secondaryButtonText',
                        <button className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
                            {localData.secondaryButtonText ?? content.secondaryButtonText ?? 'Learn More'}
                        </button>
                    )}
                </div>
            </div>

            {/* Image Section */}
            {/* Changed from w-full md:w-1/2 max-w-lg flex-shrink-0 to md:flex-1 md:max-w-xl (or keep lg depending on desired max size) */}
            <div className="relative w-full md:flex-1 md:max-w-xl z-0"> {/* Adjusted max-w for image, and added flex-1 */}
                {renderEditableField(
                    'heroImg',
                    (localData.heroImg || content.heroImg) ? (
                        <img
                            className="w-full h-auto object-cover rounded-xl shadow-2xl transform transition-transform duration-500 hover:scale-102"
                            src={localData.heroImg ?? content.heroImg}
                            alt="Business Growth"
                            loading="lazy"
                        />
                    ) : (
                        // Placeholder content when no image is present and in editing mode
                        isEditing && (
                            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-400 rounded-xl bg-gray-100 text-gray-500">
                                <FaImage size={40} className="mb-4" />
                                <p>Click to upload hero image</p>
                            </div>
                        )
                    ),
                    'image' // Specify 'image' type for this field
                )}
            </div>
        </main>
    );
}