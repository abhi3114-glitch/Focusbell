import React from 'react';

export const TICK_STYLES = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'digital', label: 'Digital' },
    { id: 'heartbeat', label: 'Heartbeat' }
];

const Settings = ({
    isOpen, onClose,
    autoStart, setAutoStart,
    longBreak, setLongBreak,
    tickStyle, setTickStyle,
    compactMode, setCompactMode,
    onClearData
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-light tracking-wide text-white">Settings</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
                </div>

                <div className="space-y-6">

                    {/* Auto Start */}
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-white/80">Auto-Start Timers</div>
                        <button
                            onClick={() => setAutoStart(!autoStart)}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${autoStart ? 'bg-green-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoStart ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Smart Long Break */}
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-white/80">
                            Smart Long Break
                            <div className="text-[10px] text-white/40">15m break after 4 pomodoros</div>
                        </div>
                        <button
                            onClick={() => setLongBreak(!longBreak)}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${longBreak ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${longBreak ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Compact Mode */}
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-white/80">Compact Mode</div>
                        <button
                            onClick={() => setCompactMode(!compactMode)}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${compactMode ? 'bg-purple-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${compactMode ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Tick Style */}
                    <div className="space-y-2">
                        <div className="text-xs uppercase text-white/40 tracking-wider">Ticking Sound Style</div>
                        <div className="grid grid-cols-3 gap-2">
                            {TICK_STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setTickStyle(style.id)}
                                    className={`px-2 py-2 text-xs rounded border transition-colors ${tickStyle === style.id ? 'bg-white/20 border-white text-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-white/5">
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                                    onClearData();
                                }
                            }}
                            className="w-full py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs uppercase tracking-wider transition-colors"
                        >
                            Reset All Data
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
