import { AnimatePresence, motion } from "motion/react"
import { SearchX, X } from "lucide-react"
import { BuscaPilula } from "@/components/site/busca"
import { CardEspaco } from "@/components/site/card-espaco"
import { Especialidades } from "@/components/site/especialidades"
import { ESPACOS, TURNO, cidadeDe, dataCurta, dataLonga, deChave } from "@/data/espacos"
import { useApp, type Filtro } from "@/lib/app"
import { ENTRAR, MOLA_RAPIDA } from "@/lib/motion"

export function filtrar({ cidade, data, turno, esp }: Filtro) {
  return ESPACOS.filter((e) => {
    if (cidade && cidadeDe(e) !== cidade) return false
    if (esp && !e.esp.includes(esp)) return false
    if (data) {
      const t = e.agenda[data]
      return !!t && (!turno || t.includes(turno))
    }
    return !turno || Object.values(e.agenda).some((t) => t.includes(turno))
  }).sort((a, b) => +a.proxima - +b.proxima)
}

export function Espacos() {
  const { filtro, setFiltro } = useApp()
  const lista = filtrar(filtro)
  const chips = [
    filtro.cidade && { k: "cidade", txt: filtro.cidade },
    filtro.data && { k: "data", txt: dataCurta(deChave(filtro.data)) },
    filtro.turno && { k: "turno", txt: TURNO[filtro.turno].nome },
    filtro.esp && { k: "esp", txt: filtro.esp },
  ].filter(Boolean) as { k: keyof Filtro; txt: string }[]

  // sugestões quando nada bate: as datas livres mais próximas que respeitam os outros filtros
  const sugestoes = [
    ...new Set(
      filtrar({ ...filtro, data: "" }).flatMap((e) =>
        Object.entries(e.agenda)
          .filter(([, t]) => !filtro.turno || t.includes(filtro.turno))
          .map(([k]) => k)
      )
    ),
  ]
    .sort()
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-[1320px] px-4 md:px-8">
      <header className="flex flex-col gap-5 pt-8 pb-2">
        <motion.h1 {...ENTRAR} tabIndex={-1} className="text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em]">
          Espaços disponíveis
        </motion.h1>
        <BuscaPilula id="busca-lista" className="max-w-[860px]" />
        <Especialidades id="esp-lista" />
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-5" aria-live="polite">
        <p className="mr-2 font-semibold">
          {lista.length} {lista.length === 1 ? "espaço disponível" : "espaços disponíveis"}
        </p>
        <AnimatePresence initial={false}>
          {chips.map((c) => (
            <motion.button
              key={c.k}
              layout
              type="button"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
              transition={MOLA_RAPIDA}
              onClick={() => setFiltro({ [c.k]: "" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-marca-suave px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-marca-media"
              aria-label={`Remover filtro ${c.txt}`}
            >
              {c.txt}
              <X className="size-3.5" aria-hidden />
            </motion.button>
          ))}
        </AnimatePresence>
        {chips.length > 1 && (
          <button type="button" onClick={() => setFiltro({ cidade: "", data: "", turno: "", esp: "" })} className="ml-1 text-sm font-semibold text-marca-tinta underline underline-offset-4">
            Limpar tudo
          </button>
        )}
      </div>

      {lista.length ? (
        <motion.div layout className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-5 gap-y-9">
          <AnimatePresence mode="popLayout">
            {lista.map((e, i) => (
              <CardEspaco key={e.id} espaco={e} data={filtro.data || undefined} indice={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div {...ENTRAR} className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-input px-6 py-14 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden />
          <h2 className="text-xl font-extrabold">Nenhuma sala livre nessa combinação</h2>
          {sugestoes.length > 0 && (
            <>
              <p className="text-muted-foreground">Estas são as datas livres mais próximas{filtro.cidade ? ` em ${filtro.cidade}` : ""}:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {sugestoes.map((k) => (
                  <button key={k} type="button" onClick={() => setFiltro({ data: k })} className="rounded-full bg-white px-4 py-2 text-sm font-semibold sombra-card transition-shadow hover:sombra-card-forte active:scale-[0.97]">
                    {dataLonga(deChave(k))}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
