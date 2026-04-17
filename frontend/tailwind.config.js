/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 50px rgba(53, 232, 255, 0.25)',
        glass: '0 20px 80px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        'aurora-radial': 'radial-gradient(circle at top left, rgba(82, 231, 255, 0.35), transparent 35%), radial-gradient(circle at bottom right, rgba(255, 176, 72, 0.25), transparent 28%)',
        'mesh-dark': 'linear-gradient(135deg, rgba(5, 15, 26, 0.98), rgba(7, 23, 44, 0.92) 42%, rgba(13, 36, 53, 0.88))'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(10px, -16px, 0) scale(1.05)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-120% 0' },
          '100%': { backgroundPosition: '120% 0' }
        }
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite'
      }
    }
  },
  plugins: []
};