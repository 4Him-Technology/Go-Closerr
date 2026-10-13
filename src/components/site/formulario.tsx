import { useState, type ChangeEvent, type ComponentProps } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HaloInput } from "@/components/ui/halo-input"
import { MASCARAS, REGRAS, UFS, type Mascara, type Regra } from "@/lib/validacao"
import { cn } from "@/lib/utils"

// Estado de formulário com validação no envio e ao sair do campo. As regras vêm de lib/validacao (testadas).
export function useFormulario<K extends string>(inicial: Record<K, string>, regras: Partial<Record<K, Regra>>, mascaras: Partial<Record<K, Mascara>> = {}) {
  const [v, setV] = useState(inicial)
  const [erros, setErros] = useState<Partial<Record<K, string>>>({})

  const msg = (k: K, val: string) => {
    const r = regras[k]
    if (!r) return ""
    const res = REGRAS[r](val)
    return res === true ? "" : res
  }
  const checar = (k: K, val = v[k]) => {
    const m = msg(k, val)
    setErros((e) => ({ ...e, [k]: m }))
    return !m
  }
  const validar = () => {
    const novos: Partial<Record<K, string>> = {}
    let primeiro: K | null = null
    for (const k of Object.keys(regras) as K[]) {
      const m = msg(k, v[k])
      novos[k] = m
      if (m && !primeiro) primeiro = k
    }
    setErros(novos)
    if (primeiro) document.getElementById(primeiro)?.focus()
    return !primeiro
  }
  const preencher = (dados: Partial<Record<K, string>>) => {
    setV((a) => ({ ...a, ...dados }))
    setErros({})
  }
  const campo = (k: K) => ({
    id: k,
    value: v[k],
    erro: erros[k],
    onChange: (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const m = mascaras[k]
      const val = m ? MASCARAS[m](ev.target.value) : ev.target.value
      setV((a) => ({ ...a, [k]: val }))
      if (erros[k]) checar(k, val)
    },
    onBlur: () => {
      if (v[k]) checar(k)
    },
  })
  return { v, validar, preencher, campo }
}

function Erro({ id, erro }: { id: string; erro?: string }) {
  return (
    <AnimatePresence initial={false}>
      {erro && (
        <motion.p id={`erro-${id}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.18 }} className="text-sm font-medium text-destructive">
          {erro}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

type CampoProps = Omit<ComponentProps<typeof HaloInput>, "onChange"> & {
  id: string
  rotulo: string
  erro?: string
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void
}
export function Campo({ rotulo, erro, className, id, ...input }: CampoProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <HaloInput id={id} invalid={!!erro} aria-describedby={erro ? `erro-${id}` : undefined} translucent={false} {...input} />
      <Erro id={id} erro={erro} />
    </div>
  )
}

export function SelectUf({ id, rotulo, value, onChange, erro, className }: { id: string; rotulo: string; value: string; onChange: (ev: ChangeEvent<HTMLSelectElement>) => void; erro?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <select id={id} value={value} onChange={onChange} aria-invalid={!!erro} aria-describedby={erro ? `erro-${id}` : undefined} className="h-[46px] rounded-xl border border-input bg-white px-3 text-base transition-[border-color,box-shadow] outline-none focus:border-ring focus:ring-2 focus:ring-ring/25 aria-invalid:border-destructive md:text-sm">
        <option value="">UF</option>
        {UFS.map((u) => (
          <option key={u}>{u}</option>
        ))}
      </select>
      <Erro id={id} erro={erro} />
    </div>
  )
}
