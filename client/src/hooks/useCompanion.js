import { useCompanionState, COMPANION_ACTIONS } from '../context/CompanionContext';
import { useAppState } from '../context/AppContext';
import { api } from '../services/api';

const COMPANION_CONVERSATION_LIMIT = 3;
const STORAGE_KEY = 'virgile_companion_conversations';

function getCompanionData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { date: '', count: 0 };
        const data = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        if (data.date !== today) return { date: today, count: 0 };
        return data;
    } catch {
        return { date: '', count: 0 };
    }
}

function incrementConversationCount() {
    const today = new Date().toISOString().slice(0, 10);
    const data = getCompanionData();
    const updated = { date: today, count: data.count + 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.count;
}

export const useCompanion = () => {
    const { state, dispatch } = useCompanionState();
    const { state: appState } = useAppState();

    const conversationCount = getCompanionData().count;
    const hasReachedConversationLimit = !appState.usage?.exempt && conversationCount >= COMPANION_CONVERSATION_LIMIT;

    const sendMessage = async (text, files) => {
        if ((!text.trim() && (!files || files.length === 0)) || state.loading) return;

        // If this is the first message of a new conversation, increment count
        if (state.messages.length === 0) {
            const newCount = incrementConversationCount();
            // Check if this new conversation exceeds the limit (for non-exempt users)
            if (!appState.usage?.exempt && newCount > COMPANION_CONVERSATION_LIMIT) {
                return;
            }
        }

        // Build display text with file names
        const fileNames = files?.length ? files.map(f => f.name) : [];
        const displayText = fileNames.length > 0
            ? `${text}${text ? '\n' : ''}📎 ${fileNames.join(', ')}`
            : text.trim();

        dispatch({ type: COMPANION_ACTIONS.ADD_USER_MESSAGE, payload: displayText });
        dispatch({ type: COMPANION_ACTIONS.SET_LOADING, payload: true });

        try {
            // Convert files to base64
            let fileData;
            if (files?.length) {
                fileData = await Promise.all(files.map(async ({ file, name, type }) => {
                    const buffer = await file.arrayBuffer();
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                    return { name, type, data: base64 };
                }));
            }

            // Build messages array for the API (without timestamps)
            const apiMessages = [
                ...state.messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: text.trim() }
            ];

            const result = await api.companion({
                messages: apiMessages,
                language: appState.language,
                provider: appState.settings.provider,
                values: appState.values,
                profile: appState.profile,
                dialogueMode: appState.dialogueMode || 'socrate',
                ...(fileData && { files: fileData })
            });

            dispatch({ type: COMPANION_ACTIONS.ADD_ASSISTANT_MESSAGE, payload: result.response });
        } catch (error) {
            console.error('Companion error:', error);
            dispatch({ type: COMPANION_ACTIONS.SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: COMPANION_ACTIONS.SET_LOADING, payload: false });
        }
    };

    const clearConversation = () => {
        dispatch({ type: COMPANION_ACTIONS.CLEAR_CONVERSATION });
    };

    return {
        messages: state.messages,
        loading: state.loading,
        error: state.error,
        sendMessage,
        clearConversation,
        conversationCount,
        hasReachedConversationLimit
    };
};
