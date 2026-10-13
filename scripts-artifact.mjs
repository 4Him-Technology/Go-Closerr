// Gera dist-artifact/artifact.html: o conteúdo do index.html sem doctype/html/head/body,
// porque o artifact do claude.ai já envolve a página com esse esqueleto.
import { readFileSync, writeFileSync } from "node:fs"
const html = readFileSync("dist-artifact/index.html", "utf8")
const head = html.match(/<head>([\s\S]*)<\/head>/)[1]
const body = html.match(/<body>([\s\S]*)<\/body>/)[1]
const tags = (re) => [...head.matchAll(re)].map((m) => m[0]).join("\n")
const saida = [
  tags(/<title>[\s\S]*?<\/title>/g),
  tags(/<link[^>]*fonts\.(googleapis|gstatic)[^>]*>/g),
  tags(/<style[\s\S]*?<\/style>/g),
  body.replace(/<script[\s\S]*?<\/script>/g, "").trim(),
  tags(/<script[\s\S]*?<\/script>/g),
].join("\n")
// o publicador recusa U+FFFD literal; no bundle ele só aparece em strings JS, onde o escape é equivalente
writeFileSync("dist-artifact/artifact.html", saida.replaceAll(String.fromCharCode(0xfffd), String.raw`\ufffd`))
console.log("artifact.html", Math.round(saida.length / 1024), "KB")
