import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    // Conteneur centré, marge latérale de 16 px sur mobile.
    // Les max-width par palier (640/768/1024/1280/1440) viennent des breakpoints ci-dessous.
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif']
      },
      // Le breakpoint 'xs' (320px) a été retiré : il plafonnait `.container` à 320px sur tous les téléphones.
      // Aucun usage de `xs:` dans le code.
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      colors: {
        'f1-red': '#FF1801', // Rouge vif : texte/accents sur fond sombre uniquement (5,0:1 sur f1-black)
        'f1-red-action': '#E10600', // Rouge des fonds portant du texte blanc (5,0:1, AA)
        'f1-red-dark': '#B30000',
        'f1-black': '#0B0B0F', // Deep rich black
        'f1-dark-gray': '#15151E',
        'f1-gray': '#38383F',
        'f1-silver': '#E0E0E0',
        'f1-light': '#F8F4F4',
        'glass-dark': 'rgba(21, 21, 30, 0.7)',
        'glass-light': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/grid-pattern.svg')", // Placeholder if needed
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale': 'scale 0.2s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        f1theme: {
          "primary": "#E10600", // = f1-red-action (texte blanc lisible)
          "primary-content": "#FFFFFF",
          "secondary": "#0B0B0F",
          "accent": "#38383F",
          "neutral": "#F8F4F4",
          "base-100": "#0B0B0F", // Dark base
          "base-200": "#15151E",
          "base-300": "#1E1E2A",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
} satisfies Config