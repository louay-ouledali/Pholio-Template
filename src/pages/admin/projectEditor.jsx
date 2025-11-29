import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchRepoDetails } from "../../utils/github";
import { generateProjectDescription } from "../../utils/ai";
import NavBar from "../../components/common/navBar";
import CloudinaryUploadWidget from "../../components/admin/CloudinaryUploadWidget";
import ImageGalleryManager from "../../components/admin/ImageGalleryManager";
import TagInput from "../../components/admin/TagInput";
import ProjectModal from "../../components/projects/modal/ProjectModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
	faSave,
	faTrash,
	faEye,
	faArrowLeft,
	faMagicWandSparkles,
	faSpinner,
	faLink,
	faPlus,
	faTimes,
	faGripVertical,
	faRocket,
	faClock
} from "@fortawesome/free-solid-svg-icons";
import "./styles/editor.css";

const ProjectEditor = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [scanning, setScanning] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [repoUrl, setRepoUrl] = useState("");
	const [activeSection, setActiveSection] = useState("basic");
	const [hasChanges, setHasChanges] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		longDescription: "",
		logo: "",
		link: "",
		linkText: "View Project",
		technologies: [],
		media: [],
		links: [],
		order: 0,
		status: "released",
		releaseDate: "",
		expectedReleaseDate: ""
	});

	useEffect(() => {
		if (id && id !== "new") {
			fetchProject();
		}
	}, [id]);

	// Track changes
	useEffect(() => {
		setHasChanges(true);
	}, [formData]);

	const fetchProject = async () => {
		setLoading(true);
		try {
			const docRef = doc(db, "projects", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormData({
					title: data.title || "",
					description: data.description || "",
					longDescription: data.longDescription || "",
					logo: data.logo || "",
					link: data.link || "",
					linkText: data.linkText || "View Project",
					technologies: data.technologies || [],
					media: data.media || [],
					links: data.links || [],
					order: data.order || 0,
					status: data.status || "released",
					releaseDate: data.releaseDate || "",
					expectedReleaseDate: data.expectedReleaseDate || ""
				});
				setHasChanges(false);
			}
		} catch (error) {
			console.error("Error fetching project:", error);
		}
		setLoading(false);
	};

	const handleScan = async () => {
		if (!repoUrl) return;
		setScanning(true);
		try {
			const cleanUrl = repoUrl.replace("https://github.com/", "").trim();
			const parts = cleanUrl.split("/");
			if (parts.length < 2) throw new Error("Invalid GitHub URL");

			const username = parts[0];
			const repoName = parts[1];

			const details = await fetchRepoDetails(username, repoName);

			const repoData = {
				name: repoName,
				languages: details.languages,
				readme: details.readme,
				html_url: `https://github.com/${username}/${repoName}`
			};

			const aiData = await generateProjectDescription(repoData);

			setFormData(prev => ({
				...prev,
				title: aiData.title,
				description: aiData.description,
				longDescription: aiData.longDescription,
				technologies: aiData.technologies || [],
				link: aiData.link,
				linkText: aiData.linkText || "View Source"
			}));

		} catch (error) {
			console.error(error);
			alert("Scan failed: " + error.message);
		} finally {
			setScanning(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);

		const projectData = {
			...formData,
			order: parseInt(formData.order) || 0
		};

		// Debug: Log what's being saved
		console.log("Saving project with data:", projectData);
		console.log("Status being saved:", projectData.status);

		try {
			if (id === "new") {
				await addDoc(collection(db, "projects"), projectData);
			} else {
				await updateDoc(doc(db, "projects", id), projectData);
			}
			setHasChanges(false);
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Error saving project:", error);
			alert("Failed to save project");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
			setLoading(true);
			try {
				await deleteDoc(doc(db, "projects", id));
				navigate("/admin/dashboard");
			} catch (error) {
				console.error("Error deleting project:", error);
			}
		}
	};

	// Add new external link
	const addLink = () => {
		setFormData(prev => ({
			...prev,
			links: [...(prev.links || []), { label: "", url: "" }]
		}));
	};

	// Update link
	const updateLink = (index, field, value) => {
		const newLinks = [...(formData.links || [])];
		newLinks[index] = { ...newLinks[index], [field]: value };
		setFormData(prev => ({ ...prev, links: newLinks }));
	};

	// Remove link
	const removeLink = (index) => {
		setFormData(prev => ({
			...prev,
			links: (prev.links || []).filter((_, i) => i !== index)
		}));
	};

	if (loading) {
		return (
			<div className="page-content">
				<div className="loading-container">
					<FontAwesomeIcon icon={faSpinner} spin size="2x" />
					<p>Loading project...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="page-content">
			<NavBar active="admin" />
			<div className="content-wrapper">
				<div className="editor-container enhanced">
					{/* Header */}
					<div className="editor-header">
						<button 
							type="button" 
							className="back-btn"
							onClick={() => navigate("/admin/dashboard")}
						>
							<FontAwesomeIcon icon={faArrowLeft} /> Back
						</button>
						<h2>{id === "new" ? "Create New Project" : "Edit Project"}</h2>
						<div className="header-actions">
							<button 
								type="button" 
								className="preview-btn"
								onClick={() => setPreviewOpen(true)}
							>
								<FontAwesomeIcon icon={faEye} /> Preview
							</button>
							{id !== "new" && (
								<button 
									type="button" 
									className="delete-btn"
									onClick={handleDelete}
								>
									<FontAwesomeIcon icon={faTrash} /> Delete
								</button>
							)}
						</div>
					</div>

					{/* GitHub Scanner */}
					<div className="github-scanner">
						<div className="scanner-header">
							<FontAwesomeIcon icon={faGithub} />
							<span>Auto-fill from GitHub Repository</span>
						</div>
						<div className="scanner-input">
							<input
								placeholder="Enter GitHub repo URL (e.g., username/repo)"
								value={repoUrl}
								onChange={(e) => setRepoUrl(e.target.value)}
							/>
							<button 
								type="button" 
								onClick={handleScan} 
								disabled={scanning || !repoUrl}
							>
								{scanning ? (
									<><FontAwesomeIcon icon={faSpinner} spin /> Scanning...</>
								) : (
									<><FontAwesomeIcon icon={faMagicWandSparkles} /> Auto-Fill</>
								)}
							</button>
						</div>
					</div>

					{/* Section Tabs */}
					<div className="editor-tabs">
						<button 
							type="button"
							className={activeSection === "basic" ? "active" : ""}
							onClick={() => setActiveSection("basic")}
						>
							Basic Info
						</button>
						<button 
							type="button"
							className={activeSection === "media" ? "active" : ""}
							onClick={() => setActiveSection("media")}
						>
							Media ({formData.media.length})
						</button>
						<button 
							type="button"
							className={activeSection === "links" ? "active" : ""}
							onClick={() => setActiveSection("links")}
						>
							Links ({(formData.links || []).length})
						</button>
						<button 
							type="button"
							className={activeSection === "settings" ? "active" : ""}
							onClick={() => setActiveSection("settings")}
						>
							Settings
						</button>
					</div>

					<form onSubmit={handleSubmit} className="editor-form">
						{/* Basic Info Section */}
						{activeSection === "basic" && (
							<div className="form-section">
								<div className="form-group">
									<label>Project Title *</label>
									<input 
										name="title" 
										value={formData.title} 
										onChange={handleChange} 
										placeholder="Enter project title"
										required 
									/>
								</div>

								<div className="form-group">
									<label>Short Description *</label>
									<textarea 
										name="description" 
										value={formData.description} 
										onChange={handleChange}
										placeholder="Brief description that appears on the card"
										rows={3}
										required 
									/>
									<span className="char-count">{formData.description.length} / 200 recommended</span>
								</div>

								<div className="form-group">
									<label>Detailed Description</label>
									<textarea 
										name="longDescription" 
										value={formData.longDescription} 
										onChange={handleChange}
										placeholder="Full description for the project modal"
										rows={6}
									/>
								</div>

								<div className="form-group">
									<label>Project Logo</label>
									<CloudinaryUploadWidget
										onUpload={(url) => setFormData(prev => ({ ...prev, logo: url }))}
										initialUrl={formData.logo}
										label=""
									/>
								</div>

								<div className="form-group">
									<label>Technologies Used</label>
									<TagInput
										tags={formData.technologies}
										onChange={(newTags) => setFormData(prev => ({ ...prev, technologies: newTags }))}
										placeholder="Type technology name and press Enter"
									/>
								</div>
							</div>
						)}

						{/* Media Section */}
						{activeSection === "media" && (
							<div className="form-section">
								<div className="section-info">
									<h3>Project Media</h3>
									<p>Add screenshots, demo videos, and other visual content. Drag to reorder.</p>
								</div>
								<ImageGalleryManager
									media={formData.media}
									onChange={(newMedia) => setFormData(prev => ({ ...prev, media: newMedia }))}
									maxItems={10}
									allowVideos={true}
								/>
							</div>
						)}

						{/* Links Section */}
						{activeSection === "links" && (
							<div className="form-section">
								<div className="section-info">
									<h3>Project Links</h3>
									<p>Add links to live demo, source code, documentation, etc.</p>
								</div>

								<div className="form-row">
									<div className="form-group">
										<label>Primary Link URL</label>
										<input 
											name="link" 
											value={formData.link} 
											onChange={handleChange}
											placeholder="https://..."
										/>
									</div>
									<div className="form-group">
										<label>Primary Link Text</label>
										<input 
											name="linkText" 
											value={formData.linkText} 
											onChange={handleChange}
											placeholder="View Project"
										/>
									</div>
								</div>

								<div className="additional-links">
									<div className="links-header">
										<label>Additional Links</label>
										<button 
											type="button" 
											className="add-link-btn"
											onClick={addLink}
										>
											<FontAwesomeIcon icon={faPlus} /> Add Link
										</button>
									</div>
									
									{(!formData.links || formData.links.length === 0) ? (
										<div className="no-links">
											<FontAwesomeIcon icon={faLink} />
											<p>No additional links added yet</p>
										</div>
									) : (
										<div className="links-list">
											{formData.links.map((link, index) => (
												<div key={index} className="link-item">
													<FontAwesomeIcon icon={faGripVertical} className="drag-handle" />
													<input
														placeholder="Label (e.g., Documentation)"
														value={link.label}
														onChange={(e) => updateLink(index, "label", e.target.value)}
													/>
													<input
														placeholder="URL (https://...)"
														value={link.url}
														onChange={(e) => updateLink(index, "url", e.target.value)}
													/>
													<button 
														type="button"
														className="remove-link-btn"
														onClick={() => removeLink(index)}
													>
														<FontAwesomeIcon icon={faTimes} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						)}

						{/* Settings Section */}
						{activeSection === "settings" && (
							<div className="form-section">
								<div className="section-info">
									<h3>Display Settings</h3>
									<p>Configure how this project appears in your portfolio.</p>
									{/* Debug: Show current status */}
									<p style={{color: '#f59e0b', fontWeight: 'bold'}}>DEBUG - Current Status: {formData.status}</p>
								</div>

								<div className="form-group">
									<label>Display Order</label>
									<input 
										type="number" 
										name="order" 
										value={formData.order} 
										onChange={handleChange}
										min="0"
									/>
									<span className="field-help">Lower numbers appear first. Projects with the same order are sorted by title.</span>
								</div>

								<div className="form-group">
									<label>Project Status</label>
									<div className="status-selector">
										<button
											type="button"
											className={`status-btn ${formData.status === "released" ? "active released" : ""}`}
											onClick={() => setFormData(prev => ({ ...prev, status: "released" }))}
										>
											<FontAwesomeIcon icon={faRocket} /> Released
										</button>
										<button
											type="button"
											className={`status-btn ${formData.status === "upcoming" ? "active upcoming" : ""}`}
											onClick={() => setFormData(prev => ({ ...prev, status: "upcoming" }))}
										>
											<FontAwesomeIcon icon={faClock} /> Upcoming
										</button>
									</div>
									<span className="field-help">Mark projects as "Upcoming" to show they're not yet released.</span>
								</div>

								{formData.status === "released" && (
									<div className="form-group">
										<label>Release Date</label>
										<input 
											type="date" 
											name="releaseDate" 
											value={formData.releaseDate} 
											onChange={handleChange}
										/>
										<span className="field-help">When was this project released? (Optional)</span>
									</div>
								)}

								{formData.status === "upcoming" && (
									<div className="form-group">
										<label>Expected Release Date</label>
										<input 
											type="date" 
											name="expectedReleaseDate" 
											value={formData.expectedReleaseDate} 
											onChange={handleChange}
										/>
										<span className="field-help">When do you expect to release this project? Leave empty for "Coming Soon".</span>
									</div>
								)}
							</div>
						)}

						{/* Sticky Save Bar */}
						<div className="save-bar">
							<div className="save-status">
								{hasChanges && <span className="unsaved">Unsaved changes</span>}
							</div>
							<button 
								type="submit" 
								className="save-btn"
								disabled={saving}
							>
								{saving ? (
									<><FontAwesomeIcon icon={faSpinner} spin /> Saving...</>
								) : (
									<><FontAwesomeIcon icon={faSave} /> Save Project</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>

			<ProjectModal
				open={previewOpen}
				onClose={() => setPreviewOpen(false)}
				title={formData.title || "Project Title"}
				description={formData.description || "Project description..."}
				longDescription={formData.longDescription}
				images={formData.media}
				logo={formData.logo}
				technologies={formData.technologies}
				link={formData.link}
				linkText={formData.linkText}
				links={formData.links || []}
			/>
		</div>
	);
};

export default ProjectEditor;
