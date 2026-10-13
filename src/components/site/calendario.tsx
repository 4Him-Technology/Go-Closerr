import { motion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MESES_L, chave, dataLonga, hoje, type Espaco } from "@/data/espacos"
import { MOLA_RAPIDA } from "@/lib/motion"
import { cn } from "@/lib/utils"

const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"]

function Mes({ espaco, base, sel, escolher }: { espaco: Espaco; base: Date; sel: string | null; escolher: (k: string) => void }) {
  const ano = base.getFullYear()
  const mes = base.getMonth()
  const dias = new Date(ano, mes + 1, 0).getDate()
  return (
    <div className="min-w-0">
      <p className="mb-3 text-center font-heading font-bold capitalize">
        {MESES_L[mes]} {ano}
      </p>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {SEMANA.map((d, i) => (
          <span key={i} className="pb-2 text-xs font-semibold text-muted-foreground" aria-hidden>
            {d}
          </span>
        ))}
        {Array.from({ length: base.getDay() }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: dias }, (_, i) => {
          const dt = new Date(ano, mes, i + 1)
          const k = chave(dt)
          const t = espaco.agenda[k]
          const escolhido = sel === k
          return (
            <button
              key={k}
              type="button"
              disabled={!t}
              aria-pressed={escolhido}
              aria-label={`${dataLonga(dt)}${t ? `, ${t.length} ${t.length > 1 ? "turnos livres" : "turno livre"}` : ", sem sala livre"}`}
              onClick={() => escolher(k)}
              className={cn(
                "relative mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm font-semibold tabular transition-colors",
                t ? "cursor-pointer text-foreground hover:ring-1 hover:ring-foreground" : "cursor-default text-muted-foreground/45 line-through decoration-transparent",
                +dt === +hoje && "underline decoration-2 underline-offset-4"
              )}
            >
              {escolhido && <motion.span layoutId="dia-escolhido" className="absolute inset-0 rounded-full bg-foreground" transition={MOLA_RAPIDA} />}
              {t && !escolhido && <span className="absolute inset-[3px] rounded-full bg-marca-suave" aria-hidden />}
              <span className={cn("relative", escolhido && "text-white")}>{i + 1}</span>
              {t && <span className={cn("absolute bottom-1 size-1 rounded-full", escolhido ? "bg-marca" : "bg-marca-tinta")} aria-hidden />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Dois meses lado a lado, como no Airbnb. O destaque do dia escolhido desliza entre os dias.
export function Calendario({ espaco, sel, escolher, mes, setMes }: { espaco: Espaco; sel: string | null; escolher: (k: string) => void; mes: number; setMes: (m: number) => void }) {
  const base = (n: number) => new Date(hoje.getFullYear(), hoje.getMonth() + n, 1)
  return (
    <div className="relative">
      <div className="absolute top-0 flex w-full justify-between">
        <button type="button" onClick={() => setMes(mes - 1)} disabled={mes <= 0} aria-label="Mês anterior" className="grid size-8 place-items-center rounded-full transition-colors hover:bg-superficie disabled:opacity-30">
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => setMes(mes + 1)} disabled={mes >= 2} aria-label="Próximo mês" className="grid size-8 place-items-center rounded-full transition-colors hover:bg-superficie disabled:opacity-30">
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
      <motion.div key={mes} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.2 }} className="grid gap-8 md:grid-cols-2" aria-live="polite">
        <Mes espaco={espaco} base={base(mes)} sel={sel} escolher={escolher} />
        <div className="hidden md:block">
          <Mes espaco={espaco} base={base(mes + 1)} sel={sel} escolher={escolher} />
        </div>
      </motion.div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-marca-suave ring-1 ring-marca-media" aria-hidden /> Com turno livre</span>
        <span className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-foreground" aria-hidden /> Dia escolhido</span>
      </div>
    </div>
  )
}
