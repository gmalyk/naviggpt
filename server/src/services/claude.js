/**
 * Calls Anthropic Claude API
 * @param {string} apiKey - API key
 * @param {string} systemPrompt - System instructions
 * @param {string} userMessage - User input
 * @param {object} options - Optional settings (e.g. { useWebSearch: true })
 * @returns {Promise<string>} AI response text
 */
export const callClaude = async (apiKey, systemPrompt, userMessage, options = {}) => {
    const body = {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
            { role: 'user', content: userMessage }
        ],
        temperature: 0.7
    };

    if (options.useWebSearch) {
        body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || 'Claude API Error');
    }

    return data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n\n');
};
