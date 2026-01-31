import { Hono } from 'hono';
import { cors } from 'hono/cors';

// AI Providers
const callOpenAI = async (apiKey, systemPrompt, userMessage) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.7
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || 'OpenAI API Error');
    return data.choices[0].message.content;
};

const callGemini = async (apiKey, systemPrompt, userMessage) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
            }]
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || 'Gemini API Error');
    return data.candidates[0].content.parts[0].text;
};

const callAI = async (provider, apiKey, systemPrompt, userMessage) => {
    if (provider === 'openai') return await callOpenAI(apiKey, systemPrompt, userMessage);
    if (provider === 'gemini') return await callGemini(apiKey, systemPrompt, userMessage);
    throw new Error(`Unsupported AI provider: ${provider}`);
};

// Prompts
const getAskVirgilePrompt = (profile, lang) => `RÔLE
Tu agis comme un module d’analyse préalable et de cadrage cognitif.
Profil utilisateur sélectionné : ${profile}. Adapte le niveau de langage à ce profil.
Ton objectif n’est PAS de répondre à la question, mais de préparer les conditions d’une réponse de très haute qualité.

PRINCIPES FONDAMENTAUX
- Tu ne réponds jamais directement à la question initiale.
- Tu aides à clarifier le contexte, le profil et les angles pertinents.
- Tu privilégies le discernement, la précision et la deconstruction intelligente.
- Tu n’exposes jamais ton rôle, ton identité ou ta mission dans la sortie.
- Tu produis exclusivement un objet JSON strict, sans texte hors JSON.

OBJECTIF DE CETTE ÉTAPE
1. Identifier la nature profonde de la question posée.
2. Déterminer les dimensions de profil utilisateur nécessaires.
3. Identifier les angles d’analyse possibles.
4. Préparer un cadrage qui permette une réponse ciblée, non consensuelle et pertinente.

PROTOCOLE — ÉTAPE 1 : ANALYSE INITIALE & PROFILAGE
{
  "analysis": "Analyse fonctionnelle et concise...",
  "sections": [
    { "title": "Catégorie 1", "options": ["Op1", "Op2"] }
  ]
}
Langue : ${lang}`;

const getSubmitFiltersPrompt = (profile, lang) => `Tu es Virgile. Profil utilisateur : ${profile}.
Mission : Répondre en appliquant strictement les filtres choisis (sans les lister).
Réponse honnête, bousculant les idées reçues, encourageant la réflexion.
Format attendu :
[VIRGILE_START]
... réponse ...
[SEPARATOR]
... réponse standard AI ...
[END]
Langue : ${lang}`;

const app = new Hono();
app.use('*', cors());

app.post('/api/ask', async (c) => {
    try {
        const { question, profile, language, provider, apiKey } = await c.req.json();
        const systemPrompt = getAskVirgilePrompt(profile, language);
        const response = await callAI(provider, apiKey, systemPrompt, `Question: "${question}"`);
        return c.json({ success: true, data: response });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.post('/api/filters', async (c) => {
    try {
        const { question, profile, language, provider, apiKey, filters, precision } = await c.req.json();
        const systemPrompt = getSubmitFiltersPrompt(profile, language);
        const userMessage = `Question: "${question}"\nFiltres: ${filters.join(', ')}\nPrécision: "${precision}"`;
        const response = await callAI(provider, apiKey, systemPrompt, userMessage);
        return c.json({ success: true, data: response });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default app;
