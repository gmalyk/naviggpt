/**
 * Calls Google Gemini API (Fixed 2026 EU Paid Tier)
 * @param {string} apiKey - User provided API key
 * @param {string} systemPrompt - System instructions
 * @param {string} userMessage - User input
 * @returns {Promise<string>} AI response text
 */
export const callGemini = async (apiKey, systemPrompt, userMessage) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ValueCompass-France/1.0'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser Question: ${userMessage}`
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 4096,
                topK: 32,
                topP: 0.95
            },
            safetySettings: [
                {category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
                {category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE"}
            ]
        }),
        signal: controller.signal
    });

    const text = await response.text();
    console.log('Gemini Status:', response.status);

    if (response.status === 429) throw new Error('Gemini rate limit - attendez 60 secondes');
    if (!response.ok) {
        try {
            const errData = JSON.parse(text);
            throw new Error(errData.error?.message || errData.error?.code || `Gemini Error ${response.status}`);
        } catch (e) {
            if (e.message.includes('Gemini')) throw e;
            throw new Error(`Gemini Error ${response.status}: ${text.substring(0, 200)}`);
        }
    }

    const data = JSON.parse(text);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
};
