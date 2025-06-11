import React, { useState, useEffect, useCallback } from 'react';
import { FaMoon, FaSun, FaEdit } from 'react-icons/fa';

// Define ALL styles as a JavaScript object
const componentStyles = {
    // Body styles: Cannot be applied directly via style prop on component's root div.
    // These would typically go in an index.css or equivalent, or be dynamically applied to body.
    // For this 'internal CSS' request, these will be omitted from the style object itself
    // as they cannot be applied directly to a React element's style prop.
    // You would need to add a <style> tag in your HTML or apply them to document.body via JS.

    page: {
        maxWidth: '900px',
        margin: '20px auto',
        padding: '0 15px',
        boxSizing: 'border-box',
    },

    // Theme Toggle
    themeToggle: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
    },
    themeIconBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#007bff', /* Primary blue for light mode */
        fontSize: '1.5rem',
        padding: '8px',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // :hover styles cannot be implemented directly here.

    // Heading
    headingBox: {
        textAlign: 'center',
        marginBottom: '25px',
    },
    headingText: {
        fontSize: '2.8rem',
        fontWeight: '700',
        cursor: 'pointer',
        margin: '0',
        padding: '5px 10px',
        display: 'inline-block',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        borderRadius: '6px',
    },
    // :hover styles cannot be implemented directly here.

    headingInput: {
        fontSize: '2.8rem',
        fontWeight: '700',
        border: '2px solid #007bff',
        padding: '5px 10px',
        outline: 'none',
        margin: '0',
        display: 'inline-block',
        width: 'auto',
        minWidth: '250px',
        boxSizing: 'border-box',
        textAlign: 'center',
        borderRadius: '6px',
        backgroundColor: '#fff',
        color: '#333',
    },

    // Add Review Button and Edit Icon
    addReviewControls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '12px',
    },
    addBtn: {
        backgroundColor: '#007bff', /* Blue in light mode */
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: '600',
        transition: 'background-color 0.25s ease, transform 0.1s ease',
        boxShadow: '0 3px 8px rgba(0, 123, 255, 0.2)',
    },
    // :hover, :active styles cannot be implemented directly here.

    addBtnInput: {
        backgroundColor: '#007bff', /* Blue in light mode */
        color: 'white',
        border: '2px solid #0056b3',
        padding: '12px 25px',
        borderRadius: '8px',
        fontSize: '1.2rem',
        fontWeight: '600',
        width: 'auto',
        minWidth: '180px',
        textAlign: 'center',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    },
    // :focus styles cannot be implemented directly here.

    editIconBtn: {
        background: 'none',
        border: 'none',
        color: '#007bff', /* Primary blue for light mode */
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'background-color 0.2s ease, color 0.2s ease',
    },
    // :hover styles cannot be implemented directly here.

    // Modal Styles
    modalBackdrop: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        // Animations @keyframes fadeIn/slideIn cannot be implemented directly here.
    },
    modalBox: {
        backgroundColor: 'white',
        padding: '35px 30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '480px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        boxSizing: 'border-box',
        // Animations @keyframes fadeIn/slideIn cannot be implemented directly here.
    },

    modalBoxH2: { // Renamed from original CSS selector `modal-box h2` for direct use
        margin: '0',
        marginBottom: '25px',
        marginTop: '0', // Ensure it's not overriding previous margin
        fontWeight: '700',
        fontSize: '2rem',
        cursor: 'pointer',
        padding: '4px 8px',
        display: 'inline-block',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        borderRadius: '6px',
    },
    // :hover styles cannot be implemented directly here.

    modalTitleInput: {
        width: '100%',
        padding: '10px 12px',
        marginBottom: '25px',
        border: '2px solid #007bff',
        borderRadius: '8px',
        fontSize: '2rem',
        fontWeight: '700',
        boxSizing: 'border-box',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#333',
        transition: 'border-color 0.2s ease',
    },
    // :focus styles cannot be implemented directly here.

    // Form Styles
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },

    formLabel: { // Renamed from original CSS `form label` selector
        fontWeight: '600',
        fontSize: '1.05rem',
        display: 'flex',
        flexDirection: 'column',
    },

    formLabelSpan: { // Renamed from original CSS `form label span` selector
        cursor: 'pointer',
        padding: '3px 6px',
        display: 'inline-block',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        borderRadius: '4px',
        marginBottom: '5px',
    },
    // :hover styles cannot be implemented directly here.

    labelInput: {
        fontSize: '1.05rem',
        fontWeight: '600',
        border: '1.5px solid #007bff',
        padding: '5px 10px',
        outline: 'none',
        display: 'inline-block',
        width: 'auto',
        minWidth: '120px',
        marginRight: '8px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: '6px',
        transition: 'border-color 0.2s ease',
    },
    // :focus styles cannot be implemented directly here.

    formInput: { // Renamed from `form input` selector
        padding: '10px 12px',
        fontSize: '1rem',
        border: '1.5px solid #ccc',
        borderRadius: '8px',
        resize: 'vertical',
        transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#333',
    },
    formSelect: { // Renamed from `form select` selector
        padding: '10px 12px',
        fontSize: '1rem',
        border: '1.5px solid #ccc',
        borderRadius: '8px',
        resize: 'vertical',
        transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#333',
    },
    formTextarea: { // Renamed from `form textarea` selector
        padding: '10px 12px',
        fontSize: '1rem',
        border: '1.5px solid #ccc',
        borderRadius: '8px',
        resize: 'vertical',
        transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#333',
    },
    // :focus styles cannot be implemented directly here for all these elements.

    formButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '20px',
    },

    submitBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease, transform 0.1s ease',
        border: 'none',
        fontWeight: '600',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#28a745', /* Green */
        color: 'white',
    },
    // :hover styles cannot be implemented directly here.

    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease, transform 0.1s ease',
        border: 'none',
        fontWeight: '600',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#dc3545', /* Red */
        color: 'white',
    },
    // :hover styles cannot be implemented directly here.

    // Reviews List
    reviews: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
    },

    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '20px 25px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        transition: 'box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
        boxSizing: 'border-box',
    },
    // :hover styles cannot be implemented directly here.

    cardH3: { // Renamed from `card h3` selector
        margin: '0 0 12px 0',
        fontWeight: '700',
        fontSize: '1.35rem',
        color: '#333',
    },

    cardP: { // Renamed from `card p` selector
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        maxHeight: '120px',
        overflow: 'auto',
        lineHeight: '1.6',
        color: '#555',
    },

    stars: {
        marginBottom: '15px',
    },

    star: {
        fontSize: '1.5rem',
        color: '#ccc',
        marginRight: '3px',
    },

    starFilled: {
        color: '#ffc107',
    },

    cardActions: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        display: 'flex',
        // opacity: 0, // :hover parent-child opacity change not possible here
        transition: 'opacity 0.3s ease',
        gap: '10px',
        zIndex: 1,
    },
    // :hover styles cannot be implemented directly here.

    editBtn: {
        border: 'none',
        padding: '7px 12px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        fontWeight: '500',
        backgroundColor: '#ffc107',
        color: '#333',
    },
    // :hover styles cannot be implemented directly here.

    deleteBtn: {
        border: 'none',
        padding: '7px 12px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        fontWeight: '500',
        backgroundColor: '#dc3545',
        color: 'white',
    },
    // :hover styles cannot be implemented directly here.

    // Dark Mode Styles (These styles will NOT work as intended with inline styles
    // because inline styles override external CSS, and there's no easy way to apply
    // body.dark rules to individual component elements dynamically without massive
    // manual conditional styling on every single element.
    // The conditional styling below for `dynamicThemeStyles` is an attempt, but
    // it's highly inefficient and verbose, and does not replicate the full power of CSS.)
};

