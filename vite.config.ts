import { defineConfig } from "vite";

export default defineConfig({
  // Root in dev so you can use http://localhost:5173/ ; repo path only for production (GitHub Pages)
  base: process.env.NODE_ENV === "production" ? "/age-of-the-terminal/" : "/",
});
