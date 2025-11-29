import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faClock } from "@fortawesome/free-solid-svg-icons";

import "./styles/project.css";

const ProjectCard = forwardRef(function ProjectCard(
	{ logo, title, description, link, linkText, onOpen, status, expectedReleaseDate },
	ref
) {
	const handleKeyDown = (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onOpen();
		}
	};

	const isUpcoming = status === "upcoming";
	
	// Debug: Log what the card receives
	console.log(`ProjectCard "${title}" - status: "${status}", isUpcoming: ${isUpcoming}`);

	// Format the expected release date
	const formatExpectedDate = (dateString) => {
		if (!dateString) return "Coming Soon";
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = date - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays < 0) return "Coming Soon";
		if (diffDays === 0) return "Releasing Today!";
		if (diffDays === 1) return "Tomorrow";
		if (diffDays <= 7) return `In ${diffDays} days`;
		if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
		
		return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
	};

	return (
		<div className={`project ${isUpcoming ? "project-upcoming" : ""}`}>
			{isUpcoming && (
				<div className="project-upcoming-banner">
					<FontAwesomeIcon icon={faClock} />
					<span>{formatExpectedDate(expectedReleaseDate)}</span>
				</div>
			)}
			<div
				ref={ref}
				className="project-container"
				onClick={onOpen}
				role="button"
				tabIndex={0}
				onKeyDown={handleKeyDown}
				aria-label={`Open details for ${title}`}
			>
				<div className="project-logo">
					<img src={logo} alt="project logo" />
				</div>
				<div className="project-title">{title}</div>
				<div className="project-description">{description}</div>
				{link && !isUpcoming && (
					<div className="project-link" onClick={(event) => event.stopPropagation()}>
						<a href={link} target="_blank" rel="noopener noreferrer">
							<div className="project-link-icon">
								<FontAwesomeIcon icon={faLink} />
							</div>
							<div className="project-link-text">{linkText}</div>
						</a>
					</div>
				)}
				{isUpcoming && (
					<div className="project-upcoming-label">
						<span>🚀 In Development</span>
					</div>
				)}
			</div>
		</div>
	);
});

export default ProjectCard;
