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

// Prompt Registry
const PROMPT_REGISTRY = {
    askVirgile: {
        name: 'Initial Analysis & Cognitive Framing',
        description: 'Used when a user first asks a question. Analyzes the question and generates discernment key sections.',
        variables: ['profile', 'lang'],
        defaultTemplate: `RÔLE
Tu agis comme un module d'analyse préalable et de cadrage cognitif.
Ton objectif n'est PAS de répondre à la question, mais de préparer les conditions d'une réponse de très haute qualité.
Profil utilisateur : {{profile}}. Adapte ton analyse et tes suggestions à ce profil.

PRINCIPES FONDAMENTAUX
- Tu ne réponds jamais directement à la question initiale.
- Tu aides à clarifier le contexte, le profil et les angles pertinents.
- Tu privilégies le discernement, la précision et la déconstruction intelligente.
- Tu n'exposes jamais ton rôle, ton identité ou ta mission dans la sortie.
- Tu produis exclusivement un objet JSON strict, sans texte hors JSON.

OBJECTIF DE CETTE ÉTAPE
1. Identifier la nature profonde de la question posée.
2. Déterminer les dimensions de profil utilisateur nécessaires.
3. Identifier les angles d'analyse possibles.
4. Préparer un cadrage qui permette une réponse ciblée, non consensuelle et pertinente.

PROTOCOLE — ÉTAPE 1 : ANALYSE INITIALE & PROFILAGE

A. Analyse de la question
- Détermine le ou les types dominants de la question.
- Identifie les ambiguïtés, implicites ou risques de mauvaise interprétation.
- Évalue le niveau de complexité attendu.

B. Définition des clés de discernement
- Quelles informations sur l'utilisateur sont nécessaires pour répondre correctement ?
- Quels choix d'angle influencent fortement la qualité de la réponse ?
- Quels paramètres peuvent modifier le ton, la profondeur ou la forme ?

C. Construction du formulaire de clarification
- Tu dois produire AU MINIMUM 5 sections distinctes pour couvrir 5 colonnes d'affichage.
- Chaque section contient un titre clair et une liste d'options courtes.
- Les sections doivent être pertinentes (Profilage, Angle, Style, Contexte, Objectif, etc.).

FORMAT DE SORTIE — STRICTEMENT JSON
{
  "analysis": "Analyse fonctionnelle et concise...",
  "sections": [
    {
      "title": "Nom de la catégorie",
      "options": ["Option 1", "Option 2", "Option 3"]
    }
    // ... au moins 5 sections
  ]
}

Langue de sortie : {{lang}}`
    },
    submitFilters: {
        name: 'Virgile Response with Filters',
        description: 'Used when the user submits their selected discernment filters. Generates the main Virgile response.',
        variables: ['profile', 'lang'],
        defaultTemplate: `Tu es Virgile. Ta mission est de répondre en appliquant strictement les filtres choisis par l'utilisateur (sans les lister).
La réponse doit être honnête, bousculer les idées reçues et encourager la réflexion profonde.
Profil utilisateur : {{profile}}.

Si l'utilisateur poursuit la discussion, conserve en mémoire ses choix mais analyse sa réaction et sauf changement de sujet, ne lui propose plus d'effectuer de nouveaux choix. Conserve, le style et le ton adopté. Continue tes réponses avec la même vigilance.

SOURCES ET LIENS : À la fin de ta réponse, ajoute toujours une section "Sources" avec des liens cliquables pertinents en format markdown. Par exemple :
- Pour un film/série : liens vers les plateformes de streaming où le regarder (Netflix, Amazon Prime, Disney+, etc.) ou vers la page IMDB/AlloCiné.
- Pour un restaurant/lieu : lien vers Google Maps, le site officiel, ou TripAdvisor.
- Pour un livre : lien vers la page de l'éditeur, Amazon, ou Fnac.
- Pour tout autre sujet : liens vers les sources d'information fiables utilisées.
Fournis des liens réels et vérifiables. Utilise le format markdown [texte](url).

Langue : {{lang}}.`
    },
    standard: {
        name: 'Generic AI Response',
        description: 'Used to generate the standard/comparison AI response without any Virgile personalization.',
        variables: ['lang'],
        defaultTemplate: `Tu es un assistant IA générique. Réponds à la question de manière directe et classique, sans aucune personnalisation. Langue : {{lang}}.`
    },
    followUpCheck: {
        name: 'Follow-Up Context Check',
        description: 'Used to check if a follow-up question is related to the ongoing conversation context.',
        variables: ['context', 'newQ', 'lang'],
        defaultTemplate: `CONTEXTE PRÉCÉDENT : {{context}}
NOUVELLE QUESTION : "{{newQ}}"

Est-ce que la nouvelle question est une suite logique ou liée au même thème ?
Réponds OUI ou NON. Si NON, traduis ce message dans la langue {{lang}} :
"Désolé, mais cette requête est sans rapport avec la précédente, il faut donc la poser en première page du site pour une nouvelle génération de clés de discernement. Veuillez cliquez sur le logo du menu supérieur."`
    },
    followUpGen: {
        name: 'Follow-Up Generation',
        description: 'Used to generate a follow-up response continuing the conversation with the same style and filters.',
        variables: ['profile', 'lang'],
        defaultTemplate: `Tu es Virgile. Ta mission est de poursuivre la discussion en conservant le style, le ton et les filtres initiaux.
Ta réponse doit rester honnête, bousculer les idées reçues et encourager la réflexion profonde.
Profil utilisateur : {{profile}}.

Conserve la même vigilance que dans tes réponses précédentes. Si l'utilisateur change de sujet, rappelle-lui gentiment que Virgile est là pour approfondir le discernement sur le thème initial.

SOURCES ET LIENS : À la fin de ta réponse, ajoute toujours une section "Sources" avec des liens cliquables pertinents en format markdown. Par exemple :
- Pour un film/série : liens vers les plateformes de streaming où le regarder (Netflix, Amazon Prime, Disney+, etc.) ou vers la page IMDB/AlloCiné.
- Pour un restaurant/lieu : lien vers Google Maps, le site officiel, ou TripAdvisor.
- Pour un livre : lien vers la page de l'éditeur, Amazon, ou Fnac.
- Pour tout autre sujet : liens vers les sources d'information fiables utilisées.
Fournis des liens réels et vérifiables. Utilise le format markdown [texte](url).

Langue : {{lang}}.`
    }
};

