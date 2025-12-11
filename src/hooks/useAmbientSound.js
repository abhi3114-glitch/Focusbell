import { useRef, useEffect, useState, useCallback } from 'react';

export const NOISE_TYPES = {
    NONE: { id: 'none', label: 'Off' },
    BROWN: { id: 'brown', label: 'Brown Noise' },
    PINK: { id: 'pink', label: 'Pink Noise' },
    WHITE: { id: 'white', label: 'White Noise' }
};

export const useAmbientSound = (volume = 0.5) => {
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const gainNodeRef = useRef(null);
    const [currentType, setCurrentType] = useState(NOISE_TYPES.NONE);

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

    const createNoiseBuffer = (ctx, type) => {
        const bufferSize = 2 * ctx.sampleRate; // 2 seconds buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        // Noise generation algorithms
        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        }
        return buffer;
    };

    const play = useCallback((typeId) => {
        const ctx = initContext();

        // Stop existing
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
        }
        if (typeId === NOISE_TYPES.NONE.id) {
            setCurrentType(NOISE_TYPES.NONE);
            return;
        }

        const typeKey = Object.keys(NOISE_TYPES).find(k => NOISE_TYPES[k].id === typeId);
        if (!typeKey) return;

        setCurrentType(NOISE_TYPES[typeKey]);

        const buffer = createNoiseBuffer(ctx, typeId);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        if (!gainNodeRef.current) {
            gainNodeRef.current = ctx.createGain();
            gainNodeRef.current.connect(ctx.destination);
        }

        // Fade in
        gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 1); // Max noise volume capped at 0.2 user volume usually

        source.connect(gainNodeRef.current);
        source.start();
        sourceNodeRef.current = source;
    }, [volume]);

    // Update volume in real-time
    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            const ctx = audioContextRef.current;
            gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
            gainNodeRef.current.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 0.1);
        }
    }, [volume]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (sourceNodeRef.current) sourceNodeRef.current.stop();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    return {
        playAmbient: play,
        currentAmbient: currentType
    };
};
