import { useEffect } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { AvisoPrototipo, Cabecalho, Rodape } from "@/components/site/moldura"
import { ESPACO } from "@/data/espacos"
import { AppProvider, useApp } from "@/lib/app"
import { MOLA, SAIR } from "@/lib/motion"
import { Credenciado } from "@/pages/credenciado"
import { Espaco } from "@/pages/espaco"
import { Espacos } from "@/pages/espacos"
import { Inicio } from "@/pages/inicio"
import { Reserva } from "@/pages/reserva"
import { Sobre } from "@/pages/sobre"

function Pagina({ rota }: { rota: string }) {
  if (rota === "espacos") return <Espacos />
  if (rota.startsWith("espaco-")) return <Espaco espaco={ESPACO[rota.slice(7)]} />
  if (rota === "reserva") return <Reserva />
  if (rota === "credenciado") return <Credenciado />
  if (rota === "sobre") return <Sobre />
  return <Inicio />
}

function Rotas() {
  const { rota } = useApp()
  useEffect(() => {
    // leva o foco para o título da página nova (leitor de tela e teclado)
    const t = setTimeout(() => document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true }), 220)
    return () => clearTimeout(t)
  }, [rota])
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}>
      <motion.main
        key={rota}
        id="conteudo"
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={SAIR}
        transition={MOLA}
      >
        <Pagina rota={rota} />
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    // reducedMotion="user": quem pede menos movimento recebe só as trocas de opacidade
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold">
          Pular para o conteúdo
        </a>
        <AvisoPrototipo />
        <Cabecalho />
        <Rotas />
        <Rodape />
      </AppProvider>
    </MotionConfig>
  )
}
