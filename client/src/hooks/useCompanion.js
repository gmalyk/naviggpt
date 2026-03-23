import { useCompanionState, COMPANION_ACTIONS } from '../context/CompanionContext';
import { useAppState } from '../context/AppContext';
import { api } from '../services/api';

export const useCompanion = () => {
    const { state, dispatch } = useCompanionState();
    const { state: appState } = useAppState();

    const sendMessage = async (text) => {
        if (!text.trim() || state.loading) return;

        dispatch({ type: COMPANION_ACTIONS.ADD_USER_MESSAGE, payload: text.trim() });
        dispatch({ type: COMPANION_ACTIONS.SET_LOADING, payload: true });

        try {
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
                profile: appState.profile
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
        clearConversation
    };
};
