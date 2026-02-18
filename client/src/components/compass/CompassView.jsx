import React, { useState } from 'react';
import { Compass, Check, Info, Users, BookOpen, Smile, Heart } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { compassData } from '../../data/compassData';

const MAX_PER_CATEGORY = 2;

const categoryColors = {
    relations: { bg: 'bg-[#B88644]/5', border: 'border-[#B88644]/20', accent: 'text-[#8C622D]', selected: 'bg-[#B88644]', icon: Users },
    travail: { bg: 'bg-[#E6C15A]/5', border: 'border-[#E6C15A]/20', accent: 'text-[#C49A3D]', selected: 'bg-[#E6C15A]', icon: BookOpen },
    loisirs: { bg: 'bg-[#D49078]/5', border: 'border-[#D49078]/20', accent: 'text-[#B36D56]', selected: 'bg-[#D49078]', icon: Smile },
    sante: { bg: 'bg-[#A39656]/5', border: 'border-[#A39656]/20', accent: 'text-[#82773F]', selected: 'bg-[#A39656]', icon: Heart }
};

const CompassView = () => {
    const { state, dispatch } = useAppState();
    const { t, language } = useTranslation();

    // Local state for age group, initialized from global state.profile
    const [selectedAge, setSelectedAge] = useState(state.profile || 'adult');

    const [selections, setSelections] = useState(() => {
        const init = {};
        const profileData = compassData[state.profile || 'adult'];
        if (profileData) {
            profileData.categories.forEach(cat => {
                init[cat.key] = state.values.filter(v =>
                    cat.values.some(cv => cv.name === v)
                );
            });
        }
        return init;
    });
    const [hoveredValue, setHoveredValue] = useState(null);
    const [saved, setSaved] = useState(false);

    const profileData = compassData[selectedAge];
    if (!profileData) return null;

    const handleAgeChange = (age) => {
        if (age === selectedAge) return;
        setSelectedAge(age);
        // Reset selections when age group changes
        const empty = {};
        compassData[age].categories.forEach(cat => { empty[cat.key] = []; });
        setSelections(empty);
        setSaved(false);
    };

    const getLabel = (frenchName) => {
        for (const cat of profileData.categories) {
            const found = cat.values.find(v => v.name === frenchName);
            if (found) return found.label?.[language] || found.label?.fr || found.name;
        }
        return frenchName;
    };

    const toggleValue = (categoryKey, valueName) => {
        setSelections(prev => {
            const current = prev[categoryKey] || [];
            if (current.includes(valueName)) {
                return { ...prev, [categoryKey]: current.filter(v => v !== valueName) };
            }
            if (current.length >= MAX_PER_CATEGORY) return prev;
            return { ...prev, [categoryKey]: [...current, valueName] };
        });
        setSaved(false);
    };

    const handleSave = () => {
        const allValues = Object.values(selections).flat();
        dispatch({ type: ACTIONS.SET_PROFILE, payload: selectedAge });
        dispatch({ type: ACTIONS.SET_VALUES, payload: allValues });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleReset = () => {
        const empty = {};
        profileData.categories.forEach(cat => { empty[cat.key] = []; });
        setSelections(empty);
        dispatch({ type: ACTIONS.SET_VALUES, payload: [] });
        setSaved(false);
    };

    const totalSelected = Object.values(selections).flat().length;

    const ageGroups = [
        { id: 'kid', label: t('prof_kid') },
        { id: 'teen', label: t('prof_teen') },
        { id: 'adult', label: t('prof_adult') },
        { id: 'senior', label: t('prof_senior') }
    ];

    return (
        <section className="pt-4 pb-12 px-4 md:px-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                    <Compass className="w-7 h-7 text-[#B88644]" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('compass_title')}</h1>
                <p className="text-sm text-slate-500 max-w-lg mx-auto mb-6">{t('compass_subtitle')}</p>

                {/* Age Selection Row */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-50 p-1.5 rounded-full border border-slate-200 w-fit mx-auto">
                    {ageGroups.map(group => (
                        <button
                            key={group.id}
                            onClick={() => handleAgeChange(group.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedAge === group.id
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {group.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {profileData.categories.map(category => {
                    const colors = categoryColors[category.key];
                    const selected = selections[category.key] || [];
                    const remaining = MAX_PER_CATEGORY - selected.length;
                    const CategoryIcon = colors.icon;

                    return (
                        <div
                            key={category.key}
                            className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 transition-all`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className={`font-semibold text-sm ${colors.accent} flex items-center gap-2`}>
                                        <CategoryIcon className="w-4 h-4" />
                                        {t(category.titleKey)}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">{category.subtitle?.[language] || category.subtitle?.fr || category.subtitle}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${remaining > 0 ? 'bg-white/70 text-slate-500' : `${colors.selected} text-white`}`}>
                                    {selected.length}/{MAX_PER_CATEGORY}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {category.values.map(value => {
                                    const isSelected = selected.includes(value.name);
                                    const isDisabled = !isSelected && selected.length >= MAX_PER_CATEGORY;

                                    return (
                                        <div key={value.name} className="relative">
                                            <button
                                                onClick={() => toggleValue(category.key, value.name)}
                                                onMouseEnter={() => setHoveredValue(value)}
                                                onMouseLeave={() => setHoveredValue(null)}
                                                disabled={isDisabled}
                                                className={`
                                                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                                    transition-all duration-200 border
                                                    ${isSelected
                                                        ? `${colors.selected} text-white border-transparent shadow-sm`
                                                        : isDisabled
                                                            ? 'bg-white/50 text-slate-300 border-slate-100 cursor-not-allowed'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer'
                                                    }
                                                `}
                                            >
                                                {isSelected && <Check className="w-3 h-3" />}
                                                {value.label?.[language] || value.label?.fr || value.name}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {hoveredValue && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-xs rounded-xl px-4 py-3 shadow-xl max-w-xs text-center animate-in fade-in duration-200">
                    <div className="font-semibold mb-1">{hoveredValue.label?.[language] || hoveredValue.label?.fr || hoveredValue.name}</div>
                    <div className="text-slate-300">{hoveredValue.description?.[language] || hoveredValue.description?.fr || hoveredValue.description}</div>
                </div>
            )}

            {totalSelected > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-slate-400" />
                        {t('compass_title')}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(selections).map(([catKey, values]) =>
                            values.map(v => {
                                const colors = categoryColors[catKey];
                                return (
                                    <span
                                        key={`${catKey}-${v}`}
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colors.selected} text-white`}
                                    >
                                        {getLabel(v)}
                                    </span>
                                );
                            })
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${saved
                                ? 'bg-emerald-500 text-white'
                                : 'bg-[#B88644] text-white hover:bg-[#A07538]'
                                }`}
                        >
                            {saved ? t('compass_saved') : t('compass_save')}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                        >
                            {t('compass_reset')}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-2 text-xs text-slate-400 px-2">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p>{t('compass_pick_2')}</p>
            </div>
        </section>
    );
};

export default CompassView;
