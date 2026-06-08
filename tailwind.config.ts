import type { Config } from 'tailwindcss';

const tailwindConfig: Partial<Config> = {
  darkMode: ['class'],
  content: [],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'transparent',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        'accent-light': 'rgb(var(--accent-light) / <alpha-value>)',
        'muted-light': 'rgb(var(--muted-light) / <alpha-value>)',
        colorDanger: 'rgb(var(--color-danger) / <alpha-value>)',
        colorDangerLight: 'rgb(var(--color-danger-light) / <alpha-value>)',
        colorWarning: 'rgb(var(--color-warning) / <alpha-value>)',
        colorWarningLight: 'rgb(var(--color-warning-light) / <alpha-value>)',
        colorSuccess: 'rgb(var(--color-success) / <alpha-value>)',
        ciLightGreen: 'rgb(var(--ci-light-green) / <alpha-value>)',
        ciDarkBlue: 'rgb(var(--ci-dark-blue) / <alpha-value>)',
        ciLightBlue: 'rgb(var(--ci-light-blue) / <alpha-value>)',
        ciGrey: 'rgb(var(--ci-dark-gray) / <alpha-value>)',
        darkGrey: 'rgb(45 45 48 / <alpha-value>)',
        darkGreyDisabled: 'rgb(26 26 27 / <alpha-value>)',
      },
      backgroundImage: {
        ciGreenToBlue: 'linear-gradient(45deg, rgb(var(--ci-light-green)), rgb(var(--ci-dark-blue)))',
      },
      fontSize: {
        p: '0.938rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
