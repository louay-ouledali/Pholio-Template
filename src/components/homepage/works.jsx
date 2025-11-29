import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngular,
	faAws,
	faCss3,
	faDocker,
	faGitAlt,
	faGithub,
	faHtml5,
	faJava,
	faJs,
	faNodeJs,
	faNpm,
	faPython,
	faReact,
} from "@fortawesome/free-brands-svg-icons";

import { usePortfolio } from "../../context/PortfolioContext";

import "./styles/works.css";

const TECH_ICON_MAP = {
	react: faReact,
	node: faNodeJs,
	nodejs: faNodeJs,
	angular: faAngular,
	java: faJava,
	docker: faDocker,
	python: faPython,
	javascript: faJs,
	typescript: faJs,
	html: faHtml5,
	html5: faHtml5,
	css: faCss3,
	css3: faCss3,
	aws: faAws,
	git: faGitAlt,
	github: faGithub,
	npm: faNpm,
};

const Works = () => {
	const { works } = usePortfolio();
	const [imageLoadErrors, setImageLoadErrors] = React.useState({});

	const handleImageError = (index) => {
		setImageLoadErrors((prev) => ({
			...prev,
			[index]: true,
		}));
	};
	const getInitials = (name = "") => {
		try {
			const parts = name.trim().split(/\s+/).filter(Boolean);
			if (parts.length === 0) return "";
			if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
			return (parts[0][0] + parts[1][0]).toUpperCase();
		} catch {
			return "";
		}
	};

	const renderCompanyName = (name = "") => {
		const n = String(name);
		const upper = n.toUpperCase();
		if (upper.startsWith("MS")) {
			const prefix = n.slice(0, 2);
			const rest = n.slice(2);
			return (
				<>
					<span className="company-prefix">{prefix}</span>
					<span className="company-rest">{rest}</span>
				</>
			);
		}
		return <span className="company-rest">{n}</span>;
	};

	// Sort works by order if available
	const sortedWorks = [...(works || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

	return (
		<div className="works">
			<div className="works-body">
				<div className="work-card">
					<div className="work-card-container" tabIndex={0}>
						<div className="timeline-container">
							{sortedWorks.map((work, index) => (
								<div className="timeline-item" key={index}>
									{/* Timeline Line and Dot */}
									<div className="timeline-line">
										<div className="timeline-dot"></div>
									</div>

									{/* Work Content */}
									<div className="work-content">
										{/* Header: Company Logo, Name, Role */}
										<div className="work-header">
											<div className="work-logo-container">
												{work.logo && !imageLoadErrors[index] ? (
													<img
														src={work.logo}
														alt={work.company}
														className="work-logo"
														onError={() => handleImageError(index)}
													/>
												) : (
													<div className="work-logo work-logo-fallback">
														{getInitials(work.company)}
													</div>
												)}
											</div>
											<div className="work-info">
												<div className="work-company">
													{work.link ? (
														<a
															href={work.link}
															target="_blank"
															rel="noreferrer"
															className="work-company-link"
														>
															{renderCompanyName(work.company)}
														</a>
													) : (
														renderCompanyName(work.company)
													)}
												</div>
												<div className="work-role">{work.role}</div>
												<div className="work-duration">
													{work.duration} • {work.period}
												</div>
											</div>
										</div>

										{/* Achievements */}
										{work.achievements && (
											<div className="work-achievements">
												<ul>
													{Array.isArray(work.achievements) ? work.achievements.map((achievement, i) => (
														<li key={i}>{achievement}</li>
													)) : <li>{work.achievements}</li>}
												</ul>
											</div>
										)}

										{/* Technologies */}
										{work.technologies && (
											<div className="work-technologies">
												{work.technologies.map((tech, i) => {
													const key = (tech || "").toLowerCase();
													const icon = TECH_ICON_MAP[key];
													return (
														<span key={i} className="tech-badge" title={tech}>
															{icon ? (
																<FontAwesomeIcon icon={icon} />
															) : (
																tech
															)}
														</span>
													);
												})}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Works;
