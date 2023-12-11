/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "var(--dark-blue)",
        "light-blue": "var(--light-blue)",
        "primary-button": "var(--primary-button)",
        "secondary-button": "var(--secondary-button)",
        "terciary-button": "var(--terciary-button)",
        "primary-table": "var(--primary-table)",
        "secondary-table": "var(--secondary-table)",
        "secondary-font": "var(--secondary-font)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
          ".no-scrollbar": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
