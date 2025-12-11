import React, { useState } from 'react';

const VolumeControl = ({ chimeVol, onChimeVolChange, ambientVol, onAmbientVolChange, tickVol, onTickVolChange, onCustomChimeUpload }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onCustomChimeUpload(file);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/40 hover:text-white transition-colors"
                title="Sound Settings"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl min-w-[200px] space-y-4 font-sans">
                    <h3 className="text-xs uppercase tracking-widest text-white/50 mb-2">Sound Mixer</h3>

                    {/* Chime Volume */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Chime</span>
                            <span>{Math.round(chimeVol * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={chimeVol}
                            onChange={(e) => onChimeVolChange(parseFloat(e.target.value))}
                            className="w-full accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Custom Chime Upload */}
                    <div className="pt-2 pb-2 border-b border-white/5">
                        <label className="flex items-center gap-2 text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Upload Custom Chime
                            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>

                    {/* Ambient Volume */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Ambient</span>
                            <span>{Math.round(ambientVol * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={ambientVol}
                            onChange={(e) => onAmbientVolChange(parseFloat(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Tick Volume */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                            <span>Ticking</span>
                            <span>{Math.round(tickVol * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={tickVol}
                            onChange={(e) => onTickVolChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>

                </div>
            )}
        </div>
    );
};

export default VolumeControl;
