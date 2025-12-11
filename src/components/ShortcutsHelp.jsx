import React from 'react';

const ShortcutsHelp = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcuts = [
        { key: 'Space', desc: 'Start / Pause Timer' },
        { key: 'Esc', desc: 'Reset Timer' },
        { key: '?', desc: 'Toggle Shortcuts Help' },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl text-white font-light mb-6 tracking-wide">Keyboard Shortcuts</h2>

                <div className="space-y-4">
                    {shortcuts.map(s => (
                        <div key={s.key} className="flex justify-between items-center text-sm">
                            <kbd className="bg-white/10 px-3 py-1.5 rounded-lg text-white font-mono min-w-[3rem] text-center border border-white/5 shadow-inner">
                                {s.key}
                            </kbd>
                            <span className="text-white/60">{s.desc}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 w-full py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-colors text-sm uppercase tracking-wider"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ShortcutsHelp;
