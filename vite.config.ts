import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import imagemin from "vite-plugin-imagemin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename));

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    imagemin({
      gifsicle: {
        optimizationLevel: 3,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 65,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false,
          },
        ],
      },
    }),
  ],

  root: path.resolve(__dirname),

  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
