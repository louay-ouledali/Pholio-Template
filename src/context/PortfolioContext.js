import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import INFO from "../data/user"; // Fallback data

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

// Default skills data
const DEFAULT_SKILLS = [
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

export const PortfolioProvider = ({ children }) => {
	const [portfolioData, setPortfolioData] = useState(INFO);
	const [projects, setProjects] = useState(INFO.projects);
	const [works, setWorks] = useState(INFO.works);
	const [articles, setArticles] = useState(INFO.articles.list || []);
	const [skills, setSkills] = useState(DEFAULT_SKILLS);
	const [certifications, setCertifications] = useState(INFO.certifications || []);
	const [achievements, setAchievements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		setLoading(true);
		try {
			// 1. Fetch User Info (About)
			const aboutDocRef = doc(db, "about", "main");
			const aboutDocSnap = await getDoc(aboutDocRef);

			let fetchedInfo = INFO;
			if (aboutDocSnap.exists()) {
				const data = aboutDocSnap.data();
				fetchedInfo = {
					...INFO,
					about: { ...INFO.about, ...data },
					socials: data.socials || INFO.socials,
				};
			}

			// 2. Fetch Projects
			const projectsRef = collection(db, "projects");
			const projectsQ = query(projectsRef, orderBy("order", "asc"));
			const projectsSnap = await getDocs(projectsQ);
			const fetchedProjects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// 3. Fetch Works
			const worksRef = collection(db, "works");
			const worksQ = query(worksRef, orderBy("order", "asc"));
			const worksSnap = await getDocs(worksQ);
			const fetchedWorks = worksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// 4. Fetch Articles
			const articlesRef = collection(db, "articles");
			const articlesQ = query(articlesRef, orderBy("order", "asc"));
			const articlesSnap = await getDocs(articlesQ);
			const fetchedArticles = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// 5. Fetch Certifications
			const certsRef = collection(db, "certifications");
			const certsQ = query(certsRef, orderBy("order", "asc"));
			const certsSnap = await getDocs(certsQ);
			const fetchedCertifications = certsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// 6. Fetch Skills
			const skillsRef = collection(db, "skills");
			const skillsQ = query(skillsRef, orderBy("order", "asc"));
			const skillsSnap = await getDocs(skillsQ);
			const fetchedSkills = skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// 7. Fetch Achievements (certificates of presence, formation, etc.)
			const achievementsRef = collection(db, "achievements");
			const achievementsQ = query(achievementsRef, orderBy("order", "asc"));
			const achievementsSnap = await getDocs(achievementsQ);
			const fetchedAchievements = achievementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			if (fetchedProjects.length > 0) setProjects(fetchedProjects);
			if (fetchedWorks.length > 0) setWorks(fetchedWorks);
			if (fetchedArticles.length > 0) setArticles(fetchedArticles);
			if (fetchedCertifications.length > 0) setCertifications(fetchedCertifications);
			if (fetchedSkills.length > 0) setSkills(fetchedSkills);
			if (fetchedAchievements.length > 0) setAchievements(fetchedAchievements);

			setPortfolioData(fetchedInfo);

		} catch (err) {
			console.error("Error fetching portfolio data:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const value = {
		data: portfolioData,
		projects,
		works,
		articles,
		skills,
		certifications,
		achievements,
		loading,
		error,
		refreshData: fetchData
	};

	return (
		<PortfolioContext.Provider value={value}>
			{children}
		</PortfolioContext.Provider>
	);
};
