import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';

const PrecisionInput = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();

    return (
        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ui_additional_precision')}</label>
            <textarea
                value={state.precision}
                onChange={(e) => dispatch({ type: ACTIONS.SET_PRECISION, payload: e.target.value })}
                placeholder={t('ui_precision_placeholder')}
                className="w-full h-20 p-4 bg-slate-50 border border-slate-100 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 transition-all text-xs placeholder:text-slate-300 resize-none"
            />
        </div>
    );
};

export default PrecisionInput;
