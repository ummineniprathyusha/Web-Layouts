import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { FaEdit, FaSave, FaTrashAlt, FaTimes } from 'react-icons/fa'; // Import necessary icons

import {
  GridLayout,
  ListLayout,
  TestimonialLayout,
  TestimonialLayout1,
  HeroLayout,
  MissionVisionLayout,
  TeamLayout,
  CtaLayout,
} from '../layouts';

import FullPageListLayout from '../layouts/FullPageListLayout';
import FullPageGridLayout from '../layouts/FullPageGridLayout';

const LayoutComponents = {
  grid: GridLayout,
  list: ListLayout,
  testimonial: TestimonialLayout,
  testimonial1: TestimonialLayout1,
  hero: HeroLayout,
  missionVision: MissionVisionLayout,
  team: TeamLayout,
  cta: CtaLayout,
  fullList: FullPageListLayout,
  fullPage: FullPageGridLayout,
};

const PageCard = React.forwardRef(
  ({ page, layoutKey, updateContent, deleteItem, setActivePageId }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      title: page.content.title,
      description: page.content.description,
      ...page.content,
    });

    useEffect(() => {
      // Update editData when page.content changes
      setEditData({
        title: page.content.title,
        description: page.content.description,
        ...page.content,
      });
    }, [page.content]);

    const handleSave = () => {
      updateContent(page.id, editData);
      setIsEditing(false);
    };

    const handleDelete = () => {
      if (window.confirm(`Are you sure you want to delete the page "${page.id}"?`)) {
        deleteItem(page.id);
        setActivePageId((prevId) => (prevId === page.id ? null : prevId));
      }
    };

    const LayoutComponent = LayoutComponents[layoutKey] || GridLayout;

    return (
      <div
        ref={ref}
        className="relative min-h-screen bg-bg-light shadow border p-8 mx-4 my-6 mt-25"
        id={`page-${page.id}`}
      >
        {/* Layout preview ONLY */}
        <div className="my-6">
          <LayoutComponent
            content={page.content}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            onContentChange={(newData) => setEditData(newData)}
          />
        </div>

        {/* Edit/Delete/Save/Cancel Controls - Centered and Icon-based */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1 flex justify-center gap-1 z-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors duration-200"
                title="Save Changes"
              >
                <FaSave size={20} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full shadow-lg transition-colors duration-200"
                title="Cancel Editing"
              >
                <FaTimes size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 text-2xl bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors duration-200"
                title="Edit Content"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
                title="Delete Page"
              >
                <FaTrashAlt size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);

export default function AllPagesView() {
  const {
    navItems,
    activePageId,
    updateContent,
    deleteItem,
    setActivePageId,
    selectedLayouts,
  } = useNavigation();

  const containerRef = useRef(null);
  const pageRefs = useRef({});

  useEffect(() => {
    if (!activePageId || !containerRef.current) return;

    const pageEl = pageRefs.current[activePageId];
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePageId]);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto h-full py-6 border"
      style={{ scrollBehavior: 'smooth' }}
    >
      {navItems.length === 0 ? (
        <p className="text-center text-gray-500">No pages found. Add one from sidebar.</p>
      ) : (
        navItems.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            ref={(el) => (pageRefs.current[page.id] = el)}
            layoutKey={selectedLayouts[page.id]}
            updateContent={updateContent}
            deleteItem={deleteItem}
            setActivePageId={setActivePageId}
          />
        ))
      )}
    </div>
  );
}
