import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const PromptCard = ({ promptKey, prompt, editedTemplate, onChange, onResetToDefault }) => {
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslation();

    const isCacheable = prompt.cacheable;

    const isModified = isCacheable
        ? (editedTemplate?.staticTemplate !== prompt.currentStaticTemplate || editedTemplate?.dynamicTemplate !== prompt.currentDynamicTemplate)
        : editedTemplate !== prompt.currentTemplate;
    const isOverridden = prompt.isOverridden || isModified;

    return (
        <div className={`border rounded-xl transition-colors ${isOverridden ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 bg-white'}`}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
                <div className="flex items-center gap-3">
                    {expanded
                        ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    }
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800">{prompt.name}</span>
                            <span className="text-xs text-slate-400 font-mono">{promptKey}</span>
                            {isCacheable && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    cache
                                </span>
                            )}
                            {isOverridden && (
                                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                                    {t('prompt_modified_badge')}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{prompt.description}</p>
                    </div>
                </div>
            </button>

            {expanded && (
                <div className="px-5 pb-5 space-y-4">
                    {isCacheable ? (
                        <>
                            {/* Static template - cached */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        {t('prompt_static_label')}
                                    </label>
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                        {t('prompt_cache_hint')}
                                    </span>
                                </div>
                                <textarea
                                    value={editedTemplate?.staticTemplate || ''}
                                    onChange={(e) => onChange(promptKey, { ...editedTemplate, staticTemplate: e.target.value })}
                                    className="w-full h-64 p-3 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                    spellCheck={false}
                                />
                            </div>

                            {/* Dynamic template - per-request */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    {t('prompt_dynamic_label')}
                                </label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-medium text-slate-500">{t('prompt_variables_label')}:</span>
                                    {prompt.variables.map(v => (
                                        <code key={v} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                                            {`{{${v}}}`}
                                        </code>
                                    ))}
                                </div>
                                <textarea
                                    value={editedTemplate?.dynamicTemplate || ''}
                                    onChange={(e) => onChange(promptKey, { ...editedTemplate, dynamicTemplate: e.target.value })}
                                    className="w-full h-32 p-3 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                    spellCheck={false}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Single textarea for non-cacheable prompts */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-slate-500">{t('prompt_variables_label')}:</span>
                                {prompt.variables.map(v => (
                                    <code key={v} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                                        {`{{${v}}}`}
                                    </code>
                                ))}
                            </div>

                            <textarea
                                value={editedTemplate}
                                onChange={(e) => onChange(promptKey, e.target.value)}
                                className="w-full h-64 p-3 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                spellCheck={false}
                            />
                        </>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={() => onResetToDefault(promptKey)}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {t('prompt_reset_default')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptCard;
