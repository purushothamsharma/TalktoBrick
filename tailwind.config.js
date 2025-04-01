/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#FFFBF5',
          100: '#F8F7F2',
          200: '#EFEEE9',
          300: '#E6E5E0',
          400: '#DDDCD7',
          500: '#D4D3CE',
        },
        brick: {
          50: '#FDF5F3',
          100: '#FAEBE7',
          200: '#F5D6CF',
          300: '#EFB8AD',
          400: '#E48D83',
          500: '#2B2B2B',
          600: '#232323',
          700: '#1A1A1A',
          800: '#121212',
          900: '#0A0A0A',
          950: '#050505',
        },
        gold: {
          50: '#FDFAF2',
          100: '#FBF5E5',
          200: '#F7EBCC',
          300: '#F3E0B3',
          400: '#EFD699',
          500: '#D4AF37',
          600: '#B39329',
          700: '#8C721F',
          800: '#665216',
          900: '#3F320D',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(43, 43, 43, 0.06)',
        'luxury-lg': '0 10px 15px -3px rgba(212, 175, 55, 0.1), 0 4px 6px -2px rgba(43, 43, 43, 0.05)',
        'luxury-xl': '0 20px 25px -5px rgba(212, 175, 55, 0.1), 0 10px 10px -5px rgba(43, 43, 43, 0.04)',
        'luxury-2xl': '0 25px 50px -12px rgba(212, 175, 55, 0.25)',
        'luxury-inner': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.05)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(203, 216, 176, 0.05) 100%)',
        'gold-shimmer': 'linear-gradient(45deg, transparent 45%, rgba(212, 175, 55, 0.1) 50%, transparent 55%)',
        'brick-pattern': 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
    disableColorOpacityUtilitiesByDefault: true,
  },
};