const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Clients
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build"
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

const SYSTEM_PROMPT = (context) => `
You are the AI Assistant for **Mohamed Louay Ouled Ali's Portfolio**.
Your goal is to answer questions about Louay based strictly on the context provided below.

**Tone:** Professional, enthusiastic, and concise.
**Role:** Act as a representative of Louay. Use "he" or "Louay" when referring to him, or "I" if you want to be playful (but clarify you are his AI).

**Context Data:**
${JSON.stringify(context, null, 2)}

**Rules:**
1. If the answer is not in the context, say: "I don't have that information in my current database, but I can tell you about his projects or skills!"
2. Keep answers short (under 3-4 sentences) unless asked for details.
3. If asked about contact info, provide his email or LinkedIn from the context.
4. Do not hallucinate skills he doesn't have.
`;

async function generateResponse(userMessage, history, context) {
    // Strategy: Try Groq (Llama 3) first because it's fast. Fallback to Gemini if Groq fails or key is missing.

    let groqError = null;

    // 1. Try Groq
    if (process.env.GROQ_API_KEY) {
        try {
            return await callGroq(userMessage, history, context);
        } catch (error) {
            console.error("Groq API Error:", error);
            groqError = error;
            // Fallthrough to Gemini
        }
    }

    // 2. Try Gemini (Fallback)
    if (process.env.GEMINI_API_KEY) {
        try {
            return await callGemini(userMessage, history, context);
        } catch (error) {
            console.error("Gemini API Error:", error);
            if (groqError) {
                return "I'm having trouble connecting to my brain right now (Both AI services failed). Please try again later.";
            }
            return "I'm currently experiencing technical difficulties. Please try again later.";
        }
    }

    // 3. No Keys or Both Failed
    if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
        return "I'm currently offline (API Keys missing). Please contact Louay directly!";
    }

    return "I encountered a temporary glitch. Please try again.";
}

async function callGroq(message, history, context) {
    const messages = [
        { role: "system", content: SYSTEM_PROMPT(context) },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
        messages: messages,
        // Groq deprecated llama3-70b-8192, so we pin to the supported successor.
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "No response generated.";
}

async function callGemini(message, history, context) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Gemini handles history differently, simplified here for single turn + context
    const prompt = `${SYSTEM_PROMPT(context)}\n\nUser Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

module.exports = { generateResponse };
