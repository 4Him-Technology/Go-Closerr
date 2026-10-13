// Origem: 21st.dev, "Real Estate Search Hero" (@felipemenezes098/hero-09). Adaptado: slots de busca, selo e título; fonte da marca.
'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Search } from 'lucide-react'
import Balancer from 'react-wrap-balancer'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface Hero09Props {
  title: string
  titleLine2?: string
  description: string
  searchPlaceholder?: string
  searchButtonText?: string
  heroImage: string
  heroAlt?: string
  /** troca a busca genérica por um formulário próprio (Gocloserr: busca em pílula com cidade, data e turno) */
  search?: React.ReactNode
  /** selo acima do título */
  eyebrow?: React.ReactNode
  /** título já montado (permite destaque e animação por letra) */
  titleNode?: React.ReactNode
  bottomTitle: string
  bottomTitleLine2?: string
  bottomText?: string
  animation?: 'none' | 'subtle'
  variant?: 'standard' | 'compact'
  /** 'split': cartão de busca sobre a foto, como a página inicial do Airbnb (acréscimo Gocloserr) */
  layout?: 'centered' | 'split'
  /** legenda clicável sobre a foto no layout split */
  imageCaption?: React.ReactNode
  /** linha de vantagens abaixo do hero (ícone, título, texto) */
  features?: { icon: React.ReactNode; title: string; text: string }[]
}

const variantStyles = {
  standard: {
    section: 'py-20 sm:py-28',
    title: 'text-3xl sm:text-4xl md:text-5xl',
    description: 'max-w-md text-sm sm:text-base',
    header: 'gap-6',
    content: 'gap-10 sm:gap-14',
    media: 'max-w-4xl',
    imageAspect: 'aspect-16/10',
    bottomTitle: 'text-2xl sm:text-3xl md:text-4xl',
    overlap: 'mt-6',
  },
  compact: {
    section: 'py-14 sm:py-20',
    title: 'text-2xl sm:text-3xl md:text-4xl',
    description: 'max-w-sm text-sm',
    header: 'gap-4',
    content: 'gap-8 sm:gap-10',
    media: 'max-w-3xl',
    imageAspect: 'aspect-16/11',
    bottomTitle: 'text-xl sm:text-2xl md:text-3xl',
    overlap: 'mt-4',
  },
} as const

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

const mediaItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean
  variants?: Variants
  className?: string
  children: React.ReactNode
}>) {
  if (!active) return <div className={className}>{children}</div>

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  )
}

