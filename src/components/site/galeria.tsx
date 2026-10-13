import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react"
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react"
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs"
import { FotoSala, N_FOTOS, fotosDe, urlFoto } from "@/components/site/foto-sala"
import type { Espaco } from "@/data/espacos"
import { MOLA, MOLA_RAPIDA } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ---------- tour 360°: panorama que gira sozinho e pode ser arrastado ---------- */
// shortcut: sem vídeo 360° real ainda, o tour corre sobre a foto principal espelhada (emenda sem corte); trocar pelo vídeo do credenciado.
export function Tour360({ espaco }: { espaco: Espaco }) {
  const caixa = useRef<HTMLDivElement>(null)
  const parado = useReducedMotion()
  const [dim, setDim] = useState({ w: 0, h: 0 })
  const [tocando, setTocando] = useState(!parado)
  const x = useMotionValue(0)
  const arraste = useRef<{ x0: number; p0: number } | null>(null)
  const graus = useTransform(x, (v) => (dim.w ? `${Math.round((-v / dim.w) * 360) % 360}°` : "0°"))

  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const h = el.clientHeight
      setDim({ w: h * 1.5 * 2, h }) // período = foto + foto espelhada
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const normalizar = (v: number) => (dim.w ? ((v % dim.w) - dim.w) % dim.w : v)
  useAnimationFrame((_, dt) => {
    if (tocando && !arraste.current) x.set(normalizar(x.get() - Math.min(dt, 64) * 0.045))
  })

  return (
    <div
      ref={caixa}
      tabIndex={0}
      role="img"
      aria-label={`Tour 360° do ${espaco.nome}. Arraste ou use as setas do teclado para girar.`}
      className="relative aspect-[16/10] w-full cursor-grab touch-pan-y overflow-hidden rounded-2xl bg-superficie active:cursor-grabbing"
      onPointerDown={(ev) => {
        arraste.current = { x0: ev.clientX, p0: x.get() }
        ev.currentTarget.setPointerCapture(ev.pointerId)
      }}
      onPointerMove={(ev) => {
        if (arraste.current) x.set(normalizar(arraste.current.p0 + ev.clientX - arraste.current.x0))
      }}
      onPointerUp={() => (arraste.current = null)}
      onPointerCancel={() => (arraste.current = null)}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
          ev.preventDefault()
          x.set(normalizar(x.get() + (ev.key === "ArrowLeft" ? 90 : -90)))
        }
      }}
    >
      {dim.w > 0 && (
        <motion.div className="flex h-full" style={{ x }}>
          {[0, 1, 2, 3].map((k) => (
            <img key={k} src={urlFoto(fotosDe(espaco)[0].nome)} alt="" draggable={false} className="h-full shrink-0 object-cover" style={{ width: dim.w / 2, transform: k % 2 ? "scaleX(-1)" : undefined }} />
          ))}
        </motion.div>
      )}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTocando((t) => !t)}
          aria-label={tocando ? "Pausar tour" : "Reproduzir tour"}
          className="pointer-events-auto grid size-10 place-items-center rounded-full bg-foreground text-white transition-transform active:scale-95"
        >
          {tocando ? <Pause className="size-4" fill="currentColor" aria-hidden /> : <Play className="size-4 translate-x-px" fill="currentColor" aria-hidden />}
        </button>
        <span className="rounded-full bg-foreground/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Tour 360° · arraste para girar</span>
        <motion.span className="ml-auto min-w-14 rounded-full bg-marca px-3 py-1.5 text-center font-heading text-xs font-extrabold tabular" aria-hidden>
          {graus}
        </motion.span>
      </div>
    </div>
  )
}

/* ---------- carrossel de fotos ---------- */
function Carrossel({ espaco, inicial = 0 }: { espaco: Espaco; inicial?: number }) {
  const [i, setI] = useState(inicial)
  const [dir, setDir] = useState(1)
  const ir = (n: number) => {
    setDir(n > i ? 1 : -1)
    setI((n + N_FOTOS) % N_FOTOS)
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-superficie">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -20, filter: "blur(4px)" }}
            transition={MOLA}
            className="absolute inset-0"
          >
            <FotoSala espaco={espaco} indice={i} rotulo />
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => ir(i - 1)} aria-label="Foto anterior" className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 sombra-card-forte active:scale-95">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => ir(i + 1)} aria-label="Próxima foto" className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 sombra-card-forte active:scale-95">
          <ChevronRight className="size-5" aria-hidden />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-foreground/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur tabular">
          {fotosDe(espaco)[i].legenda} · {i + 1} de {N_FOTOS}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {fotosDe(espaco).map(({ legenda: n }, k) => (
          <button key={k} type="button" onClick={() => ir(k)} aria-label={`Ver ${n}`} aria-current={k === i} className={cn("relative aspect-[4/3] overflow-hidden rounded-xl transition-opacity", k === i ? "opacity-100" : "opacity-60 hover:opacity-100")}>
            <FotoSala espaco={espaco} indice={k} />
            {k === i && <motion.span layoutId="mini-ativa" className="absolute inset-0 rounded-xl ring-2 ring-foreground ring-inset" transition={MOLA_RAPIDA} />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- janela com fotos e tour (abre a partir do mosaico) ---------- */
export function Galeria({ espaco, aberta, aba, foto, fechar }: { espaco: Espaco; aberta: boolean; aba: 0 | 1; foto: number; fechar: () => void }) {
  const botao = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!aberta) return
    const antes = document.activeElement as HTMLElement | null
    botao.current?.focus()
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar()
    addEventListener("keydown", esc)
    document.body.style.overflow = "hidden"
    return () => {
      removeEventListener("keydown", esc)
      document.body.style.overflow = ""
      antes?.focus()
    }
  }, [aberta, fechar])

  const abas = [
    { id: 0, label: "Fotos", content: <Carrossel espaco={espaco} inicial={foto} /> },
    { id: 1, label: "Tour 360°", content: <Tour360 espaco={espaco} /> },
  ]
  // a ordem das abas define qual abre primeiro
  const ordenadas = aba === 1 ? [{ ...abas[1], id: 0 }, { ...abas[0], id: 1 }] : abas

  return (
    <AnimatePresence>
      {aberta && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" onClick={fechar} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Fotos e tour do ${espaco.nome}`}
            initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, scale: 0.99, filter: "blur(4px)", transition: { duration: 0.16 } }}
            transition={MOLA}
            className="relative w-full max-w-4xl rounded-3xl bg-white p-4 sombra-card-forte md:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-heading text-lg font-extrabold">{espaco.nome}</p>
              <button ref={botao} type="button" onClick={fechar} aria-label="Fechar" className="grid size-10 place-items-center rounded-full bg-superficie transition-colors hover:bg-marca-suave active:scale-95">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <DirectionAwareTabs tabs={ordenadas} className="mb-4" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
