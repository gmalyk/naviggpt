/**
 * API Service for Virgile AI - Optimized for Cloudflare
 */

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Server error (${response.status})`);
    }
    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fetch error');
    }

    if (typeof data.data === 'string' && data.data.trim().startsWith('{')) {
        try {
            return JSON.parse(data.data.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {
            console.error("Failed to parse AI JSON response", e);
            return data.data;
        }
    }

    return data.data;
};

// Use relative URL for Cloudflare Unified Worker
const API_BASE = '/api';

export const api = {
    ask: async (payload) => {
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    },

    submitFilters: async (payload) => {
        const response = await fetch(`${API_BASE}/filters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    },

    followUp: async (payload) => {
        const response = await fetch(`${API_BASE}/followup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    },

    getPrompts: async (token) => {
        const response = await fetch(`${API_BASE}/prompts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await handleResponse(response);
    },

    savePrompts: async (prompts, token) => {
        const response = await fetch(`${API_BASE}/prompts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ prompts })
        });
        return await handleResponse(response);
    },

    savePrompt: async (key, template, token) => {
        const response = await fetch(`${API_BASE}/prompts/${key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ template })
        });
        return await handleResponse(response);
    },

    choosePlan: async (plan, email) => {
        const response = await fetch(`${API_BASE}/plan/choose`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, email })
        });
        return await handleResponse(response);
    },

    resetPrompts: async (token) => {
        const response = await fetch(`${API_BASE}/prompts/reset`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await handleResponse(response);
    }
};
