import { callOpenAI } from './openai.js';
import { callGemini } from './gemini.js';

/**
 * Dispatches the AI call to the appropriate provider
 * @param {string} provider - 'openai' or 'gemini'
 * @param {string} apiKey - User API key
 * @param {string} systemPrompt - Instructions
 * @param {string} userMessage - User input
 */
export const callAI = async (provider, apiKey, systemPrompt, userMessage) => {
    if (provider === 'openai') {
        const key = apiKey || process.env.OPENAI_API_KEY;
        if (!key) throw new Error('No OpenAI API key configured');
        return await callOpenAI(key, systemPrompt, userMessage);
    } else if (provider === 'gemini') {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) throw new Error('No Gemini API key configured');
        return await callGemini(key, systemPrompt, userMessage);
    } else {
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
};
