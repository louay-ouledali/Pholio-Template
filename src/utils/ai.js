import { GoogleGenerativeAI } from "@google/generative-ai";

// You can store this in Firebase or local storage
const getGoogleAIKey = () => localStorage.getItem("google_ai_key");

export const generateProjectDescription = async (repoData) => {
	const apiKey = getGoogleAIKey();
	
	if (!apiKey) {
		throw new Error("Google AI API Key not found. Please set it in the dashboard.");
	}

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const prompt = `
		You are an expert portfolio manager and technical writer.
		Analyze the following GitHub repository information and generate a professional portfolio project entry.
		
		Repo Name: ${repoData.name}
		Languages: ${repoData.languages.join(", ")}
		README:
		${repoData.readme.substring(0, 8000)} // Truncate to avoid token limits

		Task:
		1. Create a catchy, professional title based on the repo name.
		2. Write a short 2-sentence summary for a project card.
		3. Write a detailed 3-paragraph description for a modal. Highlight the problem solved, key features, and technical implementation.
		4. List the key technologies used (e.g., React, Node.js, Python).
		5. Provide the link text as "View Source".

		Output strictly in valid JSON format with no markdown code blocks:
		{
			"title": "Title Here",
			"description": "Short summary here.",
			"longDescription": "Detailed description here.",
			"technologies": ["Tech1", "Tech2"],
			"linkText": "View Source",
			"link": "${repoData.html_url}"
		}
	`;

	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		// Clean up markdown code blocks if present
		const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

		try {
			return JSON.parse(cleanText);
		} catch (e) {
			console.error("Failed to parse JSON:", cleanText);
			throw new Error("Failed to parse AI response");
		}

	} catch (error) {
		console.error("AI Generation Error:", error);
		throw error;
	}
};
