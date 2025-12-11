import React, { useState } from 'react';
import { THEMES } from '../utils/themes';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCustomColor = (e) => {
        const color = e.target.value;
        onThemeChange({
            id: 'custom',
            label: 'Custom',
            colors: { primary: color, secondary: '#ffffff' },
            classes: { bg: 'bg-black', text: 'text-white', accent: 'text-white' }
        });
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white/40 hover:text-white transition-colors"
                title="Visual Theme"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800/90 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl min-w-[140px] flex flex-col gap-1">
                    {Object.values(THEMES).map(theme => (
                        <button
                            key={theme.id}
                            onClick={() => {
                                onThemeChange(theme);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${currentTheme.id === theme.id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div
                                className={`w-3 h-3 rounded-full ${theme.classes.bg === 'bg-[#000000]' ? 'border border-white/30' : ''}`}
                                style={{ backgroundColor: theme.colors.primary }}
                            />
                            {theme.label}
                        </button>
                    ))}

                    <div className="border-t border-white/10 my-1"></div>

                    <label className="px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/5 cursor-pointer">
                        <input
                            type="color"
                            className="w-4 h-4 rounded-full overflow-hidden bg-transparent cursor-pointer border-none p-0"
                            onChange={handleCustomColor}
                            title="Pick custom color"
                        />
                        <span>Custom</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
