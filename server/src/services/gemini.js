/**
 * Calls Google Gemini API
 * @param {string} apiKey - User provided API key
 * @param {string} systemPrompt - System instructions
 * @param {string} userMessage - User input
 * @returns {Promise<string>} AI response text
 */
export const callGemini = async (apiKey, systemPrompt, userMessage) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser Question: ${userMessage}`
                }]
            }]
        })
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || 'Gemini API Error');
    }

    return data.candidates[0].content.parts[0].text;
};
