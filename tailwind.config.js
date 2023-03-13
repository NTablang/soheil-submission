/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        spaceMono: ["SpaceMonoRegular", "sans-serif"],
        spaceMonoItalic: ["SpaceMonoItalic", "sans-serif"],
        spaceMonoBold: ["SpaceMonoBold", "sans-serif"],
        spaceMonoBoldItalic: ["SpaceMonoBoldItalic", "sans-serif"],
        monumentExtended: ["MonumentExtendedRegular", "sans-serif"],
        monumentExtendedUltraBold: ["MonumentExtendedUltraBold", "sans-serif"],
      }
    },
  },
  plugins: [],
  important: true,
}