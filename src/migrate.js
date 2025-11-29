import { db } from "./firebase";
import { doc, writeBatch } from "firebase/firestore";
import INFO from "./data/user";
import SEO from "./data/seo";
import myArticles from "./data/articles";

const migrateData = async () => {
	console.log("Starting migration...");

	try {
		const batch = writeBatch(db);

		// 1. Migrate Main Info (Profile)
		const userRef = doc(db, "portfolio", "user_info");
		batch.set(userRef, {
			main: INFO.main,
			socials: INFO.socials,
			homepage: INFO.homepage,
			about: INFO.about,
			articles_intro: INFO.articles,
		});
		console.log("Prepared User Info for migration.");

		// 2. Migrate Projects
		if (INFO.projects && INFO.projects.length > 0) {
			INFO.projects.forEach((project, index) => {
				if (!project.title) return;

				const projectId = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
				const projectRef = doc(db, "projects", projectId);
				batch.set(projectRef, {
					...project,
					order: index + 1 // Start from 1
				});
			});
			console.log(`Prepared ${INFO.projects.length} projects for migration.`);
		}

		// 3. Migrate Articles
		if (myArticles && myArticles.length > 0) {
			myArticles.forEach((articleFn, index) => {
				const article = articleFn();
				const articleId = `article_${index + 1}`;
				const articleRef = doc(db, "articles", articleId);
				// We only store metadata in Firestore for the list
				batch.set(articleRef, {
					title: article.title,
					description: article.description,
					date: article.date,
					link: `/article/${index + 1}`, // Internal link logic
					order: index + 1
				});
			});
			console.log(`Prepared ${myArticles.length} articles for migration.`);
		}

		// 4. Migrate Works
		if (INFO.works && INFO.works.length > 0) {
			INFO.works.forEach((work, index) => {
				const workId = `work_${index + 1}`;
				const workRef = doc(db, "works", workId);
				batch.set(workRef, {
					...work,
					order: index + 1
				});
			});
			console.log(`Prepared ${INFO.works.length} works for migration.`);
		}

		// 5. Migrate Certifications
		const certs = [
			{ name: "IELTS Academic", issuer: "British Council / IDP", date: "Aug 30, 2025", type: "language", score: "7.5", scoreLabel: "Band Score", link: "https://drive.google.com/file/d/1Q9p026_3mP3dEfXGf1WsJKuZ4Dv08wJy/view?usp=drive_link", order: 1 },
			{ name: "Certified Ethical Hacker v13", issuer: "EC-Council", date: "Jun 27, 2025", type: "professional", link: "https://drive.google.com/file/d/1A5pfwonMFA_xC1JD-JYUK60QW3wlUG1e/view?usp=drive_link", order: 2 },
			{ name: "Microsoft Certified: Power BI Data Analyst Associate", issuer: "Microsoft", date: "Sep 30, 2024", type: "professional", link: "https://drive.google.com/file/d/1iduYQGJlAnyeFYBw4OCB7ZWpCuJx0OiI/view?usp=drive_link", order: 3 },
			{ name: "Scrum Master Accredited Certification", issuer: "International Scrum Institute", date: "Sep 04, 2024", type: "professional", link: "https://drive.google.com/file/d/1qncwBTgYAwy_craMs9TBUrm8QBJoGuim/view?usp=drive_link", order: 4 },
			{ name: "Python Entry Level Programmer", issuer: "Python Institute", date: "Oct 13, 2024", type: "professional", link: "https://drive.google.com/file/d/1iz9l0Tfu2rBXYTrZTb33WQO0ARmOfsNq/view?usp=drive_link", order: 5 }
		];

		certs.forEach((cert, index) => {
			const certRef = doc(db, "certifications", `cert_${index + 1}`);
			batch.set(certRef, cert);
		});
		console.log(`Prepared ${certs.length} certifications for migration.`);

		// 5b. Migrate Achievements
		const achievements = [
			{ name: "Letter of Recommendation", issuer: "ISTIC (Prof. Neila Bedioui)", date: "Oct 13, 2025", type: "achievement", description: "Academic letter of recommendation", link: "https://drive.google.com/file/d/1qnLy1bBL0LWHbT_spBq0nCTHL41aNZxx/view?usp=drive_link", order: 1 },
			{ name: "Certificate of Excellence - Ideathon ISTIC-AIZU 2.0", issuer: "University of Carthage / ISTIC", date: "Nov 2025", type: "achievement", description: "Excellence award from international ideathon competition", link: "https://drive.google.com/file/d/12nK0gmbicpYHbGvO1pu3kB5a3pV9ev8m/view?usp=drive_link", order: 2 },
			{ name: "IEEE Student Membership", issuer: "IEEE", date: "Valid to Dec 2026", type: "achievement", description: "Active IEEE student member", link: "https://drive.google.com/file/d/1mbbCTBbmebRnWCQVi1FhDJ0m1Uqk_2z-/view?usp=drive_link", order: 3 },
			{ name: "Certified Ethical Hacker V13 Training", issuer: "Tunisian Cloud Training Center", date: "Jun 27, 2025", type: "formation", description: "CEH v13 training attestation", link: "https://drive.google.com/file/d/1YDQX6rZAaOhOdpDWSxE1Kbqp7AH7cuem/view?usp=drive_link", order: 4 },
			{ name: "Power BI Data Analyst Training", issuer: "BI-GEEK", date: "2024", type: "formation", description: "Professional Power BI training program", link: "https://drive.google.com/file/d/1PT_-fukSMmavfM26AULWw0qsEWO15wHU/view?usp=drive_link", order: 5 },
			{ name: "Artificial Intelligence Training", issuer: "Excellence Training Center", date: "Mar 30, 2024", type: "formation", description: "AI fundamentals training program", link: "https://drive.google.com/file/d/1i2lOHBoh5IK4S4aQcW_aN6QBftWIi-1h/view?usp=drive_link", order: 6 },
			{ name: "C++ Certified Associate Programmer Training", issuer: "CFT-Tunis", date: "2023", type: "formation", description: "C++ programming training certification", link: "https://drive.google.com/file/d/1iE4LDTA1FFmqlf9jJu8GoJTueYV0Q3DJ/view?usp=drive_link", order: 7 },
			{ name: "Angular & Spring Boot Training", issuer: "Gust Training", date: "Dec 29, 2023", type: "formation", description: "Full-stack development training with Angular and Spring Boot", link: "https://drive.google.com/file/d/1DhvJ42mbFQkTZNWgjyvp2hLQ1c8oMR8Z/view?usp=drive_link", order: 8 }
		];

		achievements.forEach((achievement, index) => {
			const achievementRef = doc(db, "achievements", `achievement_${index + 1}`);
			batch.set(achievementRef, achievement);
		});
		console.log(`Prepared ${achievements.length} achievements for migration.`);

		// 6. Migrate About Page Data
		const aboutRef = doc(db, "about", "main");
		batch.set(aboutRef, {
			title: INFO.about.title,
			description: INFO.about.description,
			image: INFO.about.section1.images[0], // Default to first image
			socials: INFO.socials
		});

		// 7. Migrate SEO
		const seoRef = doc(db, "portfolio", "seo_config");
		batch.set(seoRef, { settings: SEO });

		await batch.commit();
		console.log("Migration completed successfully!");
	} catch (error) {
		console.error("Migration failed:", error);
		throw error;
	}
};

export default migrateData;
