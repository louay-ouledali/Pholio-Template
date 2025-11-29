import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCode,
	faDatabase,
	faCloud,
	faBrain,
	faServer,
	faShieldAlt,
	faCogs,
} from "@fortawesome/free-solid-svg-icons";
import {
	faReact,
	faAngular,
	faPython,
	faJava,
	faJs,
	faDocker,
	faNodeJs,
	faAws,
	faGitAlt,
} from "@fortawesome/free-brands-svg-icons";

import { usePortfolio } from "../../context/PortfolioContext";

import "./styles/skills.css";

// Icon mapping for skill categories
const CATEGORY_ICONS = {
	"Programming": faCode,
	"Frameworks": faReact,
	"AI & ML": faBrain,
	"Databases": faDatabase,
	"DevOps": faDocker,
	"Cloud": faCloud,
	"Security": faShieldAlt,
	"Other": faCogs,
};

// Icon mapping for individual technologies
const TECH_ICONS = {
	"react": faReact,
	"angular": faAngular,
	"python": faPython,
	"java": faJava,
	"javascript": faJs,
	"typescript": faJs,
	"docker": faDocker,
	"node": faNodeJs,
	"nodejs": faNodeJs,
	"aws": faAws,
	"git": faGitAlt,
};

// Color mapping for skill categories
const CATEGORY_COLORS = {
	"Programming": "#61DAFB",
	"Frameworks": "#DD0031",
	"AI & ML": "#FF6B6B",
	"Databases": "#336791",
	"DevOps": "#2496ED",
	"Cloud": "#FF9900",
	"Security": "#00D1B2",
	"Other": "#7C3AED",
};

const Skills = () => {
	const { skills } = usePortfolio();

	// Default skills if none are loaded
	const defaultSkills = [
		{
			category: "Programming",
			items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "C++", "C#"]
		},
		{
			category: "Frameworks",
			items: ["Spring Boot", "FastAPI", "Flask", "Angular", "React"]
		},
		{
			category: "AI & ML",
			items: ["Mistral 7B", "Gensim", "scikit-learn", "PyTorch", "RAG Pipelines"]
		},
		{
			category: "Databases",
			items: ["SQL Server", "PostgreSQL", "MySQL", "Oracle", "MongoDB"]
		},
		{
			category: "DevOps",
			items: ["Docker", "Redis", "RabbitMQ", "Git", "CI/CD"]
		},
		{
			category: "Cloud",
			items: ["Azure", "AWS", "Firebase"]
		}
	];

	const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;

	return (
		<div className="skills">
            <br />
			<div className="skills-body">
				<div className="skills-grid">
					{displaySkills.map((skillGroup, index) => (
						<div 
							className="skill-category" 
							key={index}
							style={{ 
								"--category-color": CATEGORY_COLORS[skillGroup.category] || "#7C3AED",
								animationDelay: `${index * 0.1}s`
							}}
						>
							<div className="skill-category-header">
								<FontAwesomeIcon 
									icon={CATEGORY_ICONS[skillGroup.category] || faCogs} 
									className="skill-category-icon"
								/>
								<span className="skill-category-name">{skillGroup.category}</span>
							</div>
							<div className="skill-items">
								{(skillGroup.items || []).map((skill, skillIndex) => (
									<span className="skill-tag" key={skillIndex}>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Skills;
