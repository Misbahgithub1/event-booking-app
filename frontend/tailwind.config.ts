import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#64748b",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      spacing: {
        128: "32rem",
        144: "36rem",
      },

      // ✅ Animation moved inside theme.extend
      animation: {
        "fade-in": "fadeIn 1s ease-in-out forwards",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;