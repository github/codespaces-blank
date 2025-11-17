/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all your React files
  ],
  darkMode: "class", // From your design
  theme: {
    extend: {
      colors: {
        "primary": "#5590f7",
        "background-light": "#f5f6f8",
        "background-dark": "#101622",
        "card-light": "#ffffff",
        "card-dark": "#1b2332",
        "text-light-primary": "#1f2937",
        "text-dark-primary": "#f0f2f5",
        "text-light-secondary": "#6b7280",
        "text-dark-secondary": "#9ca3af",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"], // From your design
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}