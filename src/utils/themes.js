export const THEMES = {
    MIDNIGHT: {
        id: 'midnight',
        label: 'Midnight',
        classes: {
            bg: 'bg-gray-900',
            text: 'text-white',
            accent: 'text-blue-400',
            ring: 'text-blue-500' // Dynamic handling in ProgressRing needed
        },
        colors: { // For inline styles / canvas
            primary: '#60A5FA',
            secondary: '#F87171'
        }
    },
    FOREST: {
        id: 'forest',
        label: 'Forest',
        classes: {
            bg: 'bg-[#1a2e1a]', // Dark green
            text: 'text-[#e2e8f0]',
            accent: 'text-green-400',
        },
        colors: {
            primary: '#34D399',
            secondary: '#A7F3D0'
        }
    },
    EMBER: {
        id: 'ember',
        label: 'Ember',
        classes: {
            bg: 'bg-[#2a1a1a]', // Dark red
            text: 'text-[#fff1f2]',
            accent: 'text-red-400'
        },
        colors: {
            primary: '#F87171',
            secondary: '#FCA5A5'
        }
    },
    CYBERPUNK: {
        id: 'cyberpunk',
        label: 'Cyberpunk',
        classes: {
            bg: 'bg-[#000000]',
            text: 'text-[#2de2e6]',
            accent: 'text-[#f6019d]'
        },
        colors: {
            primary: '#2de2e6',
            secondary: '#f6019d'
        }
    }
};
