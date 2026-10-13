import { motion } from "motion/react"
import { Baby, Bone, Brain, Droplets, Ear, Eye, HeartPulse, LayoutGrid, Scale, Scissors, Sparkles, Stethoscope, Hand } from "lucide-react"
import { useApp } from "@/lib/app"
import { MOLA_RAPIDA } from "@/lib/motion"

const ESPECIALIDADES = [
  { nome: "", rotulo: "Todas", Icone: LayoutGrid },
  { nome: "Plástica", rotulo: "Plástica", Icone: Sparkles },
  { nome: "Ortopedia", rotulo: "Ortopedia", Icone: Bone },
  { nome: "Cirurgia geral", rotulo: "Cirurgia geral", Icone: Scissors },
  { nome: "Oftalmologia", rotulo: "Oftalmologia", Icone: Eye },
  { nome: "Urologia", rotulo: "Urologia", Icone: Droplets },
  { nome: "Vascular", rotulo: "Vascular", Icone: HeartPulse },
  { nome: "Neurocirurgia", rotulo: "Neurocirurgia", Icone: Brain },
  { nome: "Bariátrica", rotulo: "Bariátrica", Icone: Scale },
  { nome: "Dermatológica", rotulo: "Dermatológica", Icone: Hand },
  { nome: "Otorrino", rotulo: "Otorrino", Icone: Ear },
  { nome: "Ginecologia", rotulo: "Ginecologia", Icone: Baby },
  { nome: "Proctologia", rotulo: "Proctologia", Icone: Stethoscope },
]

// Faixa de categorias no padrão Airbnb: o sublinhado desliza até a especialidade escolhida.
export function Especialidades({ id = "esp" }: { id?: string }) {
  const { filtro, setFiltro } = useApp()
  return (
    <div role="group" aria-label="Filtrar por especialidade" className="sem-barra -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:gap-2 md:px-0">
      {ESPECIALIDADES.map(({ nome, rotulo, Icone }) => {
        const ativo = filtro.esp === nome
        return (
          <button
            key={rotulo}
            type="button"
            aria-pressed={ativo}
            onClick={() => setFiltro({ esp: nome })}
            className="group relative flex shrink-0 flex-col items-center gap-1.5 px-3 pt-2 pb-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground aria-pressed:text-foreground"
          >
            <Icone className="size-6 transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95" strokeWidth={1.6} aria-hidden />
            <span className="whitespace-nowrap">{rotulo}</span>
            {ativo && <motion.span layoutId={`${id}-sublinhado`} className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-foreground" transition={MOLA_RAPIDA} />}
          </button>
        )
      })}
    </div>
  )
}
