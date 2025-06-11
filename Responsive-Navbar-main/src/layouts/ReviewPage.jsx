import React, { useState, useEffect, useCallback } from 'react';
import { FaMoon, FaSun, FaEdit } from 'react-icons/fa';

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

    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
        document.body.classList.toggle('light', !darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
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
            <span key={i} className={i < count ? 'star filled' : 'star'}>
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

    return (
        <div className="page">
            <style>
                {`
                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f4f7f6;
                    color: #333;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }
                
                .page {
                    max-width: 900px;
                    margin: 20px auto;
                    padding: 0 15px;
                    box-sizing: border-box;
                }
                
                .theme-toggle {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 20px;
                }
                
                .theme-icon-btn {
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    color: #007bff;
                    font-size: 1.5rem;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background-color 0.3s ease, color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .theme-icon-btn:hover {
                    background-color: rgba(0, 123, 255, 0.15);
                }
                
                .heading-box {
                    text-align: center;
                    margin-bottom: 25px;
                }
                
                .heading-text {
                    font-size: 2.8rem;
                    font-weight: 700;
                    cursor: pointer;
                    margin: 0;
                    padding: 5px 10px;
                    display: inline-block;
                    transition: background-color 0.2s ease, color 0.2s ease;
                    border-radius: 6px;
                }
                
                .heading-text:hover {
                    background-color: rgba(0, 0, 0, 0.07);
                }
                
                .heading-input {
                    font-size: 2.8rem;
                    font-weight: 700;
                    border: 2px solid #007bff;
                    padding: 5px 10px;
                    outline: none;
                    margin: 0;
                    display: inline-block;
                    width: auto;
                    min-width: 250px;
                    box-sizing: border-box;
                    text-align: center;
                    border-radius: 6px;
                    background-color: #fff;
                    color: #333;
                }
                
                .add-review-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 30px;
                    gap: 12px;
                }
                
                .add-btn {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    font-weight: 600;
                    transition: background-color 0.25s ease, transform 0.1s ease;
                    box-shadow: 0 3px 8px rgba(0, 123, 255, 0.2);
                }
                
                .add-btn:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 12px rgba(0, 123, 255, 0.3);
                }
                
                .add-btn:active {
                    background-color: #003f7f;
                    transform: translateY(0);
                    box-shadow: 0 1px 4px rgba(0, 123, 255, 0.2);
                }
                
                .add-btn-input {
                    background-color: #007bff;
                    color: white;
                    border: 2px solid #0056b3;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 1.2rem;
                    font-weight: 600;
                    width: auto;
                    min-width: 180px;
                    text-align: center;
                    box-sizing: border-box;
                    outline: none;
                    transition: border-color 0.2s ease;
                }
                
                .add-btn-input:focus {
                    border-color: #0056b3;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.4);
                }
                
                .edit-icon-btn {
                    background: none;
                    border: none;
                    color: #007bff;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                
                .edit-icon-btn:hover {
                    background-color: rgba(0, 123, 255, 0.15);
                    color: #0056b3;
                }
                
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                    animation: fadeIn 0.2s ease-out;
                }
                
                .modal-box {
                    background-color: white;
                    padding: 35px 30px;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 480px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
                    position: relative;
                    box-sizing: border-box;
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                
                .modal-box h2 {
                    margin-top: 0;
                    margin-bottom: 25px;
                    font-weight: 700;
                    font-size: 2rem;
                    cursor: pointer;
                    padding: 4px 8px;
                    display: inline-block;
                    transition: background-color 0.2s ease, color 0.2s ease;
                    border-radius: 6px;
                }
                
                .modal-box h2:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }
                
                .modal-title-input {
                    width: 100%;
                    padding: 10px 12px;
                    margin-bottom: 25px;
                    border: 2px solid #007bff;
                    border-radius: 8px;
                    font-size: 2rem;
                    font-weight: 700;
                    box-sizing: border-box;
                    outline: none;
                    background-color: #fff;
                    color: #333;
                    transition: border-color 0.2s ease;
                }
                
                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .form label {
                    font-weight: 600;
                    font-size: 1.05rem;
                    display: flex;
                    flex-direction: column;
                }
                
                .form label span {
                    cursor: pointer;
                    padding: 3px 6px;
                    display: inline-block;
                    transition: background-color 0.2s ease, color 0.2s ease;
                    border-radius: 4px;
                    margin-bottom: 5px;
                }
                
                .form label span:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }
                
                .label-input {
                    font-size: 1.05rem;
                    font-weight: 600;
                    border: 1.5px solid #007bff;
                    padding: 5px 10px;
                    outline: none;
                    display: inline-block;
                    width: auto;
                    min-width: 120px;
                    margin-right: 8px;
                    box-sizing: border-box;
                    background-color: #fff;
                    color: #333;
                    border-radius: 6px;
                    transition: border-color 0.2s ease;
                }
                
                .form input,
                .form select,
                .form textarea {
                    padding: 10px 12px;
                    font-size: 1rem;
                    border: 1.5px solid #ccc;
                    border-radius: 8px;
                    resize: vertical;
                    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
                    width: 100%;
                    box-sizing: border-box;
                    background-color: #fff;
                    color: #333;
                }
                
                .form input:focus,
                .form select:focus,
                .form textarea:focus,
                .modal-title-input:focus,
                .label-input:focus {
                    border-color: #007bff;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                }
                
                .form-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 20px;
                }
                
                .submit-btn,
                .cancel-btn {
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.25s ease, transform 0.1s ease;
                    border: none;
                    font-weight: 600;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .submit-btn {
                    background-color: #28a745;
                    color: white;
                }
                
                .submit-btn:hover {
                    background-color: #218838;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                
                .cancel-btn {
                    background-color: #dc3545;
                    color: white;
                }
                
                .cancel-btn:hover {
                    background-color: #c82333;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                
                .reviews {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                }
                
                .card {
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    padding: 20px 25px;
                    background-color: #ffffff;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                    position: relative;
                    transition: box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
                    box-sizing: border-box;
                }
                
                .card:hover {
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
                }
                
                .card h3 {
                    margin: 0 0 12px 0;
                    font-weight: 700;
                    font-size: 1.35rem;
                    color: #333;
                }
                
                .card p {
                    white-space: normal;
                    overflow-wrap: break-word;
                    max-height: 120px;
                    overflow: auto;
                    line-height: 1.6;
                    color: #555;
                }
                
                .stars {
                    margin-bottom: 15px;
                }
                
                .star {
                    font-size: 1.5rem;
                    color: #ccc;
                    margin-right: 3px;
                }
                
                .star.filled {
                    color: #ffc107;
                }
                
                .card-actions {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    display: flex;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    gap: 10px;
                    z-index: 1;
                }
                
                .card:hover .card-actions {
                    opacity: 1;
                }
                
                .edit-btn,
                .delete-btn {
                    border: none;
                    padding: 7px 12px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    font-weight: 500;
                }
                
                .edit-btn {
                    background-color: #ffc107;
                    color: #333;
                }
                
                .edit-btn:hover {
                    background-color: #e0a800;
                    transform: translateY(-1px);
                }
                
                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                }
                
                .delete-btn:hover {
                    background-color: #c82333;
                    transform: translateY(-1px);
                }
                
                body.dark {
                    background-color: #1a1a1a;
                    color: #f0f0f0;
                }
                
                body.dark .page,
                body.dark .modal-box {
                    background-color: #1a1a1a;
                    color: #f0f0f0;
                    border-color: #333;
                    box-shadow: none;
                }
                
                body.dark .card {
                    background-color: #2a2a2a;
                    color: #f0f0f0;
                    border-color: #444;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }
                
                body.dark .heading-text:hover,
                body.dark .modal-box h2:hover,
                body.dark .form label span:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                }
                
                body.dark .heading-input,
                body.dark input,
                body.dark select,
                body.dark textarea,
                body.dark .modal-title-input,
                body.dark .label-input {
                    background-color: #333333;
                    color: #f0f0f0;
                    border: 1.5px solid #555555;
                }
                
                body.dark input:focus,
                body.dark select:focus,
                body.dark textarea:focus,
                body.dark .modal-title-input:focus,
                body.dark .label-input:focus,
                body.dark .heading-input:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                }
                
                body.dark .star {
                    color: #555555;
                }
                
                body.dark .star.filled {
                    color: #ffd700;
                }
                
                body.dark .theme-icon-btn {
                    color: #f0f0f0;
                }
                
                body.dark .theme-icon-btn:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                
                body.dark .add-btn {
                    background-color: #007bff;
                    color: white;
                    box-shadow: 0 3px 8px rgba(0, 123, 255, 0.3);
                }
                
                body.dark .add-btn:hover {
                    background-color: #0056b3;
                }
                
                body.dark .add-btn-input {
                    background-color: #007bff;
                    color: white;
                    border-color: #0056b3;
                }
                
                body.dark .add-btn-input:focus {
                    border-color: #0056b3;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.4);
                }
                
                body.dark .edit-icon-btn {
                    color: #f0f0f0;
                }
                
                body.dark .edit-icon-btn:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                
                body.dark .submit-btn {
                    background-color: #28a745;
                    color: white;
                }
                
                body.dark .submit-btn:hover {
                    background-color: #218838;
                }
                
                body.dark .cancel-btn {
                    background-color: #dc3545;
                    color: white;
                }
                
                body.dark .cancel-btn:hover {
                    background-color: #c82333;
                }
                
                body.dark .edit-btn {
                    background-color: #ffc107;
                    color: #333;
                }
                
                body.dark .edit-btn:hover {
                    background-color: #e0a800;
                }
                
                body.dark .delete-btn {
                    background-color: #dc3545;
                    color: white;
                }
                
                body.dark .delete-btn:hover {
                    background-color: #c82333;
                }
                `}
            </style>
            <div className="theme-toggle">
                <button onClick={toggleTheme} className="theme-icon-btn">
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>
            </div>

            <div className="heading-box">
                {editingHeading ? (
                    <input
                        type="text"
                        className="heading-input"
                        value={pageContent.mainHeading}
                        onChange={handleHeadingChange}
                        onBlur={handleHeadingBlur}
                        autoFocus
                    />
                ) : (
                    <h1 className="heading-text" onClick={handleHeadingClick}>
                        {pageContent.mainHeading}
                    </h1>
                )}
            </div>

            <div className="add-review-controls">
                {editingAddReviewBtn ? (
                    <input
                        type="text"
                        className="add-btn-input"
                        value={pageContent.addReviewButtonText}
                        onChange={handleAddReviewBtnChange}
                        onBlur={handleAddReviewBtnBlur}
                        autoFocus
                    />
                ) : (
                    <>
                        <button className="add-btn" onClick={openModal}>
                            {pageContent.addReviewButtonText}
                        </button>
                        <button className="edit-icon-btn" onClick={handleAddReviewBtnClick} aria-label="Edit Add Review Button Text">
                            <FaEdit size={16} />
                        </button>
                    </>
                )}
            </div>


            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        {editingModalTitle ? (
                            <input
                                type="text"
                                className="modal-title-input"
                                value={pageContent.modalTitle}
                                onChange={handleModalTitleChange}
                                onBlur={handleModalTitleBlur}
                                autoFocus
                            />
                        ) : (
                            <h2 onClick={handleModalTitleClick}>
                                {editingId ? 'Edit Review' : pageContent.modalTitle}
                            </h2>
                        )}

                        <form className="form" onSubmit={handleSubmit}>
                            <label>
                                {editingNameLabel ? (
                                    <input
                                        type="text"
                                        className="label-input"
                                        value={pageContent.nameLabel}
                                        onChange={handleNameLabelChange}
                                        onBlur={handleNameLabelBlur}
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={handleNameLabelClick}>{pageContent.nameLabel}</span>
                                )}
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <label>
                                {editingRatingLabel ? (
                                    <input
                                        type="text"
                                        className="label-input"
                                        value={pageContent.ratingLabel}
                                        onChange={handleRatingLabelChange}
                                        onBlur={handleRatingLabelBlur}
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={handleRatingLabelClick}>{pageContent.ratingLabel}</span>
                                )}
                                <select
                                    name="rating"
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

                            <label>
                                {editingCommentLabel ? (
                                    <input
                                        type="text"
                                        className="label-input"
                                        value={pageContent.commentLabel}
                                        onChange={handleCommentLabelChange}
                                        onBlur={handleCommentLabelBlur}
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={handleCommentLabelClick}>{pageContent.commentLabel}</span>
                                )}
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <div className="form-buttons">
                                <button type="submit" className="submit-btn">
                                    {editingId ? 'Update Review' : 'Submit Review'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="reviews">
                {reviews.map((review) => (
                    <div className="card" key={review.id}>
                        <div className="card-actions">
                            <button onClick={() => handleEdit(review)} className="edit-btn">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(review.id)} className="delete-btn">
                                Delete
                            </button>
                        </div>
                        <h3>{review.name}</h3>
                        <div className="stars">{renderStars(review.rating)}</div>
                        <p>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewPage;