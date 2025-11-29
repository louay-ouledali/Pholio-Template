// In a real scenario, we would fetch from Firestore here.
// For now, to save reads and complexity, we will use a hardcoded "Snapshot" of the user data
// that matches src/data/user.js. 
// TODO: In Phase 3, we can make this fetch live from Firestore if you want dynamic updates to reflect instantly in the bot.

const STATIC_CONTEXT = {
	name: "Mohamed Louay Ouled Ali",
	title: "Backend Developer & AI Automation Engineer",
	location: "Tunis, Tunisia",
	email: "Ouledalilouay3@gmail.com",
	socials: {
		github: "https://github.com/louay-ouledali",
		linkedin: "https://www.linkedin.com/in/louay-ouledali-250936394"
	},
	about: "Computer Engineering student at ISTIC, University of Carthage, specializing in backend development, data engineering, and AI‑powered automation. Expected graduation May 2026. Passionate about building scalable systems and intelligent automation solutions.",
	skills: {
		programming: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "C++", "C#", "Go"],
		frameworks: ["Spring Boot", "FastAPI", "Flask", "Angular", "React"],
		ai_ml: ["Mistral 7B", "Gensim", "scikit-learn", "PyTorch", "RAG Pipelines", "OpenAI API"],
		databases: ["SQL Server", "PostgreSQL", "MySQL", "Oracle", "MongoDB", "Redis"],
		devops: ["Docker", "Kubernetes", "Redis", "RabbitMQ", "Git", "CI/CD"],
		cloud: ["Azure", "AWS", "Firebase", "Cloudinary"]
	},
	projects: [
		{
			title: "Dynamic Database Connector",
			description: "Unified AI‑powered platform for managing heterogeneous databases (MySQL, PostgreSQL, SQL Server, Oracle). Features AI log analysis using Mistral 7B, event-driven architecture with RabbitMQ + Redis, and Power BI dashboards.",
			technologies: ["Spring Boot", "Angular", "Docker", "Python", "Mistral 7B", "RabbitMQ", "Redis", "Power BI"]
		},
		{
			title: "Modern React Portfolio",
			description: "Cloud-ready portfolio with AI chat integration, GitHub project ingestion, admin dashboard with Cloudinary image management, and Firebase backend.",
			technologies: ["React", "Firebase", "Azure Functions", "Groq API", "Cloudinary"]
		},
		{
			title: "N8n Workflow Automation",
			description: "Automated API synchronization workflows and trigger-based pipelines for data validation and cleaning with multi-source data integration.",
			technologies: ["N8n", "API", "Automation"]
		},
		{
			title: "DB Router (Upcoming - Jan 2026)",
			description: "Intelligent database rerouting and migration automation platform with smart caching, real-time failover, and performance analytics.",
			technologies: ["Go", "PostgreSQL", "Redis", "Docker", "Kubernetes", "gRPC"]
		},
		{
			title: "SecConfig Auditor (Upcoming - May 2026)",
			description: "Security configuration auditing dashboard that analyzes system configs against CIS/NIST benchmarks and generates remediation reports.",
			technologies: ["Python", "FastAPI", "React", "PostgreSQL", "Celery"]
		}
	],
	experience: [
		{
			company: "MS Solutions Tunisia",
			role: "Software Engineering Intern",
			period: "July 2025 - August 2025",
			highlights: "Built containerized multi-database platform, Spring Boot REST APIs with JWT, AI log classification, event-driven backend with sub-200ms response time."
		},
		{
			company: "Djagora Academy",
			role: "Full Stack Development Intern",
			period: "July 2024 - September 2024",
			highlights: "Developed e-learning platform with Angular/Spring Boot, AWS deployment, automated backups."
		}
	],
	certifications: [
		"IELTS Academic (Band 7.5) - British Council",
		"Certified Ethical Hacker v13 - EC-Council",
		"Microsoft Certified: Power BI Data Analyst Associate (PL-300)",
		"Scrum Master Accredited Certification - International Scrum Institute",
		"Python Entry Level Programmer - Python Institute"
	],
	achievements: [
		"Certificate of Excellence - Ideathon ISTIC-AIZU 2.0 (Nov 2025)",
		"IEEE Student Member (Valid to Dec 2026)",
		"Letter of Recommendation - ISTIC (Prof. Neila Bedioui)"
	],
	languages: [
		"Arabic (Native)",
		"English (Fluent - IELTS 7.5)",
		"French (Fluent)"
	]
};

async function getPortfolioContext() {
    // Future: const snapshot = await db.collection('about').doc('main').get();
    return STATIC_CONTEXT;
}

module.exports = { getPortfolioContext };
