"use client"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gridShaderMaterial: React.DetailedHTMLProps<
        React.HTMLAttributes<THREE.ShaderMaterial>,
        THREE.ShaderMaterial
      > & { ref?: React.Ref<THREE.ShaderMaterial>; transparent?: boolean }
    }
  }
}

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react"
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

/**
 * 1) Our custom ShaderMaterial:
 *    - Repeats the grid lines via fract().
 *    - Fades lines near the mouse.
 */
const GridShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    // We'll store the mouse in [-1..+1], then transform in the fragment shader
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
  },
  /* vertexShader: */
  `
    varying vec2 vUv;
    void main() {
      // Pass the UV coords to the fragment
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragmentShader: */
  `
    uniform float uTime;
    uniform vec2  uMouse;       // [-1..1]
    uniform vec2  uResolution;

    varying vec2 vUv;

    void main() {
      // 1) We tile the grid by scaling vUv
      vec2 gridUV = vUv * 40.0; // 40 => denser lines

      // 2) Step around fractional boundaries => lines
      float lineWidth = 0.02;
      float fx = fract(gridUV.x);
      float fy = fract(gridUV.y);
      float gridLinesX = step(1.0 - lineWidth, fx);
      float gridLinesY = step(1.0 - lineWidth, fy);
      float lineMask = clamp(gridLinesX + gridLinesY, 0.0, 1.0);

      // 3) Convert uMouse [-1..1] => [0..1] so it matches vUv space
      vec2 mousePos = (uMouse)*2.0 -1.0;
      float distToMouse = length(vUv - mousePos) * 10.0;

      float highlight = 1.0 - smoothstep(0.0, 0.3, distToMouse * distToMouse);
      float alpha = lineMask * highlight;

      // 4) Color from teal to a deeper blue based on highlight
      vec3 baseColor = mix(vec3(0.0, 1.0, 0.8), vec3(0.0, 0.3, 1.0), highlight);

      gl_FragColor = vec4(baseColor, alpha);
    }
  `
)

// Register <gridShaderMaterial />
extend({ GridShaderMaterial })

////////////////////////////////////////////////////////////////////////////////
// 2) A plane that’s effectively 7.5×7.5 in world space: 0.5×0.5 geometry scaled 15
////////////////////////////////////////////////////////////////////////////////
const FullscreenGrid = forwardRef(function FullscreenGrid(_, fRef) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size, clock, camera } = useThree()

  // Animate time if you want it
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  // If you need resolution
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(
        size.width,
        size.height
      )
    }
  }, [size])

  /**
   * Dynamically update camera to match container aspect
   * so the plane is horizontally centered for wide screens.
   *
   * We'll fix the *height* in world space at 7.5 (top=3.75, bottom=-3.75).
   * The *width* = aspect * 7.5 => left=-3.75*aspect, right=3.75*aspect.
   */

  // Provide materialRef to parent
  useImperativeHandle(fRef, () => materialRef.current)

  return (
    <mesh scale={[15, 15, 15]}>
      <planeGeometry args={[1, 1]} />
      <gridShaderMaterial ref={materialRef} transparent />
    </mesh>
  )
})

////////////////////////////////////////////////////////////////////////////////
// 3) Scene: OrthographicCamera (bounds updated), plus FullscreenGrid
////////////////////////////////////////////////////////////////////////////////
const Scene = forwardRef(function Scene(_, ref) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  useImperativeHandle(ref, () => materialRef.current)

  return (
    <>
      <orthographicCamera
        // We'll override left/right/top/bottom in FullscreenGrid’s useEffect
        position={[0, 0, 15]}
      />
      <FullscreenGrid ref={materialRef} />
    </>
  )
})

////////////////////////////////////////////////////////////////////////////////
// 4) The main exported background component
//    - Absolutely covers its parent
//    - Translates mouse => [-1..1], factoring in scroll offset
////////////////////////////////////////////////////////////////////////////////
export default function ThreeGridBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  // GSAP tween object for mouse coords in [-1..1]
  const mouseCoords = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()

      // account for scroll
      const offsetX = rect.left + window.scrollX
      const offsetY = rect.top + window.scrollY

      // map [0..width] => [-1..1], same for height
      const nx = ((e.pageX - offsetX) / rect.width) * 2 - 1
      const ny = ((e.pageY - offsetY) / rect.height) * 2 - 1

      // invert Y => top is +1
      const finalX = nx
      const finalY = -ny
      console.log(finalX, finalY)
      gsap.to(mouseCoords.current, {
        duration: 0.3,
        x: finalX,
        y: finalY,
        onUpdate: () => {
          if (materialRef.current) {
            materialRef.current.uniforms.uMouse.value.set(
              mouseCoords.current.x,
              mouseCoords.current.y
            )
          }
        },
        ease: "power2.out",
      })
    }

    const el = containerRef.current
    el?.addEventListener("mousemove", handleMouseMove)
    return () => el?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-10 "
      style={{ pointerEvents: "auto" }}
    >
      <Canvas>
        <Scene ref={materialRef} />
      </Canvas>
    </div>
  )
}
