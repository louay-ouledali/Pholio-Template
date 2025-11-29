import { db } from "../firebase";
import { doc, writeBatch } from "firebase/firestore";
import INFO from "../data/user";

export const restoreDefaultProjects = async () => {
	console.log("Starting restoration of default projects...");
	const batch = writeBatch(db);

	try {
		INFO.projects.forEach((project, index) => {
			// Create a unique ID based on title
			const projectId = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
			const projectRef = doc(db, "projects", projectId);
			
			batch.set(projectRef, {
				...project,
				order: index + 1, // Ensure order is preserved
				isDefault: true // Mark as default for easier management
			});
			console.log(`Prepared restore for: ${project.title}`);
		});

		await batch.commit();
		console.log("Restoration complete!");
		return true;
	} catch (error) {
		console.error("Restoration failed:", error);
		throw error;
	}
};
