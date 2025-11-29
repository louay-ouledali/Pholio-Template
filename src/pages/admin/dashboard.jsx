import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import migrateData from "../../migrate";
import { migrateCertificationsData } from "../../migrateCertifications";
import { updateSustainableProjectToDBRouter, addSecConfigAuditorProject } from "../../updateProject";
import { usePortfolio } from "../../context/PortfolioContext";
import { fetchGitHubRepos, fetchRepoDetails } from "../../utils/github";
import { generateProjectDescription } from "../../utils/ai";
import INFO from "../../data/user";
import { restoreDefaultProjects } from "../../utils/restore";
import "./styles/dashboard.css";

const AdminDashboard = () => {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("projects");
	const [apiKey, setApiKey] = useState(localStorage.getItem("google_ai_key") || "");
	const [suggestions, setSuggestions] = useState([]);
	const [scanning, setScanning] = useState(false);
	const [migrationStatus, setMigrationStatus] = useState("");

	const { projects, works, skills, certifications, achievements, refreshData } = usePortfolio();
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (!currentUser) {
				navigate("/admin");
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [navigate]);

	const handleLogout = async () => {
		await signOut(auth);
		navigate("/admin");
	};

	const saveApiKey = () => {
		localStorage.setItem("google_ai_key", apiKey);
		alert("Google AI Key saved!");
	};

	const handleScanGitHub = async () => {
		setScanning(true);
		try {
			const username = INFO.socials.github;
			const repos = await fetchGitHubRepos(username);

			// Filter repos that are already in projects (by link or title)
			const existingLinks = projects.map(p => p.link);
			const newRepos = repos.filter(repo => !existingLinks.includes(repo.html_url));

			const newSuggestions = [];

			// Process top 3 new repos to save tokens/time
			for (const repo of newRepos.slice(0, 3)) {
				const details = await fetchRepoDetails(username, repo.name);
				if (details) {
					try {
						const aiData = await generateProjectDescription({
							name: repo.name,
							html_url: repo.html_url,
							...details
						});
						newSuggestions.push({ ...aiData, logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" });
					} catch (err) {
						console.error(`Failed to generate for ${repo.name}:`, err);
					}
				}
			}
			setSuggestions(newSuggestions);
		} catch (error) {
			console.error("Scan failed:", error);
			alert("Scan failed. Check console.");
		} finally {
			setScanning(false);
		}
	};

	const acceptSuggestion = async (suggestion) => {
		try {
			await addDoc(collection(db, "projects"), {
				...suggestion,
				order: projects.length + 1
			});
			setSuggestions(suggestions.filter(s => s !== suggestion));
			refreshData();
			alert("Project added!");
		} catch (error) {
			console.error("Error adding suggestion:", error);
		}
	};

	const handleMigration = async () => {
		if (window.confirm("This will overwrite existing data in Firestore. Continue?")) {
			setMigrationStatus("Migrating...");
			try {
				await migrateData();
				setMigrationStatus("Migration Successful!");
				refreshData(); // Refresh context after migration
			} catch (error) {
				setMigrationStatus("Migration Failed. Check console.");
			}
		}
	};

	const handleRestore = async () => {
		if (window.confirm("This will restore default projects from user.js. Continue?")) {
			setMigrationStatus("Restoring...");
			try {
				await restoreDefaultProjects();
				setMigrationStatus("Restoration Successful!");
				refreshData();
			} catch (error) {
				setMigrationStatus("Restoration Failed. Check console.");
			}
		}
	};

	if (loading) return <div className="loading">Loading...</div>;

	return (
		<div className="page-content">
			<div className="content-wrapper">
				<div className="dashboard-container">
					<div className="dashboard-header">
						<div className="header-left">
							<Link to="/" className="back-link">← Back to Website</Link>
							<h2>Admin Dashboard</h2>
						</div>
						<button onClick={handleLogout} className="logout-btn">Logout</button>
					</div>

					<div className="dashboard-tabs">
						<button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Projects</button>
						<button className={activeTab === "works" ? "active" : ""} onClick={() => setActiveTab("works")}>Experience</button>
						<button className={activeTab === "skills" ? "active" : ""} onClick={() => setActiveTab("skills")}>Skills</button>
						<button className={activeTab === "certifications" ? "active" : ""} onClick={() => setActiveTab("certifications")}>Test Scores</button>
						<button className={activeTab === "achievements" ? "active" : ""} onClick={() => setActiveTab("achievements")}>Achievements</button>
						<button className={activeTab === "about" ? "active" : ""} onClick={() => setActiveTab("about")}>About Me</button>
						<button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</button>
					</div>

					<div className="dashboard-content">
						{activeTab === "projects" && (
							<div className="section-container">
								<div className="section-header">
									<h3>Projects</h3>
									<div className="actions">
										<button onClick={handleScanGitHub} disabled={scanning} className="scan-btn">
											{scanning ? "Scanning..." : "Scan GitHub for New Projects"}
										</button>
										<Link to="/admin/project/new" className="add-btn">Add Project</Link>
									</div>
								</div>

								{suggestions.length > 0 && (
									<div className="suggestions-list">
										<h4>AI Suggestions</h4>
										{suggestions.map((s, i) => (
											<div key={i} className="suggestion-card">
												<h5>{s.title}</h5>
												<p>{s.description}</p>
												<button onClick={() => acceptSuggestion(s)}>Add to Portfolio</button>
											</div>
										))}
									</div>
								)}

								<div className="items-list">
									{projects.map((project) => (
										<div key={project.id} className="item-card">
											<div className="item-info">
												<h4>{project.title}</h4>
												<p>{project.description.substring(0, 100)}...</p>
											</div>
											<Link to={`/admin/project/${project.id}`} className="edit-btn">Edit</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "works" && (
							<div className="section-container">
								<div className="section-header">
									<h3>Work Experience</h3>
									<Link to="/admin/work/new" className="add-btn">Add Experience</Link>
								</div>
								<div className="items-list">
									{works.map((work) => (
										<div key={work.id} className="item-card">
											<div className="item-info">
												<h4>{work.company}</h4>
												<p>{work.role} ({work.period})</p>
											</div>
											<Link to={`/admin/work/${work.id}`} className="edit-btn">Edit</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "skills" && (
							<div className="section-container">
								<div className="section-header">
									<h3>Skills & Technologies</h3>
									<Link to="/admin/skill/new" className="add-btn">Add Skill Category</Link>
								</div>
								<div className="items-list">
									{(skills || []).map((skillGroup) => (
										<div key={skillGroup.id} className="item-card">
											<div className="item-info">
												<h4>{skillGroup.category}</h4>
												<p>{(skillGroup.items || []).slice(0, 5).join(", ")}{skillGroup.items?.length > 5 ? "..." : ""}</p>
											</div>
											<Link to={`/admin/skill/${skillGroup.id}`} className="edit-btn">Edit</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "certifications" && (
							<div className="section-container">
								<div className="section-header">
									<h3>Test Scores & Certifications</h3>
									<Link to="/admin/certification/new" className="add-btn">Add Certification</Link>
								</div>
								<p className="section-desc">Professional certifications, language tests (IELTS, DELF), and test scores.</p>
								<div className="items-list">
									{certifications.map((cert) => (
										<div key={cert.id} className="item-card clickable" onClick={() => cert.link && window.open(cert.link, "_blank")}>
											<div className="item-info">
												<h4>{cert.name}</h4>
												<p>{cert.issuer} {cert.score && `• Score: ${cert.score}`}</p>
											</div>
											<Link to={`/admin/certification/${cert.id}`} className="edit-btn" onClick={(e) => e.stopPropagation()}>Edit</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "achievements" && (
							<div className="section-container">
								<div className="section-header">
									<h3>Achievement Certificates</h3>
									<Link to="/admin/achievement/new" className="add-btn">Add Achievement</Link>
								</div>
								<p className="section-desc">Certificates of achievement, participation, presence, and training.</p>
								<div className="items-list">
									{(achievements || []).map((achievement) => (
										<div key={achievement.id} className="item-card clickable" onClick={() => achievement.link && window.open(achievement.link, "_blank")}>
											<div className="item-info">
												<h4>{achievement.name}</h4>
												<p>{achievement.issuer} • {achievement.type || "achievement"}</p>
											</div>
											<Link to={`/admin/achievement/${achievement.id}`} className="edit-btn" onClick={(e) => e.stopPropagation()}>Edit</Link>
										</div>
									))}
									{(!achievements || achievements.length === 0) && (
										<div className="empty-state">
											<p>No achievements added yet. Click "Add Achievement" to add certificates of presence, training, or achievements.</p>
										</div>
									)}
								</div>
							</div>
						)}

						{activeTab === "about" && (
							<div className="section-container">
								<div className="section-header">
									<h3>About Me</h3>
									<Link to="/admin/about" className="edit-btn">Edit About Page</Link>
								</div>
								<p>Click the button above to edit your bio, social links, and profile image.</p>
							</div>
						)}

						{activeTab === "settings" && (
							<div className="settings-section">
								<h3>AI Configuration</h3>
								<div className="form-group">
									<label>Google AI API Key</label>
									<input
										type="password"
										value={apiKey}
										onChange={(e) => setApiKey(e.target.value)}
										placeholder="Enter your Gemini API Key"
									/>
									<button onClick={saveApiKey} className="save-btn">Save Key</button>
								</div>

								<h3>Data Management</h3>
								<div className="action-card">
									<p>Upload local `user.js` data to Firebase Firestore.</p>
									<button onClick={handleMigration} className="action-btn">
										Run Migration
									</button>
								</div>
								<div className="action-card">
									<p>Restore default projects from `user.js`.</p>
									<button onClick={handleRestore} className="action-btn restore-btn">
										Restore Defaults
									</button>
								</div>
                            <div className="action-card">
									<p>Load all certifications and achievements data.</p>
									<button onClick={async () => {
										setMigrationStatus("Migrating certifications...");
										const result = await migrateCertificationsData();
										if (result.success) {
											setMigrationStatus(`Added ${result.certifications} certifications and ${result.achievements} achievements!`);
											refreshData();
										} else {
											setMigrationStatus("Migration failed. Check console.");
										}
									}} className="action-btn">
										Load Certifications Data
									</button>
								</div>
                            <div className="action-card">
									<p>Update Sustainable Holiday Trip → DB Router project.</p>
									<button onClick={async () => {
										setMigrationStatus("Updating project...");
										const result = await updateSustainableProjectToDBRouter();
										if (result.success) {
											setMigrationStatus("Project updated to DB Router!");
											refreshData();
										} else {
											setMigrationStatus(result.message || "Update failed.");
										}
									}} className="action-btn">
										Update to DB Router
									</button>
								</div>
								<div className="action-card">
									<p>Add SecConfig Auditor - Security configuration auditing tool.</p>
									<button onClick={async () => {
										setMigrationStatus("Adding project...");
										const result = await addSecConfigAuditorProject();
										if (result.success) {
											setMigrationStatus("SecConfig Auditor project added!");
											refreshData();
										} else {
											setMigrationStatus(result.message || "Add failed.");
										}
									}} className="action-btn">
										Add SecConfig Auditor
									</button>
									{migrationStatus && <p className="status-msg">{migrationStatus}</p>}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
