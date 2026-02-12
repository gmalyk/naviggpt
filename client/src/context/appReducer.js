export const initialState = {
    view: 'home', // 'home', 'about', 'discernment', 'result', 'prompts'
    language: 'en',
    dir: 'ltr',
    profile: 'adult',
    faith: null,
    values: [],
    question: '',
    analysis: '',
    sections: [],
    selectedFilters: [],
    precision: '',
    virgileResponse: '',
    standardResponse: '',
    followUpHistory: [],
    loading: false,
    settings: {
        provider: 'claude'
    }
};

export const ACTIONS = {
    SET_VIEW: 'SET_VIEW',
    SET_LANGUAGE: 'SET_LANGUAGE',
    SET_PROFILE: 'SET_PROFILE',
    SET_FAITH: 'SET_FAITH',
    SET_VALUES: 'SET_VALUES',
    SET_QUESTION: 'SET_QUESTION',
    SET_INITIAL_ANALYSIS: 'SET_INITIAL_ANALYSIS',
    SET_SELECTED_FILTERS: 'SET_SELECTED_FILTERS',
    SET_PRECISION: 'SET_PRECISION',
    SET_FINAL_RESPONSES: 'SET_FINAL_RESPONSES',
    ADD_FOLLOW_UP: 'ADD_FOLLOW_UP',
    SET_LOADING: 'SET_LOADING',
    UPDATE_SETTINGS: 'UPDATE_SETTINGS'
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
        case ACTIONS.SET_FAITH:
            return { ...state, faith: action.payload };
        case ACTIONS.SET_VALUES:
            return { ...state, values: action.payload };
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
                virgileResponse: action.payload.virgile,
                standardResponse: action.payload.standard,
                followUpHistory: []
            };
        case ACTIONS.ADD_FOLLOW_UP:
            return {
                ...state,
                followUpHistory: [...state.followUpHistory, action.payload]
            };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.UPDATE_SETTINGS:
            return { ...state, settings: { ...state.settings, ...action.payload } };
        default:
            return state;
    }
}