// Interpolation helpers
const interpolate = (template, vars) =>
    template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] !== undefined ? vars[key] : `{{${key}}}`);

const getPromptTemplate = async (env, key) => {
    if (env.PROMPTS) {
        const override = await env.PROMPTS.get(`prompt:${key}`);
        if (override !== null) return override;
    }
    return PROMPT_REGISTRY[key].defaultTemplate;
};

// Prompt functions (async, KV-backed)
const getAskVirgilePrompt = async (env, profile, lang) => {
    const template = await getPromptTemplate(env, 'askVirgile');
    return interpolate(template, { profile, lang });
};

const getSubmitFiltersPrompt = async (env, profile, lang) => {
    const template = await getPromptTemplate(env, 'submitFilters');
    return interpolate(template, { profile, lang });
};

const getStandardPrompt = async (env, lang) => {
    const template = await getPromptTemplate(env, 'standard');
    return interpolate(template, { lang });
};

const getFollowUpCheckPrompt = async (env, context, newQ, lang) => {
    const template = await getPromptTemplate(env, 'followUpCheck');
    return interpolate(template, { context, newQ, lang });
};

const getFollowUpGenPrompt = async (env, profile, lang) => {
    const template = await getPromptTemplate(env, 'followUpGen');
    return interpolate(template, { profile, lang });
};

const app = new Hono();
app.use('*', cors());

