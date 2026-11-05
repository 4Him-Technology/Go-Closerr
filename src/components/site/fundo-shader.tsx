import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react"
import { useReducedMotion } from "motion/react"

// Fundo animado com shadergradient. Parâmetros partem dos presets oficiais "Mint" e "Cotton Candy",
// recoloridos nos azuis da metch sobre branco. lightType "3d" evita baixar mapas HDR de fora.
const PRESETS = {
  menta: {
    type: "waterPlane", uSpeed: 0.18, uStrength: 3.4, uDensity: 1.2, uFrequency: 0, uAmplitude: 0,
    cAzimuthAngle: 170, cPolarAngle: 70, cDistance: 4.4, cameraZoom: 1,
    positionX: 0, positionY: 0.9, positionZ: -0.3, rotationX: 45, rotationY: 0, rotationZ: 0,
    color1: "#1f4b99", color2: "#c9d6ee", color3: "#ffffff", brightness: 1.25, reflection: 0.1,
  },
  algodao: {
    type: "waterPlane", uSpeed: 0.2, uStrength: 3, uDensity: 1, uFrequency: 5.5, uAmplitude: 0,
    cAzimuthAngle: 180, cPolarAngle: 120, cDistance: 2.9, cameraZoom: 1,
    positionX: 0, positionY: 1.8, positionZ: 0, rotationX: 0, rotationY: 0, rotationZ: -90,
    color1: "#e8eef8", color2: "#ffffff", color3: "#a9bfe6", brightness: 1.2, reflection: 0.1,
  },
} as const

export default function FundoShader({ preset = "menta" }: { preset?: keyof typeof PRESETS }) {
  const parado = useReducedMotion()
  return (
    <ShaderGradientCanvas style={{ position: "absolute", inset: 0 }} pixelDensity={1.2} fov={45} pointerEvents="none" lazyLoad>
      <ShaderGradient control="props" animate={parado ? "off" : "on"} lightType="3d" grain="off" {...PRESETS[preset]} />
    </ShaderGradientCanvas>
  )
}
