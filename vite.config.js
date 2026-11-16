import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Hosted at the domain root. If deployed under a subpath, set base: "/subpath/"
// and retest both /mock endpoints (api.js reads import.meta.env.BASE_URL).
export default defineConfig({
  base: "/",
  plugins: [react()],
});
