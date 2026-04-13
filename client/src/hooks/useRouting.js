import { useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { ACTIONS } from '../context/appReducer';

const VIEW_TO_PATH = {
    landing: '/',
    home: '/app',
    about: '/about',
    pricing: '/pricing',
    contact: '/contact',
    forum: '/forum',
    terms: '/terms',
    privacy: '/privacy',
    compass: '/compass',
    institutions: '/institutions',
    account: '/account',
    prompts: '/edit',
    companion: '/companion',
    discernment: '/app',
    result: '/app',
};

const PATH_TO_VIEW = {
    '/': 'landing',
    '/app': 'home',
    '/about': 'about',
    '/pricing': 'pricing',
    '/contact': 'contact',
    '/forum': 'forum',
    '/terms': 'terms',
    '/privacy': 'privacy',
    '/compass': 'compass',
    '/institutions': 'institutions',
    '/account': 'account',
    '/edit': 'prompts',
    '/companion': 'companion',
};

export function getViewFromPath(pathname) {
    return PATH_TO_VIEW[pathname] || 'home';
}

export function getPathFromView(view) {
    return VIEW_TO_PATH[view] || '/';
}

export function navigateTo(dispatch, view, { skipScroll = false } = {}) {
    const path = getPathFromView(view);
    window.history.pushState({ view }, '', path);
    dispatch({ type: ACTIONS.SET_VIEW, payload: view });
    if (!skipScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

export function useRouting() {
    const { dispatch } = useAppState();

    // Set initial view from URL on mount
    useEffect(() => {
        const view = getViewFromPath(window.location.pathname);
        dispatch({ type: ACTIONS.SET_VIEW, payload: view });
    }, [dispatch]);

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = (event) => {
            const view = event.state?.view || getViewFromPath(window.location.pathname);
            dispatch({ type: ACTIONS.SET_VIEW, payload: view });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [dispatch]);
}
