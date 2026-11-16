/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        espresso: '#0D0907',
        'espresso-50': '#1A1310',
        'espresso-100': '#231A15',
        'espresso-200': '#2E221C',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
