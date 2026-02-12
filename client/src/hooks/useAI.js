import { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ACTIONS } from '../context/appReducer';
import { useTranslation } from './useTranslation';
import { api } from '../services/api';

export const useAI = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const askVirgile = async (question) => {
        setLoading(true);
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: ACTIONS.SET_QUESTION, payload: question });

        try {
            const data = await api.ask({
                question,
                profile: state.profile,
                language: state.language,
                provider: state.settings.provider,
                apiKey: '',
                values: state.values
            });

            dispatch({ type: ACTIONS.SET_INITIAL_ANALYSIS, payload: data });
            dispatch({ type: ACTIONS.SET_VIEW, payload: 'discernment' });
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const submitFilters = async () => {
        setLoading(true);
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            const response = await api.submitFilters({
                question: state.question,
                profile: state.profile,
                language: state.language,
                provider: state.settings.provider,
                apiKey: '',
                filters: state.selectedFilters,
                precision: state.precision,
                values: state.values
            });

            dispatch({ type: ACTIONS.SET_FINAL_RESPONSES, payload: { virgile: response.virgile, standard: response.standard } });
            dispatch({ type: ACTIONS.SET_VIEW, payload: 'result' });
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const handleFollowUp = async (followUpText) => {
        setLoading(true);

        try {
            // Construct context for the check
            const context = `Question: ${state.question}. Filters: ${state.selectedFilters.join(', ')}. Virgil Response: ${state.virgileResponse.substring(0, 200)}...`;

            const result = await api.followUp({
                followUp: followUpText,
                context,
                question: state.question,
                filters: state.selectedFilters,
                precision: state.precision,
                virgileResponse: state.virgileResponse,
                followUpHistory: state.followUpHistory,
                profile: state.profile,
                language: state.language,
                provider: state.settings.provider,
                apiKey: '',
                values: state.values
            });

            if (result.rejected) {
                dispatch({
                    type: ACTIONS.ADD_FOLLOW_UP,
                    payload: { user: followUpText, ai: result.message || t('error_off_topic') }
                });
            } else {
                dispatch({
                    type: ACTIONS.ADD_FOLLOW_UP,
                    payload: { user: followUpText, ai: result.response }
                });
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        askVirgile,
        submitFilters,
        handleFollowUp,
        loading
    };
};
