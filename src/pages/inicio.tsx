import { useRef } from "react"
import { motion } from "motion/react"
import { ArrowRight, BadgeCheck, Building2, CalendarCheck, ChevronDown, ChevronLeft, ChevronRight, Info, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { Hero09 } from "@/components/ui/hero-09"
import { TextAnimate } from "@/components/ui/text-animate"
import { BuscaPilula } from "@/components/site/busca"
import { CardEspaco } from "@/components/site/card-espaco"
import { Especialidades } from "@/components/site/especialidades"
import { fotosDe, urlFoto } from "@/components/site/foto-sala"
import { CIDADES, ESPACO, ESPACOS, cidadeDe, dataCurta } from "@/data/espacos"
import { useApp } from "@/lib/app"
import { AO_ROLAR, MOLA, atraso } from "@/lib/motion"

const DESTAQUE = ESPACO["jardim-acacias"]

const PERGUNTAS = [
  ["Quem pode reservar um centro cirúrgico?", "Cirurgiões com CRM ativo ou empresas médicas. Na reserva você informa CPF ou CNPJ, CRM e UF, e confirma o e-mail ou o celular com um código antes de pagar."],
  ["Como é calculado o valor?", "Cada centro define o valor por turno. Manhã (07h às 13h), tarde (13h às 19h) e noite (19h às 23h) podem ser reservados juntos no mesmo dia, e o total aparece antes de você confirmar."],
  ["Quando o pagamento é feito?", "Só depois da verificação do seu contato. No cartão, em até 3x sem juros; no Pix, a sala fica guardada por 30 minutos até o pagamento cair."],
  ["Posso cancelar?", "Sim. O cancelamento é sem custo até 72 horas antes da data. As regras de cada espaço aparecem na revisão da reserva."],
  ["Tenho um centro cirúrgico com horários vagos. Como entro?", "Faça o cadastro em Seja credenciado. Nossa equipe agenda uma visita técnica e, aprovada a estrutura, sua agenda entra no catálogo."],
]

function Fileira({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children: React.ReactNode }) {
  const trilho = useRef<HTMLDivElement>(null)
  const rolar = (d: number) => trilho.current?.scrollBy({ left: d * trilho.current.clientWidth * 0.85, behavior: "smooth" })
  return (
    <section aria-label={titulo} className="pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <a href="#espacos" className="group inline-flex items-center gap-1.5">
            <h2 className="text-[22px] font-bold">{titulo}</h2>
            <ChevronRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </a>
          {subtitulo && <p className="mt-0.5 text-sm text-muted-foreground">{subtitulo}</p>}
        </div>
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => rolar(-1)} aria-label="Ver anteriores" className="grid size-8 place-items-center rounded-full bg-superficie transition-[background-color,transform] hover:bg-marca-suave active:scale-95">
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => rolar(1)} aria-label="Ver próximos" className="grid size-8 place-items-center rounded-full bg-superficie transition-[background-color,transform] hover:bg-marca-suave active:scale-95">
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div ref={trilho} role="region" aria-label={titulo} tabIndex={0} className="sem-barra -mx-4 mt-4 grid snap-x snap-mandatory auto-cols-[min(250px,72%)] grid-flow-col gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:auto-cols-[calc((100%-4rem)/5)] md:scroll-px-0 md:px-0">
        {children}
      </div>
    </section>
  )
}

