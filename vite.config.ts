import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // Ensure the correct port
  },
  resolve: {
    alias: {
      "@": "/src", // Support absolute imports
    },
  },
  optimizeDeps: {
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Ensure React is auto-injected
  },
});
