/**
 * Calls Perplexity API (OpenAI-compatible format with built-in web search)
 * @param {string} apiKey - API key
 * @param {string} systemPrompt - System instructions
 * @param {string} userMessage - User input
 * @param {object} options - Optional settings (unused, kept for interface compatibility)
 * @returns {Promise<string>} AI response text
 */
export const callPerplexity = async (apiKey, systemPrompt, userMessage, options = {}) => {
    let systemContent;
    if (typeof systemPrompt === 'object' && systemPrompt.staticPrompt) {
        systemContent = systemPrompt.staticPrompt + '\n\n' + systemPrompt.dynamicPrompt;
    } else {
        systemContent = systemPrompt;
    }

    const body = {
        model: 'sonar-pro',
        max_tokens: 4096,
        messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: userMessage }
        ],
        temperature: 0.7
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || 'Perplexity API Error');
    }

    return data.choices[0].message.content;
};
