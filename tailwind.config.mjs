/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E2A50", // Default primary color
          light: "#3A4C80",  // Lighter shade
          dark: "#141B38",   // Darker shade
        },
        secondary: {
          DEFAULT: "#CDB12A", // Default secondary color
          light: "#E0C75E",  // Lighter shade
          dark: "#A28E1F",   // Darker shade
        },
      },
    },
  },
  plugins: [],
};
