import React from 'react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const PrecisionInput = () => {
    const { state, dispatch } = useAppState();

    return (
        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Précisions supplémentaires</label>
            <textarea
                value={state.precision}
                onChange={(e) => dispatch({ type: ACTIONS.SET_PRECISION, payload: e.target.value })}
                placeholder="Ex: Je suis un professionnel..."
                className="w-full h-20 p-4 bg-slate-50 border border-slate-100 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 transition-all text-xs placeholder:text-slate-300 resize-none"
            />
        </div>
    );
};

export default PrecisionInput;
