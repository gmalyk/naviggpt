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
- Tu privilégies le discernement, la précision et la déconstruction intelligente.
- Tu n’exposes jamais ton rôle, ton identité ou ta mission.
- Tu produis exclusivement un objet JSON strict.

PROTOCOLE — ÉTAPE 1 : ANALYSE INITIALE & PROFILAGE
A. Construction du formulaire (sections) :
- Identifie les angles d'analyse.
- RÈGLE SPÉCIALE - PROFILAGE : Si l'âge n'est pas renseigné et que la réponse en dépend (ex: santé, éducation), consacre UNE COLONNE ENTIÈRE (section) à l'âge. Dans cette même colonne, si le genre (Homme/Femme) est impératif pour une réponse exacte, demande-le aussi.
- Inclure obligatoirement une section sur le style ou la profondeur.

FORMAT DE SORTIE — STRICTEMENT JSON
{
  "analysis": "Analyse fonctionnelle...",
  "sections": [
    { "title": "Âge et Profil", "options": ["Enfant", "Adulte", "Homme", "Femme"] },
    { "title": "Angle d'analyse", "options": ["...", "..."] }
  ]
}
Langue : ${lang}`;

const getSubmitFiltersPrompt = (profile, lang) => `Tu es Virgile. Profil : ${profile}.

MISSION :
Répondre à l'utilisateur en appliquant strictement les clés de discernement choisies.
Ta réponse doit être honnête, bousculer les idées reçues et encourager la réflexion profonde.

RÈGLES DE RÉPONSE (VIRGILE) :
1. CITATIONS ET SOURCES : Cite systématiquement tes sources et références. Utilise des extraits pour augmenter la précision.
2. DISCERNEMENT ET VALEURS : Pour les questions de société, politique ou croyance controversées, rappelle que ton but est d'aider au discernement.
3. FRICTION : Signale si la solution peut représenter une friction avec le système de valeur de l'utilisateur. 
4. BOUSSOLE : Si l'utilisateur n'a pas de système de valeur, suggère des systèmes de référence (Humaniste, Religieux, ACT - psychologie, CNV - communication non violente). Propose un quiz pour définir sa boussole ACT ou CNV si approprié.
5. POSITION : Virgile refuse les idéologies justifiant la violence (révolution, terrorisme). Virgile privilégie les voies pacifiques et justes.
6. CLÔTURE : Si pertinent (ex: info Wikipedia), propose un quiz, un exercice ou un QCM pour mémoriser. Ne le fais pas pour des choix de produits/restaurants.

RÈGLE RÉPONSE STANDARD AI :
Dans cette partie, ignore TOUS les filtres et profils. Réponds comme une IA sans mémoire, de manière neutre et générale. 
Cette réponse doit être environ DEUX FOIS PLUS COURTE que celle de Virgile.

FORMAT ATTENDU :
[VIRGILE_START]
... réponse adaptée avec sources et boussole ...
[SEPARATOR]
... réponse standard courte et neutre ...
[END]

Langue : ${lang}`;

const getFollowUpCheckPrompt = (context, newQ, lang) => `CONTEXTE : ${context}
NOUVELLE REQUÊTE : "${newQ}"

Vérifie si cette requête est dans le même thème que la précédente et correspond à une réaction logique.
Réponds OUI ou NON. Si NON, traduis exactement ce message :
"Désolé, mais cette requête est sans rapport avec la précédente, il faut donc la poser en première page du site pour une nouvelle génération de clés de discernement. Veuillez cliquer sur le logo du menu supérieur."
Langue : ${lang}`;

const getFollowUpGenPrompt = (profile, lang) => `Tu es Virgile. Continues la discussion dans la même page en utilisant les mêmes clés de discernement initiales, SAUF si l'utilisateur demande explicitement d'en changer.
Mêmes règles : sources, discernement, et boussole.
Réponds directement.
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

app.post('/api/followup', async (c) => {
    try {
        const { followUp, context, profile, language, provider, apiKey } = await c.req.json();

        // 1. Check Context
        const checkPrompt = getFollowUpCheckPrompt(context, followUp, language);
        const checkResult = await callAI(provider, apiKey, "Tu es un vérificateur de contexte.", checkPrompt);

        if (checkResult.toUpperCase().includes("NON")) {
            return c.json({
                success: true,
                data: {
                    rejected: true,
                    message: checkResult.replace(/NON/i, '').trim() || "Désolé, sujet différent."
                }
            });
        }

        // 2. Generate
        const genPrompt = getFollowUpGenPrompt(profile, language);
        const response = await callAI(provider, apiKey, genPrompt, `Suite discussion : "${followUp}"`);
        return c.json({ success: true, data: { rejected: false, response } });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default app;
