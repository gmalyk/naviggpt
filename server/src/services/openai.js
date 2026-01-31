/**
 * Calls OpenAI API (GPT-4o or GPT-4o-mini)
 * @param {string} apiKey - User provided API key
 * @param {string} systemPrompt - System instructions
 * @param {string} userMessage - User input
 * @returns {Promise<string>} AI response text
 */
export const callOpenAI = async (apiKey, systemPrompt, userMessage) => {
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
    if (data.error) {
        throw new Error(data.error.message || 'OpenAI API Error');
    }

    return data.choices[0].message.content;
};
