import { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ACTIONS } from '../context/appReducer';
import { navigateTo } from './useRouting';
import { useTranslation } from './useTranslation';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const useAI = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const { user, openAuthModal } = useAuth();
    const [loading, setLoading] = useState(false);

    const callSubmitFilters = async (questionOverride) => {
        const response = await api.submitFilters({
            question: questionOverride || state.question,
            profileKey: state.profile,
            language: state.language,
            provider: state.settings.provider,
            apiKey: '',
            filters: state.selectedFilters,
            precision: state.precision,
            values: state.values,
            useWebSearch: state.useWebSearch
        });

        // Optimistic usage decrement after successful flow
        if (!state.usage.exempt) {
            dispatch({
                type: ACTIONS.SET_USAGE,
                payload: {
                    used: state.usage.used + 1,
                    remaining: Math.max(0, state.usage.remaining - 1)
                }
            });
        }

        dispatch({ type: ACTIONS.SET_FINAL_RESPONSES, payload: { virgile: response.virgile, standard: response.standard } });
        navigateTo(dispatch, 'result');
    };

    const askVirgile = async (question) => {
        // Require login
        if (!user) {
            openAuthModal('sign_in', t('login_to_ask'));
            return;
        }

        // Check usage limit
        if (state.usage.remaining <= 0 && !state.usage.exempt) {
            dispatch({ type: ACTIONS.SHOW_LIMIT_BANNER });
            return;
        }

        setLoading(true);
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: ACTIONS.SET_QUESTION, payload: question });

        try {
            if (state.filterCount === 0) {
                // Skip analysis entirely, go straight to final response
                await callSubmitFilters(question);
            } else {
                const data = await api.ask({
                    question,
                    profileKey: state.profile,
                    language: state.language,
                    provider: state.settings.provider,
                    apiKey: '',
                    values: state.values,
                    filterCount: state.filterCount
                });

                dispatch({ type: ACTIONS.SET_INITIAL_ANALYSIS, payload: data });
                navigateTo(dispatch, 'discernment');
            }
        } catch (error) {
            console.error(error);
            if (error.status === 401) {
                openAuthModal('sign_in', t('login_to_ask'));
            } else if (error.status === 429 || error.errorCode === 'daily_limit_reached') {
                dispatch({ type: ACTIONS.SHOW_LIMIT_BANNER });
            } else {
                alert(error.message);
            }
        } finally {
            setLoading(false);
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const submitFilters = async () => {
        setLoading(true);
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            await callSubmitFilters();
        } catch (error) {
            console.error(error);
            if (error.status === 401) {
                openAuthModal('sign_in', t('login_to_ask'));
            } else if (error.status === 429 || error.errorCode === 'daily_limit_reached') {
                dispatch({ type: ACTIONS.SHOW_LIMIT_BANNER });
            } else {
                alert(error.message);
            }
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
                profileKey: state.profile,
                language: state.language,
                provider: state.settings.provider,
                apiKey: '',
                values: state.values,
                useWebSearch: state.useWebSearch
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
