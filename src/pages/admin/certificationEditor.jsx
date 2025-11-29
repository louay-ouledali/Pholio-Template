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
	faCertificate,
	faLink,
	faCalendar,
	faShieldAlt,
	faLanguage,
	faStar
} from "@fortawesome/free-solid-svg-icons";
import "./styles/editor.css";

// Certification types
const CERT_TYPES = [
	{ value: "professional", label: "Professional Certification", icon: faCertificate, color: "#10B981" },
	{ value: "test", label: "Test Score", icon: faShieldAlt, color: "#3B82F6" },
	{ value: "language", label: "Language Test", icon: faLanguage, color: "#8B5CF6" },
];

const CertificationEditor = () => {
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
		type: "professional",
		score: "",
		scoreLabel: "",
		order: 0
	});

	useEffect(() => {
		if (id && id !== "new") {
			fetchCertification();
		}
	}, [id]);

	useEffect(() => {
		setHasChanges(true);
	}, [formData]);

	const fetchCertification = async () => {
		setLoading(true);
		try {
			const docRef = doc(db, "certifications", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormData({
					name: data.name || "",
					issuer: data.issuer || "",
					date: data.date || "",
					image: data.image || "",
					link: data.link || "",
					type: data.type || "professional",
					score: data.score || "",
					scoreLabel: data.scoreLabel || "",
					order: data.order || 0
				});
				setHasChanges(false);
			}
		} catch (error) {
			console.error("Error fetching certification:", error);
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
				await addDoc(collection(db, "certifications"), data);
			} else {
				await updateDoc(doc(db, "certifications", id), data);
			}
			setHasChanges(false);
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Error saving certification:", error);
			alert("Failed to save certification");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this certification? This action cannot be undone.")) {
			setLoading(true);
			try {
				await deleteDoc(doc(db, "certifications", id));
				navigate("/admin/dashboard");
			} catch (error) {
				console.error("Error deleting certification:", error);
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
						<h2>{id === "new" ? "Add New Certification" : "Edit Certification"}</h2>
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
								<h3><FontAwesomeIcon icon={faCertificate} /> Certification Details</h3>
								<p>Add your professional certification or test score.</p>
							</div>

							{/* Type Selector */}
							<div className="form-group">
								<label>Certification Type *</label>
								<div className="type-selector">
									{CERT_TYPES.map((type) => (
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
								<label>Certification Name *</label>
								<input 
									name="name" 
									value={formData.name} 
									onChange={handleChange} 
									placeholder="e.g., AWS Solutions Architect, IELTS Academic"
									required 
								/>
							</div>
							
							<div className="form-group">
								<label>Issuing Organization *</label>
								<input 
									name="issuer" 
									value={formData.issuer} 
									onChange={handleChange} 
									placeholder="e.g., Amazon Web Services, British Council"
									required 
								/>
							</div>

							{/* Score fields for test types */}
							{(formData.type === "test" || formData.type === "language") && (
								<div className="form-row">
									<div className="form-group">
										<label><FontAwesomeIcon icon={faStar} /> Score/Level</label>
										<input 
											name="score" 
											value={formData.score} 
											onChange={handleChange} 
											placeholder="e.g., 7.5, B2, 95%"
										/>
									</div>
									<div className="form-group">
										<label>Score Label</label>
										<input 
											name="scoreLabel" 
											value={formData.scoreLabel} 
											onChange={handleChange}
											placeholder="e.g., Band Score, Level, Percentile"
										/>
									</div>
								</div>
							)}

							<div className="form-row">
								<div className="form-group">
									<label><FontAwesomeIcon icon={faCalendar} /> Issue Date</label>
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
								<span className="field-help">Upload an image of your certificate or badge.</span>
							</div>

							<div className="form-group">
								<label><FontAwesomeIcon icon={faLink} /> Verification Link</label>
								<input 
									name="link" 
									value={formData.link} 
									onChange={handleChange}
									placeholder="https://verify.certification.com/..."
								/>
								<span className="field-help">Link to verify this certification online. Clicking the card will open this link.</span>
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
									<><FontAwesomeIcon icon={faSave} /> Save Certification</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CertificationEditor;
