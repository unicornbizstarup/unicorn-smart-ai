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
        // Brand
        "brand-gold":       "#b8924a",
        "brand-gold-hover": "#a07c38",
        "brand-gold-light": "#f5e8d0",
        "brand-gold-muted": "#d4a96e",
        "brand-dark":       "#1a1209",
        // Background
        "bg-page":    "#f7f4ef",
        "bg-card":    "#ffffff",
        "bg-sidebar": "#ffffff",
        "bg-hover":   "#faf5ec",
        "bg-active":  "#f5e8d0",
        // Text
        "text-primary":   "#1a1209",
        "text-secondary": "#6b5e4a",
        "text-muted":     "#9e8e78",
        // Border
        "border-default": "#ece6dc",
        "border-muted":   "#f0ebe3",
        "border-strong":  "#d4c9b8",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["Sarabun", "Noto Sans Thai", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs:    ["11px", { lineHeight: "16px" }],
        sm:    ["12px", { lineHeight: "18px" }],
        base:  ["13.5px", { lineHeight: "20px" }],
        md:    ["14px", { lineHeight: "21px" }],
        lg:    ["16px", { lineHeight: "24px" }],
        xl:    ["18px", { lineHeight: "27px" }],
        "2xl": ["22px", { lineHeight: "30px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
      },
      borderRadius: {
        sm:  "6px",
        md:  "8px",
        lg:  "12px",
        xl:  "16px",
        "2xl": "20px",
      },
      boxShadow: {
        sm:   "0 1px 3px rgba(26,18,9,0.06)",
        md:   "0 2px 8px rgba(26,18,9,0.08)",
        card: "0 1px 4px rgba(26,18,9,0.07)",
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