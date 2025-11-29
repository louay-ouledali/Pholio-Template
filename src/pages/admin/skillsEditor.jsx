import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../../components/common/navBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSave,
	faTrash,
	faArrowLeft,
	faSpinner,
	faPlus,
	faTimes,
	faCode,
	faDatabase,
	faCloud,
	faBrain,
	faShieldAlt,
	faCogs
} from "@fortawesome/free-solid-svg-icons";
import "./styles/editor.css";

// Available categories for skills
const SKILL_CATEGORIES = [
	{ value: "Programming", label: "Programming", icon: faCode, color: "#61DAFB" },
	{ value: "Frameworks", label: "Frameworks", icon: faCogs, color: "#DD0031" },
	{ value: "AI & ML", label: "AI & ML", icon: faBrain, color: "#FF6B6B" },
	{ value: "Databases", label: "Databases", icon: faDatabase, color: "#336791" },
	{ value: "DevOps", label: "DevOps", icon: faCogs, color: "#2496ED" },
	{ value: "Cloud", label: "Cloud", icon: faCloud, color: "#FF9900" },
	{ value: "Security", label: "Security", icon: faShieldAlt, color: "#00D1B2" },
	{ value: "Other", label: "Other", icon: faCogs, color: "#7C3AED" },
];

const SkillsEditor = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [newSkill, setNewSkill] = useState("");
	const [formData, setFormData] = useState({
		category: "Programming",
		items: [],
		order: 0
	});

	useEffect(() => {
		if (id && id !== "new") {
			fetchSkillCategory();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		setHasChanges(true);
	}, [formData]);

	const fetchSkillCategory = async () => {
		setLoading(true);
		try {
			const docRef = doc(db, "skills", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormData({
					category: data.category || "Programming",
					items: data.items || [],
					order: data.order || 0
				});
				setHasChanges(false);
			}
		} catch (error) {
			console.error("Error fetching skill category:", error);
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
				await addDoc(collection(db, "skills"), data);
			} else {
				await updateDoc(doc(db, "skills", id), data);
			}
			setHasChanges(false);
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Error saving skill category:", error);
			alert("Failed to save skill category");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this skill category? This action cannot be undone.")) {
			setLoading(true);
			try {
				await deleteDoc(doc(db, "skills", id));
				navigate("/admin/dashboard");
			} catch (error) {
				console.error("Error deleting skill category:", error);
			}
		}
	};

	// Skill item management
	const addSkillItem = () => {
		if (newSkill.trim()) {
			setFormData(prev => ({
				...prev,
				items: [...prev.items, newSkill.trim()]
			}));
			setNewSkill("");
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addSkillItem();
		}
	};

	const removeSkillItem = (index) => {
		setFormData(prev => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index)
		}));
	};

	const getCategoryInfo = (categoryValue) => {
		return SKILL_CATEGORIES.find(c => c.value === categoryValue) || SKILL_CATEGORIES[0];
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

	const currentCategory = getCategoryInfo(formData.category);

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
						<h2>{id === "new" ? "Add Skill Category" : "Edit Skill Category"}</h2>
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
							<h3>Category Information</h3>
							
							<div className="form-group">
								<label>Category *</label>
								<div className="category-selector">
									{SKILL_CATEGORIES.map((cat) => (
										<button
											key={cat.value}
											type="button"
											className={`category-btn ${formData.category === cat.value ? 'active' : ''}`}
											onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
											style={{ 
												'--cat-color': cat.color,
												borderColor: formData.category === cat.value ? cat.color : undefined,
												backgroundColor: formData.category === cat.value ? `${cat.color}15` : undefined
											}}
										>
											<FontAwesomeIcon icon={cat.icon} />
											<span>{cat.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className="form-group">
								<label>Display Order</label>
								<input 
									type="number"
									name="order" 
									value={formData.order} 
									onChange={handleChange} 
									placeholder="0"
								/>
								<span className="helper-text">Lower numbers appear first</span>
							</div>
						</div>

						<div className="form-section">
							<h3>
								<FontAwesomeIcon icon={currentCategory.icon} style={{ color: currentCategory.color, marginRight: '8px' }} />
								Skills in {formData.category}
							</h3>
							
							{/* Add new skill input */}
							<div className="form-group">
								<label>Add Skills</label>
								<div className="skill-input-row">
									<input
										type="text"
										value={newSkill}
										onChange={(e) => setNewSkill(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder="Type a skill and press Enter or click Add"
									/>
									<button 
										type="button" 
										className="add-skill-btn"
										onClick={addSkillItem}
										disabled={!newSkill.trim()}
									>
										<FontAwesomeIcon icon={faPlus} /> Add
									</button>
								</div>
							</div>

							{/* Skills list */}
							<div className="skills-list">
								{formData.items.length === 0 ? (
									<div className="empty-skills">
										<p>No skills added yet. Add some skills above!</p>
									</div>
								) : (
									<div className="skill-tags-container">
										{formData.items.map((skill, index) => (
											<div 
												key={index} 
												className="skill-tag-item"
												style={{ '--tag-color': currentCategory.color }}
											>
												<span>{skill}</span>
												<button
													type="button"
													className="remove-skill-btn"
													onClick={() => removeSkillItem(index)}
													title="Remove skill"
												>
													<FontAwesomeIcon icon={faTimes} />
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Save Button */}
						<div className="form-actions">
							<button 
								type="submit" 
								className={`save-btn ${hasChanges ? 'has-changes' : ''}`}
								disabled={saving}
							>
								{saving ? (
									<>
										<FontAwesomeIcon icon={faSpinner} spin /> Saving...
									</>
								) : (
									<>
										<FontAwesomeIcon icon={faSave} /> Save Changes
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SkillsEditor;
