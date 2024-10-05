import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import path from "path";

export default defineConfig({
  plugins: [],
  root: "src", // Set the root to the src directory
  base: "./", // Ensures relative paths in the built files
  assetsInclude: ["./src/assets/*.glb"],
  build: {
    outDir: "../", // Output directory outside src
    emptyOutDir: false, // don't Clean the output directory before build
    rollupOptions: {
      input: path.resolve(__dirname, "src", "index.html"), // Entry point
    },
  },
  server: {
    port: 3000, // Optional: Specify a port
    open: true, // Optional: Automatically open the browser
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Optional: Create an alias for src
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
