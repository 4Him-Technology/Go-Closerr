import { useState } from "react"
import { motion } from "motion/react"
import { Search } from "lucide-react"
import { CIDADES, TURNOS, chave, hoje } from "@/data/espacos"
import { useApp, type Filtro } from "@/lib/app"
import { MOLA_RAPIDA } from "@/lib/motion"
import { cn } from "@/lib/utils"

// Barra de busca em pílula, no padrão Airbnb: cada segmento é um campo; o fundo branco desliza para o segmento em foco.
// variante "cartao": campos empilhados em caixas, como o cartão de busca da página inicial do Airbnb.
export function BuscaPilula({ id = "busca", className, variante = "pilula" }: { id?: string; className?: string; variante?: "pilula" | "cartao" }) {
  const { filtro, setFiltro, ir } = useApp()
  const [ativo, setAtivo] = useState<string | null>(null)

  const segmentos: { k: keyof Filtro; rotulo: string; controle: React.ReactNode }[] = [
    {
      k: "cidade",
      rotulo: "Cidade",
      controle: (
        <select id={`${id}-cidade`} value={filtro.cidade} onChange={(e) => setFiltro({ cidade: e.target.value })} className="w-full truncate bg-transparent text-[15px] text-foreground outline-none">
          <option value="">Qualquer cidade</option>
          {CIDADES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      ),
    },
    {
      k: "data",
      rotulo: "Data da cirurgia",
      controle: (
        <input id={`${id}-data`} type="date" min={chave(hoje)} value={filtro.data} onChange={(e) => setFiltro({ data: e.target.value })} className="w-full bg-transparent text-[15px] text-foreground outline-none" />
      ),
    },
    {
      k: "turno",
      rotulo: "Turno",
      controle: (
        <select id={`${id}-turno`} value={filtro.turno} onChange={(e) => setFiltro({ turno: e.target.value as Filtro["turno"] })} className="w-full truncate bg-transparent text-[15px] text-foreground outline-none">
          <option value="">Qualquer turno</option>
          {TURNOS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome} ({t.horas})
            </option>
          ))}
        </select>
      ),
    },
  ]

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    ir("espacos")
  }

  if (variante === "cartao") {
    const caixa = "flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 px-4 py-2.5"
    const [cidade, data, turno] = segmentos
    return (
      <form role="search" aria-label="Buscar centro cirúrgico" onSubmit={buscar} className={cn("flex flex-col gap-3", className)}>
        <label htmlFor={`${id}-cidade`} className={cn(caixa, "rounded-xl border border-input transition-shadow focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground")}>
          <span className="text-xs font-semibold">{cidade.rotulo}</span>
          {cidade.controle}
        </label>
        <div className="flex rounded-xl border border-input transition-shadow focus-within:border-foreground">
          {[data, turno].map((sg, i) => (
            <label key={sg.k} htmlFor={`${id}-${sg.k}`} className={cn(caixa, i && "border-l border-input", "rounded-xl focus-within:ring-1 focus-within:ring-foreground")}>
              <span className="text-xs font-semibold">{sg.rotulo}</span>
              {sg.controle}
            </label>
          ))}
        </div>
        <motion.button type="submit" whileTap={{ scale: 0.98 }} className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#b8ee3c,#92cf16)] font-bold text-foreground transition-[filter] hover:brightness-95">
          <Search className="size-[18px]" aria-hidden />
          Buscar sala
        </motion.button>
      </form>
    )
  }

  return (
    <form
      role="search"
      aria-label="Buscar centro cirúrgico"
      onSubmit={buscar}
      className={cn(
        "relative flex w-full flex-col gap-1 rounded-3xl bg-white p-2 sombra-card-forte md:flex-row md:items-center md:gap-0 md:rounded-full",
        className
      )}
    >
      {segmentos.map((s, i) => (
        <label
          key={s.k}
          htmlFor={`${id}-${s.k}`}
          onFocus={() => setAtivo(s.k)}
          onBlur={() => setAtivo(null)}
          className="relative flex min-w-0 flex-1 cursor-pointer flex-col rounded-2xl px-5 py-2.5 transition-colors hover:bg-superficie md:rounded-full"
        >
          {ativo === s.k && <motion.span layoutId={`${id}-seg`} className="absolute inset-0 rounded-2xl bg-white sombra-card-forte md:rounded-full" transition={MOLA_RAPIDA} />}
          {i > 0 && <span aria-hidden className="absolute top-1/4 -left-px hidden h-1/2 w-px bg-border md:block" />}
          <span className="relative text-xs font-semibold text-foreground">{s.rotulo}</span>
          <span className="relative">{s.controle}</span>
        </label>
      ))}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.96 }}
        className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-marca px-5 font-semibold text-foreground transition-colors hover:bg-marca-forte md:ml-1 md:size-12 md:px-0"
        aria-label="Buscar"
      >
        <Search className="size-5" aria-hidden />
        <span className="md:hidden">Buscar</span>
      </motion.button>
    </form>
  )
}
