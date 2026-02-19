import { callPerplexity } from './claude.js';

/**
 * Calls the Perplexity AI provider
 * @param {string} provider - Ignored, always uses Perplexity
 * @param {string} apiKey - User API key
 * @param {string} systemPrompt - Instructions
 * @param {string} userMessage - User input
 */
export const callAI = async (provider, apiKey, systemPrompt, userMessage, options = {}) => {
    const key = apiKey || process.env.PERPLEXITY_API_KEY;
    if (!key) throw new Error('No Perplexity API key configured');
    return await callPerplexity(key, systemPrompt, userMessage, options);
};
