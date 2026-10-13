import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react"
import { ArrowLeft, Check, Copy, CreditCard, Info, Mail, QrCode, ShieldCheck, Smartphone } from "lucide-react"
import { HaloSegmented } from "@/components/ui/halo-segmented"
import { RollingNumber } from "@/components/ui/rolling-number"
import { SecurityCheckpoint } from "@/components/ui/security-checkpoint"
import { Campo, SelectUf, useFormulario } from "@/components/site/formulario"
import { FotoSala } from "@/components/site/foto-sala"
import { TURNO, cidadeDe, dataCurta, dataLonga, deChave, hoje, listaPt, reais, rng } from "@/data/espacos"
import { useApp, type Reserva as TReserva } from "@/lib/app"
import { MOLA, MOLA_RAPIDA } from "@/lib/motion"
import { cpfExemplo, dig } from "@/lib/validacao"
import { cn } from "@/lib/utils"

const ETAPAS = ["Seus dados", "Revisão", "Pagamento", "Verificação"]
const mascEmail = (e: string) => {
  const [u, d] = e.split("@")
  return `${u.slice(0, 2)}•••@${d}`
}
const mascTel = (t: string) => `(${dig(t).slice(0, 2)}) •••••-${dig(t).slice(-4)}`

// Passos deslizam na direção do avanço; a saída é mais curta que a entrada (Jakub). Formulário é tarefa: nada de floreio (Emil).
const passo = {
  entrar: (d: number) => ({ opacity: 0, x: d * 24, filter: "blur(4px)" }),
  ficar: { opacity: 1, x: 0, filter: "blur(0px)" },
  sair: (d: number) => ({ opacity: 0, x: d * -12, filter: "blur(4px)", transition: { duration: 0.15 } }),
}

export function Reserva() {
  const { reserva, ir } = useApp()
  const [etapa, setEtapa] = useState(1)
  const [dir, setDir] = useState(1)
  const topo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!reserva) ir("espacos")
  }, [reserva, ir])
  if (!reserva) return null

  const irPara = (n: number) => {
    setDir(n > etapa ? 1 : -1)
    setEtapa(n)
    topo.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const e = reserva.espaco
  const fim = etapa === 5

  return (
    <div ref={topo} className="mx-auto max-w-[1180px] scroll-mt-24 px-4 md:px-8">
      {!fim && (
        <div className="flex items-center gap-3 pt-8">
          <a href={`#espaco-${e.id}`} aria-label={`Voltar para ${e.nome}`} className="grid size-10 place-items-center rounded-full transition-colors hover:bg-superficie">
            <ArrowLeft className="size-5" aria-hidden />
          </a>
          <h1 tabIndex={-1} className="text-[clamp(1.75rem,3.4vw,2.4rem)] font-extrabold tracking-[-0.03em]">Confirme e pague</h1>
        </div>
      )}

      {!fim && (
        <ol aria-label="Etapas da reserva" className="sem-barra mt-6 flex gap-1 overflow-x-auto rounded-full bg-superficie p-1 md:w-fit">
          {ETAPAS.map((nome, i) => {
            const n = i + 1
            const atual = n === etapa
            return (
              <li key={nome} aria-current={atual ? "step" : undefined} className="relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                {atual && <motion.span layoutId="etapa-atual" className="absolute inset-0 rounded-full bg-white sombra-card" transition={MOLA_RAPIDA} />}
                <span className={cn("relative grid size-6 place-items-center rounded-full text-xs font-bold transition-colors", n < etapa ? "bg-marca" : atual ? "bg-foreground text-white" : "bg-white text-muted-foreground")}>
                  {n < etapa ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : n}
                </span>
                <span className={cn("relative", !atual && n > etapa && "text-muted-foreground")}>{nome}</span>
              </li>
            )
          })}
        </ol>
      )}

      <div className={cn("grid gap-10 pt-8", fim ? "mx-auto max-w-2xl" : "lg:grid-cols-[minmax(0,1fr)_380px]")}>
        <div className="min-w-0">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={etapa} custom={dir} variants={passo} initial="entrar" animate="ficar" exit="sair" transition={MOLA}>
              {etapa === 1 && <EtapaDados avancar={() => irPara(2)} />}
              {etapa === 2 && <EtapaRevisao voltar={irPara} avancar={() => irPara(3)} />}
              {etapa === 3 && <EtapaPagamento voltar={() => irPara(2)} avancar={() => irPara(4)} />}
              {etapa === 4 && <EtapaVerificacao voltar={() => irPara(3)} concluir={() => irPara(5)} />}
              {etapa === 5 && <Concluido />}
            </motion.div>
          </AnimatePresence>
        </div>
        {!fim && <Resumo reserva={reserva} />}
      </div>
    </div>
  )
}

