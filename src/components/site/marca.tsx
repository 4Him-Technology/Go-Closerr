import { cn } from "@/lib/utils"

// Logo da metch a partir dos arquivos originais (PNG com fundo transparente, recortados por scripts-logo.py).
// "cabecalho": símbolo + nome, sem o slogan, que ficaria ilegível nesse tamanho. "completa": com "Encontre, conecte, opere.".
const LOGOS = {
  cabecalho: { src: "./logo-cabecalho.png", w: 611, h: 212 },
  completa: { src: "./logo.png", w: 623, h: 224 },
  branca: { src: "./logo-branco.png", w: 681, h: 250 },
} as const

export function Marca({ variante = "cabecalho", altura = 34, alt = "", className }: { variante?: keyof typeof LOGOS; altura?: number; alt?: string; className?: string }) {
  const l = LOGOS[variante]
  return <img src={l.src} alt={alt} width={Math.round((altura * l.w) / l.h)} height={altura} decoding="async" className={cn("block shrink-0", className)} />
}
