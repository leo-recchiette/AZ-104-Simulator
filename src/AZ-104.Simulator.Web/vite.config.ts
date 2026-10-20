import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 0.0.0.0: sul localhost del container Vite non sarebbe raggiungibile dall'host.
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      // Su macOS i bind mount di Docker Desktop perdono eventi inotify: senza polling niente hot reload.
      usePolling: true,
      interval: 300,
    },
  },
});
