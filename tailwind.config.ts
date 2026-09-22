/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        accent: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        surface: {
          page:    "#f0f4f8",
          card:    "#ffffff",
          sidebar: "#ffffff",
        },
      },
      boxShadow: {
        xs:    "0 1px 2px 0 rgba(0,0,0,.04)",
        "2xs": "0 1px 1px 0 rgba(0,0,0,.03)",
      },
      borderRadius: {
        DEFAULT: "10px",
        sm:  "6px",
        md:  "10px",
        lg:  "14px",
        xl:  "20px",
        "2xl": "28px",
      },
      fontSize: {
        "2xs": ["10px", "14px"],
        xs:    ["12px", "16px"],
        sm:    ["13.5px", "20px"],
        base:  ["15px", "24px"],
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand":    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      },
      animation: {
        "fade-in":     "fadeIn .2s ease-out",
        "fade-in-up":  "fadeInUp .25s ease-out",
        "slide-in-right": "slideInRight .22s ease-out",
        shimmer:       "shimmer 1.4s infinite",
      },
      keyframes: {
        fadeIn:         { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeInUp:       { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInRight:   { from: { opacity: "0", transform: "translateX(12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer:        { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(.4,0,.2,1)",
      },
    },
  },
  plugins: [],
};