// /api/generate.js 
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
    }

    try {
        const { userMessage, styleInstruction } = request.body;
        const userApiKey = request.headers['x-gemini-api-key'];
        
        if (!userApiKey) {
            return response.status(401).json({ error: "API key is required." });
        }

        // 2026年3月時点の最新メインラインモデルにアップデート
        const MODEL_ID = "gemini-3.0-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${userApiKey}`;

        const geminiPayload = {
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
            system_instruction: { parts: [{ text: styleInstruction || "" }] },
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 4096 // 3.0の性能を活かすための拡張
            }
        };

        // Node.js標準のfetch（node-fetch不要）
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
        });
        
        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            return response.status(geminiResponse.status).json({ error: errorBody.error?.message || "API Error" });
        }

        const geminiResult = await geminiResponse.json();
        const botText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No text generated.";

        response.status(200).json({ text: botText });

    } catch (error) {
        console.error("Serverless Function Error:", error);
        response.status(500).json({ error: "Service Error" });
    }
}
