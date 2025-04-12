import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/v0/b/chatty-b0606.appspot.com/o': {
        target: 'https://firebasestorage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v0\/b\/chatty-b0606.appspot.com\/o/, '/v0/b/chatty-b0606.appspot.com/o'),
      },
    },
  },
});
