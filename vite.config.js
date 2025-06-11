import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__direname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, ".src/components"),
      "@css": path.resolve(__dirname, "./src/css"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@scss": path.resolve(__dirname, "./src/scss"),
    },
  },
});
