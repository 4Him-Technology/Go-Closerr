import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CalendarClock, Check, ShieldCheck, Wallet } from "lucide-react"
import { HeroDitheringRoot, HeroDitheringContainer, HeroDitheringContent, HeroDitheringHeading, HeroDitheringDescription, HeroDitheringVisual, HeroDitheringMobileVisual } from "@/components/ui/hero-dithering"
import { Campo, SelectUf, useFormulario } from "@/components/site/formulario"
import { AO_ROLAR, ENTRAR, MOLA, atraso } from "@/lib/motion"

const BENEFICIOS = [
  { Icone: Wallet, t: "Turnos parados viram receita", d: "Ofereça só os horários que hoje ficam sem cirurgia." },
  { Icone: CalendarClock, t: "Você define as regras", d: "Dias, turnos, valores e especialidades aceitas ficam com você." },
  { Icone: ShieldCheck, t: "Locatários verificados", d: "Todo cirurgião informa o CRM e confirma e-mail ou celular antes de pagar." },
]

export function Credenciado() {
  const [enviado, setEnviado] = useState<{ resp: string; nome: string } | null>(null)
  const f = useFormulario(
    { "c-nome": "", "c-cnpj": "", "c-salas": "", "c-cidade": "", "c-uf": "", "c-resp": "", "c-email": "", "c-tel": "" },
    { "c-nome": "texto", "c-cnpj": "cnpj", "c-salas": "salas", "c-cidade": "texto", "c-uf": "uf", "c-resp": "nome", "c-email": "email", "c-tel": "tel" },
    { "c-cnpj": "cnpj", "c-salas": "num", "c-tel": "tel" }
  )

  return (
    <>
      <div className="mx-auto max-w-[1360px] px-3 pt-3 md:px-6 md:pt-5">
        <HeroDitheringRoot
          srTitle="Capitalize o seu espaço ocioso"
          title="Capitalize o seu espaço ocioso"
          subtitle="Seja um credenciado Gocloserr"
          description="Seus horários livres de centro cirúrgico aparecem para cirurgiões que estão procurando sala agora. Você publica a agenda; a Gocloserr cuida da reserva, da verificação e do pagamento."
          desktopShaderProps={{ colorBack: "#00000000", colorFront: "#92cf16", shape: "sphere", type: "4x4", size: 2.2, speed: 0.6, scale: 0.7 }}
          mobileShaderProps={{ colorBack: "#00000000", colorFront: "#a6e22e", shape: "sphere", speed: 0.5, scale: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-marca-suave"
        >
          <HeroDitheringContainer className="px-6 py-12 md:px-12">
            <HeroDitheringContent>
              <HeroDitheringHeading>
                {/* o componente já põe o título num h1 para leitores de tela */}
                <motion.p {...ENTRAR} className="text-xs font-bold tracking-[0.14em] text-marca-tinta uppercase">Para hospitais e clínicas</motion.p>
                <motion.p {...ENTRAR} transition={atraso(1, 0.08)} aria-hidden className="mt-3 font-heading text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.03] font-extrabold tracking-[-0.04em]">
                  Capitalize o seu <span className="bg-[linear-gradient(transparent_60%,var(--marca)_60%,var(--marca)_90%,transparent_90%)]">espaço ocioso</span>
                </motion.p>
                <motion.p {...ENTRAR} transition={atraso(2, 0.08)} className="mt-3 font-heading text-xl font-bold">Seja um credenciado Gocloserr</motion.p>
              </HeroDitheringHeading>
              <motion.div {...ENTRAR} transition={atraso(3, 0.08)}>
                <HeroDitheringDescription descriptionClassName="text-lg text-muted-foreground" />
              </motion.div>
              <motion.button
                {...ENTRAR}
                transition={atraso(4, 0.08)}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => {
                  document.getElementById("form-cred")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  document.getElementById("c-nome")?.focus({ preventScroll: true })
                }}
                className="mx-auto mt-2 h-14 w-fit rounded-full lg:mx-0 bg-foreground px-8 text-[17px] font-bold text-white"
              >
                Quero ser credenciado
              </motion.button>
            </HeroDitheringContent>
            <HeroDitheringVisual />
          </HeroDitheringContainer>
          <HeroDitheringMobileVisual />
        </HeroDitheringRoot>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 md:px-8">
        <section aria-label="Benefícios" className="grid gap-4 pt-14 md:grid-cols-3">
          {BENEFICIOS.map(({ Icone, t, d }, i) => (
            <motion.div key={t} {...AO_ROLAR} transition={atraso(i, 0.06)} className="flex flex-col gap-2 rounded-3xl bg-white p-7 sombra-card">
              <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-marca-suave">
                <Icone className="size-6" aria-hidden />
              </span>
              <h2 className="text-lg font-bold">{t}</h2>
              <p className="text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </section>

        <section aria-labelledby="h-cred-passos" className="pt-16">
          <h2 id="h-cred-passos" className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold">Como funciona o credenciamento</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Cadastro", "Envie os dados do espaço pelo formulário abaixo."],
              ["Visita técnica", "Nossa equipe confere estrutura, equipamentos e documentação sanitária."],
              ["Agenda publicada", "Seu centro cirúrgico entra no catálogo com fotos, tour 360° e as datas que você liberar."],
            ].map(([t, d], i) => (
              <motion.li key={t} {...AO_ROLAR} transition={atraso(i, 0.06)} className="flex flex-col gap-2 rounded-3xl bg-superficie p-7">
                <span className="mb-2 grid size-9 place-items-center rounded-full bg-foreground font-heading text-sm font-extrabold text-marca">{i + 1}</span>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        <section id="form-cred" className="scroll-mt-24 pt-16">
          <AnimatePresence mode="wait" initial={false}>
            {enviado ? (
              <motion.div key="ok" {...ENTRAR} className="flex flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center sombra-card-forte" role="status">
                <span className="grid size-20 place-items-center rounded-full bg-marca">
                  <Check className="size-10" strokeWidth={2.6} aria-hidden />
                </span>
                <h2 className="text-2xl font-extrabold">Cadastro recebido</h2>
                <p className="max-w-[52ch] text-muted-foreground">
                  Obrigado, {enviado.resp}. Nossa equipe vai entrar em contato para agendar a visita técnica no {enviado.nome}.
                </p>
                <a href="#espacos" className="inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-white">Ver o catálogo</a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -4, filter: "blur(4px)", transition: { duration: 0.15 } }}
                transition={MOLA}
                noValidate
                onSubmit={(ev) => {
                  ev.preventDefault()
                  if (!f.validar()) return
                  setEnviado({ resp: f.v["c-resp"].trim().split(/\s+/)[0], nome: f.v["c-nome"].trim() })
                }}
                className="rounded-3xl bg-white p-6 sombra-card-forte md:p-10"
              >
                <h2 className="text-2xl font-extrabold">Cadastre o seu espaço</h2>
                <p className="mt-1 text-muted-foreground">Leva dois minutos. Depois entramos em contato para agendar a visita técnica.</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Campo rotulo="Nome do hospital ou clínica" autoComplete="organization" className="sm:col-span-2" {...f.campo("c-nome")} />
                  <Campo rotulo="CNPJ" inputMode="numeric" {...f.campo("c-cnpj")} />
                  <Campo rotulo="Salas cirúrgicas para locação" inputMode="numeric" {...f.campo("c-salas")} />
                  <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-2">
                    <Campo rotulo="Cidade" autoComplete="address-level2" {...f.campo("c-cidade")} />
                    <SelectUf rotulo="UF" {...f.campo("c-uf")} />
                  </div>
                  <Campo rotulo="Responsável pelo contato" autoComplete="name" {...f.campo("c-resp")} />
                  <Campo rotulo="E-mail" type="email" autoComplete="email" {...f.campo("c-email")} />
                  <Campo rotulo="Celular com DDD" type="tel" inputMode="tel" placeholder="(11) 98765-4321" {...f.campo("c-tel")} />
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">Usamos estes dados só para falar sobre o credenciamento.</p>
                  <motion.button type="submit" whileTap={{ scale: 0.97 }} className="h-14 rounded-full bg-marca px-8 text-[17px] font-bold transition-colors hover:bg-marca-forte">
                    Enviar cadastro
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>
    </>
  )
}
