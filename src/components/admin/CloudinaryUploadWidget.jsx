import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimes, faCheck, faSpinner, faExclamationTriangle, faLink } from "@fortawesome/free-solid-svg-icons";
import "./styles/cloudinaryWidget.css";

const CloudinaryUploadWidget = ({ 
    onUpload, 
    initialUrl = "", 
    label = "Upload Image",
    accept = "image/*"
}) => {
    const widgetRef = useRef(null);
    const onUploadRef = useRef(onUpload);
    
    const [preview, setPreview] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isWidgetReady, setIsWidgetReady] = useState(false);
    const [manualUrl, setManualUrl] = useState("");

    // Keep onUpload ref current to avoid stale closure
    useEffect(() => {
        onUploadRef.current = onUpload;
    }, [onUpload]);

    // Update preview when initialUrl changes
    useEffect(() => {
        setPreview(initialUrl);
    }, [initialUrl]);

    // Initialize Cloudinary widget
    useEffect(() => {
        const initWidget = () => {
            if (window.cloudinary) {
                try {
                    widgetRef.current = window.cloudinary.createUploadWidget(
                        {
                            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
                            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
                            sources: ['local', 'url', 'camera', 'dropbox', 'google_drive'],
                            multiple: false,
                            clientAllowedFormats: accept === "image/*" ? ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] : ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm', 'mov'],
                            maxImageFileSize: 10000000, // 10MB
                            showAdvancedOptions: false,
                            cropping: false,
                            showSkipCropButton: true,
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
                                console.error("Cloudinary error:", error);
                                setError("Upload failed. Please try again or use URL option.");
                                setIsLoading(false);
                                return;
                            }

                            if (result.event === "queues-start") {
                                setIsLoading(true);
                                setError("");
                            }

                            if (result.event === "success") {
                                const url = result.info.secure_url;
                                setPreview(url);
                                setIsLoading(false);
                                setError("");
                                if (onUploadRef.current) {
                                    onUploadRef.current(url);
                                }
                            }

                            if (result.event === "close") {
                                setIsLoading(false);
                            }
                        }
                    );
                    setIsWidgetReady(true);
                } catch (err) {
                    console.error("Failed to create Cloudinary widget:", err);
                    setError("Cloudinary not configured. Use URL option instead.");
                }
            } else {
                setError("Cloudinary script not loaded. Use URL option instead.");
            }
        };

        // Check if Cloudinary is already loaded
        if (window.cloudinary) {
            initWidget();
        } else {
            // Wait for script to load
            const checkCloudinary = setInterval(() => {
                if (window.cloudinary) {
                    clearInterval(checkCloudinary);
                    initWidget();
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkCloudinary);
                if (!window.cloudinary) {
                    setError("Cloudinary failed to load. Use URL option instead.");
                }
            }, 5000);

            return () => clearInterval(checkCloudinary);
        }
    }, [accept]);

    const handleOpenWidget = useCallback(() => {
        if (widgetRef.current) {
            setError("");
            widgetRef.current.open();
        } else {
            setError("Upload widget not ready. Please use URL option.");
        }
    }, []);

    const handleRemove = useCallback(() => {
        setPreview("");
        setManualUrl("");
        setError("");
        if (onUploadRef.current) {
            onUploadRef.current("");
        }
    }, []);

    const handleManualUrlChange = useCallback((e) => {
        const url = e.target.value;
        setManualUrl(url);
    }, []);

    const handleManualUrlSubmit = useCallback(() => {
        if (manualUrl.trim()) {
            // Basic URL validation
            try {
                new URL(manualUrl);
                setPreview(manualUrl);
                setError("");
                if (onUploadRef.current) {
                    onUploadRef.current(manualUrl);
                }
                setManualUrl("");
            } catch {
                setError("Please enter a valid URL");
            }
        }
    }, [manualUrl]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleManualUrlSubmit();
        }
    }, [handleManualUrlSubmit]);

    return (
        <div className="cloudinary-widget-container">
            {label && <label className="cloudinary-label">{label}</label>}
            
            {preview ? (
                <div className="cloudinary-preview-wrapper">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="cloudinary-preview-image"
                        onError={() => setError("Failed to load image preview")}
                    />
                    <button 
                        type="button" 
                        className="cloudinary-remove-btn" 
                        onClick={handleRemove}
                        aria-label="Remove image"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="cloudinary-success-badge">
                        <FontAwesomeIcon icon={faCheck} /> Uploaded
                    </div>
                </div>
            ) : (
                <div className="cloudinary-upload-zone">
                    <button
                        type="button"
                        className="cloudinary-button"
                        onClick={handleOpenWidget}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCloudUploadAlt} />
                                <span>{isWidgetReady ? "Click to Upload" : "Loading..."}</span>
                            </>
                        )}
                    </button>

                    <div className="cloudinary-url-divider">
                        <span>OR</span>
                    </div>

                    <div className="cloudinary-url-input-wrapper">
                        <FontAwesomeIcon icon={faLink} className="cloudinary-url-icon" />
                        <input
                            type="text"
                            placeholder="Paste image URL here..."
                            value={manualUrl}
                            onChange={handleManualUrlChange}
                            onKeyPress={handleKeyPress}
                            className="cloudinary-url-input"
                        />
                        <button
                            type="button"
                            className="cloudinary-url-submit"
                            onClick={handleManualUrlSubmit}
                            disabled={!manualUrl.trim()}
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="cloudinary-error">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default CloudinaryUploadWidget;
