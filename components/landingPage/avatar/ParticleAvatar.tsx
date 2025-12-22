"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { COLOR_ONE, COLOR_TWO } from '@/config'
import NextImage from 'next/image'

interface ParticleAvatarProps {
  imageUrl: string
  particleCount?: number
  particleSize?: number
  formationSpeed?: number
  mouseInfluence?: number
}

const ParticleAvatar = ({
  imageUrl,
  particleCount = 10000000,
  particleSize = 3,
  formationSpeed = 0.02,
  mouseInfluence = 50,
}: ParticleAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showFallback, setShowFallback] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const resolvedTheme = theme === 'system' ? systemTheme : theme
    const isDark = resolvedTheme === 'dark'

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,  // Narrower FOV for less distortion
      1,   // Force aspect ratio 1:1 for perfect circle
      0.1,
      2000
    )
    camera.position.z = 680

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    })
    // Force square canvas - use smaller dimension to ensure it fits
    const size = Math.min(container.clientWidth, container.clientHeight)
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    
    // Ensure canvas maintains square aspect ratio and doesn't stretch
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.objectFit = 'contain'
    renderer.domElement.style.aspectRatio = '1 / 1'
    
    container.appendChild(renderer.domElement)
    
    console.log('Renderer initialized:', renderer.domElement.width, 'x', renderer.domElement.height)

    // Mouse position - start far away to avoid initial interaction
    const mouse = new THREE.Vector2(999, 999)
    const targetMouse = new THREE.Vector2(999, 999)

    // Load image and extract pixel data
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    const setupParticles = (imageData: ImageData) => {
      const width = imageData.width
      const height = imageData.height
      const data = imageData.data

      // Sample pixels and create particle positions
      const positions: number[] = []
      const colors: number[] = []
      const originalPositions: number[] = []
      const velocities: number[] = []
      const sizes: number[] = []
      const delays: number[] = []

      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = width / 2

      // POLAR COORDINATE SAMPLING - Identical to portal for guaranteed perfect circle
      // Use more rings for denser, smoother circular coverage
      const numRings = Math.floor(Math.sqrt(particleCount / 2))
      
      for (let ring = 0; ring < numRings; ring++) {
        // Include ring 0 (center) through the outer edge
        const radiusFraction = ring / (numRings - 1)
        const radius = radiusFraction * maxRadius
        
        // More particles in outer rings for even density
        const circumference = 2 * Math.PI * Math.max(1, radius)
        const particlesThisRing = ring === 0 ? 1 : Math.floor(circumference * 1.5)
        
        for (let i = 0; i < particlesThisRing; i++) {
          const angle = (i / particlesThisRing) * Math.PI * 2
          
          // Sample image at this polar coordinate
          const sampledX = centerX + Math.cos(angle) * radius
          const sampledY = centerY + Math.sin(angle) * radius
          
          // Ensure within bounds
          if (sampledX < 0 || sampledX >= width || sampledY < 0 || sampledY >= height) continue
          
          const dx = sampledX - centerX
          const dy = sampledY - centerY
          const pixelDistFromCenter = Math.sqrt(dx * dx + dy * dy)
          
          const pixelIndex = (Math.floor(sampledY) * width + Math.floor(sampledX)) * 4
          const r = data[pixelIndex] / 255
          const g = data[pixelIndex + 1] / 255
          const b = data[pixelIndex + 2] / 255
          const a = data[pixelIndex + 3] / 255

          if (a > 0.1) {
            // Position in 3D space - use polar coordinates for PERFECT circle
            // Scale uniformly to maintain perfect circular shape
            const scale = 180.0  // Fixed radius for all particles at same ring
            const targetRadius = radiusFraction * scale
            
            // Convert polar to Cartesian - guaranteed perfect circle
            const px = Math.cos(angle) * targetRadius
            const py = Math.sin(angle) * targetRadius  // Keep positive for perfect circle
            const pz = 0

            originalPositions.push(px, py, pz)  // Use as-is for perfect circle

            // Circular explosion effect - use same angle for consistency
            const explosionAngle = angle + (Math.random() - 0.5) * 0.3
            const explosionRadius = 250 + Math.random() * 200 + radiusFraction * maxRadius * 0.5
            const startX = Math.cos(explosionAngle) * explosionRadius
            const startY = Math.sin(explosionAngle) * explosionRadius
            const startZ = (Math.random() - 0.5) * 400

            positions.push(startX, startY, startZ)

            // Natural colors - preserve original image colors for recognizable face
            // Only minimal enhancement to compensate for particle gaps
            const saturation = 1.05  // Nearly original colors
            const brightness = 1.15  // Slight brightness boost only
            // No contrast curve - keep natural colors
            colors.push(
              Math.min(1, r * saturation * brightness),
              Math.min(1, g * saturation * brightness),
              Math.min(1, b * saturation * brightness)
            )

            // Velocities for animation
            velocities.push(0, 0, 0)
            
            // Calculate delay based on circular distance (normalized to 0-1)
            const normalizedCircularDist = pixelDistFromCenter / maxRadius
            delays.push(normalizedCircularDist * 0.5)
            
            // Subtle size variation for organic look with smooth edge falloff
            const edgeDist = pixelDistFromCenter / maxRadius
            const edgeFactor = 1.0 - Math.pow(edgeDist, 8) * 0.3 // Ultra smooth falloff
            // Slight size variation for natural appearance
            sizes.push(particleSize * (0.85 + Math.random() * 0.15) * edgeFactor)
          }
        }
      }

      // Create geometry
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geometry.setAttribute('originalPosition', new THREE.Float32BufferAttribute(originalPositions, 3))
      geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
      geometry.setAttribute('delay', new THREE.Float32BufferAttribute(delays, 1))

      // Particle shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mousePosition: { value: new THREE.Vector3() },
          mouseInfluence: { value: mouseInfluence },
          formationProgress: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() },
          colorOne: { value: new THREE.Color(COLOR_ONE) },
          colorTwo: { value: new THREE.Color(COLOR_TWO) },
          flowFieldStrength: { value: 0.15 },
        },
        vertexShader: `
          uniform float time;
          uniform vec3 mousePosition;
          uniform float mouseInfluence;
          uniform float formationProgress;
          uniform float pixelRatio;
          uniform float flowFieldStrength;
          
          attribute vec3 originalPosition;
          attribute vec3 velocity;
          attribute float size;
          attribute float delay;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          // Simplex noise functions for flow field
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }
          
          // Curl noise for fluid-like flow
          vec3 curlNoise(vec3 p) {
            float e = 0.1;
            float n1 = snoise(vec3(p.x, p.y + e, p.z));
            float n2 = snoise(vec3(p.x, p.y - e, p.z));
            float n3 = snoise(vec3(p.x, p.y, p.z + e));
            float n4 = snoise(vec3(p.x, p.y, p.z - e));
            float n5 = snoise(vec3(p.x + e, p.y, p.z));
            float n6 = snoise(vec3(p.x - e, p.y, p.z));
            
            vec3 curl = vec3(
              n1 - n2,
              n3 - n4,
              n5 - n6
            );
            return curl / (2.0 * e);
          }
          
          void main() {
            vec3 pos = position;
            vec3 targetPos = originalPosition;
            
            // Organic wave-based formation with delay
            float adjustedProgress = clamp((formationProgress - delay) / (1.0 - delay * 0.5), 0.0, 1.0);
            // Ease out cubic for smooth arrival
            float eased = 1.0 - pow(1.0 - adjustedProgress, 3.0);
            pos = mix(pos, targetPos, eased);
            
            // NO FLOW FIELD - keep image particles stable for clear face visibility
            
            // Mouse interaction - only active after formation complete
            // Gentle repulsion effect
            float mouseActive = step(0.98, formationProgress);
            vec3 mouseDir = pos - mousePosition;
            float mouseDist = length(mouseDir);
            float mouseEffect = smoothstep(mouseInfluence, 0.0, mouseDist) * mouseActive;
            // Subtle push
            pos += normalize(mouseDir) * mouseEffect * 15.0;
            
            // NO IDLE MOVEMENT - keep particles perfectly still for maximum clarity
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Larger size for clearer image with subtle pulse
            float pulse = 1.0 + sin(time * 0.5 + delay * 10.0) * 0.08 * formationProgress;
            gl_PointSize = size * pixelRatio * pulse * (750.0 / -mvPosition.z);
            
            // Pass color and alpha (color is provided by Three.js)
            vColor = color;
            // Fully opaque when formed for maximum visibility
            vAlpha = adjustedProgress;
          }
        `,
        fragmentShader: `
          uniform vec3 colorOne;
          uniform vec3 colorTwo;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Circular particle shape with sharper edges for clarity
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            
            // Sharper edges for clearer image
            float alpha = smoothstep(0.5, 0.15, dist) * vAlpha;
            
            // Very minimal glow to preserve image clarity
            vec3 glowColor = mix(colorOne, colorTwo, gl_PointCoord.y);
            vec3 finalColor = mix(vColor, glowColor, 0.02);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,  // Normal blending for recognizable image
        vertexColors: true,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)
      
      console.log('Particles added to scene, count:', positions.length / 3)
      setShowFallback(false)

      return { particles, material, geometry }
    }

    // Create advanced particle-based portal with flow field
    const createPortalRing = () => {
      const portalParticles: number[] = []
      const portalColors: number[] = []
      const portalAngles: number[] = []
      const portalRadii: number[] = []
      const portalSizes: number[] = []
      const portalSeeds: number[] = []
      
      const numRings = 8
      const particlesPerRing = 1000
      
      // Portal should surround the image (radius ~180) and extend to edge of circular viewport
      // Viewport is 700px, so max visible radius is ~300 units at z=0
      for (let ring = 0; ring < numRings; ring++) {
        const baseRadius = 165 + ring * 16
        
        for (let i = 0; i < particlesPerRing; i++) {
          const angle = (i / particlesPerRing) * Math.PI * 2
          const radiusVariation = (Math.random() - 0.5) * 10
          const radius = baseRadius + radiusVariation
          
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const z = (Math.random() - 0.5) * 8
          
          portalParticles.push(x, y, z)
          portalAngles.push(angle)
          portalRadii.push(radius)
          portalSeeds.push(Math.random() * 100)
          
          // Enhanced purple gradient colors with more vibrance
          const t = ring / numRings
          const brightness = 0.8 + Math.random() * 0.4
          portalColors.push(
            (0.65 + t * 0.25) * brightness,
            (0.25 + t * 0.35) * brightness,
            (0.85 + t * 0.15) * brightness
          )
          
          portalSizes.push(1.8 + Math.random() * 2.2)
        }
      }
      
      const portalGeometry = new THREE.BufferGeometry()
      portalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(portalParticles, 3))
      portalGeometry.setAttribute('angle', new THREE.Float32BufferAttribute(portalAngles, 1))
      portalGeometry.setAttribute('radius', new THREE.Float32BufferAttribute(portalRadii, 1))
      portalGeometry.setAttribute('size', new THREE.Float32BufferAttribute(portalSizes, 1))
      portalGeometry.setAttribute('seed', new THREE.Float32BufferAttribute(portalSeeds, 1))
      
      const portalMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mousePosition: { value: new THREE.Vector2(999, 999) },
          colorOne: { value: new THREE.Color(COLOR_ONE) },
          colorTwo: { value: new THREE.Color(COLOR_TWO) },
          pixelRatio: { value: renderer.getPixelRatio() },
          isDark: { value: isDark ? 1.0 : 0.0 },
        },
        vertexShader: `
          uniform float time;
          uniform vec2 mousePosition;
          uniform float pixelRatio;
          
          attribute float angle;
          attribute float radius;
          attribute float size;
          attribute float seed;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          // Simplex noise for flow field
          vec4 permute_3d(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
          vec4 taylorInvSqrt3d(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
          
          float simplexNoise3d(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
            i = mod(i, 289.0);
            vec4 p = permute_3d(permute_3d(permute_3d(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 1.0/7.0;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt3d(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }
          
          float fbm3d(vec3 x) {
            float v = 0.0;
            float a = 0.5;
            vec3 shift = vec3(100);
            for (int i = 0; i < 4; ++i) {
              v += a * simplexNoise3d(x);
              x = x * 2.0 + shift;
              a *= 0.5;
            }
            return v;
          }
          
          void main() {
            // Rotate particles clockwise
            float rotatedAngle = angle + time * 0.2;
            
            vec3 pos = vec3(
              cos(rotatedAngle) * radius,
              sin(rotatedAngle) * radius,
              position.z
            );
            
            // Apply flow field distortion (portal effect)
            vec2 uv = pos.xy / 170.0;
            vec3 flowPos = vec3(uv, 0.5);
            flowPos = normalize(flowPos);
            flowPos -= 0.2 * vec3(0.0, 0.0, time * 0.3);
            
            // Logarithmic angle distortion
            float distortAngle = -log2(length(uv) + 0.1);
            float cosA = cos(distortAngle);
            float sinA = sin(distortAngle);
            vec2 rotatedFlow = vec2(
              flowPos.x * cosA - flowPos.y * sinA,
              flowPos.x * sinA + flowPos.y * cosA
            );
            flowPos.xy = rotatedFlow;
            
            // Sample noise at particle position
            float noise1 = fbm3d(flowPos * 1.4 + seed * 0.1);
            float noise2 = fbm3d(flowPos * 1.4 + seed * 0.1 + 1.0);
            
            // Apply distortion to particle position
            vec2 distortion = vec2(noise1, noise2) * 15.0;
            pos.xy += distortion;
            
            // Z-axis wave
            pos.z += sin(time + seed) * 3.0 + cos(rotatedAngle * 3.0 + time) * 2.0;
            
            // Mouse interaction
            vec2 mouseUV = (mousePosition - vec2(0.5)) * 400.0;
            float mouseDist = distance(pos.xy, mouseUV);
            float mouseEffect = smoothstep(100.0, 0.0, mouseDist);
            pos.xy += normalize(pos.xy - mouseUV) * mouseEffect * 30.0;
            pos.z += mouseEffect * 15.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Dynamic pulsing size with more variation
            float pulse = 1.0 + sin(time * 2.5 + seed * 10.0 + noise1 * 8.0) * 0.5;
            gl_PointSize = size * pixelRatio * pulse * (750.0 / -mvPosition.z);
            
            vColor = color;
            vAlpha = 1.0 - mouseEffect * 0.4;
          }
        `,
        fragmentShader: `
          uniform vec3 colorOne;
          uniform vec3 colorTwo;
          uniform float isDark;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            
            // Enhanced glowing core with stronger effect
            float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;
            alpha += smoothstep(0.5, 0.2, dist) * 0.8;
            alpha += smoothstep(0.3, 0.0, dist) * 0.5; // Extra bright core
            
            // Theme-aware glow with more intensity
            vec3 themeColor = mix(colorOne, colorTwo, isDark);
            vec3 glowColor = mix(themeColor, vColor, 0.4);
            vec3 finalColor = mix(glowColor, vColor, dist * 0.8);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      })
      
      const portalPoints = new THREE.Points(portalGeometry, portalMaterial)
      scene.add(portalPoints)
      
      return { portalPoints, portalMaterial }
    }

    let particles: THREE.Points | null = null
    let material: THREE.ShaderMaterial | null = null
    let portalRing: { portalPoints: THREE.Points; portalMaterial: THREE.ShaderMaterial } | null = null
    let animationId: number

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      
      // Use square canvas for perfect circle
      const size = 200
      canvas.width = size
      canvas.height = size
      
      // Calculate dimensions to cover the entire circle (crop if needed - like object-fit: cover)
      const imgAspect = img.width / img.height
      let drawWidth = size
      let drawHeight = size
      let offsetX = 0
      let offsetY = 0
      
      // Scale to cover entire circle - crop edges outside (similar to overflow: hidden)
      if (imgAspect > 1) {
        // Wider than tall - use full height, center-crop width
        drawWidth = size * imgAspect
        offsetX = (size - drawWidth) / 2
      } else if (imgAspect < 1) {
        // Taller than wide - use full width, center-crop height
        drawHeight = size / imgAspect
        offsetY = (size - drawHeight) / 2
      }
      
      // Draw image filling entire circle - crop overflow
      ctx.save()
      ctx.beginPath()
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()  // Anything outside circle will be clipped (overflow hidden)
      // Flip image vertically to correct orientation BEFORE sampling
      ctx.translate(0, size)
      ctx.scale(1, -1)
      // Draw image to fill circle completely - edges will be cropped by clip
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      ctx.restore()

      const imageData = ctx.getImageData(0, 0, size, size)
      const setup = setupParticles(imageData)
      particles = setup.particles
      material = setup.material
      
      // Create portal ring
      portalRing = createPortalRing()
      
      console.log('Particles created:', setup.geometry.attributes.position.count)
    }
    
    // Add error handler
    img.onerror = (error) => {
      console.error('Failed to load image:', error)
    }
    
    img.src = imageUrl

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      targetMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const clock = new THREE.Clock()
    let formationProgress = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()

      // Smooth mouse following
      mouse.lerp(targetMouse, 0.1)

      // Update formation progress
      if (formationProgress < 1) {
        formationProgress = Math.min(1, formationProgress + formationSpeed)
      }

      if (material) {
        material.uniforms.time.value = elapsed
        material.uniforms.formationProgress.value = formationProgress
        
        // Convert 2D mouse to 3D space
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const pos = camera.position.clone().add(dir.multiplyScalar(distance))
        material.uniforms.mousePosition.value = pos
      }

      // Update portal ring
      if (portalRing) {
        portalRing.portalMaterial.uniforms.time.value = elapsed
        portalRing.portalMaterial.uniforms.isDark.value = isDark ? 1.0 : 0.0
        
        // Use normalized 2D mouse position
        const normalizedMouse = new THREE.Vector2(
          (mouse.x + 1) / 2,
          (mouse.y + 1) / 2
        )
        portalRing.portalMaterial.uniforms.mousePosition.value = normalizedMouse
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!container) return
      // Keep square aspect ratio on resize
      const size = Math.min(container.clientWidth, container.clientHeight)
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(size, size)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      scene.clear()
      renderer.dispose()
    }
  }, [mounted, imageUrl, particleCount, particleSize, formationSpeed, mouseInfluence, theme, systemTheme])

  if (!mounted) {
    return (
      <div className="w-[750px] h-[750px] rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 animate-pulse" />
    )
  }

  return (
    <div className="relative w-[750px] h-[750px] overflow-visible">
      {showFallback && (
        <NextImage
          width={750}
          height={750}
          src={imageUrl}
          alt="Avatar"
          className="absolute inset-0 w-full h-full rounded-full object-cover opacity-30"
        />
      )}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />
    </div>
  )
}

export default ParticleAvatar
