import { motion } from "motion/react"
import { Search } from "lucide-react"
import { Marca } from "@/components/site/marca"
import { useApp } from "@/lib/app"
import { MOLA_RAPIDA } from "@/lib/motion"
import { dataCurta, deChave, TURNO } from "@/data/espacos"

const LINKS = [
  { rota: "espacos", rotulo: "Espaços disponíveis" },
  { rota: "credenciado", rotulo: "Seja credenciado" },
  { rota: "sobre", rotulo: "Sobre nós" },
]

export function AvisoPrototipo() {
  return (
    <div className="bg-foreground px-4 py-1.5 text-center text-[13px] text-marca-media">
      Protótipo navegável com dados fictícios. Nenhum pagamento é feito e nenhuma mensagem é enviada.
    </div>
  )
}

export function Cabecalho() {
  const { rota, filtro } = useApp()
  const atual = rota.startsWith("espaco") || rota === "reserva" ? "espacos" : rota
  const mostrarResumoBusca = rota !== "inicio" && rota !== "espacos"

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-border/70 bg-white/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex min-h-[72px] max-w-[1320px] flex-wrap items-center gap-x-6 gap-y-2 px-4 md:px-8">
        <a href="#inicio" aria-label="Gocloserr, página inicial" className="rounded-lg">
          <Marca />
        </a>

        {mostrarResumoBusca && (
          <a
            href="#espacos"
            className="mx-auto hidden items-center gap-3 rounded-full py-1.5 pr-1.5 pl-5 text-sm font-semibold sombra-card transition-shadow hover:sombra-card-forte lg:flex"
          >
            <span>{filtro.cidade || "Qualquer cidade"}</span>
            <span className="h-5 w-px bg-border" aria-hidden />
            <span>{filtro.data ? dataCurta(deChave(filtro.data)) : "Qualquer data"}</span>
            <span className="h-5 w-px bg-border" aria-hidden />
            <span className="font-normal text-muted-foreground">{filtro.turno ? TURNO[filtro.turno].nome : "Turno"}</span>
            <span className="grid size-8 place-items-center rounded-full bg-marca" aria-hidden>
              <Search className="size-4" />
            </span>
          </a>
        )}

        <nav aria-label="Principal" className="sem-barra order-3 -mx-1 flex w-full gap-1 overflow-x-auto pb-2 md:order-none md:ml-auto md:w-auto md:pb-0">
          {LINKS.map((l) => (
            <a
              key={l.rota}
              href={`#${l.rota}`}
              aria-current={atual === l.rota ? "page" : undefined}
              className="relative rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
            >
              {atual === l.rota && <motion.span layoutId="nav-ativo" className="absolute inset-0 rounded-full bg-marca-suave" transition={MOLA_RAPIDA} />}
              <span className="relative">{l.rotulo}</span>
            </a>
          ))}
        </nav>
        <a
          href="#espacos"
          className="ml-auto inline-flex h-11 items-center rounded-full bg-marca px-5 text-sm font-semibold transition-[background-color,transform] hover:bg-marca-forte active:scale-[0.97] md:ml-0"
        >
          Encontrar sala
        </a>
      </div>
    </header>
  )
}

export function Rodape() {
  return (
    <footer className="mt-24 border-t border-border bg-superficie">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-start justify-between gap-8 px-4 py-12 md:px-8">
        <div className="flex flex-col gap-3">
          <Marca />
          <p className="font-heading text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
            O espaço que você precisa, <span className="text-marca-tinta">onde você precisa.</span>
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
          {LINKS.map((l) => (
            <a key={l.rota} href={`#${l.rota}`} className="hover:text-foreground">
              {l.rotulo}
            </a>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">© 2026 Gocloserr. Protótipo com centros cirúrgicos fictícios.</p>
      </div>
    </footer>
  )
}
