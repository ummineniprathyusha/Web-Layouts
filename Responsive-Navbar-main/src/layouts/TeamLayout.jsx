import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle, FaTimesCircle } from 'react-icons/fa'; // Added FaTimesCircle for delete

// Helper function to generate a unique ID
const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export default function TeamLayout({ content = {}, isEditing, onContentChange }) {
  // Initialize localData with a 'teamMembers' array.
  // If content.teamMembers exists, use it; otherwise, provide default members.
  const [localData, setLocalData] = useState(() => {
    if (content.teamMembers && Array.isArray(content.teamMembers) && content.teamMembers.length > 0) {
      return { ...content, teamMembers: content.teamMembers.map(member => ({ ...member, id: member.id || generateUniqueId() })) };
    }
    return {
      teamTitle: 'Meet Our Team',
      teamMembers: [
        {
          id: generateUniqueId(),
          name: 'Jane Doe',
          title: 'Co-Founder & CEO',
          bio: 'Jane is passionate about driving technological advancements and fostering a collaborative work environment.',
          photo: '',
        },
        {
          id: generateUniqueId(),
          name: 'John Smith',
          title: 'Lead Developer',
          bio: 'John is a seasoned developer with expertise in scalable architectures and cutting-edge software solutions.',
          photo: '',
        },
        {
          id: generateUniqueId(),
          name: 'Alice Johnson',
          title: 'Head of Design',
          bio: 'Alice combines aesthetics with user experience to create intuitive and beautiful product designs.',
          photo: '',
        },
      ],
    };
  });

  const [editingField, setEditingField] = useState(null); // { memberId: 'id123', field: 'name' } or 'teamTitle'

  // Ref for file inputs, now indexed by member ID and field
  const fileInputRefs = useRef({});

  // Keep localData in sync with the content prop
  useEffect(() => {
    if (content.teamMembers && Array.isArray(content.teamMembers)) {
      setLocalData({ ...content, teamMembers: content.teamMembers.map(member => ({ ...member, id: member.id || generateUniqueId() })) });
    } else {
      setLocalData(prevData => ({
        ...prevData,
        teamMembers: prevData.teamMembers.map(member => ({ ...member, id: member.id || generateUniqueId() }))
      }));
    }
  }, [content]);

  // Propagate changes up to a parent handler if provided
  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  // Handle changes for text and textarea fields (for team title)
  const handleTitleChange = (e) => {
    const updatedData = { ...localData, teamTitle: e.target.value };
    setLocalData(updatedData);
  };

  // Handle changes for team member text/textarea fields
  const handleMemberChange = (memberId, field) => (e) => {
    const updatedTeamMembers = localData.teamMembers.map((member) =>
      member.id === memberId ? { ...member, [field]: e.target.value } : member
    );
    setLocalData({ ...localData, teamMembers: updatedTeamMembers });
  };

  // Handle image file changes for team members
  const handleImageChange = (memberId) => (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setEditingField(null); // Clear editing state if no file selected
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedTeamMembers = localData.teamMembers.map((member) =>
        member.id === memberId ? { ...member, photo: reader.result } : member
      );
      setLocalData({ ...localData, teamMembers: updatedTeamMembers });
      setEditingField(null); // Clear editing state after upload
    };
    reader.readAsDataURL(file);
  };

  // Programmatically click hidden file input for a specific team member
  const triggerImageUpload = (memberId) => {
    fileInputRefs.current[memberId]?.click();
  };

  // Add a new team member
  const addTeamMember = () => {
    const newMember = {
      id: generateUniqueId(),
      name: 'New Team Member',
      title: 'Position',
      bio: 'Brief biography of the new team member.',
      photo: '',
    };
    setLocalData((prevData) => ({
      ...prevData,
      teamMembers: [...prevData.teamMembers, newMember],
    }));
  };

  // Delete a team member
  const deleteTeamMember = (memberId) => {
    setLocalData((prevData) => ({
      ...prevData,
      teamMembers: prevData.teamMembers.filter((member) => member.id !== memberId),
    }));
  };

  // Reusable render function for editable text/textarea fields
  const renderEditableField = (fieldKey, element, type = 'text', customClasses = '', memberId = null) => {
    const isEditingThis = typeof editingField === 'object'
      ? editingField?.memberId === memberId && editingField?.field === fieldKey
      : editingField === fieldKey;

    let value;
    let onChangeHandler;

    if (memberId) {
      const member = localData.teamMembers.find(m => m.id === memberId);
      value = member ? (member[fieldKey] ?? '') : '';
      onChangeHandler = handleMemberChange(memberId, fieldKey);
    } else {
      // For teamTitle
      value = localData[fieldKey] ?? content[fieldKey] ?? '';
      onChangeHandler = handleTitleChange;
    }

    return (
      <div
        className={`relative inline-block group ${customClasses}`}
        onClick={() => {
          if (isEditing && (type === 'text' || type === 'textarea')) {
            setEditingField(memberId ? { memberId, field: fieldKey } : fieldKey);
          }
        }}
      >
        {isEditingThis ? (
          <div className="flex flex-col items-center justify-center w-full">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={onChangeHandler}
                className="border-b border-blue-500 bg-transparent focus:outline-none w-full p-1"
                autoFocus
                onBlur={() => setEditingField(null)} // Save on blur
                onKeyDown={(e) => { // Save on Enter key
                  if (e.key === 'Enter') {
                    setEditingField(null);
                  }
                }}
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={onChangeHandler}
                className="border p-2 rounded resize-y focus:outline-blue-500 w-full"
                rows={Math.max(3, value.split('\n').length)}
                autoFocus
                onBlur={() => setEditingField(null)} // Save on blur
              />
            )}
            {/* The save button here is more for visual confirmation, blur/enter are primary save */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingField(null);
              }}
              className="bg-gray-200 text-gray-500 hover:bg-gray-300 flex-shrink-0 p-1 mt-1"
              aria-label="Save"
              type="button"
            >
              <FaSave /> {/* Changed to FaSave for consistency */}
            </button>
          </div>
        ) : (
          <>
            {element}
            {isEditing && (type === 'text' || type === 'textarea') && (
              <FaEdit
                className="absolute top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(memberId ? { memberId, field: fieldKey } : fieldKey);
                }}
                aria-label={`Edit ${fieldKey}`}
              />
            )}
          </>
        )}
      </div>
    );
  };

  // Render team member photo container with upload/edit UI
  const renderTeamMemberPhoto = (memberId, photoUrl, photoBorderColor) => {
    const hasImage = photoUrl;
    return (
      <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 ${photoBorderColor} relative group`}>
        {hasImage ? (
          <img
            src={photoUrl}
            alt="Team Member"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"></div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange(memberId)}
          ref={(el) => (fileInputRefs.current[memberId] = el)} // Assign ref dynamically
          className="hidden"
        />

        {/* Upload / Add Image overlay */}
        {isEditing && !hasImage && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              triggerImageUpload(memberId);
            }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors duration-200 text-xl rounded-full cursor-pointer"
            aria-label="Add Image"
          >
            <FaPlusCircle className="text-4xl mb-2" />
            <span className="text-sm">Add Image</span>
          </div>
        )}

        {/* Edit overlay icon on existing image */}
        {isEditing && hasImage && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              triggerImageUpload(memberId);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
            aria-label="Edit Image"
          >
            <FaEdit />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container item mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          {renderEditableField(
            'teamTitle',
            <span>{localData.teamTitle}</span>,
            'text'
          )}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"> {/* Added justify-items-center for centering */}
          {localData.teamMembers.map((member, index) => (
            <div
              key={member.id} // Important for list rendering
              className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 relative"
            >
              {isEditing && (
                <button
                  onClick={() => deleteTeamMember(member.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl"
                  aria-label="Delete Team Member"
                  type="button"
                >
                  <FaTimesCircle />
                </button>
              )}
              {/* Assign different border colors based on index for variety */}
              {renderTeamMemberPhoto(member.id, member.photo,
                index % 3 === 0 ? 'border-blue-400' :
                index % 3 === 1 ? 'border-indigo-400' :
                'border-purple-400'
              )}
              <h3 className="text-xl font-semibold mb-2">
                {renderEditableField(
                  'name',
                  <span>{member.name}</span>,
                  'text',
                  '',
                  member.id // Pass member ID for dynamic fields
                )}
              </h3>
              <p className="text-blue-600 mb-4">
                {renderEditableField(
                  'title',
                  <span>{member.title}</span>,
                  'text',
                  '',
                  member.id // Pass member ID for dynamic fields
                )}
              </p>
              <p className="text-gray-600 text-sm">
                {renderEditableField(
                  'bio',
                  <span>{member.bio}</span>,
                  'textarea',
                  '',
                  member.id // Pass member ID for dynamic fields
                )}
              </p>
            </div>
          ))}

          {isEditing && (
            <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 w-full min-h-[300px]"> {/* min-h to match card height */}
              <button
                onClick={addTeamMember}
                className="text-gray-500 hover:text-green-600 transition-colors duration-200 flex flex-col items-center"
                aria-label="Add New Team Member"
                type="button"
              >
                <FaPlusCircle className="text-6xl mb-4" />
                <span className="text-lg font-semibold">Add New Member</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}