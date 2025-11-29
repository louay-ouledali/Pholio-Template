const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Clients using Firebase config
const groq = new Groq({
    apiKey: functions.config().groq?.api_key || process.env.GROQ_API_KEY || ""
});

const genAI = new GoogleGenerativeAI(
    functions.config().gemini?.api_key || process.env.GEMINI_API_KEY || ""
);

// Static context for the AI
const STATIC_CONTEXT = {
    name: "Mohamed Louay Ouled Ali",
    title: "Backend Developer & AI Automation Engineer",
    location: "Tunis, Tunisia",
    email: "Ouledalilouay3@gmail.com",
    socials: {
        github: "https://github.com/louay-ouledali",
        linkedin: "https://www.linkedin.com/in/louay-ouledali-250936394"
    },
    about: "Computer Engineering student at ISTIC, University of Carthage, specializing in backend development, data engineering, and AI‑powered automation. Expected graduation May 2026.",
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
            description: "Unified AI‑powered platform for managing heterogeneous databases with AI log analysis using Mistral 7B.",
            technologies: ["Spring Boot", "Angular", "Docker", "Python", "Mistral 7B", "RabbitMQ", "Redis"]
        },
        {
            title: "Modern React Portfolio (Pholio)",
            description: "Cloud-ready portfolio with AI chat integration, admin dashboard, and Firebase backend.",
            technologies: ["React", "Firebase", "Cloud Functions", "Groq API", "Cloudinary"]
        },
        {
            title: "DB Router (Upcoming - Jan 2026)",
            description: "Intelligent database rerouting and migration automation platform.",
            technologies: ["Go", "PostgreSQL", "Redis", "Docker", "Kubernetes"]
        },
        {
            title: "SecConfig Auditor (Upcoming - May 2026)",
            description: "Security configuration auditing dashboard against CIS/NIST benchmarks.",
            technologies: ["Python", "FastAPI", "React", "PostgreSQL"]
        }
    ],
    certifications: [
        "IELTS Academic (Band 7.5) - British Council",
        "Certified Ethical Hacker v13 - EC-Council",
        "Microsoft Certified: Power BI Data Analyst Associate (PL-300)",
        "Scrum Master Accredited Certification",
        "Python Entry Level Programmer"
    ]
};

const SYSTEM_PROMPT = (context) => `
You are the AI Assistant for **Mohamed Louay Ouled Ali's Portfolio**.
Your goal is to answer questions about Louay based strictly on the context provided below.

**Tone:** Professional, enthusiastic, and concise.
**Role:** Act as a representative of Louay.

**Context Data:**
${JSON.stringify(context, null, 2)}

**Rules:**
1. If the answer is not in the context, say: "I don't have that information, but I can tell you about his projects or skills!"
2. Keep answers short (under 3-4 sentences) unless asked for details.
3. If asked about contact info, provide his email or LinkedIn from the context.
4. Do not hallucinate skills he doesn't have.
`;

async function callGroq(message, history, context) {
    const messages = [
        { role: "system", content: SYSTEM_PROMPT(context) },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "No response generated.";
}

async function callGemini(message, history, context) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${SYSTEM_PROMPT(context)}\n\nUser Question: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

async function generateResponse(userMessage, history, context) {
    const groqKey = functions.config().groq?.api_key || process.env.GROQ_API_KEY;
    const geminiKey = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;

    // Try Groq first
    if (groqKey) {
        try {
            return await callGroq(userMessage, history, context);
        } catch (error) {
            console.error("Groq API Error:", error);
        }
    }

    // Fallback to Gemini
    if (geminiKey) {
        try {
            return await callGemini(userMessage, history, context);
        } catch (error) {
            console.error("Gemini API Error:", error);
        }
    }

    return "I'm currently offline. Please contact Louay directly at Ouledalilouay3@gmail.com!";
}

// Main API endpoint
exports.api = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        // Handle preflight
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        // Only allow POST for chat
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        // Route handling
        const path = req.path;
        
        if (path === '/chat' || path === '/api/chat') {
            const { message, history } = req.body;

            if (!message) {
                res.status(400).json({ error: "Message is required" });
                return;
            }

            try {
                const response = await generateResponse(message, history || [], STATIC_CONTEXT);
                res.status(200).json({
                    reply: response,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error("Error in chat function:", error);
                res.status(500).json({ error: "Internal Server Error", details: error.message });
            }
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    });
});
