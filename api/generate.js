// /api/generate.js 
import fetch from 'node-fetch';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
    }

    try {
        const { userMessage, styleInstruction } = request.body;
        
        // 1. クライアント側のヘッダーからAPIキーを取得
        const userApiKey = request.headers['x-gemini-api-key'];
        
        if (!userApiKey) {
            return response.status(401).json({ error: "API key is required in 'x-gemini-api-key' header." });
        }

        // 2. 安定版モデルのURLを構築 (モデル名を2.5-flashに更新・2026年3月27日)
        // v1betaエンドポイントはgoogleSearch等の最新機能を使うために維持
        const MODEL_ID = "gemini-2.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${userApiKey}`;

        const geminiPayload = {
            contents: [{ parts: [{ text: userMessage }] }],
            systemInstruction: { parts: [{ text: styleInstruction }] },
            generationConfig: {
                temperature: 0.8
            }
        };

        const geminiResponse = await fetch(
            API_URL,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
            }
        );
        
        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            const errorMessage = errorBody.error?.message || "Gemini API Error";
            return response.status(geminiResponse.status).json({ error: errorMessage });
        }

        const geminiResult = await geminiResponse.json();
        const botText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Failed to extract response text.";

        response.status(200).json({ text: botText });

    } catch (error) {
        console.error("Serverless Function Error:", error);
        response.status(500).json({ error: "Service Error: Failed to generate response." });
    }
}
