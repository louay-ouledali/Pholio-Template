import axios from "axios";

export const fetchGitHubRepos = async (username) => {
	try {
		// Extract username from URL if full URL is provided
		const user = username.split("/").pop();
		const response = await axios.get(`https://api.github.com/users/${user}/repos?sort=created&direction=desc`);
		return response.data;
	} catch (error) {
		console.error("Error fetching GitHub repos:", error);
		return [];
	}
};

export const fetchRepoDetails = async (username, repoName) => {
	try {
		const user = username.split("/").pop();
		
		// 1. Check if repo exists and get languages
		let languages = [];
		try {
			const languagesRes = await axios.get(`https://api.github.com/repos/${user}/${repoName}/languages`);
			languages = Object.keys(languagesRes.data);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				throw new Error(`Repository "${user}/${repoName}" not found.`);
			}
			throw error;
		}

		// 2. Try to get README (might not exist)
		let readmeContent = "No README available.";
		try {
			const readmeRes = await axios.get(`https://api.github.com/repos/${user}/${repoName}/readme`);
			// GitHub API returns base64 with newlines, which atob might dislike
			const cleanContent = readmeRes.data.content.replace(/\n/g, "");
			readmeContent = atob(cleanContent);
		} catch (error) {
			console.warn("README not found or could not be decoded:", error);
		}
		
		return {
			readme: readmeContent,
			languages: languages
		};
	} catch (error) {
		console.error("Error fetching repo details:", error);
		if (error.response && error.response.status === 403) {
			throw new Error("GitHub API rate limit exceeded. Please try again later.");
		}
		throw error;
	}
};
