import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          300: "#67A3FF",
          400: "#3B75D4",
          500: "#0D47A1",
          600: "#0B3F8A",
          700: "#093471",
        },
        gray: {
          50:  "#F5F6F8",
          100: "#F1F2F4",
          200: "#E3E5E8",
          300: "#CFCFD4",
          400: "#B6BAC0",
          500: "#9AA0A6",
          600: "#6B7280",
          700: "#4B5563",
          800: "#2F343C",
          900: "#111827",
        },
        success: { DEFAULT: "#22C55E" },
        warning: { DEFAULT: "#FFC107" },
        error:   { DEFAULT: "#EF4444" },
      },

      fontFamily: {
        sans: [
          "Futura",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      lineHeight: {
        "110": "1.1",
      },

      borderRadius: {
        input: "10px",
        button: "12px",
      },
    },
  },

  plugins: [],
};

export default config;
