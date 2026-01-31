/**
 * API Service for Virgile AI
 */

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fetch error');
    }

    // The server returns a JSON string in 'data' for /api/ask
    if (typeof data.data === 'string' && data.data.startsWith('{')) {
        try {
            return JSON.parse(data.data.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {
            console.error("Failed to parse AI JSON response", e);
            return data.data;
        }
    }

    return data.data;
};

export const api = {
    ask: async (payload) => {
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    },

    submitFilters: async (payload) => {
        const response = await fetch('/api/filters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    },

    followUp: async (payload) => {
        const response = await fetch('/api/followup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    }
};
