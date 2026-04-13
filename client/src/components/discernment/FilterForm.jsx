import React, { useState, useRef, useCallback } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const CategorySection = ({ section, state, onToggle }) => (
    <div className="space-y-3">
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
                        onClick={() => onToggle(section.title, option)}
                        className={`w-full text-left p-1.5 px-3 border rounded-[4px] text-xs leading-tight transition-all flex items-center gap-2 ${isSelected
                            ? 'bg-slate-50 border-[#0F172A] text-slate-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                    >
                        <div className={`shrink-0 w-2.5 h-2.5 rounded-full border flex items-center justify-center brand-protect ${isSelected ? 'bg-[#7B8FA3] border-[#7B8FA3]' : 'bg-white border-slate-300'
                            }`}>
                            {isSelected && <Check className="w-1.5 h-1.5 text-white stroke-[4]" />}
                        </div>
                        <span className="truncate">{option}</span>
                    </button>
                );
            })}
        </div>
    </div>
);

const FilterForm = () => {
    const { state, dispatch } = useAppState();
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

    const handleToggle = (title, option) => {
        const value = `${title}: ${option}`;
        const newList = state.selectedFilters.includes(value)
            ? state.selectedFilters.filter(f => f !== value)
            : [...state.selectedFilters, value];

        dispatch({ type: ACTIONS.SET_SELECTED_FILTERS, payload: newList });
    };

    const sections = state.sections.slice(0, state.filterCount);
    const gridCols = state.filterCount <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-5';

    // Swipe handling for mobile
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null;
        touchStartY.current = null;

        // Only swipe if horizontal movement is dominant and > 40px
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                setActiveCategoryIndex(i => Math.min(sections.length - 1, i + 1));
            } else {
                setActiveCategoryIndex(i => Math.max(0, i - 1));
            }
        }
    }, [sections.length]);

    if (sections.length === 0) return null;

    const clampedIndex = Math.min(activeCategoryIndex, sections.length - 1);
    const activeSection = sections[clampedIndex];

    return (
        <>
            {/* Desktop/tablet: existing grid layout */}
            <div className={`hidden md:grid grid-cols-2 md:grid-cols-3 ${gridCols} gap-x-6 gap-y-4 w-full animate-in slide-in-from-bottom-4 duration-500`}>
                {sections.map((section, sIdx) => (
                    <CategorySection key={sIdx} section={section} state={state} onToggle={handleToggle} />
                ))}
            </div>

            {/* Mobile: one category at a time, swipeable */}
            <div
                className="md:hidden w-full animate-in slide-in-from-bottom-4 duration-500"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div key={clampedIndex} className="animate-in fade-in duration-300">
                    <CategorySection section={activeSection} state={state} onToggle={handleToggle} />
                </div>

                {/* Navigation */}
                {sections.length > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            onClick={() => setActiveCategoryIndex(i => Math.max(0, i - 1))}
                            disabled={clampedIndex === 0}
                            className="p-1 text-slate-400 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                            {sections.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveCategoryIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === clampedIndex ? 'bg-slate-800 scale-125' : 'bg-slate-300'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveCategoryIndex(i => Math.min(sections.length - 1, i + 1))}
                            disabled={clampedIndex === sections.length - 1}
                            className="p-1 text-slate-400 disabled:opacity-30"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <span className="text-[10px] text-slate-400 ml-1">
                            {clampedIndex + 1}/{sections.length}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterForm;
