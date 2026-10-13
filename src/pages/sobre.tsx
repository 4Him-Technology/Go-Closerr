import { lazy, Suspense } from "react"
import { motion } from "motion/react"
import { ArrowRight, Building2, Stethoscope } from "lucide-react"
import { TextAnimate } from "@/components/ui/text-animate"
import { AO_ROLAR, ENTRAR, MOLA, atraso } from "@/lib/motion"

const FundoShader = lazy(() => import("@/components/site/fundo-shader"))

export function Sobre() {
  return (
    <>
      <section className="mx-auto max-w-[1360px] px-3 pt-3 md:px-6 md:pt-5">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_80%_20%,#e6f8bd_0%,#ffffff_70%)]" />
          <Suspense fallback={null}>
            <div className="absolute inset-0 -z-10">
              <FundoShader preset="algodao" />
            </div>
          </Suspense>
          <div className="flex flex-col gap-6 px-6 py-16 md:px-14 md:py-24">
            <motion.p {...ENTRAR} className="text-xs font-bold tracking-[0.14em] text-marca-tinta uppercase">Sobre nós</motion.p>
            <TextAnimate
              aria-level={1}
              text="Vamos capitalizar espaços ociosos ofertando-os a quem tem a demanda."
              type="calmInUp"
              destaque="espaços ociosos"
              destaqueClassName="bg-[linear-gradient(transparent_60%,var(--marca)_60%,var(--marca)_90%,transparent_90%)]"
              className="m-0 max-w-[18ch] p-0 font-heading text-[clamp(2.2rem,5vw,4rem)] leading-[1.04] font-extrabold tracking-[-0.04em] text-foreground"
            />
            <motion.p {...ENTRAR} transition={atraso(8, 0.1)} className="font-heading text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              O espaço que você precisa, <span className="text-marca-tinta">onde você precisa.</span>
            </motion.p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 md:px-8">
        <section className="grid gap-10 pt-16 md:grid-cols-2">
          <motion.p {...AO_ROLAR} className="text-lg leading-relaxed text-muted-foreground">
            A maioria dos cirurgiões tem consultório próprio, mas depende de um centro cirúrgico locado para operar. Encontrar sala costuma levar dias e muitas ligações só para descobrir quem tem horário livre.
          </motion.p>
          <motion.p {...AO_ROLAR} transition={atraso(1, 0.08)} className="text-lg leading-relaxed text-muted-foreground">
            Do outro lado, hospitais e clínicas têm salas paradas em vários turnos da semana. A Gocloserr junta as duas pontas em um catálogo com agenda aberta: o cirurgião vê fotos, tour 360°, equipamentos e datas livres, e reserva em poucos passos.
          </motion.p>
        </section>
        <section aria-label="Para quem" className="grid gap-4 pt-14 md:grid-cols-2">
          {[
            { href: "#espacos", Icone: Stethoscope, t: "Para cirurgiões", d: "Compare espaços, veja a agenda real de cada centro e reserve com o seu CRM.", cta: "Ver espaços", destaque: false },
            { href: "#credenciado", Icone: Building2, t: "Para hospitais e clínicas", d: "Publique os turnos livres e receba reservas de cirurgiões verificados.", cta: "Seja credenciado", destaque: true },
          ].map((c, i) => (
            <motion.a key={c.href} href={c.href} {...AO_ROLAR} transition={atraso(i, 0.06)} whileHover={{ y: -3, transition: MOLA }} className={`group flex flex-col gap-3 rounded-3xl p-8 transition-shadow hover:sombra-card-forte ${c.destaque ? "bg-marca" : "bg-white sombra-card"}`}>
              <span className={`mb-2 grid size-12 place-items-center rounded-2xl ${c.destaque ? "bg-white" : "bg-marca-suave"}`}>
                <c.Icone className="size-6" aria-hidden />
              </span>
              <h2 className="text-[22px] font-extrabold">{c.t}</h2>
              <p className={c.destaque ? "" : "text-muted-foreground"}>{c.d}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold">
                {c.cta}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
              </span>
            </motion.a>
          ))}
        </section>
      </div>
    </>
  )
}
