import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold:  "#c9a96e",
          dark:  "#080604",
          light: "#f5f0e8",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body:    ["var(--font-sarabun)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
