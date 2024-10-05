import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [],
  base: "/",
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
