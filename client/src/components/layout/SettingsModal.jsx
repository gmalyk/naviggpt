import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';

const SettingsModal = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const [localSettings, setLocalSettings] = useState(state.settings);

    if (!isOpen) return null;

    const handleSave = () => {
        dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: localSettings });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">{t('settings_title')}</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">{t('settings_default_engine')}</label>
                        <div className="p-3 border-2 rounded-2xl border-[#B88644] bg-amber-50/30">
                            <p className="font-bold text-sm">Grok</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                        {t('btn_cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-[#B88644] text-white text-sm font-bold rounded-full shadow-lg shadow-amber-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {t('btn_save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
