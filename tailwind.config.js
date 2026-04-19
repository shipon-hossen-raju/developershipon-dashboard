/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#198f51',
        'primary-hover': '#15a857',
        'primary-light': '#f0fdf4',
        'primary-dark-light': '#052e16',
        sidebar: '#0f172a',
        'sidebar-hover': '#1e293b',
        surface: '#ffffff',
        'surface-dark': '#1e293b',
        'bg-main': '#f8fafc',
        'bg-main-dark': '#0f172a',
        border: '#e2e8f0',
        'border-dark': '#334155',
        'text-main': '#0f172a',
        'text-main-dark': '#f1f5f9',
        'text-muted': '#64748b',
        'text-muted-dark': '#94a3b8',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10)',
        sidebar: '4px 0 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
