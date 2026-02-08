/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY - Medical Blue (Trust & Safety)
        primary: {
          50: '#E7F1FF',   // Soft Sky Blue (Accent backgrounds)
          100: '#CFE2FF',
          200: '#9DC6FF',
          300: '#6BA9FF',
          400: '#3A8DFF',
          500: '#0B5ED7',  // Main Medical Blue
          600: '#094BB0',
          700: '#073883',
          800: '#052557',
          900: '#02122B',
        },
        // SUCCESS - Healthcare Green
        success: {
          50: '#E6FAF2',
          100: '#CDF5E5',
          200: '#9BEBCB',
          300: '#69E1B1',
          400: '#37D797',
          500: '#1FA971',  // Main Healthcare Green
          600: '#19875A',
          700: '#136544',
          800: '#0C432D',
          900: '#062217',
        },
        // ERROR/DANGER - Soft Medical Red
        danger: {
          50: '#FDEDED',
          100: '#FBDBDB',
          200: '#F7B7B7',
          300: '#F39393',
          400: '#EF6F6F',
          500: '#DC3545',  // Main Medical Red
          600: '#B02A37',
          700: '#842029',
          800: '#58151C',
          900: '#2C0B0E',
        },
        // NEUTRAL SYSTEM
        gray: {
          50: '#F8FAFC',   // Main Background
          100: '#F1F5F9',  // Section Background
          200: '#E2E8F0',  // Border Light
          300: '#CBD5E1',  // Border Default
          400: '#94A3B8',  // Muted Text
          500: '#64748B',
          600: '#475569',  // Secondary Text
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',  // Primary Text
        },
        // DEPRECATED (for backwards compatibility)
        secondary: {
          500: '#0B5ED7',  // Maps to primary
        },
        accent: {
          500: '#E7F1FF',  // Maps to primary-50
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