app.post('/api/ask', async (c) => {
    try {
        const { question, profile, language, provider, apiKey } = await c.req.json();
        const systemPrompt = await getAskVirgilePrompt(c.env, profile, language);
        const response = await callAI(provider, apiKey, systemPrompt, `Question: "${question}"`);
        return c.json({ success: true, data: response });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.post('/api/filters', async (c) => {
    try {
        const { question, profile, language, provider, apiKey, filters, precision } = await c.req.json();

        // Virgile response: full context with filters and profile
        const virgilePrompt = await getSubmitFiltersPrompt(c.env, profile, language);
        const virgileMessage = `Question: "${question}"\nFiltres: ${filters.join(', ')}\nPrécision: "${precision}"`;

        // Standard response: raw question only, no filters/profile/context
        const standardPrompt = await getStandardPrompt(c.env, language);
        const standardMessage = `Question: "${question}"`;

        // Run both calls in parallel
        const [virgileResponse, standardResponse] = await Promise.all([
            callAI(provider, apiKey, virgilePrompt, virgileMessage),
            callAI(provider, apiKey, standardPrompt, standardMessage)
        ]);

        return c.json({ success: true, data: { virgile: virgileResponse, standard: standardResponse } });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.post('/api/followup', async (c) => {
    try {
        const { followUp, context, question, filters, precision, virgileResponse, followUpHistory, profile, language, provider, apiKey } = await c.req.json();

        // 1. Check Context
        const checkPrompt = await getFollowUpCheckPrompt(c.env, context, followUp, language);
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

        // 2. Generate — include full conversation history
        const genPrompt = await getFollowUpGenPrompt(c.env, profile, language);

        let conversationContext = `Question initiale : "${question}"\nFiltres : ${filters ? filters.join(', ') : 'aucun'}\nPrécision : "${precision || ''}"\n\nRéponse de Virgile :\n${virgileResponse || ''}`;

        if (followUpHistory && followUpHistory.length > 0) {
            conversationContext += '\n\nHistorique de la discussion :';
            for (const entry of followUpHistory) {
                conversationContext += `\nUtilisateur : ${entry.user}\nVirgile : ${entry.ai}`;
            }
        }

        conversationContext += `\n\nNouvelle question de l'utilisateur : "${followUp}"`;

        const response = await callAI(provider, apiKey, genPrompt, conversationContext);
        return c.json({ success: true, data: { rejected: false, response } });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

// Prompt Editor API routes

app.get('/api/prompts', async (c) => {
    try {
        const prompts = {};
        for (const [key, meta] of Object.entries(PROMPT_REGISTRY)) {
            let currentTemplate = meta.defaultTemplate;
            let isOverridden = false;
            if (c.env.PROMPTS) {
                const override = await c.env.PROMPTS.get(`prompt:${key}`);
                if (override !== null) {
                    currentTemplate = override;
                    isOverridden = true;
                }
            }
            prompts[key] = {
                name: meta.name,
                description: meta.description,
                variables: meta.variables,
                defaultTemplate: meta.defaultTemplate,
                currentTemplate,
                isOverridden
            };
        }
        return c.json({ success: true, data: prompts });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.put('/api/prompts', async (c) => {
    try {
        const { prompts } = await c.req.json();
        if (!prompts || typeof prompts !== 'object') {
            return c.json({ success: false, error: 'Invalid payload' }, 400);
        }
        if (!c.env.PROMPTS) {
            return c.json({ success: false, error: 'KV not available' }, 500);
        }
        for (const [key, template] of Object.entries(prompts)) {
            if (!PROMPT_REGISTRY[key]) continue;
            await c.env.PROMPTS.put(`prompt:${key}`, template);
        }
        return c.json({ success: true });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.put('/api/prompts/:key', async (c) => {
    try {
        const key = c.req.param('key');
        if (!PROMPT_REGISTRY[key]) {
            return c.json({ success: false, error: 'Unknown prompt key' }, 404);
        }
        const { template } = await c.req.json();
        if (typeof template !== 'string') {
            return c.json({ success: false, error: 'Invalid template' }, 400);
        }
        if (!c.env.PROMPTS) {
            return c.json({ success: false, error: 'KV not available' }, 500);
        }
        await c.env.PROMPTS.put(`prompt:${key}`, template);
        return c.json({ success: true });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.post('/api/prompts/reset', async (c) => {
    try {
        if (!c.env.PROMPTS) {
            return c.json({ success: false, error: 'KV not available' }, 500);
        }
        for (const key of Object.keys(PROMPT_REGISTRY)) {
            await c.env.PROMPTS.delete(`prompt:${key}`);
        }
        return c.json({ success: true });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default app;
