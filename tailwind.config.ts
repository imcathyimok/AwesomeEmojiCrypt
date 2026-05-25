import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0a0f1e",
        deepTeal: "#10313a",
        neonCyan: "#22d3ee",
        neonGreen: "#34d399",
      },
      boxShadow: {
        glow: "0 0 30px rgba(34, 211, 238, 0.2)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(16,49,58,0.7), #0a0f1e 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