function Resumo({ reserva: r }: { reserva: TReserva }) {
  const parado = useReducedMotion()
  return (
    <aside aria-label="Resumo da reserva" className="order-first lg:sticky lg:top-24 lg:order-none lg:self-start">
      <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 sombra-card-forte">
        <div className="grid grid-cols-[104px_1fr] items-center gap-4">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <FotoSala espaco={r.espaco} />
          </div>
          <div className="min-w-0">
            <p className="leading-tight font-semibold">{r.espaco.nome}</p>
            <p className="text-sm text-muted-foreground">{cidadeDe(r.espaco)}</p>
          </div>
        </div>
        <div className="border-t border-border pt-5">
          <h2 className="font-heading text-lg font-extrabold">Detalhes da reserva</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Data</dt>
              <dd className="text-right font-medium">{dataLonga(deChave(r.data))}</dd>
            </div>
            {r.turnos.map((t) => (
              <div key={t} className="flex justify-between gap-4 tabular">
                <dt className="text-muted-foreground">
                  {TURNO[t].nome} · {TURNO[t].horas}
                </dt>
                <dd className="font-medium">{reais(r.espaco.preco)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <span className="font-semibold">Total (BRL)</span>
          <span className="font-heading text-2xl font-extrabold tabular">{parado ? reais(r.total) : <RollingNumber value={r.total} format={reais} stiffness={170} damping={26} />}</span>
        </div>
      </div>
    </aside>
  )
}

function Acoes({ voltar, rotulo, desativado }: { voltar?: () => void; rotulo: string; desativado?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      {voltar ? (
        <button type="button" onClick={voltar} className="rounded-full px-5 py-3 font-semibold underline underline-offset-4 transition-colors hover:bg-superficie">
          Voltar
        </button>
      ) : (
        <span />
      )}
      <motion.button type="submit" disabled={desativado} whileTap={{ scale: 0.97 }} className="h-14 rounded-full bg-foreground px-8 text-[17px] font-bold text-white transition-colors hover:bg-[#283021] disabled:opacity-50">
        {rotulo}
      </motion.button>
    </div>
  )
}

/* ---------- 1. dados do locatário ---------- */
function EtapaDados({ avancar }: { avancar: () => void }) {
  const { cliente, setCliente } = useApp()
  const f = useFormulario(cliente, { nome: "nome", doc: "doc", crm: "crm", crmUf: "uf", email: "email", tel: "tel" }, { doc: "doc", crm: "crm", tel: "tel" })
  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        if (!f.validar()) return
        setCliente({ ...f.v, nome: f.v.nome.trim(), email: f.v.email.trim() })
        avancar()
      }}
    >
      <h2 className="text-2xl font-extrabold">Quem vai locar o espaço</h2>
      <p className="mt-1 text-muted-foreground">Use os dados do cirurgião ou da empresa responsável pela reserva.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Campo rotulo="Nome completo ou razão social" autoComplete="name" className="sm:col-span-2" {...f.campo("nome")} />
        <Campo rotulo="CPF ou CNPJ" inputMode="numeric" {...f.campo("doc")} />
        <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-2">
          <Campo rotulo="CRM" inputMode="numeric" {...f.campo("crm")} />
          <SelectUf rotulo="UF" {...f.campo("crmUf")} />
        </div>
        <Campo rotulo="E-mail" type="email" autoComplete="email" {...f.campo("email")} />
        <Campo rotulo="Celular com DDD" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(11) 98765-4321" {...f.campo("tel")} />
      </div>
      <button
        type="button"
        onClick={() => f.preencher({ nome: "Dra. Helena Duarte Ramos", doc: cpfExemplo(), crm: "148392", crmUf: "SP", email: "helena.ramos@exemplo.com.br", tel: "(11) 98765-4321" })}
        className="mt-5 text-sm font-semibold text-marca-tinta underline underline-offset-4"
      >
        Preencher com dados de exemplo
      </button>
      <Acoes rotulo="Continuar" />
    </form>
  )
}

/* ---------- 2. revisão ---------- */
function EtapaRevisao({ voltar, avancar }: { voltar: (n: number) => void; avancar: () => void }) {
  const { cliente: c, reserva } = useApp()
  const [aceite, setAceite] = useState(false)
  const [erro, setErro] = useState("")
  const r = reserva!
  const Bloco = ({ titulo, editar, linhas }: { titulo: string; editar?: () => void; linhas: [string, string][] }) => (
    <section className="rounded-2xl bg-superficie p-5">
      <h3 className="flex items-center justify-between font-sans text-base font-bold tracking-normal">
        {titulo}
        {editar && (
          <button type="button" onClick={editar} className="text-sm font-semibold text-marca-tinta underline underline-offset-4">
            Editar
          </button>
        )}
      </h3>
      <dl className="mt-3 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-2 text-sm">
        {linhas.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        if (!aceite) {
          setErro("Para seguir, aceite as regras do espaço.")
          document.getElementById("aceite")?.focus()
          return
        }
        avancar()
      }}
    >
      <h2 className="text-2xl font-extrabold">Confira a reserva</h2>
      <p className="mt-1 text-muted-foreground">Revise tudo antes de seguir para o pagamento.</p>
      <div className="mt-6 grid gap-3">
        <Bloco
          titulo="Espaço e data"
          linhas={[
            ["Centro cirúrgico", r.espaco.nome],
            ["Endereço", `${r.espaco.endereco}, ${cidadeDe(r.espaco)}`],
            ["Data", dataLonga(deChave(r.data))],
            ["Turnos", r.turnos.map((t) => `${TURNO[t].nome} (${TURNO[t].horas})`).join(", ")],
          ]}
        />
        <Bloco
          titulo="Locatário"
          editar={() => voltar(1)}
          linhas={[
            ["Nome", c.nome],
            [dig(c.doc).length === 11 ? "CPF" : "CNPJ", c.doc],
            ["CRM", `${c.crm}/${c.crmUf}`],
            ["E-mail", c.email],
            ["Celular", c.tel],
          ]}
        />
        <section className="rounded-2xl border border-border p-5">
          <h3 className="font-sans text-base font-bold tracking-normal">Regras do espaço</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Cancelamento sem custo até 72 horas antes da data.</li>
            <li>A equipe chega 30 minutos antes para o preparo da sala.</li>
            <li>Materiais e medicamentos específicos do procedimento não estão incluídos no valor.</li>
          </ul>
        </section>
      </div>
      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          id="aceite"
          type="checkbox"
          checked={aceite}
          onChange={(ev) => {
            setAceite(ev.target.checked)
            if (ev.target.checked) setErro("")
          }}
          aria-describedby="erro-aceite"
          className="mt-0.5 size-5 shrink-0 accent-foreground"
        />
        <span>Li e aceito as regras do espaço e os termos de uso da Gocloserr.</span>
      </label>
      <p id="erro-aceite" className="mt-2 text-sm font-medium text-destructive" aria-live="polite">
        {erro}
      </p>
      <Acoes voltar={() => voltar(1)} rotulo="Ir para o pagamento" />
    </form>
  )
}

