// /api/generate.js 
// This code runs on the hosting server, NOT the user's browser.
// It is the secure middleman for your application.

import fetch from 'node-fetch';

// This is where the hosting service securely injects the key 
// from your dashboard settings (GEMINI_API_KEY).
const API_KEY = process.env.GEMINI_API_KEY; 

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

export default async function handler(request, response) {
    // Basic security check: only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
    }

    try {
        // 1. Extract the data sent from your index.html
        // We get the user's message and the secret persona prompt.
        const { userMessage, styleInstruction } = request.body;
        
        // 2. Build the full payload for the official Gemini API endpoint
        const geminiPayload = {
            contents: [{ parts: [{ text: userMessage }] }],
            systemInstruction: { parts: [{ text: styleInstruction }] },
            config: { 
                temperature: 0.8 
            },
            // Enable Google Search grounding for factual accuracy
            tools: [{ googleSearch: {} }] 
        };

        // 3. Make the SECURE call to the Gemini API
        const geminiResponse = await fetch(
            API_URL,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
            }
        );
        
        // Handle Gemini API errors (e.g., key expired, bad request)
        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            throw new Error(`Gemini API Error: ${geminiResponse.status} - ${errorBody}`);
        }

        const geminiResult = await geminiResponse.json();
        
        // 4. Extract the clean text response
        const botText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Failed to extract response text from AI.";

        // 5. Send the result back to the user's browser
        response.status(200).json({ text: botText });

    } catch (error) {
        console.error("Serverless Function Error:", error);
        // Send a generic 500 error back to the client
        response.status(500).json({ error: "Service Error: Failed to generate character response." });
    }
}