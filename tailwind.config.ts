import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: { 500: "#FF69B4", 600: "#DB2777" },
        purple: { 500: "#C084FC", 600: "#9333EA" }
      }
    }
  },
  plugins: []
};

export default config;