/* ---------- 3. pagamento ---------- */
function EtapaPagamento({ voltar, avancar }: { voltar: () => void; avancar: () => void }) {
  const { reserva, pagamento, setPagamento } = useApp()
  const [metodo, setMetodo] = useState(pagamento.metodo)
  const [parcelas, setParcelas] = useState(1)
  const f = useFormulario({ cartao: "", titular: "", validade: "", cvv: "" }, { cartao: "cartao", titular: "titular", validade: "validade", cvv: "cvv" }, { cartao: "cartao", validade: "validade", cvv: "cvv" })
  const total = reserva!.total
  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault()
        if (metodo === "cartao" && !f.validar()) return
        setPagamento({ metodo, final: metodo === "cartao" ? dig(f.v.cartao).slice(-4) : null, parcelas: metodo === "cartao" ? parcelas : 1 })
        avancar()
      }}
    >
      <h2 className="text-2xl font-extrabold">Pagamento</h2>
      <p className="mt-1 text-muted-foreground">A cobrança só acontece depois que você confirmar seu contato na próxima etapa.</p>
      <div className="mt-6" role="group" aria-label="Forma de pagamento">
        <HaloSegmented
          translucent={false}
          value={metodo}
          onValueChange={(v) => setMetodo(v as "cartao" | "pix")}
          items={[
            { value: "cartao", label: <span className="flex items-center gap-2"><CreditCard className="size-4" aria-hidden /> Cartão de crédito</span> },
            { value: "pix", label: <span className="flex items-center gap-2"><QrCode className="size-4" aria-hidden /> Pix</span> },
          ]}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {metodo === "cartao" ? (
          <motion.div key="cartao" initial={{ opacity: 0, y: 6, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={MOLA_RAPIDA}>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Campo rotulo="Número do cartão" inputMode="numeric" autoComplete="cc-number" className="sm:col-span-2" {...f.campo("cartao")} />
              <Campo rotulo="Nome impresso no cartão" autoComplete="cc-name" className="sm:col-span-2" {...f.campo("titular")} />
              <Campo rotulo="Validade" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" {...f.campo("validade")} />
              <Campo rotulo="Código de segurança" inputMode="numeric" autoComplete="cc-csc" placeholder="3 ou 4 dígitos" {...f.campo("cvv")} />
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="parcelas" className="text-sm font-semibold">Parcelas</label>
                <select id="parcelas" value={parcelas} onChange={(ev) => setParcelas(+ev.target.value)} className="h-[46px] rounded-xl border border-input bg-white px-3 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/25 md:text-sm">
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}x de {reais(Math.round(total / n))} sem juros
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => f.preencher({ cartao: "4242 4242 4242 4242", titular: "HELENA D RAMOS", validade: `12/${String(hoje.getFullYear() + 3).slice(2)}`, cvv: "123" })}
              className="mt-5 text-sm font-semibold text-marca-tinta underline underline-offset-4"
            >
              Usar cartão de teste
            </button>
          </motion.div>
        ) : (
          <motion.div key="pix" initial={{ opacity: 0, y: 6, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={MOLA_RAPIDA} className="mt-6 flex gap-3 rounded-2xl bg-superficie p-5 text-muted-foreground">
            <QrCode className="size-6 shrink-0 text-marca-tinta" aria-hidden />
            <p>O QR Code e o código Pix copia e cola aparecem logo depois da verificação. A sala fica guardada por 30 minutos até o pagamento cair.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <Acoes voltar={voltar} rotulo={`Confirmar pagamento de ${reais(total)}`} />
    </form>
  )
}

/* ---------- 4. verificação do contato ---------- */
function EtapaVerificacao({ voltar, concluir }: { voltar: () => void; concluir: () => void }) {
  const { cliente: c, pagamento, reserva, setReserva } = useApp()
  const [canal, setCanal] = useState<"email" | "sms">("email")
  const [codigo, setCodigo] = useState<string | null>(null)
  const [enviadoEm, setEnviadoEm] = useState(0)
  const [agora, setAgora] = useState(Date.now())
  const [digitos, setDigitos] = useState(["", "", "", "", "", ""])
  const [erro, setErro] = useState("")
  const [grupo, animar] = useAnimate()
  const [processando, setProcessando] = useState(false)
  const caixas = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!codigo) return
    const t = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [codigo])
  const restante = Math.max(0, 30 - Math.floor((agora - enviadoEm) / 1000))

  const enviar = () => {
    setCodigo(String(100000 + Math.floor(Math.random() * 900000)))
    setEnviadoEm(Date.now())
    setAgora(Date.now())
    setDigitos(["", "", "", "", "", ""])
    setErro("")
    setTimeout(() => caixas.current[0]?.focus(), 50)
  }
  const verificar = (lista = digitos) => {
    const v = lista.join("")
    if (v.length < 6) return setErro("Digite os 6 dígitos do código.")
    if (v !== codigo) {
      setErro("Código incorreto. Confira os 6 dígitos e tente de novo.")
      if (grupo.current) animar(grupo.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.35 })
      setDigitos(["", "", "", "", "", ""])
      caixas.current[0]?.focus()
      return
    }
    setErro("")
    setProcessando(true)
    setTimeout(() => {
      const r = rng(String(Date.now()))
      const cod = "GC-" + Array.from({ length: 5 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(r() * 31)]).join("")
      setReserva({ ...reserva!, codigo: cod })
      concluir()
    }, 2200)
  }
  const digitar = (i: number, bruto: string) => {
    const d = dig(bruto)
    const novo = [...digitos]
    if (d.length > 1) {
      d.slice(0, 6 - i).split("").forEach((x, k) => (novo[i + k] = x))
      caixas.current[Math.min(5, i + d.length)]?.focus()
    } else {
      novo[i] = d
      if (d && i < 5) caixas.current[i + 1]?.focus()
    }
    setDigitos(novo)
    if (novo.join("").length === 6) verificar(novo)
  }

  if (processando)
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center" role="status">
        <SecurityCheckpoint title="Gocloserr" subtitle="Verificação de segurança" message={pagamento.metodo === "pix" ? "Contato confirmado. Estamos gerando o seu Pix e guardando a sala." : "Contato confirmado. Estamos aprovando o pagamento e bloqueando a sala para você."} />
        <p className="text-sm text-muted-foreground">Isso leva só alguns segundos.</p>
      </div>
    )

  return (
    <div>
      <h2 className="text-2xl font-extrabold">Confirme seu contato</h2>
      <p className="mt-1 max-w-[60ch] text-muted-foreground">Antes de finalizar, enviamos um código de 6 dígitos para o canal que você escolher. Assim garantimos que o e-mail ou o celular informado é seu.</p>
      <div className="mt-6" role="group" aria-label="Onde receber o código">
        <HaloSegmented
          translucent={false}
          value={canal}
          onValueChange={(v) => {
            setCanal(v as "email" | "sms")
            setCodigo(null)
          }}
          items={[
            { value: "email", label: <span className="flex items-center gap-2"><Mail className="size-4" aria-hidden /> {mascEmail(c.email)}</span> },
            { value: "sms", label: <span className="flex items-center gap-2"><Smartphone className="size-4" aria-hidden /> {mascTel(c.tel)}</span> },
          ]}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!codigo ? (
          <motion.div key="enviar" exit={{ opacity: 0, transition: { duration: 0.12 } }} className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={voltar} className="rounded-full px-5 py-3 font-semibold underline underline-offset-4 hover:bg-superficie">
              Voltar
            </button>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={enviar} className="h-14 rounded-full bg-foreground px-8 text-[17px] font-bold text-white">
              Enviar código por {canal === "sms" ? "SMS" : "e-mail"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="codigo"
            noValidate
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={MOLA}
            onSubmit={(ev) => {
              ev.preventDefault()
              verificar()
            }}
            className="mt-8 flex flex-col gap-3"
          >
            <p id="rot-cod" className="font-semibold">
              Digite o código enviado para {canal === "sms" ? mascTel(c.tel) : mascEmail(c.email)}
            </p>
            <div ref={grupo} role="group" aria-labelledby="rot-cod" className="flex gap-2">
              {digitos.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    caixas.current[i] = el
                  }}
                  value={d}
                  inputMode="numeric"
                  autoComplete={i ? "off" : "one-time-code"}
                  aria-label={`Dígito ${i + 1} de 6`}
                  aria-invalid={!!erro}
                  aria-describedby="erro-cod"
                  onChange={(ev) => digitar(i, ev.target.value)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Backspace" && !digitos[i] && i > 0) {
                      ev.preventDefault()
                      const novo = [...digitos]
                      novo[i - 1] = ""
                      setDigitos(novo)
                      caixas.current[i - 1]?.focus()
                    }
                  }}
                  onPaste={(ev) => {
                    ev.preventDefault()
                    digitar(i, ev.clipboardData.getData("text"))
                  }}
                  className="h-16 w-[calc((100%-40px)/6)] max-w-14 rounded-2xl border border-input bg-white text-center font-heading text-2xl font-extrabold tabular transition-[border-color,box-shadow] outline-none focus:border-ring focus:ring-3 focus:ring-marca-media aria-invalid:border-destructive"
                />
              ))}
            </div>
            <p id="erro-cod" className="min-h-5 text-sm font-medium text-destructive" aria-live="polite">
              {erro}
            </p>
            <p className="text-sm text-muted-foreground">
              {restante > 0 ? (
                <>Não chegou? Você pode pedir outro código em <span className="tabular">{restante}s</span>.</>
              ) : (
                <>
                  Não chegou?{" "}
                  <button type="button" onClick={enviar} className="font-semibold text-marca-tinta underline underline-offset-4">
                    Reenviar código
                  </button>
                </>
              )}
            </p>
            <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-[#d9b648] bg-[#fff7db] p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                Protótipo: nenhuma mensagem é enviada de verdade. Use o código <b className="tabular">{codigo}</b>.
              </span>
            </div>
            <Acoes voltar={voltar} rotulo="Verificar e finalizar" />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- 5. concluído ---------- */
function qrPix(semente: string) {
  const r = rng(semente)
  const n = 25
  let q = ""
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const finder = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)
      if (!finder && r() < 0.47) q += `M${x} ${y}h1v1h-1z`
    }
  const fi = (x: number, y: number) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`
  return { q, f: fi(0, 0) + fi(n - 7, 0) + fi(0, n - 7) }
}

function Concluido() {
  const { reserva, cliente: c, pagamento: p } = useApp()
  const [copiado, setCopiado] = useState(false)
  const r = reserva!
  const pix = p.metodo === "pix"
  const turnos = listaPt(r.turnos.map((t) => TURNO[t].nome)).toLowerCase()
  const copia = `00020126580014BR.GOV.BCB.PIX-GOCLOSER-DEMO-${r.codigo}-5406${(r.total / 100).toFixed(2)}5802BR6009SAO PAULO`
  const { q, f } = qrPix(r.codigo ?? "x")

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(copia)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      const el = document.getElementById("pix-codigo")
      if (el) getSelection()?.selectAllChildren(el)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <motion.span initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.55, bounce: 0.3 }} className="grid size-24 place-items-center rounded-full bg-marca">
        <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="#10140c" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} />
        </svg>
      </motion.span>
      <h1 tabIndex={-1} className="text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em]">{pix ? "Falta só o Pix" : "Reserva confirmada"}</h1>
      <p className="max-w-[52ch] text-muted-foreground">
        {pix ? "Sua sala fica guardada por 30 minutos no" : "Sua sala está reservada no"} {r.espaco.nome} para {dataLonga(deChave(r.data))}, {turnos}.
      </p>
      <motion.p initial={{ opacity: 0, y: 6, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ ...MOLA, delay: 0.35 }} className="rounded-2xl bg-superficie px-6 py-3">
        <span className="block text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Código da reserva</span>
        <span className="font-heading text-2xl font-extrabold tracking-[0.08em]">{r.codigo}</span>
      </motion.p>

      {pix ? (
        <div className="mt-2 grid w-full items-center gap-5 rounded-3xl p-5 text-left sombra-card sm:grid-cols-[auto_1fr]">
          <svg viewBox="-2 -2 29 29" className="mx-auto size-44 rounded-xl" role="img" aria-label="QR Code Pix de exemplo">
            <rect x="-2" y="-2" width="29" height="29" fill="#fff" />
            <path d={q} fill="#10140c" />
            <path d={f} fill="#10140c" fillRule="evenodd" />
          </svg>
          <div className="min-w-0">
            <p className="font-semibold">Pague {reais(r.total)} com Pix</p>
            <p className="text-sm text-muted-foreground">Abra o app do banco, escolha Pix e leia o QR Code ou cole o código abaixo.</p>
            <code id="pix-codigo" className="my-3 block rounded-xl bg-superficie p-3 font-mono text-xs break-all select-all">{copia}</code>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={copiar} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 font-semibold sombra-card">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={String(copiado)} initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }} transition={{ duration: 0.15 }}>
                  {copiado ? <Check className="size-4 text-marca-tinta" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                </motion.span>
              </AnimatePresence>
              {copiado ? "Código copiado" : "Copiar código Pix"}
            </motion.button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Pagamento aprovado no cartão final {p.final}, {p.parcelas}x de {reais(Math.round(r.total / p.parcelas))} sem juros.
        </p>
      )}
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="size-4 text-marca-tinta" aria-hidden />
        Enviamos a confirmação para {mascEmail(c.email)} e {mascTel(c.tel)}.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <a href="#espacos" className="inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-white transition-transform active:scale-[0.97]">
          Reservar outro espaço
        </a>
        <a href="#inicio" className="inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold sombra-card transition-transform active:scale-[0.97]">
          Voltar ao início
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        {pix ? "Reserva guardada. Falta pagar o Pix." : "Reserva confirmada."} Data {dataCurta(deChave(r.data))}.
      </p>
    </div>
  )
}
