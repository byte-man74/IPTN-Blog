import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/_components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primaryGreen: 'var(--primaryGreen)',
        secondaryBg: 'var(--secondaryBackground)',
        textColor: 'var(--textColor)',
        primaryDark: 'var(--primaryDark)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      padding: {
        'x-sm': '0.05rem',
        'x-md': '0.5rem',
        'x-lg': '1.5rem',
        'x-xl': '2rem',
        'x-2xl': '3.5rem',
      },
      fontSize: {
        'basic-header': '16px',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
