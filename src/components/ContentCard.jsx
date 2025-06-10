import React, { useEffect, useState, forwardRef } from 'react';

const ContentCard = forwardRef(({ item, updateContent, deleteItem, setActiveId, itemType = 'Item' }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: item.content.title,
    description: item.content.description,
  });

  useEffect(() => {
    setEditData({
      title: item.content.title,
      description: item.content.description,
    });
  }, [item.content]);

  const handleSave = () => {
    updateContent(item.id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${item.title}" permanently?`)) {
      deleteItem(item.id);
      setActiveId((prevId) => (prevId === item.id ? null : prevId));
    }
  };

  return (
    <div
      ref={ref}
      className="relative min-h-screen bg-bg-light shadow border p-8 mx-4 my-6 mt-25"
    >
      {isEditing ? (
        <>
          <input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full mb-4 p-2 border text-3xl font-bold text-center"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full p-2 border h-50"
          />
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center capitalize">{item.content.title}</h2>
          <div className="w-30 h-1 bg-gray-400 mx-auto my-2 rounded"></div>
          <p className="text-lg text-center m-auto max-w-2xl mt-6 mb-10">{item.content.description}</p>
        </>
      )}

      <div className="absolute bottom-4 left-4 flex justify-center gap-4">
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white"
        >
          {isEditing ? 'Save' : 'Edit content'}
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-white border hover:shadow-lg text-black"
        >
          Delete {itemType}
        </button>
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-400 text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
});

export default ContentCard;
