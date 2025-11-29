import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../../components/common/navBar";
import CloudinaryUploadWidget from "../../components/admin/CloudinaryUploadWidget";
import TagInput from "../../components/admin/TagInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSave,
	faTrash,
	faArrowLeft,
	faSpinner,
	faPlus,
	faTimes,
	faGripVertical
} from "@fortawesome/free-solid-svg-icons";
import "./styles/editor.css";

const WorksEditor = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [formData, setFormData] = useState({
		company: "",
		role: "",
		duration: "",
		period: "",
		logo: "",
		link: "",
		achievements: [],
		technologies: [],
		order: 0
	});

	useEffect(() => {
		if (id && id !== "new") {
			fetchWork();
		}
	}, [id]);

	useEffect(() => {
		setHasChanges(true);
	}, [formData]);

	const fetchWork = async () => {
		setLoading(true);
		try {
			const docRef = doc(db, "works", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormData({
					company: data.company || "",
					role: data.role || "",
					duration: data.duration || "",
					period: data.period || "",
					logo: data.logo || "",
					link: data.link || "",
					achievements: data.achievements || [],
					technologies: data.technologies || [],
					order: data.order || 0
				});
				setHasChanges(false);
			}
		} catch (error) {
			console.error("Error fetching work:", error);
		}
		setLoading(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);

		const data = {
			...formData,
			order: parseInt(formData.order) || 0
		};

		try {
			if (id === "new") {
				await addDoc(collection(db, "works"), data);
			} else {
				await updateDoc(doc(db, "works", id), data);
			}
			setHasChanges(false);
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Error saving work:", error);
			alert("Failed to save work");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this work experience? This action cannot be undone.")) {
			setLoading(true);
			try {
				await deleteDoc(doc(db, "works", id));
				navigate("/admin/dashboard");
			} catch (error) {
				console.error("Error deleting work:", error);
			}
		}
	};

	// Achievement management
	const addAchievement = () => {
		setFormData(prev => ({
			...prev,
			achievements: [...prev.achievements, ""]
		}));
	};

	const updateAchievement = (index, value) => {
		const newAchievements = [...formData.achievements];
		newAchievements[index] = value;
		setFormData(prev => ({ ...prev, achievements: newAchievements }));
	};

	const removeAchievement = (index) => {
		setFormData(prev => ({
			...prev,
			achievements: prev.achievements.filter((_, i) => i !== index)
		}));
	};

	if (loading) {
		return (
			<div className="page-content">
				<div className="loading-container">
					<FontAwesomeIcon icon={faSpinner} spin size="2x" />
					<p>Loading...</p>
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
						<h2>{id === "new" ? "Add Work Experience" : "Edit Work Experience"}</h2>
						<div className="header-actions">
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

					<form onSubmit={handleSubmit} className="editor-form">
						<div className="form-section">
							<div className="form-group">
								<label>Company Name *</label>
								<input 
									name="company" 
									value={formData.company} 
									onChange={handleChange} 
									placeholder="e.g., Google, Microsoft"
									required 
								/>
							</div>
							
							<div className="form-group">
								<label>Role / Position *</label>
								<input 
									name="role" 
									value={formData.role} 
									onChange={handleChange} 
									placeholder="e.g., Software Engineer"
									required 
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Duration</label>
									<input 
										name="duration" 
										value={formData.duration} 
										onChange={handleChange}
										placeholder="e.g., July 2024 - Present"
									/>
								</div>
								<div className="form-group">
									<label>Period</label>
									<input 
										name="period" 
										value={formData.period} 
										onChange={handleChange}
										placeholder="e.g., 6 Months"
									/>
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Company Logo</label>
									<CloudinaryUploadWidget
										onUpload={(url) => setFormData(prev => ({ ...prev, logo: url }))}
										initialUrl={formData.logo}
										label=""
									/>
								</div>
								<div className="form-group">
									<label>Company Website</label>
									<input 
										name="link" 
										value={formData.link} 
										onChange={handleChange}
										placeholder="https://company.com"
									/>
								</div>
							</div>
						</div>

						<div className="form-section">
							<div className="section-info">
								<h3>Key Achievements</h3>
								<p>List your main accomplishments and responsibilities in this role.</p>
							</div>

							<div className="achievements-list">
								{formData.achievements.length === 0 ? (
									<div className="no-links">
										<p>No achievements added yet</p>
									</div>
								) : (
									formData.achievements.map((achievement, index) => (
										<div key={index} className="link-item">
											<FontAwesomeIcon icon={faGripVertical} className="drag-handle" />
											<input
												placeholder="Describe an achievement or responsibility..."
												value={achievement}
												onChange={(e) => updateAchievement(index, e.target.value)}
											/>
											<button 
												type="button"
												className="remove-link-btn"
												onClick={() => removeAchievement(index)}
											>
												<FontAwesomeIcon icon={faTimes} />
											</button>
										</div>
									))
								)}
								<button 
									type="button" 
									className="add-link-btn"
									onClick={addAchievement}
									style={{ marginTop: '10px' }}
								>
									<FontAwesomeIcon icon={faPlus} /> Add Achievement
								</button>
							</div>
						</div>

						<div className="form-section">
							<div className="form-group">
								<label>Technologies Used</label>
								<TagInput
									tags={formData.technologies}
									onChange={(newTags) => setFormData(prev => ({ ...prev, technologies: newTags }))}
									placeholder="Type technology name and press Enter"
								/>
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
								<span className="field-help">Lower numbers appear first.</span>
							</div>
						</div>

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
									<><FontAwesomeIcon icon={faSave} /> Save Experience</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default WorksEditor;
