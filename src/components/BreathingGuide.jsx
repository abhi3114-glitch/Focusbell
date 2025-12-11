import React, { useEffect, useState } from 'react';

const BreathingGuide = ({ isActive }) => {
    const [phase, setPhase] = useState('inhale'); // inhale, hold1, exhale, hold2
    const [text, setText] = useState('Inhale');

    useEffect(() => {
        if (!isActive) return;

        const cycle = [
            { phase: 'inhale', text: 'Inhale', duration: 4000 },
            { phase: 'hold1', text: 'Hold', duration: 4000 },
            { phase: 'exhale', text: 'Exhale', duration: 4000 },
            { phase: 'hold2', text: 'Hold', duration: 4000 },
        ];

        let currentIndex = 0;

        const runCycle = () => {
            const step = cycle[currentIndex];
            setPhase(step.phase);
            setText(step.text);

            currentIndex = (currentIndex + 1) % cycle.length;
        };

        runCycle(); // Start immediately

        const interval = setInterval(runCycle, 4000);

        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-30">
            <div
                className={`
                rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out
                ${phase === 'inhale' ? 'w-96 h-96 opacity-100' : ''}
                ${phase === 'hold1' ? 'w-96 h-96 opacity-80' : ''}
                ${phase === 'exhale' ? 'w-32 h-32 opacity-50' : ''}
                ${phase === 'hold2' ? 'w-32 h-32 opacity-30' : ''}
            `}
            >
                <span className="text-white/50 text-sm uppercase tracking-widest">{text}</span>
            </div>
        </div>
    );
};

export default BreathingGuide;