const ReviewPage = () => {
    const REVIEWS_API_BASE_URL = 'http://localhost:8080/api/reviews';
    const PAGECONTENT_API_BASE_URL = 'http://localhost:8080/api/page-content';

    const [pageContent, setPageContent] = useState({
        mainHeading: 'Review',
        addReviewButtonText: 'Add Review',
        modalTitle: 'Add Your Review',
        nameLabel: 'Name:',
        ratingLabel: 'Rating (1–5):',
        commentLabel: 'Comment:',
        id: null,
    });

    const [editingHeading, setEditingHeading] = useState(false);
    const [editingAddReviewBtn, setEditingAddReviewBtn] = useState(false);
    const [editingModalTitle, setEditingModalTitle] = useState(false);
    const [editingNameLabel, setEditingNameLabel] = useState(false);
    const [editingRatingLabel, setEditingRatingLabel] = useState(false);
    const [editingCommentLabel, setEditingCommentLabel] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        rating: '',
        comment: '',
    });
    const [editingId, setEditingId] = useState(null);

    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // This useEffect will still toggle the 'dark' class on the body.
    // However, since all styles are now inline, 'body.dark' CSS rules
    // are essentially irrelevant for the component's elements.
    // Dark mode styles must be applied conditionally directly to each element's style prop.
    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
        document.body.classList.toggle('light', !darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');

        // Manually apply body styles for dark mode as they can't be in componentStyles
        document.body.style.backgroundColor = darkMode ? '#1a1a1a' : '#f4f7f6';
        document.body.style.color = darkMode ? '#f0f0f0' : '#333';
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    }, [darkMode]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(REVIEWS_API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }, []);

    const fetchPageContent = useCallback(async () => {
        try {
            const response = await fetch(PAGECONTENT_API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setPageContent(data[0]);
            } else if (data) {
                setPageContent(data);
            }
        } catch (error) {
            console.error('Error fetching page content:', error);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
        fetchPageContent();
    }, [fetchReviews, fetchPageContent]);

    const updatePageContent = useCallback(async (updatedFields) => {
        if (pageContent.id === null) {
            console.error('Cannot update page content: ID is missing. Ensure initial page content is fetched and has an ID.');
            fetchPageContent();
            return;
        }

        const newPageContent = { ...pageContent, ...updatedFields };

        try {
            const response = await fetch(`${PAGECONTENT_API_BASE_URL}/${pageContent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPageContent),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            setPageContent(newPageContent);
            console.log('Page content updated successfully:', newPageContent);
        } catch (error) {
            console.error('Error updating page content:', error);
            fetchPageContent();
        }
    }, [pageContent, fetchPageContent]);

    const toggleTheme = () => setDarkMode((prev) => !prev);

    const handleHeadingClick = () => setEditingHeading(true);
    const handleHeadingChange = (e) => setPageContent(prev => ({ ...prev, mainHeading: e.target.value }));
    const handleHeadingBlur = () => {
        setEditingHeading(false);
        updatePageContent({ mainHeading: pageContent.mainHeading });
    };

    const handleAddReviewBtnClick = () => setEditingAddReviewBtn(true);
    const handleAddReviewBtnChange = (e) => setPageContent(prev => ({ ...prev, addReviewButtonText: e.target.value }));
    const handleAddReviewBtnBlur = () => {
        setEditingAddReviewBtn(false);
        updatePageContent({ addReviewButtonText: pageContent.addReviewButtonText });
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', rating: '', comment: '' });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.rating.trim() || !formData.comment.trim()) {
            alert('Please fill all fields.');
            return;
        }

        const reviewToSave = {
            ...formData,
            rating: Number(formData.rating),
        };

        try {
            let response;
            if (editingId) {
                response = await fetch(`${REVIEWS_API_BASE_URL}/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewToSave),
                });
            } else {
                response = await fetch(REVIEWS_API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewToSave),
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchReviews();
            closeModal();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleEdit = (review) => {
        setFormData({
            name: review.name,
            rating: String(review.rating),
            comment: review.comment,
        });
        setEditingId(review.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const response = await fetch(`${REVIEWS_API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setReviews((prev) => prev.filter((review) => review.id !== id));
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{
                ...componentStyles.star,
                // Applying conditional filled style for stars
                color: (i < count) ? (darkMode ? '#ffd700' : '#ffc107') : (darkMode ? '#555555' : '#ccc')
            }}>
                ★
            </span>
        ));
    };

    const handleModalTitleClick = () => {
        if (editingId === null) {
            setEditingModalTitle(true);
        }
    };
    const handleModalTitleChange = (e) => setPageContent(prev => ({ ...prev, modalTitle: e.target.value }));
    const handleModalTitleBlur = () => {
        setEditingModalTitle(false);
        updatePageContent({ modalTitle: pageContent.modalTitle });
    };

    const handleNameLabelClick = () => setEditingNameLabel(true);
    const handleNameLabelChange = (e) => setPageContent(prev => ({ ...prev, nameLabel: e.target.value }));
    const handleNameLabelBlur = () => {
        setEditingNameLabel(false);
        updatePageContent({ nameLabel: pageContent.nameLabel });
    };

    const handleRatingLabelClick = () => setEditingRatingLabel(true);
    const handleRatingLabelChange = (e) => setPageContent(prev => ({ ...prev, ratingLabel: e.target.value }));
    const handleRatingLabelBlur = () => {
        setEditingRatingLabel(false);
        updatePageContent({ ratingLabel: pageContent.ratingLabel });
    };

    const handleCommentLabelClick = () => setEditingCommentLabel(true);
    const handleCommentLabelChange = (e) => setPageContent(prev => ({ ...prev, commentLabel: e.target.value }));
    const handleCommentLabelBlur = () => {
        setEditingCommentLabel(false);
        updatePageContent({ commentLabel: pageContent.commentLabel });
    };

    // --- Dynamic Styles for Dark Mode ---
    // This is how you'd attempt to handle dark mode with inline styles.
    // It's very verbose and has limitations (e.g., no hover effects directly).
    const getDynamicStyle = (baseStyle, darkModeStyle) => {
        return darkMode ? { ...baseStyle, ...darkModeStyle } : baseStyle;
    };

    return (
        <div style={componentStyles.page}> {/* Base page styles */}
            <div style={componentStyles.themeToggle}>
                <button
                    onClick={toggleTheme}
                    style={getDynamicStyle(componentStyles.themeIconBtn, { color: '#f0f0f0' })}
                >
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
            </div>

            <div style={componentStyles.headingBox}>
                {editingHeading ? (
                    <input
                        type="text"
                        style={getDynamicStyle(componentStyles.headingInput, {
                            backgroundColor: '#333333',
                            color: '#f0f0f0',
                            borderColor: '#007bff' // Assuming focus border remains blue in dark mode
                        })}
                        value={pageContent.mainHeading}
                        onChange={handleHeadingChange}
                        onBlur={handleHeadingBlur}
                        autoFocus
                    />
                ) : (
                    <h1 style={getDynamicStyle(componentStyles.headingText, { color: '#f0f0f0' })} onClick={handleHeadingClick}>
                        {pageContent.mainHeading}
                    </h1>
                )}
            </div>

            <div style={componentStyles.addReviewControls}>
                {editingAddReviewBtn ? (
                    <input
                        type="text"
                        style={getDynamicStyle(componentStyles.addBtnInput, {
                            backgroundColor: '#007bff', // Stays blue
                            color: 'white',
                            borderColor: '#0056b3',
                        })}
                        value={pageContent.addReviewButtonText}
                        onChange={handleAddReviewBtnChange}
                        onBlur={handleAddReviewBtnBlur}
                        autoFocus
                    />
                ) : (
                    <>
                        <button style={getDynamicStyle(componentStyles.addBtn, { backgroundColor: '#007bff', color: 'white' })} onClick={openModal}>
                            {pageContent.addReviewButtonText}
                        </button>
                        <button style={getDynamicStyle(componentStyles.editIconBtn, { color: '#f0f0f0' })} onClick={handleAddReviewBtnClick} aria-label="Edit Add Review Button Text">
                            <FaEdit size={16} />
                        </button>
                    </>
                )}
            </div>

            {showModal && (
                <div style={componentStyles.modalBackdrop} onClick={closeModal}>
                    <div style={getDynamicStyle(componentStyles.modalBox, {
                        backgroundColor: '#1a1a1a',
                        color: '#f0f0f0',
                        boxShadow: 'none',
                        borderColor: '#333' // If there was a border
                    })} onClick={(e) => e.stopPropagation()}>
                        {editingModalTitle ? (
                            <input
                                type="text"
                                style={getDynamicStyle(componentStyles.modalTitleInput, {
                                    backgroundColor: '#333333',
                                    color: '#f0f0f0',
                                    borderColor: '#007bff'
                                })}
                                value={editingId ? 'Edit Review' : pageContent.modalTitle}
                                onChange={handleModalTitleChange}
                                onBlur={handleModalTitleBlur}
                                autoFocus
                            />
                        ) : (
                            <h2 style={getDynamicStyle(componentStyles.modalBoxH2, { color: '#f0f0f0' })} onClick={handleModalTitleClick}>
                                {editingId ? 'Edit Review' : pageContent.modalTitle}
                            </h2>
                        )}

                        <form style={componentStyles.form} onSubmit={handleSubmit}>
                            <label style={componentStyles.formLabel}>
                                {editingNameLabel ? (
                                    <input
                                        type="text"
                                        style={getDynamicStyle(componentStyles.labelInput, {
                                            backgroundColor: '#333333',
                                            color: '#f0f0f0',
                                            borderColor: '#007bff'
                                        })}
                                        value={pageContent.nameLabel}
                                        onChange={handleNameLabelChange}
                                        onBlur={handleNameLabelBlur}
                                        autoFocus
                                    />
                                ) : (
                                    <span style={getDynamicStyle(componentStyles.formLabelSpan, { color: '#f0f0f0' })} onClick={handleNameLabelClick}>{pageContent.nameLabel}</span>
                                )}
                                <input
                                    type="text"
                                    name="name"
                                    style={getDynamicStyle(componentStyles.formInput, {
                                        backgroundColor: '#333333',
                                        color: '#f0f0f0',
                                        borderColor: '#555555'
                                    })}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <label style={componentStyles.formLabel}>
                                {editingRatingLabel ? (
                                    <input
                                        type="text"
                                        style={getDynamicStyle(componentStyles.labelInput, {
                                            backgroundColor: '#333333',
                                            color: '#f0f0f0',
                                            borderColor: '#007bff'
                                        })}
                                        value={pageContent.ratingLabel}
                                        onChange={handleRatingLabelChange}
                                        onBlur={handleRatingLabelBlur}
                                        autoFocus
                                    />
                                ) : (
                                    <span style={getDynamicStyle(componentStyles.formLabelSpan, { color: '#f0f0f0' })} onClick={handleRatingLabelClick}>{pageContent.ratingLabel}</span>
                                )}
                                <select
                                    name="rating"
                                    style={getDynamicStyle(componentStyles.formSelect, {
                                        backgroundColor: '#333333',
                                        color: '#f0f0f0',
                                        borderColor: '#555555'
                                    })}
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select rating
                                    </option>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label style={componentStyles.formLabel}>
                                {editingCommentLabel ? (
                                    <input
                                        type="text"
                                        style={getDynamicStyle(componentStyles.labelInput, {
                                            backgroundColor: '#333333',
                                            color: '#f0f0f0',
                                            borderColor: '#007bff'
                                        })}
                                        value={pageContent.commentLabel}
                                        onChange={handleCommentLabelChange}
                                        onBlur={handleCommentLabelBlur}
                                        autoFocus
                                    />
                                ) : (
                                    <span style={getDynamicStyle(componentStyles.formLabelSpan, { color: '#f0f0f0' })} onClick={handleCommentLabelClick}>{pageContent.commentLabel}</span>
                                )}
                                <textarea
                                    name="comment"
                                    style={getDynamicStyle(componentStyles.formTextarea, {
                                        backgroundColor: '#333333',
                                        color: '#f0f0f0',
                                        borderColor: '#555555'
                                    })}
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <div style={componentStyles.formButtons}>
                                <button type="submit" style={getDynamicStyle(componentStyles.submitBtn, { backgroundColor: '#28a745', color: 'white' })}>
                                    {editingId ? 'Update Review' : 'Submit Review'}
                                </button>
                                <button type="button" style={getDynamicStyle(componentStyles.cancelBtn, { backgroundColor: '#dc3545', color: 'white' })} onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={componentStyles.reviews}>
                {reviews.map((review) => (
                    <div key={review.id}
                        style={getDynamicStyle(componentStyles.card, {
                            backgroundColor: '#2a2a2a',
                            color: '#f0f0f0',
                            borderColor: '#444',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                        })}
                    >
                        {/* Note: card-actions opacity change on card:hover cannot be done with inline styles. */}
                        <div style={componentStyles.cardActions}>
                            <button style={getDynamicStyle(componentStyles.editBtn, { backgroundColor: '#ffc107', color: '#333' })} onClick={() => handleEdit(review)}>
                                Edit
                            </button>
                            <button style={getDynamicStyle(componentStyles.deleteBtn, { backgroundColor: '#dc3545', color: 'white' })} onClick={() => handleDelete(review.id)}>
                                Delete
                            </button>
                        </div>
                        <h3 style={getDynamicStyle(componentStyles.cardH3, { color: '#f0f0f0' })}>{review.name}</h3>
                        <div style={componentStyles.stars}>{renderStars(review.rating)}</div>
                        <p style={getDynamicStyle(componentStyles.cardP, { color: '#f0f0f0' })}>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewPage;