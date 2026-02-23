import express from 'express';
import { callAI } from '../services/dispatcher.js';
import { getAskVirgilePrompt } from '../prompts/askVirgile.js';
import { getSubmitFiltersPrompt, getStandardPrompt } from '../prompts/submitFilters.js';
import { getFollowUpCheckPrompt, getFollowUpGenPrompt } from '../prompts/followUp.js';

const router = express.Router();

// POST /api/ask - Initial analysis stage
router.post('/ask', async (req, res) => {
    const { question, profile, faith, values, language, provider, apiKey, filterCount } = req.body;

    try {
        const systemPrompt = getAskVirgilePrompt(profile, faith, values, language, filterCount);
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
    const { question, profile, faith, values, language, provider, apiKey, filters, precision } = req.body;

    try {
        // Virgile response: full context with filters, profile, faith, values, precision
        const virgilePrompt = getSubmitFiltersPrompt(profile, faith, values, language);
        const virgileMessage = `Question: "${question}"\nFiltres: ${filters.join(', ')}\nPrécision: "${precision}"`;

        // Standard response: raw question only, no filters/profile/context
        const standardPrompt = getStandardPrompt(language);
        const standardMessage = `Question: "${question}"`;

        // Run both calls in parallel
        const [virgileResponse, standardResponse] = await Promise.all([
            callAI(provider, apiKey, virgilePrompt, virgileMessage, { useWebSearch: true }),
            callAI(provider, apiKey, standardPrompt, standardMessage, { useWebSearch: true })
        ]);

        res.json({ success: true, data: { virgile: virgileResponse, standard: standardResponse } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/followup - Follow-up chat stage
router.post('/followup', async (req, res) => {
    const { followUp, context, question, filters, precision, virgileResponse, followUpHistory, profile, faith, values, language, provider, apiKey } = req.body;

    try {
        // Stage 3a: Context Check
        const checkPrompt = getFollowUpCheckPrompt(context, followUp, language);
        const checkResponse = await callAI(provider, apiKey, "Tu es un vérificateur de contexte.", checkPrompt);

        if (checkResponse.toUpperCase().includes("NON")) {
            return res.json({ success: true, data: { rejected: true, message: checkResponse } });
        }

        // Stage 3b: Generation — include full conversation history
        const genPrompt = getFollowUpGenPrompt(profile, faith, values, language);

        let conversationContext = `Question initiale : "${question}"\nFiltres : ${filters ? filters.join(', ') : 'aucun'}\nPrécision : "${precision || ''}"\n\nRéponse de Virgile :\n${virgileResponse || ''}`;

        if (followUpHistory && followUpHistory.length > 0) {
            conversationContext += '\n\nHistorique de la discussion :';
            for (const entry of followUpHistory) {
                conversationContext += `\nUtilisateur : ${entry.user}\nVirgile : ${entry.ai}`;
            }
        }

        conversationContext += `\n\nNouvelle question de l'utilisateur : "${followUp}"`;

        const response = await callAI(provider, apiKey, genPrompt, conversationContext, { useWebSearch: true });

        res.json({ success: true, data: { rejected: false, response } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
