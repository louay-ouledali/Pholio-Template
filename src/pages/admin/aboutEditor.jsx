import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../../components/common/navBar";
import CloudinaryUploadWidget from "../../components/admin/CloudinaryUploadWidget";
import "./styles/editor.css";

const AboutEditor = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		image: "",
		socials: {
			twitter: "",
			github: "",
			linkedin: "",
			instagram: "",
			email: ""
		}
	});

	useEffect(() => {
		fetchAbout();
	}, []);

	const fetchAbout = async () => {
		setLoading(true);
		const docRef = doc(db, "about", "main");
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			setFormData(docSnap.data());
		}
		setLoading(false);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSocialChange = (e) => {
		setFormData({
			...formData,
			socials: {
				...formData.socials,
				[e.target.name]: e.target.value
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await setDoc(doc(db, "about", "main"), formData);
			alert("About page updated successfully!");
		} catch (error) {
			console.error("Error saving about:", error);
			alert("Failed to save about page");
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div className="loading">Loading...</div>;

	return (
		<div className="page-content">
			<NavBar active="admin" />
			<div className="content-wrapper">
				<div className="editor-container">
					<h2>Edit About Page</h2>
					<form onSubmit={handleSubmit} className="editor-form">
						<div className="form-group">
							<label>Main Title</label>
							<textarea name="title" value={formData.title} onChange={handleChange} rows={2} />
						</div>
						
						<div className="form-group">
							<label>Description</label>
							<textarea name="description" value={formData.description} onChange={handleChange} rows={6} />
						</div>

						<div className="form-group">
							<label>Profile Image</label>
							<CloudinaryUploadWidget
								onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
								initialUrl={formData.image}
								label="Upload Profile Image"
							/>
						</div>

						<h3>Social Links</h3>
						<div className="form-row">
							<div className="form-group">
								<label>GitHub</label>
								<input name="github" value={formData.socials?.github || ""} onChange={handleSocialChange} />
							</div>
							<div className="form-group">
								<label>LinkedIn</label>
								<input name="linkedin" value={formData.socials?.linkedin || ""} onChange={handleSocialChange} />
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label>Twitter</label>
								<input name="twitter" value={formData.socials?.twitter || ""} onChange={handleSocialChange} />
							</div>
							<div className="form-group">
								<label>Instagram</label>
								<input name="instagram" value={formData.socials?.instagram || ""} onChange={handleSocialChange} />
							</div>
						</div>
						<div className="form-group">
							<label>Email</label>
							<input name="email" value={formData.socials?.email || ""} onChange={handleSocialChange} />
						</div>

						<div className="button-group">
							<button type="submit" className="save-btn">Save Changes</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AboutEditor;
