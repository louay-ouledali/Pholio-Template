import React from "react";

import Project from "./project";
import { usePortfolio } from "../../context/PortfolioContext";

import "./styles/allProjects.css";

const AllProjects = () => {
	const { projects } = usePortfolio();

	return (
		<div className="all-projects-container">
			{projects.map((project, index) => (
				<div className="all-projects-project" key={index}>
					<Project
						id={project.id}
						logo={project.logo}
						title={project.title}
						description={project.description}
						linkText={project.linkText}
						link={project.link}
						longDescription={project.longDescription}
						technologies={project.technologies}
						screenshot={project.screenshot}
						images={project.media || project.images}
						qr={project.qr}
						links={project.links}
						status={project.status}
						releaseDate={project.releaseDate}
						expectedReleaseDate={project.expectedReleaseDate}
					/>
				</div>
			))}
		</div>
	);
};

export default AllProjects;
