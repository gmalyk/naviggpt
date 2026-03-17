/**
 * API Service for Virgile AI - Optimized for Cloudflare
 */

import { supabase } from '../lib/supabase';

const getAuthHeaders = async () => {
    if (!supabase) return {};
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {};
};

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Server error (${response.status})`);
    }
    if (!response.ok || !data.success) {
        const err = new Error(data.error || 'Fetch error');
        err.status = response.status;
        err.errorCode = data.error;
        throw err;
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
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify(payload)
        });
        return await handleResponse(response);
    },

    submitFilters: async (payload) => {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/filters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
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

    choosePlan: async (plan, email, firstName) => {
        const response = await fetch(`${API_BASE}/plan/choose`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, email, firstName })
        });
        return await handleResponse(response);
    },

    resetPrompts: async (token) => {
        const response = await fetch(`${API_BASE}/prompts/reset`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await handleResponse(response);
    },

    getUsage: async () => {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/usage`, {
            headers: authHeaders
        });
        return await handleResponse(response);
    }
};
