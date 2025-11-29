import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const certifications = [
	{
		name: "IELTS Academic",
		issuer: "British Council / IDP",
		date: "Aug 30, 2025",
		type: "language",
		score: "7.5",
		scoreLabel: "Band Score",
		link: "https://drive.google.com/file/d/1Q9p026_3mP3dEfXGf1WsJKuZ4Dv08wJy/view?usp=drive_link",
		order: 1
	},
	{
		name: "Certified Ethical Hacker v13",
		issuer: "EC-Council",
		date: "Jun 27, 2025",
		type: "professional",
		score: "",
		scoreLabel: "",
		link: "https://drive.google.com/file/d/1A5pfwonMFA_xC1JD-JYUK60QW3wlUG1e/view?usp=drive_link",
		order: 2
	},
	{
		name: "Microsoft Certified: Power BI Data Analyst Associate",
		issuer: "Microsoft",
		date: "Sep 30, 2024",
		type: "professional",
		score: "",
		scoreLabel: "",
		link: "https://drive.google.com/file/d/1iduYQGJlAnyeFYBw4OCB7ZWpCuJx0OiI/view?usp=drive_link",
		order: 3
	},
	{
		name: "Scrum Master Accredited Certification",
		issuer: "International Scrum Institute",
		date: "Sep 04, 2024",
		type: "professional",
		score: "",
		scoreLabel: "",
		link: "https://drive.google.com/file/d/1qncwBTgYAwy_craMs9TBUrm8QBJoGuim/view?usp=drive_link",
		order: 4
	},
	{
		name: "Python Entry Level Programmer",
		issuer: "Python Institute",
		date: "Oct 13, 2024",
		type: "professional",
		score: "",
		scoreLabel: "",
		link: "https://drive.google.com/file/d/1iz9l0Tfu2rBXYTrZTb33WQO0ARmOfsNq/view?usp=drive_link",
		order: 5
	}
];

const achievements = [
	{
		name: "Letter of Recommendation",
		issuer: "ISTIC (Prof. Neila Bedioui)",
		date: "Oct 13, 2025",
		type: "achievement",
		description: "Academic letter of recommendation",
		link: "https://drive.google.com/file/d/1qnLy1bBL0LWHbT_spBq0nCTHL41aNZxx/view?usp=drive_link",
		order: 1
	},
	{
		name: "Certificate of Excellence - Ideathon ISTIC-AIZU 2.0",
		issuer: "University of Carthage / ISTIC",
		date: "Nov 2025",
		type: "achievement",
		description: "Excellence award from international ideathon competition",
		link: "https://drive.google.com/file/d/12nK0gmbicpYHbGvO1pu3kB5a3pV9ev8m/view?usp=drive_link",
		order: 2
	},
	{
		name: "IEEE Student Membership",
		issuer: "IEEE",
		date: "Valid to Dec 2026",
		type: "achievement",
		description: "Active IEEE student member",
		link: "https://drive.google.com/file/d/1mbbCTBbmebRnWCQVi1FhDJ0m1Uqk_2z-/view?usp=drive_link",
		order: 3
	},
	{
		name: "Certified Ethical Hacker V13 Training",
		issuer: "Tunisian Cloud Training Center",
		date: "Jun 27, 2025",
		type: "formation",
		description: "CEH v13 training attestation",
		link: "https://drive.google.com/file/d/1YDQX6rZAaOhOdpDWSxE1Kbqp7AH7cuem/view?usp=drive_link",
		order: 4
	},
	{
		name: "Power BI Data Analyst Training",
		issuer: "BI-GEEK",
		date: "2024",
		type: "formation",
		description: "Professional Power BI training program",
		link: "https://drive.google.com/file/d/1PT_-fukSMmavfM26AULWw0qsEWO15wHU/view?usp=drive_link",
		order: 5
	},
	{
		name: "Artificial Intelligence Training",
		issuer: "Excellence Training Center",
		date: "Mar 30, 2024",
		type: "formation",
		description: "AI fundamentals training program",
		link: "https://drive.google.com/file/d/1i2lOHBoh5IK4S4aQcW_aN6QBftWIi-1h/view?usp=drive_link",
		order: 6
	},
	{
		name: "C++ Certified Associate Programmer Training",
		issuer: "CFT-Tunis",
		date: "2023",
		type: "formation",
		description: "C++ programming training certification",
		link: "https://drive.google.com/file/d/1iE4LDTA1FFmqlf9jJu8GoJTueYV0Q3DJ/view?usp=drive_link",
		order: 7
	},
	{
		name: "Angular & Spring Boot Training",
		issuer: "Gust Training",
		date: "Dec 29, 2023",
		type: "formation",
		description: "Full-stack development training with Angular and Spring Boot",
		link: "https://drive.google.com/file/d/1DhvJ42mbFQkTZNWgjyvp2hLQ1c8oMR8Z/view?usp=drive_link",
		order: 8
	}
];

export const migrateCertificationsData = async () => {
	console.log("Starting certifications migration...");
	
	try {
		// Clear existing certifications
		const certsRef = collection(db, "certifications");
		const certsSnap = await getDocs(certsRef);
		for (const doc of certsSnap.docs) {
			await deleteDoc(doc.ref);
		}
		console.log("Cleared existing certifications");

		// Add new certifications
		for (const cert of certifications) {
			await addDoc(collection(db, "certifications"), cert);
			console.log(`Added certification: ${cert.name}`);
		}
		console.log(`Added ${certifications.length} certifications`);

		// Clear existing achievements
		const achievementsRef = collection(db, "achievements");
		const achievementsSnap = await getDocs(achievementsRef);
		for (const doc of achievementsSnap.docs) {
			await deleteDoc(doc.ref);
		}
		console.log("Cleared existing achievements");

		// Add new achievements
		for (const achievement of achievements) {
			await addDoc(collection(db, "achievements"), achievement);
			console.log(`Added achievement: ${achievement.name}`);
		}
		console.log(`Added ${achievements.length} achievements`);

		console.log("Migration complete!");
		return { success: true, certifications: certifications.length, achievements: achievements.length };
	} catch (error) {
		console.error("Migration failed:", error);
		return { success: false, error };
	}
};

export default migrateCertificationsData;
