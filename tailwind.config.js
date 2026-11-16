/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        pearl:    { DEFAULT: '#FAF9F6', 100: '#F5F4F0', 200: '#ECEAE4' },
        aqua:     { DEFAULT: '#0D9488', light: '#14B8A6', dark: '#0F766E' },
        skyblue:  { DEFAULT: '#0284C7', light: '#38BDF8', dark: '#0369A1' },
        navy:     { DEFAULT: '#0F172A' },
        slate:    { body: '#334155', muted: '#64748B' },
      },
      backgroundImage: {
        'gradient-aqua': 'linear-gradient(135deg, #0D9488, #0284C7)',
      },
    },
  },
  plugins: [],
}
