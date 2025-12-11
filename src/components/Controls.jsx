import React, { useState, useEffect } from 'react';
import { MODES } from '../hooks/useTimer';

const Controls = ({ isActive, onStart, onPause, onReset, currentMode, onModeChange, onCustomTimeChange }) => {
    const [showModes, setShowModes] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(15);

    useEffect(() => {
        if (currentMode.id === 'custom') {
            const mins = Math.floor(currentMode.time / 60);
            setCustomMinutes(mins);
        }
    }, [currentMode]);

    const handleCustomChange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 120) val = 120; // Max 2 hours
        setCustomMinutes(val);
        onCustomTimeChange(val * 60);
    };

    return (
        <div className="flex flex-col items-center gap-6 mt-8 z-10 w-full">
            {/* Primary Actions */}
            <div className="flex items-center gap-4">
                {!isActive ? (
                    <button
                        onClick={onStart}
                        className="px-8 py-3 rounded-full bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                    >
                        Start Focus
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        className="px-8 py-3 rounded-full bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                    >
                        Pause
                    </button>
                )}

                <button
                    onClick={onReset}
                    className="p-3 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    title="Reset"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Mode Switcher */}
            <div className="relative flex flex-col items-center gap-2">
                <button
                    onClick={() => setShowModes(!showModes)}
                    className="text-white/60 text-sm font-medium hover:text-white transition-colors flex items-center gap-2"
                >
                    {currentMode.label} Mode
                    <svg className={`w-4 h-4 transition-transform ${showModes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Custom Input */}
                {currentMode.id === 'custom' && !isActive && (
                    <div className="flex items-center gap-2 animate-fade-in-up mt-2">
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={customMinutes}
                            onChange={handleCustomChange}
                            className="w-16 bg-white/10 border border-white/20 rounded-md px-2 py-1 text-center text-white text-sm focus:outline-none focus:border-white/50"
                        />
                        <span className="text-xs text-white/50 uppercase">min</span>
                    </div>
                )}

                {showModes && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-md rounded-xl p-2 min-w-[150px] shadow-2xl border border-white/10 flex flex-col gap-1 z-50">
                        {Object.values(MODES).map((m) => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    onModeChange(m);
                                    setShowModes(false);
                                }}
                                className={`px-4 py-2 rounded-lg text-left text-sm transition-colors ${currentMode.id === m.id
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Controls;
