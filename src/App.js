import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { PortfolioProvider } from "./context/PortfolioContext";

import "./app.css";

const Homepage = lazy(() => import("./pages/homepage"));
const About = lazy(() => import("./pages/about"));
const Projects = lazy(() => import("./pages/projects"));
const Articles = lazy(() => import("./pages/articles"));
const Certifications = lazy(() => import("./pages/certifications"));
const ReadArticle = lazy(() => import("./pages/readArticle"));
const Contact = lazy(() => import("./pages/contact"));
const Notfound = lazy(() => import("./pages/404"));
const AdminLogin = lazy(() => import("./pages/admin/login"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const ProjectEditor = lazy(() => import("./pages/admin/projectEditor"));
const WorksEditor = lazy(() => import("./pages/admin/worksEditor"));
const ArticleEditor = lazy(() => import("./pages/admin/articleEditor"));
const CertificationEditor = lazy(() => import("./pages/admin/certificationEditor"));
const AchievementEditor = lazy(() => import("./pages/admin/achievementEditor"));
const SkillsEditor = lazy(() => import("./pages/admin/skillsEditor"));
const AboutEditor = lazy(() => import("./pages/admin/aboutEditor"));
const ParticlesComponent = lazy(() => import("./components/particles"));
const Footer = lazy(() => import("./components/common/footer"));
const ProtectedRoute = lazy(() => import("./components/common/ProtectedRoute"));
const ChatWidget = lazy(() => import("./components/common/ChatWidget"));

function App() {
	return (
		<div className="App">
			<PortfolioProvider>
				<Suspense fallback={<div className="loading"></div>}>
					<ParticlesComponent id="particles" className="particles-background" />
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="/about" element={<About />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/articles" element={<Articles />} />
						<Route path="/certifications" element={<Certifications />} />
						<Route path="/article/:slug" element={<ReadArticle />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/admin" element={<AdminLogin />} />
						<Route path="/admin/dashboard" element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						} />
						<Route path="/admin/project/:id" element={
							<ProtectedRoute>
								<ProjectEditor />
							</ProtectedRoute>
						} />
						<Route path="/admin/work/:id" element={
							<ProtectedRoute>
								<WorksEditor />
							</ProtectedRoute>
						} />
						<Route path="/admin/article/:id" element={
							<ProtectedRoute>
								<ArticleEditor />
							</ProtectedRoute>
						} />
						<Route path="/admin/certification/:id" element={
							<ProtectedRoute>
								<CertificationEditor />
							</ProtectedRoute>
						} />
						<Route path="/admin/achievement/:id" element={
							<ProtectedRoute>
								<AchievementEditor />
							</ProtectedRoute>
						} />
						<Route path="/admin/skill/:id" element={
							<ProtectedRoute>
								<SkillsEditor />
							</ProtectedRoute>
						} />
						<Route path="/admin/about" element={
							<ProtectedRoute>
								<AboutEditor />
							</ProtectedRoute>
						} />
						<Route path="*" element={<Notfound />} />
					</Routes>
					<Footer />
					<ChatWidget />
				</Suspense>
			</PortfolioProvider>
		</div>
	);
}

export default App;
