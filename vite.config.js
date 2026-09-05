import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite bundles the app; the two JSON files under data/ are imported directly so the
// dataset and the schedule ship inside the static bundle. No server, no API.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: "node", include: ["src/**/*.test.js"] },
});