export function Inicio() {
  const { filtro, setFiltro, ir } = useApp()
  const lista = ESPACOS.filter((e) => !filtro.esp || e.esp.includes(filtro.esp)).sort((a, b) => +a.proxima - +b.proxima)
  const cidades = CIDADES.map((c) => {
    const daqui = ESPACOS.filter((e) => cidadeDe(e) === c)
    return { c, n: daqui.length, prox: daqui.map((e) => e.proxima).sort((a, b) => +a - +b)[0] }
  })

  return (
    <>
      {/* cartão de busca sobre a foto, como a página inicial do Airbnb (Hero09 do 21st.dev no layout dividido) */}
      <Hero09
        layout="split"
        animation="subtle"
        title="Sua cirurgia acontece em um clique"
        titleNode={
          <TextAnimate
            aria-level={1}
            text={"Sua cirurgia acontece em um clique"}
            type="calmInUp"
            destaque={"um clique"}
            destaqueClassName="bg-[linear-gradient(transparent_60%,var(--marca)_60%,var(--marca)_90%,transparent_90%)]"
            className="m-0 flex flex-wrap p-0 font-heading text-[clamp(1.9rem,3.2vw,2.5rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-foreground"
          />
        }
        description="Encontre centros cirúrgicos com agenda aberta, veja fotos e equipamentos e reserve a sala sem precisar ligar."
        search={<BuscaPilula id="busca-hero" variante="cartao" />}
        heroImage={urlFoto(fotosDe(DESTAQUE)[0].nome)}
        heroAlt={`Sala cirúrgica do ${DESTAQUE.nome}`}
        imageCaption={
          <a href={`#espaco-${DESTAQUE.id}`} className="group flex items-center gap-3 rounded-2xl bg-white/95 py-2.5 pr-3 pl-4 text-sm backdrop-blur sombra-card-forte">
            <span className="leading-tight">
              <b className="block">{DESTAQUE.nome}</b>
              <span className="text-muted-foreground">{cidadeDe(DESTAQUE)} · próxima data {dataCurta(DESTAQUE.proxima)}</span>
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-marca transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </a>
        }
        bottomTitle=""
        features={[
          { icon: <CalendarCheck strokeWidth={1.6} />, title: "Agenda aberta, sem ligações", text: "Cada centro mostra os dias e turnos livres. Você escolhe e reserva na hora, sem esperar retorno." },
          { icon: <ShieldCheck strokeWidth={1.6} />, title: "Reserva verificada", text: "Toda reserva passa pelo CRM do cirurgião e por um código no e-mail ou no celular antes do pagamento." },
          { icon: <SlidersHorizontal strokeWidth={1.6} />, title: "Filtros que importam", text: `${ESPACOS.length} centros em ${CIDADES.length} cidades, filtrados por cidade, data, turno e especialidade.` },
        ]}
      />

      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="mt-14 border-t border-border pt-6">
          <Especialidades id="esp-home" />
        </div>

        <Fileira titulo="Datas livres nos próximos dias" subtitulo="Da data mais próxima para a mais distante">
          {lista.map((e, i) => (
            <CardEspaco key={e.id} espaco={e} indice={i} className="snap-start" />
          ))}
        </Fileira>

        {/* os três atalhos principais do briefing */}
        <section aria-label="Atalhos" className="grid gap-4 pt-16 md:grid-cols-3">
          {[
            { href: "#espacos", Icone: CalendarCheck, titulo: "Espaços disponíveis", texto: "Compare fotos, tour 360°, equipamentos e datas livres de cada centro cirúrgico.", cta: "Ver espaços", destaque: false },
            { href: "#credenciado", Icone: Building2, titulo: "Cadastre o seu espaço", texto: "Capitalize o seu espaço ocioso: seja um credenciado Gocloserr.", cta: "Quero ser credenciado", destaque: true },
            { href: "#sobre", Icone: Info, titulo: "Sobre nós", texto: "Vamos capitalizar espaços ociosos ofertando-os a quem tem a demanda.", cta: "Conheça a Gocloserr", destaque: false },
          ].map((c, i) => (
            <motion.a
              key={c.href}
              href={c.href}
              {...AO_ROLAR}
              transition={atraso(i, 0.06)}
              whileHover={{ y: -3, transition: MOLA }}
              className={`group flex flex-col gap-3 rounded-3xl p-7 transition-shadow hover:sombra-card-forte ${c.destaque ? "bg-marca" : "bg-white sombra-card"}`}
            >
              <span className={`mb-2 grid size-12 place-items-center rounded-2xl ${c.destaque ? "bg-white" : "bg-marca-suave"}`}>
                <c.Icone className="size-6" aria-hidden />
              </span>
              <h3 className="text-[22px] font-extrabold">{c.titulo}</h3>
              <p className={c.destaque ? "text-foreground" : "text-muted-foreground"}>{c.texto}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold">
                {c.cta}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
              </span>
            </motion.a>
          ))}
        </section>

        <section aria-labelledby="h-como" className="pt-16">
          <h2 id="h-como" className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold">Como funciona a reserva</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Escolha o espaço", "Filtre por cidade, data e especialidade e compare fotos, tour 360° e equipamentos."],
              ["Escolha data e turno", "O calendário mostra os dias com sala livre. Marque um ou mais turnos e veja o valor na hora."],
              ["Confirme e pague", "Informe seus dados e o CRM, confirme o e-mail ou o celular com um código e pague com cartão ou Pix."],
            ].map(([t, d], i) => (
              <motion.li key={t} {...AO_ROLAR} transition={atraso(i, 0.06)} className="flex flex-col gap-2 rounded-3xl bg-superficie p-7">
                <span className="mb-2 grid size-9 place-items-center rounded-full bg-foreground font-heading text-sm font-extrabold text-marca">{i + 1}</span>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* "anuncie seu espaço", no formato do Airbnb: foto real e chamada para o credenciamento */}
        <motion.section {...AO_ROLAR} aria-labelledby="h-anuncie" className="mt-16 grid overflow-hidden rounded-[28px] bg-foreground text-white md:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            <p className="text-xs font-bold tracking-[0.16em] text-marca uppercase">Para hospitais e clínicas</p>
            <h2 id="h-anuncie" className="text-[clamp(1.7rem,3vw,2.4rem)] leading-tight font-extrabold">Capitalize o seu espaço ocioso</h2>
            <p className="max-w-md text-white/75">Publique os turnos em que suas salas ficam paradas e receba reservas de cirurgiões verificados. Você define dias, valores e especialidades.</p>
            <a href="#credenciado" className="mt-2 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-marca px-6 font-bold text-foreground transition-transform active:scale-[0.97]">
              Seja um credenciado Gocloserr <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
          <div className="relative min-h-[260px]">
            <img src={urlFoto("equipe-02")} alt="Equipe cirúrgica operando em um centro cirúrgico" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          </div>
        </motion.section>

        <section aria-labelledby="h-cidades" className="pt-16">
          <h2 id="h-cidades" className="text-[22px] font-bold">Centros cirúrgicos por cidade</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
            {cidades.map(({ c, n, prox }) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    setFiltro({ cidade: c, data: "", turno: "" })
                    ir("espacos")
                  }}
                  className="group text-left"
                >
                  <span className="block font-semibold group-hover:underline group-hover:underline-offset-4">{c}</span>
                  <span className="block text-sm text-muted-foreground">
                    {n} {n === 1 ? "centro" : "centros"} · a partir de {dataCurta(prox)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="h-faq" className="pt-16">
          <h2 id="h-faq" className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold">Perguntas frequentes</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {PERGUNTAS.map(([p, r]) => (
              <details key={p} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {p}
                  <ChevronDown className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 max-w-3xl text-muted-foreground">{r}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeCheck className="size-4 text-marca-tinta" aria-hidden />
            Todos os centros passam por visita técnica antes de entrar no catálogo.
          </p>
        </section>
      </div>
    </>
  )
}
