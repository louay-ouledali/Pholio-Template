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
	faCalendar,
	faLink,
	faNewspaper
} from "@fortawesome/free-solid-svg-icons";
import "./styles/editor.css";

const ArticleEditor = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		link: "",
		image: "",
		order: 0
	});

	useEffect(() => {
		if (id && id !== "new") {
			fetchArticle();
		}
	}, [id]);

	useEffect(() => {
		setHasChanges(true);
	}, [formData]);

	const fetchArticle = async () => {
		setLoading(true);
		try {
			const docRef = doc(db, "articles", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormData({
					title: data.title || "",
					description: data.description || "",
					date: data.date || "",
					link: data.link || "",
					image: data.image || "",
					order: data.order || 0
				});
				setHasChanges(false);
			}
		} catch (error) {
			console.error("Error fetching article:", error);
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
				await addDoc(collection(db, "articles"), data);
			} else {
				await updateDoc(doc(db, "articles", id), data);
			}
			setHasChanges(false);
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Error saving article:", error);
			alert("Failed to save article");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
			setLoading(true);
			try {
				await deleteDoc(doc(db, "articles", id));
				navigate("/admin/dashboard");
			} catch (error) {
				console.error("Error deleting article:", error);
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
						<h2>{id === "new" ? "Add New Article" : "Edit Article"}</h2>
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
								<h3><FontAwesomeIcon icon={faNewspaper} /> Article Details</h3>
								<p>Add information about your article or blog post.</p>
							</div>

							<div className="form-group">
								<label>Article Title *</label>
								<input 
									name="title" 
									value={formData.title} 
									onChange={handleChange} 
									placeholder="Enter article title"
									required 
								/>
							</div>
							
							<div className="form-group">
								<label>Description *</label>
								<textarea 
									name="description" 
									value={formData.description} 
									onChange={handleChange} 
									rows={4} 
									placeholder="Brief summary of the article content"
									required 
								/>
								<span className="char-count">{formData.description.length} / 300 recommended</span>
							</div>

							<div className="form-group">
								<label>Cover Image</label>
								<CloudinaryUploadWidget
									onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
									initialUrl={formData.image}
									label=""
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label><FontAwesomeIcon icon={faCalendar} /> Publication Date</label>
									<input 
										name="date" 
										value={formData.date} 
										onChange={handleChange} 
										placeholder="e.g., May 7, 2024"
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
								<label><FontAwesomeIcon icon={faLink} /> Article Link</label>
								<input 
									name="link" 
									value={formData.link} 
									onChange={handleChange}
									placeholder="https://medium.com/your-article"
								/>
								<span className="field-help">Link to the full article on Medium, Dev.to, or your blog.</span>
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
									<><FontAwesomeIcon icon={faSave} /> Save Article</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ArticleEditor;
