import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 14px 50px -12px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
