import type { Config } from "tailwindcss";
// @ts-expect-error no type declaration fil is available
import tailwindcssMotion from "tailwindcss-motion";
import daisyui from 'daisyui';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    daisyui,
    tailwindcssMotion,
  ],
  daisyui: {
    themes: ["light", "dark", "retro", "nord", "valentine"],
  }
} satisfies Config;
