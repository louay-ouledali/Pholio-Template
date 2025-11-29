import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCloudUploadAlt, 
    faTimes, 
    faGripVertical, 
    faImage, 
    faVideo, 
    faPlus,
    faLink,
    faExpand,
    faTrash,
    faArrowUp,
    faArrowDown,
    faCheck,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";
import "./styles/imageGalleryManager.css";

const ImageGalleryManager = ({ 
    media = [], 
    onChange, 
    maxItems = 10,
    allowVideos = true 
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addType, setAddType] = useState("image");
    const [urlInput, setUrlInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    const widgetRef = useRef(null);

    // Initialize Cloudinary widget once
    const initCloudinaryWidget = useCallback(() => {
        if (window.cloudinary && !widgetRef.current) {
            try {
                widgetRef.current = window.cloudinary.createUploadWidget(
                    {
                        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
                        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
                        sources: ['local', 'url', 'camera', 'dropbox', 'google_drive'],
                        multiple: true,
                        maxFiles: maxItems - media.length,
                        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
                        maxImageFileSize: 10000000,
                        styles: {
                            palette: {
                                window: "#1e293b",
                                windowBorder: "#475569",
                                tabIcon: "#38bdf8",
                                menuIcons: "#94a3b8",
                                textDark: "#0f172a",
                                textLight: "#f1f5f9",
                                link: "#38bdf8",
                                action: "#38bdf8",
                                inactiveTabIcon: "#64748b",
                                error: "#f87171",
                                inProgress: "#38bdf8",
                                complete: "#4ade80",
                                sourceBg: "#0f172a"
                            }
                        }
                    },
                    (error, result) => {
                        if (error) {
                            setError("Upload failed. Please try again.");
                            setIsUploading(false);
                            return;
                        }
                        if (result.event === "queues-start") {
                            setIsUploading(true);
                            setError("");
                        }
                        if (result.event === "success") {
                            const url = result.info.secure_url;
                            onChange([...media, { type: "image", src: url }]);
                        }
                        if (result.event === "close") {
                            setIsUploading(false);
                            setShowAddModal(false);
                        }
                    }
                );
            } catch (err) {
                console.error("Failed to create Cloudinary widget:", err);
            }
        }
    }, [media, maxItems, onChange]);

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.outerHTML);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            const newMedia = [...media];
            const [removed] = newMedia.splice(draggedIndex, 1);
            newMedia.splice(index, 0, removed);
            onChange(newMedia);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Move item up/down
    const moveItem = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= media.length) return;
        
        const newMedia = [...media];
        [newMedia[index], newMedia[newIndex]] = [newMedia[newIndex], newMedia[index]];
        onChange(newMedia);
    };

    // Remove item
    const removeItem = (index) => {
        const newMedia = media.filter((_, i) => i !== index);
        onChange(newMedia);
    };

    // Add image via URL
    const addImageByUrl = () => {
        if (!urlInput.trim()) {
            setError("Please enter a URL");
            return;
        }
        try {
            new URL(urlInput);
            onChange([...media, { type: addType, src: urlInput }]);
            setUrlInput("");
            setShowAddModal(false);
            setError("");
        } catch {
            setError("Please enter a valid URL");
        }
    };

    // Open Cloudinary widget
    const openCloudinaryUpload = () => {
        initCloudinaryWidget();
        if (widgetRef.current) {
            widgetRef.current.open();
        } else {
            setError("Upload widget not available. Use URL option instead.");
        }
    };

    // Get video embed URL
    const getVideoEmbedUrl = (url) => {
        if (!url) return null;
        
        // YouTube
        const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
        
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        
        return url;
    };

    return (
        <div className="image-gallery-manager">
            <div className="gallery-header">
                <span className="gallery-count">{media.length} / {maxItems} items</span>
                <button 
                    type="button" 
                    className="gallery-add-btn"
                    onClick={() => setShowAddModal(true)}
                    disabled={media.length >= maxItems}
                >
                    <FontAwesomeIcon icon={faPlus} /> Add Media
                </button>
            </div>

            {media.length === 0 ? (
                <div 
                    className="gallery-empty"
                    onClick={() => setShowAddModal(true)}
                >
                    <FontAwesomeIcon icon={faImage} className="empty-icon" />
                    <p>No media added yet</p>
                    <span>Click to add images or videos</span>
                </div>
            ) : (
                <div className="gallery-grid">
                    {media.map((item, index) => (
                        <div 
                            key={index}
                            className={`gallery-item ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="gallery-item-drag">
                                <FontAwesomeIcon icon={faGripVertical} />
                            </div>
                            
                            <div className="gallery-item-preview">
                                {item.type === "video" ? (
                                    <div className="video-thumbnail">
                                        <FontAwesomeIcon icon={faVideo} />
                                        <span>Video</span>
                                    </div>
                                ) : (
                                    <img 
                                        src={item.src} 
                                        alt={`Media ${index + 1}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                )}
                                <div className="image-error" style={{ display: 'none' }}>
                                    <FontAwesomeIcon icon={faImage} />
                                    <span>Failed to load</span>
                                </div>
                            </div>

                            <div className="gallery-item-actions">
                                <button 
                                    type="button"
                                    onClick={() => moveItem(index, -1)}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    <FontAwesomeIcon icon={faArrowUp} />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => moveItem(index, 1)}
                                    disabled={index === media.length - 1}
                                    title="Move down"
                                >
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setPreviewImage(item)}
                                    title="Preview"
                                >
                                    <FontAwesomeIcon icon={faExpand} />
                                </button>
                                <button 
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => removeItem(index)}
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                            <div className="gallery-item-type">
                                <FontAwesomeIcon icon={item.type === "video" ? faVideo : faImage} />
                            </div>

                            <div className="gallery-item-index">{index + 1}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Media Modal */}
            {showAddModal && (
                <div className="gallery-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="gallery-modal-header">
                            <h3>Add Media</h3>
                            <button type="button" onClick={() => setShowAddModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="gallery-modal-body">
                            <div className="add-type-selector">
                                <button 
                                    type="button"
                                    className={addType === "image" ? "active" : ""}
                                    onClick={() => setAddType("image")}
                                >
                                    <FontAwesomeIcon icon={faImage} /> Image
                                </button>
                                {allowVideos && (
                                    <button 
                                        type="button"
                                        className={addType === "video" ? "active" : ""}
                                        onClick={() => setAddType("video")}
                                    >
                                        <FontAwesomeIcon icon={faVideo} /> Video
                                    </button>
                                )}
                            </div>

                            {addType === "image" && (
                                <div className="upload-section">
                                    <button 
                                        type="button" 
                                        className="cloudinary-upload-btn"
                                        onClick={openCloudinaryUpload}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin /> Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faCloudUploadAlt} /> Upload Image
                                            </>
                                        )}
                                    </button>
                                    <div className="upload-divider">
                                        <span>or paste URL</span>
                                    </div>
                                </div>
                            )}

                            <div className="url-input-section">
                                <div className="url-input-wrapper">
                                    <FontAwesomeIcon icon={faLink} className="url-icon" />
                                    <input
                                        type="text"
                                        placeholder={addType === "video" ? "YouTube or Vimeo URL" : "Image URL (https://...)"}
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addImageByUrl()}
                                    />
                                    <button type="button" onClick={addImageByUrl}>
                                        <FontAwesomeIcon icon={faCheck} /> Add
                                    </button>
                                </div>
                                {error && <div className="url-error">{error}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewImage && (
                <div className="gallery-modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            type="button" 
                            className="preview-close"
                            onClick={() => setPreviewImage(null)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        {previewImage.type === "video" ? (
                            <iframe
                                src={getVideoEmbedUrl(previewImage.src)}
                                title="Video preview"
                                allowFullScreen
                            />
                        ) : (
                            <img src={previewImage.src} alt="Preview" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGalleryManager;
