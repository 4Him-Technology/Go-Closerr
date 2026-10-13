import { useCallback, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { BadgeCheck, Building2, Check, Grid2x2, Heart, MapPin, Rotate3d, ShieldCheck, Stethoscope } from "lucide-react"
import { RollingNumber } from "@/components/ui/rolling-number"
import { Calendario } from "@/components/site/calendario"
import { FotoSala, fotosDe } from "@/components/site/foto-sala"
import { Galeria } from "@/components/site/galeria"
import { TURNOS, cidadeDe, dataCurta, dataLonga, deChave, hoje, listaPt, reais, type Espaco as TEspaco, type TurnoId } from "@/data/espacos"
import { useApp } from "@/lib/app"
import { AO_ROLAR, ENTRAR, MOLA_RAPIDA, atraso } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function Espaco({ espaco: e }: { espaco: TEspaco }) {
  const { filtro, selecoes, setSelecao, favoritos, alternarFavorito, setReserva, ir } = useApp()
  const parado = useReducedMotion()
  const sel = selecoes[e.id] ?? {
    id: e.id,
    data: filtro.data && e.agenda[filtro.data] ? filtro.data : null,
    turnos: filtro.data && filtro.turno && e.agenda[filtro.data]?.includes(filtro.turno) ? [filtro.turno] : [],
  }
  const ref = sel.data ? deChave(sel.data) : e.proxima
  const [mes, setMes] = useState(Math.min(2, (ref.getFullYear() - hoje.getFullYear()) * 12 + ref.getMonth() - hoje.getMonth()))
  const [galeria, setGaleria] = useState<{ aberta: boolean; aba: 0 | 1; foto: number }>({ aberta: false, aba: 0, foto: 0 })
  const fecharGaleria = useCallback(() => setGaleria((g) => ({ ...g, aberta: false })), [])
  const fav = favoritos.includes(e.id)

  const livres = sel.data ? e.agenda[sel.data] : []
  const total = sel.turnos.length * e.preco

  const escolherDia = (k: string) => {
    const l = e.agenda[k]
    setSelecao({ id: e.id, data: k, turnos: l.length === 1 ? [l[0]] : sel.data === k ? sel.turnos : [] })
  }
  const alternarTurno = (t: TurnoId) =>
    setSelecao({ ...sel, turnos: sel.turnos.includes(t) ? sel.turnos.filter((x) => x !== t) : TURNOS.map((x) => x.id).filter((x) => x === t || sel.turnos.includes(x)) })
  const reservar = () => {
    if (!sel.data || !sel.turnos.length) return
    setReserva({ espaco: e, data: sel.data, turnos: sel.turnos, total, codigo: null })
    ir("reserva")
  }

  return (
    <div className="mx-auto max-w-[1180px] px-4 md:px-8">
      <nav aria-label="Você está em" className="flex flex-wrap gap-2 pt-6 text-sm text-muted-foreground">
        <a href="#inicio" className="hover:text-foreground">Início</a>
        <span aria-hidden>/</span>
        <a href="#espacos" className="hover:text-foreground">Espaços disponíveis</a>
        <span aria-hidden>/</span>
        <span aria-current="page" className="text-foreground">{e.nome}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4 pt-3 pb-5">
        <div>
          <motion.h1 {...ENTRAR} tabIndex={-1} className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold tracking-[-0.03em]">
            {e.nome}
          </motion.h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="size-4" aria-hidden /> {e.endereco} · {cidadeDe(e)}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-marca-tinta"><BadgeCheck className="size-4" aria-hidden /> Credenciado Gocloserr</span>
          </p>
        </div>
        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => alternarFavorito(e.id)} aria-pressed={fav} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold underline-offset-4 transition-colors hover:bg-superficie">
          <Heart className={cn("size-4 transition-colors", fav && "fill-marca")} aria-hidden /> {fav ? "Salvo" : "Salvar"}
        </motion.button>
      </div>

      {/* mosaico de fotos, padrão Airbnb */}
      <motion.div {...ENTRAR} className="relative grid h-[min(56vw,440px)] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl">
        {[0, 1, 2, 3, 4].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setGaleria({ aberta: true, aba: 0, foto: k })}
            aria-label={`Abrir fotos: ${fotosDe(e)[k].legenda}`}
            className={cn("group relative overflow-hidden bg-superficie", k === 0 ? "col-span-4 row-span-2 md:col-span-2" : "hidden md:block")}
          >
            <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]">
              <FotoSala espaco={e} indice={k} prioridade={k === 0} />
            </span>
            <span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
          </button>
        ))}
        <div className="absolute right-3 bottom-3 flex gap-2">
          <button type="button" onClick={() => setGaleria({ aberta: true, aba: 1, foto: 0 })} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.97]">
            <Rotate3d className="size-4" aria-hidden /> Tour 360°
          </button>
          <button type="button" onClick={() => setGaleria({ aberta: true, aba: 0, foto: 0 })} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold sombra-card-forte transition-transform active:scale-[0.97]">
            <Grid2x2 className="size-4" aria-hidden /> Ver todas as fotos
          </button>
        </div>
      </motion.div>
      <Galeria espaco={e} {...galeria} fechar={fecharGaleria} />

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <section className="flex flex-col gap-5 border-b border-border pb-8">
            <h2 className="text-2xl font-extrabold">Centro cirúrgico em {e.cidade}</h2>
            <ul className="flex flex-wrap gap-2">
              {[`${e.salas} salas cirúrgicas`, e.porte, ...e.esp].map((x) => (
                <li key={x} className="rounded-full bg-superficie px-3.5 py-1.5 text-sm font-semibold">{x}</li>
              ))}
            </ul>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [Building2, "Estrutura completa", "Salas, recuperação e apoio no mesmo andar."],
                [ShieldCheck, "Reserva garantida", "A sala fica bloqueada para você no turno."],
                [Stethoscope, "Equipe de apoio", "Enfermagem do centro cirúrgico no turno."],
              ].map(([I, t, d], i) => {
                const Icone = I as typeof Building2
                return (
                  <motion.div key={t as string} {...AO_ROLAR} transition={atraso(i, 0.05)} className="flex gap-3">
                    <Icone className="mt-0.5 size-6 shrink-0" strokeWidth={1.6} aria-hidden />
                    <div>
                      <p className="font-semibold">{t as string}</p>
                      <p className="text-sm text-muted-foreground">{d as string}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>

          <section className="border-b border-border py-8">
            <h2 className="sr-only">Sobre o espaço</h2>
            <p className="max-w-[68ch] text-[17px] leading-relaxed text-muted-foreground">{e.descricao}</p>
          </section>

          <section className="border-b border-border py-8">
            <h2 className="text-2xl font-extrabold">O que este centro oferece</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {e.equip.map((x, i) => (
                <motion.li key={x} {...AO_ROLAR} transition={atraso(i, 0.03)} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-marca-tinta" aria-hidden />
                  <span>{x}</span>
                </motion.li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="h-agenda" className="py-8">
            <h2 id="h-agenda" className="text-2xl font-extrabold">{sel.data ? dataLonga(deChave(sel.data)) : "Datas disponíveis"}</h2>
            <p className="mt-1 text-muted-foreground">{sel.data ? "Agora escolha um ou mais turnos." : "Escolha um dia marcado e depois o turno."}</p>
            <div className="mt-6">
              <Calendario espaco={e} sel={sel.data} escolher={escolherDia} mes={mes} setMes={setMes} />
            </div>
            <AnimatePresence initial={false}>
              {sel.data && (
                <motion.fieldset key={sel.data} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={MOLA_RAPIDA} className="mt-8 grid gap-3 sm:grid-cols-3">
                  <legend className="mb-3 font-semibold">Turnos em {dataCurta(deChave(sel.data))}</legend>
                  {TURNOS.map((t) => {
                    const ok = livres.includes(t.id)
                    const marcado = sel.turnos.includes(t.id)
                    return (
                      <label
                        key={t.id}
                        className={cn(
                          "relative flex cursor-pointer flex-col gap-0.5 rounded-2xl p-4 transition-[box-shadow,background-color]",
                          ok ? "bg-white sombra-card hover:sombra-card-forte" : "cursor-not-allowed bg-superficie opacity-55",
                          marcado && "bg-marca-suave ring-2 ring-foreground"
                        )}
                      >
                        <input type="checkbox" className="sr-only" disabled={!ok} checked={marcado} onChange={() => alternarTurno(t.id)} />
                        <span className="flex items-center justify-between font-semibold">
                          {t.nome}
                          <span className={cn("grid size-5 place-items-center rounded-full border transition-colors", marcado ? "border-foreground bg-foreground" : "border-input bg-white")} aria-hidden>
                            <AnimatePresence>
                              {marcado && (
                                <motion.span initial={{ scale: 0.6, opacity: 0, filter: "blur(2px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} exit={{ scale: 0.6, opacity: 0 }} transition={MOLA_RAPIDA}>
                                  <Check className="size-3 text-marca" strokeWidth={3.5} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                        </span>
                        <span className="text-sm text-muted-foreground">{t.horas}</span>
                        <span className="mt-1 text-sm font-semibold tabular">{ok ? reais(e.preco) : "Ocupado"}</span>
                      </label>
                    )
                  })}
                </motion.fieldset>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* cartão de reserva fixo, como no Airbnb: o valor fica no fim e é o botão */}
        <aside aria-label="Valor da reserva" className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 sombra-card-forte">
            <p className="text-muted-foreground">
              <span className="mr-1 font-heading text-[28px] font-extrabold tracking-tight text-foreground tabular">{reais(e.preco)}</span>
              por turno
            </p>
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-input text-sm">
              <div className="border-r border-input p-3">
                <p className="text-[11px] font-bold tracking-wide uppercase">Data</p>
                <p className={sel.data ? "font-medium" : "text-muted-foreground"}>{sel.data ? dataCurta(deChave(sel.data)) : "Escolha no calendário"}</p>
              </div>
              <div className="p-3">
                <p className="text-[11px] font-bold tracking-wide uppercase">Turnos</p>
                <p className={sel.turnos.length ? "font-medium" : "text-muted-foreground"}>{sel.turnos.length ? listaPt(sel.turnos.map((t) => TURNOS.find((x) => x.id === t)!.nome)) : "Um ou mais"}</p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={reservar}
              disabled={!sel.turnos.length}
              whileTap={sel.turnos.length ? { scale: 0.97 } : undefined}
              className="h-14 rounded-full bg-marca text-[17px] font-bold transition-colors hover:bg-marca-forte disabled:cursor-not-allowed disabled:bg-superficie disabled:text-muted-foreground"
            >
              {sel.turnos.length ? (
                <>Reservar por {parado ? reais(total) : <RollingNumber value={total} format={reais} stiffness={170} damping={26} />}</>
              ) : sel.data ? (
                "Escolha o turno"
              ) : (
                "Escolha data e turno"
              )}
            </motion.button>
            <AnimatePresence initial={false}>
              {sel.turnos.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4, filter: "blur(2px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={MOLA_RAPIDA}>
                  <div className="flex justify-between text-sm text-muted-foreground tabular">
                    <span className="underline underline-offset-4">{sel.turnos.length} × {reais(e.preco)}</span>
                    <span>{reais(total)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold tabular">
                    <span>Total</span>
                    <span>{reais(total)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="flex items-start gap-2 text-center text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-marca-tinta" aria-hidden />
              Você só paga depois de confirmar seu e-mail ou celular com um código.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
