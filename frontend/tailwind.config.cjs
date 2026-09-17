/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        'app-base': '#0F172A',       // Base App Background (Slate 900)
        'surface-card': '#1E293B',    // Surface/Card Background (Slate 800)
        'elevated-surface': '#334155',// Elevated Surface (Modals/Dropdowns) (Slate 700)

        /* Primary Brand */
        'accent-cyan': '#06B6D4',     // Active states, primary buttons (Cyan 500)
        'accent-blue': '#3B82F6',     // Links, highlights (Blue 500)

        /* Incident Status Colors (Critical for UI) */
        'status-critical': '#EF4444', // Red 500
        'status-warning': '#F59E0B',  // Amber 500
        'status-success': '#10B981',  // Emerald 500
        'status-neutral': '#64748B',  // Slate 500

        /* Typography */
        'text-primary': '#F8FAFC',    // Slate 50
        'text-secondary': '#94A3B8',  // Slate 400

        /* Borders & Dividers */
        'border-subtle': '#334155',   // Slate 700
      },
      boxShadow: {
        'panel': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'cyan-glow': '0 0 15px -3px rgba(6, 182, 212, 0.35)',
        'red-glow': '0 0 15px -3px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'edge-flow': 'flowDash 1s linear infinite',
      },
      keyframes: {
        flowDash: {
          to: { strokeDashoffset: '-20' },
        },
      },
    },
  },
  plugins: [],
};
