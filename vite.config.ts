import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// `npm run build:artifact` gera um HTML único (JS e CSS embutidos) para publicar como artifact do claude.ai,
// que só aceita scripts próprios embutidos na página.
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), tailwindcss(), ...(mode === "artifact" ? [viteSingleFile()] : [])],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { port: Number(process.env.PORT) || 5174 },
  preview: { port: Number(process.env.PORT) || 4174 },
  build: mode === "artifact" ? { outDir: "dist-artifact", chunkSizeWarningLimit: 4000 } : undefined,
}))
