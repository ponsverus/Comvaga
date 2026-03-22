export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Condensed', 'sans-serif'],
      },
      borderRadius: {
        custom: '3px',
        button: '9999px',
      },
      colors: {
        primary: '#FFD700',
        dark: {
          100: '#1a1a1a',
          200: '#0d0d0d',
          300: '#000000',
        },
        vbg:           'var(--vbg)',
        vcard:         'var(--vcard)',
        vcard2:        'var(--vcard2)',
        vtext:         'var(--vtext)',
        vsub:          'var(--vsub)',
        vmuted:        'var(--vmuted)',
        vborder:       'var(--vborder)',
        vborder2:      'var(--vborder2)',
        vprimary:      'var(--vprimary)',
        'vprimary-text': 'var(--vprimary-text)',
        voferta:       'var(--voferta-text)',
        vpromo:        'var(--vpromo-text)',
        verror:        'var(--verror-text)',
      }
    },
  },
  plugins: [],
}
