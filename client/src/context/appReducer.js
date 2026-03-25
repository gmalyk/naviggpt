export const initialState = {
    view: 'home', // 'home', 'about', 'discernment', 'result', 'prompts'
    language: 'en',
    dir: 'ltr',
    profile: 'adult',
    filterCount: 5,
    useWebSearch: false,
    faith: null,
    values: [],
    inputDraft: '',
    question: '',
    analysis: '',
    sections: [],
    selectedFilters: [],
    precision: '',
    virggileResponse: '',
    standardResponse: '',
    followUpHistory: [],
    returnToView: null,
    loading: false,
    settings: {
        provider: 'grok'
    },
    usage: { used: 0, limit: 3, remaining: 3, exempt: false, loaded: false },
    showLimitBanner: false,
    dialogueActive: false,
    dialogueMode: null,
    pendingCompanionMessage: null
};

export const ACTIONS = {
    SET_VIEW: 'SET_VIEW',
    SET_LANGUAGE: 'SET_LANGUAGE',
    SET_PROFILE: 'SET_PROFILE',
    SET_FILTER_COUNT: 'SET_FILTER_COUNT',
    SET_WEB_SEARCH: 'SET_WEB_SEARCH',
    SET_FAITH: 'SET_FAITH',
    SET_VALUES: 'SET_VALUES',
    SET_INPUT_DRAFT: 'SET_INPUT_DRAFT',
    SET_QUESTION: 'SET_QUESTION',
    SET_INITIAL_ANALYSIS: 'SET_INITIAL_ANALYSIS',
    SET_SELECTED_FILTERS: 'SET_SELECTED_FILTERS',
    SET_PRECISION: 'SET_PRECISION',
    SET_FINAL_RESPONSES: 'SET_FINAL_RESPONSES',
    ADD_FOLLOW_UP: 'ADD_FOLLOW_UP',
    SET_LOADING: 'SET_LOADING',
    SET_RETURN_TO_VIEW: 'SET_RETURN_TO_VIEW',
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    SET_USAGE: 'SET_USAGE',
    SHOW_LIMIT_BANNER: 'SHOW_LIMIT_BANNER',
    HIDE_LIMIT_BANNER: 'HIDE_LIMIT_BANNER',
    SET_DIALOGUE_ACTIVE: 'SET_DIALOGUE_ACTIVE',
    SET_DIALOGUE_MODE: 'SET_DIALOGUE_MODE',
    SET_PENDING_COMPANION_MESSAGE: 'SET_PENDING_COMPANION_MESSAGE'
};

export function appReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_VIEW:
            return { ...state, view: action.payload };
        case ACTIONS.SET_LANGUAGE:
            return {
                ...state,
                language: action.payload,
                dir: action.payload === 'ar' ? 'rtl' : 'ltr'
            };
        case ACTIONS.SET_PROFILE:
            return { ...state, profile: action.payload };
        case ACTIONS.SET_FILTER_COUNT:
            return { ...state, filterCount: action.payload };
        case ACTIONS.SET_WEB_SEARCH:
            return { ...state, useWebSearch: action.payload };
        case ACTIONS.SET_FAITH:
            return { ...state, faith: action.payload };
        case ACTIONS.SET_VALUES:
            return { ...state, values: action.payload };
        case ACTIONS.SET_INPUT_DRAFT:
            return { ...state, inputDraft: action.payload };
        case ACTIONS.SET_QUESTION:
            return { ...state, question: action.payload };
        case ACTIONS.SET_INITIAL_ANALYSIS:
            return {
                ...state,
                analysis: action.payload.analysis,
                sections: action.payload.sections,
                selectedFilters: [],
                precision: ''
            };
        case ACTIONS.SET_SELECTED_FILTERS:
            return { ...state, selectedFilters: action.payload };
        case ACTIONS.SET_PRECISION:
            return { ...state, precision: action.payload };
        case ACTIONS.SET_FINAL_RESPONSES:
            return {
                ...state,
                virggileResponse: action.payload.virggile,
                standardResponse: action.payload.standard,
                followUpHistory: []
            };
        case ACTIONS.ADD_FOLLOW_UP:
            return {
                ...state,
                followUpHistory: [...state.followUpHistory, action.payload]
            };
        case ACTIONS.SET_RETURN_TO_VIEW:
            return { ...state, returnToView: action.payload };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.UPDATE_SETTINGS:
            return { ...state, settings: { ...state.settings, ...action.payload } };
        case ACTIONS.SET_USAGE:
            return { ...state, usage: { ...state.usage, ...action.payload, loaded: true } };
        case ACTIONS.SHOW_LIMIT_BANNER:
            return { ...state, showLimitBanner: true };
        case ACTIONS.HIDE_LIMIT_BANNER:
            return { ...state, showLimitBanner: false };
        case ACTIONS.SET_DIALOGUE_ACTIVE:
            return { ...state, dialogueActive: action.payload, dialogueMode: action.payload ? state.dialogueMode : null };
        case ACTIONS.SET_DIALOGUE_MODE:
            return { ...state, dialogueMode: action.payload };
        case ACTIONS.SET_PENDING_COMPANION_MESSAGE:
            return { ...state, pendingCompanionMessage: action.payload };
        default:
            return state;
    }
}
