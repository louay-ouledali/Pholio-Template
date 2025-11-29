import { collection, getDocs, updateDoc, addDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

// Calculate expected release date (months from now)
const getExpectedReleaseDate = (months = 2) => {
	const date = new Date();
	date.setMonth(date.getMonth() + months);
	return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const updateSustainableProjectToDBRouter = async () => {
	console.log("Updating project...");
	
	try {
		const projectsRef = collection(db, "projects");
		const projectsSnap = await getDocs(projectsRef);
		
		for (const projectDoc of projectsSnap.docs) {
			const data = projectDoc.data();
			
			// Find the Sustainable Holiday Trip project
			if (data.title && data.title.toLowerCase().includes("sustainable holiday")) {
				const updatedProject = {
					title: "DB Router",
					description: "Intelligent database rerouting and migration automation platform with smart caching and real-time failover capabilities.",
					logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/go/go.png",
					linkText: "Coming Soon",
					link: "https://github.com/louay-ouledali",
					longDescription: `DB Router is an enterprise-grade database routing and migration automation platform designed to streamline complex multi-database environments. 

Key Features:
• Automated Schema Migration - Zero-downtime schema migrations across multiple database instances with rollback support
• Intelligent Query Routing - Smart routing layer that directs queries to optimal database instances based on load, latency, and data locality
• Distributed Caching Layer - Redis-based caching with intelligent invalidation strategies and cache warming
• Real-time Failover - Automatic failover detection and rerouting with sub-second recovery times
• Connection Pooling - Advanced connection pool management with dynamic scaling based on workload
• Migration Versioning - Git-like version control for database schemas with branching and merging capabilities
• Performance Analytics - Real-time dashboards for query performance, cache hit rates, and system health

The platform supports MySQL, PostgreSQL, SQL Server, and Oracle databases with a unified API layer.`,
					technologies: [
						"Go",
						"PostgreSQL",
						"Redis",
						"Docker",
						"Kubernetes",
						"gRPC",
						"Prometheus",
						"Grafana"
					],
					status: "upcoming",
					releaseDate: "",
					expectedReleaseDate: getExpectedReleaseDate(2)
				};
				
				await updateDoc(doc(db, "projects", projectDoc.id), updatedProject);
				console.log(`Updated project: ${data.title} -> DB Router`);
				return { success: true, message: "Project updated successfully!" };
			}
		}
		
		console.log("Sustainable Holiday Trip project not found");
		return { success: false, message: "Project not found" };
		
	} catch (error) {
		console.error("Update failed:", error);
		return { success: false, error };
	}
};

export const addSecConfigAuditorProject = async () => {
	console.log("Adding SecConfig Auditor project...");
	
	try {
		const projectsRef = collection(db, "projects");
		const projectsSnap = await getDocs(projectsRef);
		
		// Check if project already exists
		for (const projectDoc of projectsSnap.docs) {
			const data = projectDoc.data();
			if (data.title && data.title.toLowerCase().includes("secconfig")) {
				return { success: false, message: "SecConfig Auditor project already exists" };
			}
		}
		
		const newProject = {
			title: "SecConfig Auditor",
			description: "Security configuration auditing dashboard that analyzes system configs against CIS/NIST benchmarks, detects misconfigurations, and generates remediation reports.",
			logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			linkText: "Coming Soon",
			link: "https://github.com/louay-ouledali",
			longDescription: `SecConfig Auditor is a comprehensive security configuration auditing platform - think of it as a linting tool for security configurations.

🎯 Core Features:

📤 Configuration Import Engine:
• Upload/import configuration files (JSON, YAML, XML, INI)
• Automated collection agents for live system scanning
• Support for cloud configs (AWS, Azure, GCP)
• Network device configuration parsing (Cisco, Juniper, Palo Alto)

🔍 Analysis Backend:
• Intelligent configuration parser with format auto-detection
• Benchmark mapping engine (CIS Benchmarks, NIST 800-53, DISA STIGs)
• Custom rule definition with YAML-based DSL
• Misconfiguration detection with pattern matching
• Severity classification (Critical, High, Medium, Low, Informational)
• Context-aware remediation step generation

📊 Reporting Engine:
• Professional PDF reports with executive summaries
• Interactive HTML dashboards
• Compliance scorecards and trend analysis
• Issue breakdown by severity with recommended fixes
• Export to JIRA, ServiceNow, and ticketing systems
• Scheduled report generation and email delivery

🔧 Supported Configurations:
• Operating Systems: Linux (sysctl, PAM, SSH), Windows (Registry, GPO)
• Databases: MySQL, PostgreSQL, MongoDB, Redis
• Web Servers: Apache, Nginx, IIS
• Containers: Docker, Kubernetes
• Cloud: AWS IAM, S3, Security Groups, Azure AD, GCP IAM

Perfect for security teams, DevSecOps, and compliance auditors.`,
			technologies: [
				"Python",
				"FastAPI",
				"React",
				"PostgreSQL",
				"Redis",
				"Docker",
				"Celery",
				"OpenAI API"
			],
			status: "upcoming",
			releaseDate: "",
			expectedReleaseDate: getExpectedReleaseDate(6),
			order: projectsSnap.size + 1
		};
		
		await addDoc(projectsRef, newProject);
		console.log("Added SecConfig Auditor project");
		return { success: true, message: "SecConfig Auditor project added successfully!" };
		
	} catch (error) {
		console.error("Failed to add project:", error);
		return { success: false, error };
	}
};

export default updateSustainableProjectToDBRouter;