import { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ACTIONS } from '../context/appReducer';
import { useTranslation } from './useTranslation';
import { api } from '../services/api';

export const useAI = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const askVirgile = async (question, faith, values) => {
        setLoading(true);
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: ACTIONS.SET_QUESTION, payload: question });
        dispatch({ type: ACTIONS.SET_FAITH, payload: faith });
        dispatch({ type: ACTIONS.SET_VALUES, payload: values });

        try {
            const data = await api.ask({
                question,
                profile: state.profile,
                faith,
                values,
                language: state.language,
                provider: state.settings.provider,
                apiKey: state.settings.provider === 'openai' ? state.settings.openaiKey : state.settings.geminiKey
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
            const rawResponse = await api.submitFilters({
                question: state.question,
                profile: state.profile,
                faith: state.faith,
                values: state.values,
                language: state.language,
                provider: state.settings.provider,
                apiKey: state.settings.provider === 'openai' ? state.settings.openaiKey : state.settings.geminiKey,
                filters: state.selectedFilters,
                precision: state.precision
            });

            // Split response based on [SEPARATOR]
            const parts = rawResponse.split('[SEPARATOR]');
            const virgile = parts[0].replace('[VIRGILE_START]', '').trim();
            const standard = parts[1] ? parts[1].replace('[END]', '').trim() : "Standard response error.";

            dispatch({ type: ACTIONS.SET_FINAL_RESPONSES, payload: { virgile, standard } });
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
            const faithContext = state.faith ? `, Faith: ${state.faith.label}` : '';
            const valuesContext = state.values && state.values.length > 0 ? `, Values: ${state.values.join(', ')}` : '';
            const context = `Question: ${state.question}${faithContext}${valuesContext}. Filters: ${state.selectedFilters.join(', ')}. Virgil Response: ${state.virgileResponse.substring(0, 200)}...`;

            const result = await api.followUp({
                followUp: followUpText,
                context,
                profile: state.profile,
                faith: state.faith,
                values: state.values,
                language: state.language,
                provider: state.settings.provider,
                apiKey: state.settings.provider === 'openai' ? state.settings.openaiKey : state.settings.geminiKey
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
