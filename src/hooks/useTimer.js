import { useState, useEffect, useRef, useCallback } from 'react';

export const MODES = {
    MICRO: { id: 'micro', label: 'Micro', time: 10 * 60 },
    POMODORO: { id: 'pomodoro', label: 'Pomodoro', time: 25 * 60 },
    BREAK: { id: 'break', label: 'Break', time: 5 * 60 },
    CUSTOM: { id: 'custom', label: 'Custom', time: 15 * 60 }, // Default custom
};

export const useTimer = (initialMode = MODES.MICRO, onComplete) => {
    const [mode, setMode] = useState(initialMode);
    const [timeLeft, setTimeLeft] = useState(initialMode.time);
    const [isActive, setIsActive] = useState(false);
    const endTimeRef = useRef(null);
    const rafRef = useRef(null);

    const start = useCallback(() => {
        if (isActive) return;

        setIsActive(true);
        // Calculate expected end time based on current timeLeft
        // This allows pausing and resuming without drift
        endTimeRef.current = Date.now() + timeLeft * 1000;

        const tick = () => {
            const now = Date.now();
            const remaining = Math.ceil((endTimeRef.current - now) / 1000);

            if (remaining <= 0) {
                setTimeLeft(0);
                setIsActive(false);
                if (onComplete) onComplete();
            } else {
                setTimeLeft(remaining);
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [isActive, timeLeft, onComplete]);

    const pause = useCallback(() => {
        if (!isActive) return;
        setIsActive(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        // timeLeft is already up to date from the last tick
    }, [isActive]);

    const reset = useCallback(() => {
        setIsActive(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        setTimeLeft(mode.time);
    }, [mode]);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        setIsActive(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        setTimeLeft(newMode.time);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return {
        timeLeft,
        isActive,
        mode,
        start,
        pause,
        reset,
        switchMode,
        setCustomTime: (timeInSeconds) => {
            const customMode = { ...MODES.CUSTOM, time: timeInSeconds };
            setMode(customMode);
            setTimeLeft(timeInSeconds);
        }
    };
};
