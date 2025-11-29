import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Logo from "../components/common/logo";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/projects.css";

const Projects = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "projects");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Projects | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="projects" />
				<div className="content-wrapper">
					<div className="projects-logo-container">
						<div className="projects-logo">
							<Logo width={90} />
						</div>
					</div>
					<div className="projects-container">
						<div className="title projects-title">
							Building solutions that make a difference.
						</div>

						<div className="subtitle projects-subtitle">
							From enterprise database platforms to AI-powered automation tools, 
							each project represents a step forward in solving real-world challenges. 
							I specialize in backend systems, data engineering, and intelligent 
							automation. Most of my work is open-source — feel free to explore, 
							fork, or contribute. I'm always excited to collaborate and learn 
							from fellow developers.
						</div>

						<div className="projects-list">
							<AllProjects />
						</div>
					</div>
					
				</div>
			</div>
		</React.Fragment>
	);
};

export default Projects;
