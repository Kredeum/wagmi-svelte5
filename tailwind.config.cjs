import daisyui from "daisyui";

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)"
      }
    }
  },

  daisyui: {
    themes: [
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px"
          },
          ".link": {
            textUnderlineOffset: "2px"
          },
          ".link:hover": {
            opacity: "80%"
          },

          ".bg-green-ai": {
            "background-color": "#DDFAE4"
          }
        }
      }
    ]
  },

  plugins: [daisyui]
};

export default config;
