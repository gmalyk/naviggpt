import express from 'express';
import { callAI } from '../services/dispatcher.js';
import { getAskNavigGPTPrompt } from '../prompts/askNavigGPT.js';
import { getSubmitFiltersPrompt, getStandardPrompt } from '../prompts/submitFilters.js';
import { getFollowUpCheckPrompt, getFollowUpGenPrompt } from '../prompts/followUp.js';

const router = express.Router();

// POST /api/ask - Initial analysis stage
router.post('/ask', async (req, res) => {
    const { question, profile, faith, values, language, provider, apiKey, filterCount } = req.body;

    try {
        const systemPrompt = getAskNavigGPTPrompt(profile, faith, values, language, filterCount);
        let response = await callAI(provider, apiKey, systemPrompt, `Question: "${question}"`);

        // Server-side safety net: filter out any age-related sections
        // that the LLM may have generated despite prompt instructions
        try {
            const parsed = JSON.parse(response);
            if (parsed.sections && Array.isArray(parsed.sections)) {
                const ageKeywords = [
                    'age', 'âge', "tranche d'âge", 'profil générationnel',
                    'scolaire', 'niveau scolaire', 'age group', 'school level',
                    'edad', 'nivel escolar', 'età', 'alter',
                    'возраст', '年龄', 'العمر', 'उम्र'
                ];
                parsed.sections = parsed.sections.filter(section => {
                    const title = (section.title || '').toLowerCase();
                    return !ageKeywords.some(kw => title.includes(kw.toLowerCase()));
                });
                response = JSON.stringify(parsed);
            }
        } catch (_e) {
            // If response isn't valid JSON, pass through as-is
        }

        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/filters - Result generation stage
router.post('/filters', async (req, res) => {
    const { question, profile, faith, values, language, provider, apiKey, filters, precision, useWebSearch } = req.body;

    try {
        // NavigGPT response: full context with filters, profile, faith, values, precision
        const naviggptPrompt = getSubmitFiltersPrompt(profile, faith, values, language, useWebSearch);
        const naviggptMessage = `Question: "${question}"\nFiltres: ${filters.join(', ')}\nPrécision: "${precision}"`;

        // Standard response: raw question only, no filters/profile/context
        const standardPrompt = getStandardPrompt(language);
        const standardMessage = `Question: "${question}"`;

        // Run both calls in parallel
        const webSearchOption = useWebSearch !== false;
        const [naviggptResponse, standardResponse] = await Promise.all([
            callAI(provider, apiKey, naviggptPrompt, naviggptMessage, { useWebSearch: webSearchOption }),
            callAI(provider, apiKey, standardPrompt, standardMessage, { useWebSearch: webSearchOption })
        ]);

        res.json({ success: true, data: { naviggpt: naviggptResponse, standard: standardResponse } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/followup - Follow-up chat stage
router.post('/followup', async (req, res) => {
    const { followUp, context, question, filters, precision, naviggptResponse, followUpHistory, profile, faith, values, language, provider, apiKey, useWebSearch } = req.body;

    try {
        // Stage 3a: Context Check
        const checkPrompt = getFollowUpCheckPrompt(context, followUp, language);
        const checkResponse = await callAI(provider, apiKey, "Tu es un vérificateur de contexte.", checkPrompt);

        if (checkResponse.toUpperCase().includes("NON")) {
            return res.json({ success: true, data: { rejected: true, message: checkResponse } });
        }

        // Stage 3b: Generation — include full conversation history
        const genPrompt = getFollowUpGenPrompt(profile, faith, values, language, useWebSearch !== false);

        let conversationContext = `Question initiale : "${question}"\nFiltres : ${filters ? filters.join(', ') : 'aucun'}\nPrécision : "${precision || ''}"\n\nRéponse de NavigGPT :\n${naviggptResponse || ''}`;

        if (followUpHistory && followUpHistory.length > 0) {
            conversationContext += '\n\nHistorique de la discussion :';
            for (const entry of followUpHistory) {
                conversationContext += `\nUtilisateur : ${entry.user}\nNavigGPT : ${entry.ai}`;
            }
        }

        conversationContext += `\n\nNouvelle question de l'utilisateur : "${followUp}"`;

        const response = await callAI(provider, apiKey, genPrompt, conversationContext, { useWebSearch: useWebSearch !== false });

        res.json({ success: true, data: { rejected: false, response } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
