import { useRef, useCallback } from 'react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';

const PrecisionInput = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const textareaRef = useRef(null);

    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }, []);

    return (
        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ui_additional_precision')}</label>
            <textarea
                ref={textareaRef}
                rows={1}
                value={state.precision}
                onChange={(e) => { dispatch({ type: ACTIONS.SET_PRECISION, payload: e.target.value }); autoResize(); }}
                placeholder={t('ui_precision_placeholder')}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 transition-all text-xs placeholder:text-slate-300 resize-none overflow-hidden"
            />
        </div>
    );
};

export default PrecisionInput;
