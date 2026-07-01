import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c97a",
          dark: "#9a7a30",
        },
        dark: {
          DEFAULT: "#0a0a0a",
          2: "#111111",
          3: "#1a1a1a",
          4: "#222222",
        },
        light: {
          DEFAULT: "#f5f5f0",
          2: "#ebe8e0",
        },
        muted: "#888880",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.3em",
        ultra: "0.5em",
      },
    },
  },
  plugins: [],
};

export default config;
