## 🤖 Modern Persona Chatbot (Chotto Bot)

This project is a dynamic, multi-persona chat application showcasing the **Gemini API** for advanced character generation, built using a simple, secure architecture.

### ⚠️ Ownership and Copyright

This code is provided primarily as a demonstration of a secure, serverless application architecture using the Gemini API. While the code is publicly viewable, unauthorized commercial use or large-scale publication is restricted.

### 🔑 Key Features & Security Architecture

* **Multi-Persona Engine:** Features 8 super unique, dynamic Japanese character styles (おっさん, 厨二, 猫, ワカメ, etc.) with unique personalities and response rules defined by system prompts.
* **Secure API Key Management (Crucial):** The application strictly uses a **Serverless Proxy Function** to protect the **Gemini API key**. The key is **never** exposed in the client-side code, ensuring credentials are safe.
* **Google Search Grounding:** All AI conversations leverage the built-in Google Search tool for factual grounding and real-time information retrieval when needed.
* **Technology Stack:** Pure **HTML**, **Vanilla JavaScript**, and **Tailwind CSS** (via CDN) for a lightweight, single-page experience.

***

## ⚙️ Architecture: How the Key Stays Secret

The project's architecture separates the public front-end from your secret API key by using a Serverless Function (like Vercel or Netlify's edge functions).

1.  **Client-Side (`chottobot.html`):** This file contains **no API key**. It sends the user's message and the persona prompt via a `POST` request to a local endpoint: `/api/generate`.
2.  **Serverless Proxy (`api/generate.js`):** This file runs exclusively on the hosting server. It securely reads the **hidden `GEMINI_API_KEY`** from the server's environment variables and makes the actual, authenticated call to the Gemini API.
3.  **Security:** Your key is protected as it is **never** sent to the user's browser or committed to the public GitHub repository. 

***
