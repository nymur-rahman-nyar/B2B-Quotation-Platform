// tailwind.config.js
module.exports = {
  // **Add this** so Tailwind knows where to look for your class names:
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // your DaisyUI plugin
  ],
};
