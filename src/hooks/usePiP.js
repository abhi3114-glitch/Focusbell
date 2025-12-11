import { useState, useCallback, useEffect } from 'react';

export const usePiP = (active) => {
    const [pipWindow, setPipWindow] = useState(null);

    const togglePiP = useCallback(async () => {
        // Check support
        if (!('documentPictureInPicture' in window)) {
            alert('Picture-in-Picture API is not supported in this browser (Chrome/Edge 111+ required).');
            return;
        }

        // Close if open
        if (pipWindow) {
            pipWindow.close();
            return;
        }

        // Open
        try {
            const pipWin = await window.documentPictureInPicture.requestWindow({
                width: 300,
                height: 300,
            });

            // Copy styles
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    pipWin.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = styleSheet.type;
                    link.media = styleSheet.media;
                    link.href = styleSheet.href;
                    pipWin.document.head.appendChild(link);
                }
            });

            // Move body content or clone?
            // For a timer, we might want to clone specific elements or render a portal.
            // But React Portals are cleaner. We will return the pipWindow to render a Portal into it.

            setPipWindow(pipWin);

            pipWin.addEventListener('pagehide', () => {
                setPipWindow(null);
            });

        } catch (err) {
            console.error("PiP failed:", err);
        }
    }, [pipWindow]);

    // Auto-close on unmount
    useEffect(() => {
        return () => {
            if (pipWindow) pipWindow.close();
        };
    }, [pipWindow]);

    return { togglePiP, pipWindow };
};
