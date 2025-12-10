import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname),

  build: {
    outDir: resolve(__dirname, "dist"),

    rollupOptions: {
      input: {
        lobby: resolve(__dirname, "lobby.html"),
        game: resolve(__dirname, "game.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
});
