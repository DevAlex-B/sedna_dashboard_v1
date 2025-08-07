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
        'gradient-light': 'linear-gradient(to bottom right, #ffffff, #f7f9fc, #e8eef5)',
        'gradient-dark': 'radial-gradient(circle at top left, #036EC8 5%, #2e353b 30%, #1a1d20 100%)',
      },
    },
  },
  plugins: [],
};
