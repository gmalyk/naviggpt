import React, { useState, useEffect, useCallback } from 'react';
import { Save, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { api } from '../../services/api';
import PromptCard from './PromptCard';

const PromptEditorView = () => {
    const { dispatch } = useAppState();
    const { t } = useTranslation();

    const [prompts, setPrompts] = useState(null);
    const [editedTemplates, setEditedTemplates] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchPrompts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getPrompts();
            setPrompts(data);
            const templates = {};
            for (const [key, prompt] of Object.entries(data)) {
                templates[key] = prompt.currentTemplate;
            }
            setEditedTemplates(templates);
        } catch (e) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const hasUnsavedChanges = prompts && Object.keys(prompts).some(
        key => editedTemplates[key] !== prompts[key].currentTemplate
    );

    useEffect(() => {
        const handler = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleChange = (key, value) => {
        setEditedTemplates(prev => ({ ...prev, [key]: value }));
    };

    const handleResetToDefault = (key) => {
        if (prompts[key]) {
            setEditedTemplates(prev => ({ ...prev, [key]: prompts[key].defaultTemplate }));
        }
    };

    const handleSaveAll = async () => {
        try {
            setSaving(true);
            const toSave = {};
            for (const [key, template] of Object.entries(editedTemplates)) {
                toSave[key] = template;
            }
            await api.savePrompts(toSave);
            await fetchPrompts();
            showMessage('success', t('prompt_saved_success'));
        } catch (e) {
            showMessage('error', e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleResetAll = async () => {
        if (!window.confirm(t('prompt_confirm_reset_all'))) return;
        try {
            setSaving(true);
            await api.resetPrompts();
            await fetchPrompts();
            showMessage('success', t('prompt_reset_success'));
        } catch (e) {
            showMessage('error', e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={() => {
                        if (hasUnsavedChanges && !window.confirm(t('prompt_unsaved_warning'))) return;
                        dispatch({ type: ACTIONS.SET_VIEW, payload: 'home' });
                    }}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-slate-900">{t('prompt_editor_title')}</h1>
                <p className="text-sm text-slate-500 mt-1">{t('prompt_editor_subtitle')}</p>
            </div>

            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-3 mb-6">
                <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {t('prompt_save_all')}
                </button>
                <button
                    onClick={handleResetAll}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    {t('prompt_reset_all')}
                </button>
            </div>

            <div className="space-y-3">
                {prompts && Object.entries(prompts).map(([key, prompt]) => (
                    <PromptCard
                        key={key}
                        promptKey={key}
                        prompt={prompt}
                        editedTemplate={editedTemplates[key] || ''}
                        onChange={handleChange}
                        onResetToDefault={handleResetToDefault}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromptEditorView;
