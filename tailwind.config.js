module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        header: 'var(--header-bg)',
        app: 'var(--app-bg)',
        sidebar: 'var(--sidebar-bg)',
        default: 'var(--text)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
        focus: 'var(--focus)',
        'primary-hover': 'var(--primary-hover)',
      },
    },
  },
  plugins: [],
};
