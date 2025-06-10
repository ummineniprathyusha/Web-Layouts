import React, { useState, useEffect, useRef } from 'react';
import { FaUpload, FaSave, FaTrashAlt, FaPalette, FaImage } from 'react-icons/fa';

export default function SalesHeroLayout({ content = {}, isEditing, editData = {}, setEditData }) {
    const [localData, setLocalData] = useState(editData);
    const [editingField, setEditingField] = useState(null);
    const [hoveredField, setHoveredField] = useState(null);
    const fileInputRef = useRef(null);
    const [showBgOptions, setShowBgOptions] = useState(false); // State to toggle background options

    useEffect(() => {
        // Only update localData if editData has truly changed, to prevent infinite loops
        if (JSON.stringify(editData) !== JSON.stringify(localData)) {
            setLocalData(editData);
        }
    }, [editData, localData]);

    const handleChange = (field) => (e) => {
        const updated = { ...localData, [field]: e.target.value };
        setLocalData(updated);
        setEditData(updated); // Propagate changes up to the parent
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = { ...localData, heroImg: reader.result, bgColor: null }; // Clear bgColor if image is set
            setLocalData(updated);
            setEditData(updated);
            setEditingField(null); // Exit editing mode after upload
            setShowBgOptions(false); // Hide options after upload
        };
        reader.readAsDataURL(file);
    };

    const handleImageDelete = () => {
        const updated = { ...localData, heroImg: null }; // Remove image
        setLocalData(updated);
        setEditData(updated);
        setEditingField(null);
        setShowBgOptions(false); // Hide options after deletion
    };

    const handleBgColorChange = (e) => {
        const updated = { ...localData, bgColor: e.target.value, heroImg: null }; // Clear heroImg if color is set
        setLocalData(updated);
        setEditData(updated);
    };

    const triggerImageUpload = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const renderEditableField = (fieldKey, element, as = 'text') => {
        const isEditingThis = editingField === fieldKey;

        return (
            <div
                className="relative inline-block group w-full" // Added w-full for full width, important for textarea
                onMouseEnter={() => isEditing && setHoveredField(fieldKey)}
                onMouseLeave={() => setHoveredField(null)}
            >
                {isEditingThis ? (
                    <div className="flex flex-col items-start gap-2 w-full"> {/* Changed to flex-col for stacked input/textarea and button */}
                        {as === 'text' && (
                            <input
                                type="text"
                                value={localData[fieldKey] ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-b-2 border-blue-500 bg-transparent focus:outline-none px-1 py-0.5 rounded w-full" // Added w-full
                                autoFocus
                            />
                        )}
                        {as === 'textarea' && (
                            <textarea
                                value={localData[fieldKey] ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-2 border-blue-500 p-2 rounded-md resize-y focus:outline-none w-full" // Added w-full
                                rows={3}
                                autoFocus
                            />
                        )}
                        <button
                            onClick={() => setEditingField(null)}
                            className="self-end text-green-500 hover:text-green-700 p-1 rounded-full bg-white shadow-md mt-2" // Position save button below input/textarea
                            title="Save Changes"
                        >
                            <FaSave size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        {element}
                        {isEditing && (hoveredField === fieldKey || editingField === fieldKey) && (
                            <button
                                onClick={() => setEditingField(fieldKey)}
                                className="absolute right-0 top-0 w-full h-full opacity-0 bg-white rounded-full p-1 shadow-md text-blue-500 hover:scale-110 transition-transform z-1" // Added z-1
                                aria-label={`Edit ${fieldKey}`}
                                title={`Edit ${fieldKey}`}
                            >
                               
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const heroStyle = {
        backgroundImage: localData.heroImg ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${localData.heroImg})` : 'none',
        backgroundColor: localData.bgColor || '#f0f4f8', // Default light background color
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: localData.heroImg ? '#ffffff' : '#1a202c', // White text on image, dark text on color
    };

    return (
        <main
            className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-20 min-h-[550px] overflow-hidden rounded-lg shadow-xl"
            style={heroStyle}
        >
            {isEditing && (
                <div className="absolute top-6 right-6 z-1 flex flex-col gap-3"> {/* Increased z-1 to ensure controls are on top */}
                    <button
                        onClick={() => setShowBgOptions(!showBgOptions)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                        title="Background Options"
                        aria-expanded={showBgOptions}
                    >
                        {localData.heroImg ? <FaImage size={20} /> : <FaPalette size={20} />}
                    </button>

                    {showBgOptions && (
                        <div className="flex flex-col items-end gap-3 bg-white p-4 rounded-lg shadow-lg">
                            {localData.heroImg ? (
                                <>
                                    <button
                                        onClick={handleImageDelete}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md flex items-center gap-2 pr-3"
                                        title="Delete Image"
                                    >
                                        <FaTrashAlt /> <span className="text-sm">Delete Image</span>
                                    </button>
                                    <button
                                        onClick={triggerImageUpload}
                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md flex items-center gap-2 pr-3"
                                        title="Change Image"
                                    >
                                        <FaUpload /> <span className="text-sm">Change Image</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={triggerImageUpload}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md flex items-center gap-2 pr-3"
                                    title="Upload Image"
                                >
                                    <FaUpload /> <span className="text-sm">Upload Image</span>
                                </button>
                            )}
                            {!localData.heroImg && (
                                <div className="relative flex items-center gap-2 bg-gray-100 p-2 rounded-full shadow-inner">
                                    <input
                                        type="color"
                                        value={localData.bgColor || '#f0f4f8'}
                                        onChange={handleBgColorChange}
                                        className="p-1 border-none rounded-full cursor-pointer h-8 w-8"
                                        title="Choose Background Color"
                                    />
                                    <span className="text-sm text-gray-700">Select Color</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="max-md:mt-10 max-w-lg relative z-1 text-center md:text-left">
                <h1 className="text-5xl md:text-[74px] font-extrabold leading-tight mb-4">
                    {renderEditableField(
                        'headlineStart',
                        <span className={localData.heroImg ? 'text-white' : 'text-blue-600'}>
                            {localData.headlineStart ?? content.headlineStart ?? 'Drive sales to'}
                        </span>
                    )}{' '}
                    {renderEditableField(
                        'headlineEnd',
                        <span className={`underline font-bold ${localData.heroImg ? 'text-blue-300' : 'text-blue-500'}`}>
                            {localData.headlineEnd ?? content.headlineEnd ?? 'the sky'}
                        </span>
                    )}
                </h1>

                <div className={`mt-6 text-sm sm:text-base max-w-lg ${localData.heroImg ? 'text-gray-200' : 'text-gray-600'}`}>
                    {renderEditableField(
                        'description',
                        <p>{localData.description ?? content.description ?? 'Unlock potential with tailored strategies, innovative tools, and expert guidance to propel your business to new heights. Experience unprecedented growth and achieve your sales objectives with our comprehensive solutions.'}</p>,
                        'textarea'
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start mt-8 gap-4">
                    {renderEditableField(
                        'primaryCta',
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                            {localData.primaryCta ?? content.primaryCta ?? 'Get Started Now'}
                        </button>
                    )}
                    {renderEditableField(
                        'secondaryCta',
                        <button className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${localData.heroImg ? 'text-blue-200 hover:text-blue-100' : 'text-blue-600 hover:text-blue-700'} underline-offset-4 hover:underline`}>
                            {localData.secondaryCta ?? content.secondaryCta ?? 'Watch How It Works'}
                            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 6.5h16M11.5 1l5.5 5.5L11.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

            </div>
        </main>
    );
}