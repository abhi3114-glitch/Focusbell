import { useState, useEffect, useRef } from 'react';

export const useZenMode = (isActive, timeout = 3000) => {
    const [isZen, setIsZen] = useState(false);
    const timerRef = useRef(null);

    const resetTimer = () => {
        setIsZen(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (isActive) {
            timerRef.current = setTimeout(() => {
                setIsZen(true);
            }, timeout);
        }
    };

    useEffect(() => {
        // Initial trigger when active changes
        if (isActive) {
            resetTimer();
        } else {
            setIsZen(false);
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [isActive]);

    useEffect(() => {
        const handleActivity = () => resetTimer();

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isActive]);

    return isZen;
};
