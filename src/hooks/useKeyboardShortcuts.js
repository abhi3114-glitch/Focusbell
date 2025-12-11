import { useEffect } from 'react';

export const useKeyboardShortcuts = (handlers) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ignore if input is focused
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (event.code === 'Space') {
                event.preventDefault();
                handlers.onSpace?.();
            }
            if (event.code === 'Escape') {
                handlers.onEsc?.();
            }
            // 's' for Start/Stop toggle? Or Space for toggle.
            // Let's use generic letter keys if needed.
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};
