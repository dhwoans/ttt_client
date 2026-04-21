import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: "game components",
          include: ["./src/features/game/**/*.test.{js,ts,tsx}"],
          environment: "jsdom",
          globals: true,
        },
      },
      {
        test: {
          name: "lobby components",
          include: ["./src/features/lobby/**/*.test.{js,ts,tsx}"],
          environment: "jsdom",
          globals: true,
        },
      },
      {
        test: {
          name: "shared components",
          include: ["./src/shared/**/*test.{js,ts,tsx}"],
          environment: "jsdom",
          globals: true,
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
