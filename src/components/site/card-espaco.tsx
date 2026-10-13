import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { TURNO, cidadeDe, dataCurta, deChave, listaPt, type Espaco } from "@/data/espacos"
import { FotoSala, N_FOTOS } from "@/components/site/foto-sala"
import { useApp } from "@/lib/app"
import { MOLA, MOLA_RAPIDA } from "@/lib/motion"
import { cn } from "@/lib/utils"


// Card de anúncio no padrão Airbnb: fotos navegáveis dentro do card, favorito e a próxima data no lugar do preço.
export function CardEspaco({ espaco: e, data, indice = 0, className }: { espaco: Espaco; data?: string; indice?: number; className?: string }) {
  const { favoritos, alternarFavorito } = useApp()
  const [foto, setFoto] = useState(0)
  const [dir, setDir] = useState(1)
  const fav = favoritos.includes(e.id)
  const livres = data ? e.agenda[data] : undefined

  const mudar = (passo: number) => {
    setDir(passo)
    setFoto((f) => (f + passo + N_FOTOS) % N_FOTOS)
  }

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.16 } }}
      transition={{ ...MOLA, delay: Math.min(indice, 8) * 0.04 }}
      className={cn("group relative flex min-w-0 flex-col gap-3", className)}
    >
      <div className="relative aspect-[20/19] overflow-hidden rounded-2xl bg-superficie">
        <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={foto}
              custom={dir}
              initial={{ opacity: 0, x: dir * 28, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -14, filter: "blur(4px)" }}
              transition={MOLA_RAPIDA}
              className="absolute inset-0"
            >
              <FotoSala espaco={e} indice={foto} />
            </motion.div>
          </AnimatePresence>
        </div>

        <span className="absolute top-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold sombra-card">{e.salas} salas</span>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => alternarFavorito(e.id)}
          aria-pressed={fav}
          aria-label={fav ? `Tirar ${e.nome} dos favoritos` : `Salvar ${e.nome} nos favoritos`}
          className="absolute top-2.5 right-2.5 z-10 grid size-9 place-items-center rounded-full"
        >
          <motion.span key={String(fav)} initial={fav ? { scale: 0.7 } : false} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.35, bounce: 0.45 }}>
            <Heart className={cn("size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,.35)] transition-colors", fav ? "fill-marca stroke-foreground" : "fill-black/35 stroke-white")} strokeWidth={2} aria-hidden />
          </motion.span>
        </motion.button>

        {/* setas aparecem no hover; no toque ficam sempre visíveis */}
        <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 flex -translate-y-1/2 justify-between opacity-100 transition-opacity duration-200 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          <button type="button" onClick={() => mudar(-1)} aria-label="Foto anterior" className="pointer-events-auto grid size-8 place-items-center rounded-full bg-white/95 sombra-card transition-transform hover:scale-105 active:scale-95">
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => mudar(1)} aria-label="Próxima foto" className="pointer-events-auto grid size-8 place-items-center rounded-full bg-white/95 sombra-card transition-transform hover:scale-105 active:scale-95">
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-2.5 z-10 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: N_FOTOS }, (_, i) => (
            <span key={i} className={cn("size-1.5 rounded-full bg-white transition-all duration-300", i === foto ? "scale-110 opacity-100" : "opacity-55")} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-[15px] leading-snug font-semibold tracking-normal">
          {/* link esticado: o card inteiro abre o espaço, sem botão dentro de link */}
          <a href={`#espaco-${e.id}`} className="after:absolute after:inset-0 after:z-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-ring">
            {e.nome}
          </a>
        </h3>
        <p className="text-sm text-muted-foreground">{cidadeDe(e)}</p>
        {livres ? (
          <>
            <span className="mt-1 inline-flex w-fit items-baseline gap-1.5 rounded-full bg-marca px-3 py-1 text-sm font-semibold tabular">
              <span className="text-[11px] tracking-wide uppercase opacity-70">Livre em</span>
              {dataCurta(deChave(data!))}
            </span>
            <span className="text-xs text-muted-foreground">{listaPt(livres.map((t) => TURNO[t].nome))}</span>
          </>
        ) : (
          <span className="mt-1 inline-flex w-fit items-baseline gap-1.5 rounded-full bg-marca px-3 py-1 text-sm font-semibold tabular">
            <span className="text-[11px] tracking-wide uppercase opacity-70">Próxima data</span>
            {dataCurta(e.proxima)}
          </span>
        )}
      </div>
    </motion.article>
  )
}
