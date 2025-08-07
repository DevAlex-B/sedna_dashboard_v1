module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        main: '#036EC8',
        secondary: '#e16f3d',
      },
      backgroundImage: {
        'gradient-light':
          'radial-gradient(circle at top left, #036EC8 0%, #f7f9fc 50%, #ffffff 100%)',
        'gradient-dark':
          'radial-gradient(circle at top left, #036EC8 0%, #2e353b 50%, #1a1d20 100%)',
      },
    },
  },
  plugins: [],
};
