import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { faCloudUploadAlt, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/imageUpload.css";

const ImageUpload = ({ onUpload, initialUrl = "", label = "Upload Image" }) => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(initialUrl);
    const [error, setError] = useState("");
    const [manualUrl, setManualUrl] = useState("");

    const handleManualUrlChange = (e) => {
        setManualUrl(e.target.value);
        if (e.target.value) {
            setPreview(e.target.value);
            onUpload(e.target.value);
            setError("");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset
        setError("");
        setUploading(true);
        setProgress(10); // Start progress

        // Debug checks
        if (!storage.app.options.storageBucket) {
            setError("Configuration Error: Storage Bucket is missing. Check .env file.");
            setUploading(false);
            return;
        }

        try {
            // Create a reference
            const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Upload timed out. CORS/Network issue.")), 15000);
            });

            // Race the upload against the timeout
            const snapshot = await Promise.race([
                uploadBytes(storageRef, file),
                timeoutPromise
            ]);

            setProgress(80);

            const downloadURL = await getDownloadURL(snapshot.ref);
            setPreview(downloadURL);
            onUpload(downloadURL);
            setProgress(100);
            setUploading(false);

        } catch (error) {
            console.error("Upload error:", error);
            let errorMessage = "Upload failed.";
            if (error.message === "Upload timed out. CORS/Network issue.") {
                errorMessage = "Upload timed out. Please use the 'Paste URL' option below.";
            } else if (error.code === 'storage/unauthorized') {
                errorMessage = "Permission denied. Check Firebase Storage rules.";
            } else if (error.code === 'storage/retry-limit-exceeded') {
                errorMessage = "Network error: Retry limit exceeded. Check CORS.";
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            setError(errorMessage);
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview("");
        onUpload("");
        setManualUrl("");
        setProgress(0);
    };

    return (
        <div className="image-upload-container">
            <label className="image-upload-label">{label}</label>

            {preview ? (
                <div className="image-preview-wrapper">
                    <img src={preview} alt="Preview" className="image-preview" />
                    <button type="button" className="remove-image-btn" onClick={handleRemove}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="upload-success-badge">
                        <FontAwesomeIcon icon={faCheck} /> Uploaded
                    </div>
                </div>
            ) : (
                <div className="upload-dropzone">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                        className="file-input"
                    />
                    <label htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`} className="upload-trigger">
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
                        <span>{uploading ? `Uploading ${progress}%` : "Click to Upload Image"}</span>
                    </label>
                    {uploading && (
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}

                    <div className="manual-url-input-wrapper">
                        <span className="manual-url-divider">OR</span>
                        <input
                            type="text"
                            placeholder="Paste image URL directly..."
                            value={manualUrl}
                            onChange={handleManualUrlChange}
                            className="manual-url-input"
                        />
                    </div>
                </div>
            )}
            {error && <p className="upload-error">{error}</p>}
        </div>
    );
};

export default ImageUpload;
