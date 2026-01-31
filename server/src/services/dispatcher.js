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
        return await callOpenAI(apiKey, systemPrompt, userMessage);
    } else if (provider === 'gemini') {
        return await callGemini(apiKey, systemPrompt, userMessage);
    } else {
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
};
