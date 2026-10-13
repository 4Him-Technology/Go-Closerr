import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { ESPACO, type Espaco, type TurnoId } from "@/data/espacos"

export type Filtro = { cidade: string; data: string; turno: "" | TurnoId; esp: string }
export type Selecao = { id: string; data: string | null; turnos: TurnoId[] }
export type Reserva = { espaco: Espaco; data: string; turnos: TurnoId[]; total: number; codigo: string | null }
export type Cliente = { nome: string; doc: string; crm: string; crmUf: string; email: string; tel: string }
export type Pagamento = { metodo: "cartao" | "pix"; final: string | null; parcelas: number }

type App = {
  rota: string
  ir: (rota: string) => void
  filtro: Filtro
  setFiltro: (f: Partial<Filtro>) => void
  favoritos: string[]
  alternarFavorito: (id: string) => void
  selecoes: Record<string, Selecao>
  setSelecao: (s: Selecao) => void
  reserva: Reserva | null
  setReserva: (r: Reserva | null) => void
  cliente: Cliente
  setCliente: (c: Cliente) => void
  pagamento: Pagamento
  setPagamento: (p: Pagamento) => void
}

const Ctx = createContext<App | null>(null)
const FILTRO_VAZIO: Filtro = { cidade: "", data: "", turno: "", esp: "" }

// Rotas por hash simples (#espacos, #espaco-vila-aurora): funcionam também dentro do artifact publicado.
const lerRota = () => {
  const h = location.hash.slice(1) || "inicio"
  if (h.startsWith("espaco-") && !ESPACO[h.slice(7)]) return "espacos"
  return h
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [rota, setRota] = useState(lerRota)
  const [filtro, setF] = useState(FILTRO_VAZIO)
  const [favoritos, setFav] = useState<string[]>([])
  const [selecoes, setSel] = useState<Record<string, Selecao>>({})
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [cliente, setCliente] = useState<Cliente>({ nome: "", doc: "", crm: "", crmUf: "", email: "", tel: "" })
  const [pagamento, setPagamento] = useState<Pagamento>({ metodo: "cartao", final: null, parcelas: 1 })

  useEffect(() => {
    const ao = () => setRota(lerRota())
    addEventListener("hashchange", ao)
    return () => removeEventListener("hashchange", ao)
  }, [])

  const ir = useCallback((r: string) => {
    if (location.hash.slice(1) === r) return
    location.hash = r
  }, [])
  const setFiltro = useCallback((f: Partial<Filtro>) => setF((a) => ({ ...a, ...f })), [])
  const alternarFavorito = useCallback(
    (id: string) => setFav((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id])),
    []
  )
  const setSelecao = useCallback((s: Selecao) => setSel((a) => ({ ...a, [s.id]: s })), [])

  return (
    <Ctx.Provider
      value={{ rota, ir, filtro, setFiltro, favoritos, alternarFavorito, selecoes, setSelecao, reserva, setReserva, cliente, setCliente, pagamento, setPagamento }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error("useApp fora do AppProvider")
  return c
}