export function Hero09({
  title,
  titleLine2,
  description,
  searchPlaceholder = 'Search blocks and components',
  searchButtonText = 'Search',
  heroImage,
  heroAlt = '',
  bottomTitle,
  bottomTitleLine2,
  bottomText,
  animation = 'none',
  variant = 'standard',
  search,
  eyebrow,
  titleNode,
  layout = 'centered',
  imageCaption,
  features,
}: Readonly<Hero09Props>) {
  const reduce = useReducedMotion()
  const animate = animation === 'subtle' && !reduce
  const vs = variantStyles[variant]

  const titleElement = titleNode ?? (title && (
    <h1
      className={cn(
        'text-foreground font-heading font-extrabold tracking-tight text-balance',
        vs.title,
      )}
    >
      <Balancer>{title}</Balancer>
      {titleLine2 && (
        <>
          <br />
          <Balancer>{titleLine2}</Balancer>
        </>
      )}
    </h1>
  ))

  const descriptionElement = description && (
    <p className={cn('text-muted-foreground', vs.description)}>
      <Balancer>{description}</Balancer>
    </p>
  )

  const searchElement = search ?? (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-background focus-within:ring-ring/40 mx-auto flex w-full max-w-lg items-center gap-2 rounded-full border p-1.5 shadow-sm transition focus-within:ring-2"
    >
      <div className="text-muted-foreground pl-3">
        <Search className="size-4" />
      </div>
      <Input
        aria-label={searchPlaceholder}
        placeholder={searchPlaceholder}
        className="h-9 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <Button type="submit" className="shrink-0 rounded-full px-5">
        {searchButtonText}
      </Button>
    </form>
  )

  const mediaElement = heroImage && (
    <div className={cn('relative mx-auto w-full', vs.media)}>
      <div
        className={cn(
          'relative mx-auto w-full overflow-hidden',
          'mask-x-from-80% mask-x-to-100%',
          'mask-t-from-35% mask-t-to-95%',
          'mask-b-from-55% mask-b-to-100%',
          'mask-radial-[95%_85%] mask-radial-from-60% mask-radial-to-100% mask-radial-at-center',
          'dark:opacity-85',
        )}
      >
        <img
          src={heroImage}
          alt={heroAlt}
          decoding="async"
          fetchPriority="high"
          className={cn('w-full object-cover object-center', vs.imageAspect)}
        />
      </div>
    </div>
  )

  const bottomElement = (bottomTitle || bottomText) && (
    <div
      className={cn(
        'grid grid-cols-1 items-end gap-6 lg:grid-cols-2',
        vs.overlap,
      )}
    >
      {bottomTitle && (
        <h2
          className={cn(
            'text-foreground font-heading font-extrabold tracking-tight text-balance',
            vs.bottomTitle,
          )}
        >
          <Balancer>{bottomTitle}</Balancer>
          {bottomTitleLine2 && (
            <>
              <br />
              <Balancer>{bottomTitleLine2}</Balancer>
            </>
          )}
        </h2>
      )}
      {bottomText && (
        <p className="text-muted-foreground max-w-xs text-sm lg:justify-self-end">
          <Balancer>{bottomText}</Balancer>
        </p>
      )}
    </div>
  )

  if (layout === 'split') {
    // Layout dividido no modelo do Airbnb: o cartão de busca sobrepõe a borda esquerda da foto.
    // Reaproveita os mesmos variants de entrada do componente (container, item e mediaItem).
    return (
      <section className="bg-background relative isolate w-full overflow-hidden">
        <motion.div
          className="relative z-10 mx-auto flex max-w-[1320px] flex-col gap-14 px-4 pt-5 pb-4 md:px-8 md:pt-10"
          variants={animate ? container : undefined}
          initial={animate ? 'hidden' : false}
          animate={animate ? 'visible' : undefined}
        >
          <div className="grid items-center lg:grid-cols-[minmax(0,450px)_minmax(0,1fr)]">
            <Reveal active={animate} variants={mediaItem} className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:ml-[330px]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-muted sm:aspect-[16/10] lg:aspect-auto lg:h-[min(600px,74vh)]">
                <img src={heroImage} alt={heroAlt} decoding="async" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
                {imageCaption && <div className="absolute right-4 bottom-4 hidden sm:block">{imageCaption}</div>}
              </div>
            </Reveal>
            <Reveal active={animate} className="relative z-10 mx-3 -mt-20 sm:mx-8 lg:col-start-1 lg:row-start-1 lg:m-0">
              <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] sm:p-8">
                {eyebrow}
                {titleElement}
                {descriptionElement}
                <div className="mt-1">{searchElement}</div>
              </div>
            </Reveal>
          </div>
          {features && (
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((f) => (
                <Reveal key={f.title} active={animate} className="flex flex-col gap-3">
                  <span className="text-foreground [&_svg]:size-7">{f.icon}</span>
                  <h2 className="text-foreground font-heading text-xl font-bold tracking-tight">{f.title}</h2>
                  <p className="text-muted-foreground max-w-sm">{f.text}</p>
                </Reveal>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    )
  }

  return (
    <section className="bg-background relative isolate w-full overflow-hidden">
      <motion.div
        className={cn(
          'relative z-10 mx-auto flex max-w-6xl flex-col px-6',
          vs.section,
          vs.content,
        )}
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-80px' }}
      >
        <Reveal
          active={animate}
          className={cn(
            'mx-auto flex w-full max-w-3xl flex-col items-center text-center',
            vs.header,
          )}
        >
          {eyebrow}
          {titleElement}
          {descriptionElement}
          {searchElement}
        </Reveal>

        <Reveal active={animate} variants={mediaItem} className="w-full">
          {mediaElement}
        </Reveal>

        <Reveal active={animate} className="w-full">
          {bottomElement}
        </Reveal>
      </motion.div>
    </section>
  )
}

export default Hero09;
