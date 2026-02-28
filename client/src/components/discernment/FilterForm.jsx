import React from 'react';
import { Check } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const FilterForm = () => {
    const { state, dispatch } = useAppState();

    const handleToggle = (title, option) => {
        const value = `${title}: ${option}`;
        const newList = state.selectedFilters.includes(value)
            ? state.selectedFilters.filter(f => f !== value)
            : [...state.selectedFilters, value];

        dispatch({ type: ACTIONS.SET_SELECTED_FILTERS, payload: newList });
    };

    const sections = state.sections.slice(0, state.filterCount);
    const gridCols = state.filterCount <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-5';

    if (sections.length === 0) return null;

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols} gap-x-6 gap-y-4 w-full animate-in slide-in-from-bottom-4 duration-500`}>
            {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                        {section.title}
                    </h4>
                    <div className="space-y-1">
                        {section.options.map((option, oIdx) => {
                            const value = `${section.title}: ${option}`;
                            const isSelected = state.selectedFilters.includes(value);

                            return (
                                <button
                                    key={oIdx}
                                    onClick={() => handleToggle(section.title, option)}
                                    className={`w-full text-left p-1.5 px-3 border rounded-[4px] text-xs leading-tight transition-all flex items-center gap-2 ${isSelected
                                        ? 'bg-slate-50 border-[#0F172A] text-slate-900 font-bold'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    <div className={`shrink-0 w-2.5 h-2.5 rounded-full border flex items-center justify-center brand-protect ${isSelected ? 'bg-[#B88644] border-[#B88644]' : 'bg-white border-slate-300'
                                        }`}>
                                        {isSelected && <Check className="w-1.5 h-1.5 text-white stroke-[4]" />}
                                    </div>
                                    <span className="truncate">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilterForm;
