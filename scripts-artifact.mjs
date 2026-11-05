// Prepara dist-artifact/index.html (HTML único gerado pelo vite-plugin-singlefile) para publicar como artifact do claude.ai.
// O publicador recusa U+FFFD literal; no bundle ele só aparece em strings JS, onde o escape é equivalente.
import { readFileSync, writeFileSync } from "node:fs"

const arquivo = "dist-artifact/index.html"
const html = readFileSync(arquivo, "utf8")
const escape = String.fromCharCode(92) + "ufffd" // barra invertida montada por código
writeFileSync(arquivo, html.replaceAll(String.fromCharCode(0xfffd), escape))
console.log("index.html", Math.round(html.length / 1024), "KB")
