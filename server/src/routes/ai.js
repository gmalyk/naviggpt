import express from 'express';
import { callAI } from '../services/dispatcher.js';
import { getAskVirgilePrompt } from '../prompts/askVirgile.js';
import { getSubmitFiltersPrompt } from '../prompts/submitFilters.js';
import { getFollowUpCheckPrompt, getFollowUpGenPrompt } from '../prompts/followUp.js';

const router = express.Router();

// POST /api/ask - Initial analysis stage
router.post('/ask', async (req, res) => {
    const { question, profile, faith, values, language, provider, apiKey } = req.body;

    try {
        const systemPrompt = getAskVirgilePrompt(profile, faith, values, language);
        const response = await callAI(provider, apiKey, systemPrompt, `Question: "${question}"`);

        // The response is expected to be JSON as per the system prompt instructions
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/filters - Result generation stage
router.post('/filters', async (req, res) => {
    const { question, profile, faith, values, language, provider, apiKey, filters, precision } = req.body;

    try {
        const systemPrompt = getSubmitFiltersPrompt(profile, faith, values, language);
        const userMessage = `Question: "${question}"\nFiltres: ${filters.join(', ')}\nPrécision: "${precision}"`;
        const response = await callAI(provider, apiKey, systemPrompt, userMessage);

        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/followup - Follow-up chat stage
router.post('/followup', async (req, res) => {
    const { followUp, context, profile, faith, values, language, provider, apiKey } = req.body;

    try {
        // Stage 3a: Context Check
        const checkPrompt = getFollowUpCheckPrompt(context, followUp, language);
        const checkResponse = await callAI(provider, apiKey, "Tu es un vérificateur de contexte.", checkPrompt);

        if (checkResponse.toUpperCase().includes("NON")) {
            return res.json({ success: true, rejected: true, message: checkResponse });
        }

        // Stage 3b: Generation
        const genPrompt = getFollowUpGenPrompt(profile, faith, values, language);
        const response = await callAI(provider, apiKey, genPrompt, `Suite discussion : "${followUp}"`);

        res.json({ success: true, rejected: false, data: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
