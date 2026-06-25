import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#080a0f",
        charcoal: "#111721",
        panel: "#121922",
        metal: "#3d4656",
        minecraft: "#64ff72",
        discord: "#7a9cff",
        arena: "#ffb84d",
        danger: "#ff5f73",
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Cascadia Mono",
          "Consolas",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        glowGreen: "0 0 24px rgba(100, 255, 114, 0.22)",
        glowBlue: "0 0 24px rgba(122, 156, 255, 0.2)",
        insetPanel: "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -18px 40px rgba(0,0,0,0.24)",
      },
    },
  },
  plugins: [],
} satisfies Config;
