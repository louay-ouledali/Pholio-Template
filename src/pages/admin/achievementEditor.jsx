import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../../components/common/navBar";
import CloudinaryUploadWidget from "../../components/admin/CloudinaryUploadWidget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSave,
	faTrash,
	faArrowLeft,
	faSpinner,
	faAward,
	faLink,
	faCalendar,
	faUserCheck,
	faGraduationCap,
	faTrophy
} from "@fortawesome/free-solid-svg-icons";
import "./styles/editor.css";

// Achievement types
const ACHIEVEMENT_TYPES = [
	{ value: "achievement", label: "Achievement", icon: faTrophy, color: "#F59E0B" },
	{ value: "presence", label: "Certificate of Presence", icon: faUserCheck, color: "#8B5CF6" },
	{ value: "formation", label: "Training/Formation", icon: faGraduationCap, color: "#EC4899" },
];

const AchievementEditor = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		issuer: "",
		date: "",
		image: "",
		link: "",
		type: "achievement",
		description: "",
		order: 0
	});

	useEffect(() => {
		if (id && id !== "new") {
			fetchAchievement();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		setHasChanges(true);
	}, [formData]);

	const fetchAchievement = async () => {
		setLoading(true);
		try {
			const docRef = doc(db, "achievements", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormData({
					name: data.name || "",
					issuer: data.issuer || "",
					date: data.date || "",
					image: data.image || "",
					link: data.link || "",
					type: data.type || "achievement",
					description: data.description || "",
					order: data.order || 0
				});
				setHasChanges(false);
			}
		} catch (error) {
			console.error("Error fetching achievement:", error);
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
				await addDoc(collection(db, "achievements"), data);
			} else {
				await updateDoc(doc(db, "achievements", id), data);
			}
			setHasChanges(false);
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Error saving achievement:", error);
			alert("Failed to save achievement");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this achievement? This action cannot be undone.")) {
			setLoading(true);
			try {
				await deleteDoc(doc(db, "achievements", id));
				navigate("/admin/dashboard");
			} catch (error) {
				console.error("Error deleting achievement:", error);
			}
		}
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
						<h2>{id === "new" ? "Add New Achievement" : "Edit Achievement"}</h2>
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
							<div className="section-info">
								<h3><FontAwesomeIcon icon={faAward} /> Achievement Details</h3>
								<p>Add certificates of achievement, participation, or training.</p>
							</div>

							{/* Type Selector */}
							<div className="form-group">
								<label>Achievement Type *</label>
								<div className="type-selector">
									{ACHIEVEMENT_TYPES.map((type) => (
										<button
											key={type.value}
											type="button"
											className={`type-btn ${formData.type === type.value ? 'active' : ''}`}
											onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
											style={{ 
												'--type-color': type.color,
												borderColor: formData.type === type.value ? type.color : undefined,
												backgroundColor: formData.type === type.value ? `${type.color}15` : undefined
											}}
										>
											<FontAwesomeIcon icon={type.icon} />
											<span>{type.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className="form-group">
								<label>Certificate/Achievement Name *</label>
								<input 
									name="name" 
									value={formData.name} 
									onChange={handleChange} 
									placeholder="e.g., Certificate of Completion, Award of Excellence"
									required 
								/>
							</div>
							
							<div className="form-group">
								<label>Issuing Organization *</label>
								<input 
									name="issuer" 
									value={formData.issuer} 
									onChange={handleChange} 
									placeholder="e.g., Conference Name, Training Provider"
									required 
								/>
							</div>

							<div className="form-group">
								<label>Description</label>
								<textarea 
									name="description" 
									value={formData.description} 
									onChange={handleChange}
									placeholder="Brief description of the achievement or training..."
									rows={3}
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label><FontAwesomeIcon icon={faCalendar} /> Date</label>
									<input 
										name="date" 
										value={formData.date} 
										onChange={handleChange} 
										placeholder="e.g., May 2024"
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
								</div>
							</div>

							<div className="form-group">
								<label>Certificate Image</label>
								<CloudinaryUploadWidget
									onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
									initialUrl={formData.image}
									label=""
								/>
								<span className="field-help">Upload an image of your certificate.</span>
							</div>

							<div className="form-group">
								<label><FontAwesomeIcon icon={faLink} /> Certificate Link</label>
								<input 
									name="link" 
									value={formData.link} 
									onChange={handleChange}
									placeholder="https://..."
								/>
								<span className="field-help">Link to view or verify this certificate. Clicking the card will open this link.</span>
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
									<><FontAwesomeIcon icon={faSave} /> Save Achievement</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AchievementEditor;
