import { useAppState } from '../context/AppContext';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
    const { state } = useAppState();
    const { language } = state;

    const t = (key) => {
        if (!translations[language]) return translations['fr'][key] || key;
        return translations[language][key] || translations['fr'][key] || key;
    };

    return { t, language };
};
