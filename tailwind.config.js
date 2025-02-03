import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
    "./node_modules/@heroui/theme/dist/components/(badge|breadcrumbs|button|card|code|dropdown|input|kbd|link|listbox|modal|navbar|snippet|toggle|form).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
