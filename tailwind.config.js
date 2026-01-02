/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'forensic-dark': '#0a0a0c',
                'forensic-panel': '#121216',
                'forensic-caution': '#fef08a', // Lightened from #facc15
                'forensic-red': '#ef4444',
                'forensic-slate': '#1e293b',
            },
            fontFamily: {
                'mono': ['Roboto Mono', 'monospace'],
                'courier': ['Courier Prime', 'serif'],
            },
            boxShadow: {
                'brutalist': '8px 8px 0px 0px rgba(30, 41, 59, 0.5)',
                'brutalist-caution': '4px 4px 0px 0px rgba(250, 204, 21, 0.2)',
            },
            animation: {
                'scanline': 'scanline 10s linear infinite',
                'flicker': 'flicker 0.15s infinite',
                'glitch': 'glitch 0.2s infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                flicker: {
                    '0%': { opacity: '0.97' },
                    '5%': { opacity: '0.9' },
                    '10%': { opacity: '0.95' },
                    '15%': { opacity: '0.85' },
                    '20%': { opacity: '0.98' },
                    '100%': { opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
