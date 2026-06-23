/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Modern SaaS palette — indigo brand on a slate canvas.
        brand: {
          DEFAULT: '#4f46e5',
          light: '#6366f1',
          dark: '#4338ca',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          600: '#4f46e5',
          700: '#4338ca',
        },
        ink: { DEFAULT: '#0f172a', muted: '#64748b', soft: '#94a3b8' },
        canvas: '#f8fafc',
        surface: '#ffffff',
        line: '#e2e8f0',
        positive: { DEFAULT: '#059669', soft: '#d1fae5' },
        warning: { DEFAULT: '#d97706', soft: '#fef3c7' },
        danger: { DEFAULT: '#dc2626', soft: '#fee2e2' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        pop: '0 10px 30px -10px rgb(15 23 42 / 0.20)',
      },
      maxWidth: { content: '1240px' },
    },
  },
  plugins: [],
}
