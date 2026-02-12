import { callClaude } from './claude.js';

/**
 * Calls the Claude AI provider
 * @param {string} provider - Ignored, always uses Claude
 * @param {string} apiKey - User API key
 * @param {string} systemPrompt - Instructions
 * @param {string} userMessage - User input
 */
export const callAI = async (provider, apiKey, systemPrompt, userMessage, options = {}) => {
    const key = apiKey || process.env.CLAUDE_API_KEY;
    if (!key) throw new Error('No Claude API key configured');
    return await callClaude(key, systemPrompt, userMessage, options);
};
