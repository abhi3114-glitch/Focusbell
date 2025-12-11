import { useRef, useCallback } from 'react';

export const useAudio = (chimeVolume = 0.5, tickVolume = 0.3) => {
    const audioContextRef = useRef(null);
    const customBufferRef = useRef(null);

    const initContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    };

    const setCustomChime = async (file) => {
        const ctx = initContext();
        if (!ctx || !file) return;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            customBufferRef.current = audioBuffer;
            return true;
        } catch (e) {
            console.error("Failed to decode audio", e);
            return false;
        }
    };

    const playChime = useCallback(() => {
        const ctx = initContext();
        if (!ctx) return;

        if (customBufferRef.current) {
            // Play custom sound
            const source = ctx.createBufferSource();
            const gainNode = ctx.createGain();

            source.buffer = customBufferRef.current;
            source.connect(gainNode);
            gainNode.connect(ctx.destination);

            gainNode.gain.value = chimeVolume;
            source.start(0);
        } else {
            // Default synthesized chime
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(659.25, ctx.currentTime);

            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(chimeVolume, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 2.0);
        }
    }, [chimeVolume]);

    const playTick = useCallback((style = 'mechanical') => {
        // Only play if volume > 0 to save performance
        if (tickVolume <= 0) return;

        const ctx = initContext();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const t = ctx.currentTime;

        if (style === 'digital') {
            // Digital Beep
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, t);
            gainNode.gain.setValueAtTime(0, t);
            gainNode.gain.linearRampToValueAtTime(tickVolume * 0.05, t + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            oscillator.start(t);
            oscillator.stop(t + 0.05);

        } else if (style === 'heartbeat') {
            // Heartbeat Thud (Low frequency)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, t);

            gainNode.gain.setValueAtTime(0, t);
            gainNode.gain.linearRampToValueAtTime(tickVolume * 1.5, t + 0.05); // Boost volume for low freq
            gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            oscillator.start(t);
            oscillator.stop(t + 0.2);

        } else {
            // Mechanical (Default - High Click)
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(2000, t);
            // Add a slight frequency drop for "click" effect?
            oscillator.frequency.exponentialRampToValueAtTime(1000, t + 0.01);

            gainNode.gain.setValueAtTime(0, t);
            gainNode.gain.linearRampToValueAtTime(tickVolume * 0.1, t + 0.005);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

            oscillator.start(t);
            oscillator.stop(t + 0.05);
        }
    }, [tickVolume]);

    return { playChime, playTick, setCustomChime };
};
