/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        'bg-blue-500',
        'bg-red-500',
        'bg-purple-500', // for the ambient background
        'bg-blue-500/10',
        'bg-red-500/10',
        'bg-purple-500/10',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
