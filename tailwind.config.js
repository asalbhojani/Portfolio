/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:        'var(--accent)',
        'accent-2':    'var(--accent-2)',
        'bg-surface':  'var(--bg-surface)',
        'bg-card':     'var(--bg-card)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        // legacy aliases — kept so any existing Tailwind utility classes keep working
        gold:     'var(--gold)',
        'gold-l': 'var(--gold-l)',
        ivory:    'var(--ivory)',
        muted:    'var(--muted)',
        obsidian: 'var(--bg)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
