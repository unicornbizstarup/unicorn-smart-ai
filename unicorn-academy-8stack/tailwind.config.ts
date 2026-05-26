// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand gradient
        "brand-red":          "#c0281e",
        "brand-orange":       "#e8621a",
        "brand-amber":        "#f5a623",
        "brand-gold":         "#b8924a",
        "brand-gold-hover":   "#a07c38",
        "brand-gold-light":   "#fef6ea",
        "brand-gold-mid":     "#f5e2c0",
        "brand-gold-muted":   "#d4a96e",
        "brand-dark":         "#1a1209",
        // Backgrounds
        "bg-page":            "#f7f4ef",
        "bg-card":            "#ffffff",
        "bg-sidebar":         "#ffffff",
        "bg-input":           "#faf8f4",
        "bg-hover":           "#faf5ec",
        "bg-active":          "#f5e8d0",
        // Text
        "text-primary":       "#1a1209",
        "text-secondary":     "#6b5e4a",
        "text-muted":         "#9a8a72",
        // Borders
        "border-default":     "#e8e2d9",
        "border-muted":       "#f0ebe3",
        "border-mid":         "#d6cfc4",
        "border-strong":      "#c4bcb0",
      },
      fontFamily: {
        display: ["var(--font-prompt)", "Prompt", "sans-serif"],
        body:    ["var(--font-sarabun)", "Sarabun", "Noto Sans Thai", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm:    "6px",
        md:    "8px",
        lg:    "12px",
        xl:    "16px",
        "2xl": "20px",
      },
      boxShadow: {
        sm:   "0 1px 3px rgba(26,18,9,.06)",
        md:   "0 2px 8px rgba(26,18,9,.08)",
        card: "0 1px 4px rgba(26,18,9,.07)",
      },
      spacing: {
        sidebar: "220px",
        topbar:  "52px",
      },
    },
  },
  plugins: [],
};

export default config;
