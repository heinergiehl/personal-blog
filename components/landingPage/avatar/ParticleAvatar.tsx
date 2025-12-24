"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { COLOR_ONE, COLOR_TWO } from '@/config'
import NextImage from 'next/image'
import Stats from 'stats.js'

interface ParticleAvatarProps {
  imageUrl: string
  particleCount?: number
  particleSize?: number
  formationSpeed?: number
  mouseInfluence?: number
  isMobile?: boolean
  onLoad?: () => void
}

const ParticleAvatar = ({
  imageUrl,
  particleCount = 25000,
  particleSize = 0.15,
  formationSpeed = 0.02,
  mouseInfluence = 200,
  isMobile = false,
  onLoad,
}: ParticleAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const mouseRef = useRef({ x: 999, y: 999, targetX: 999, targetY: 999 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

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
    camera.position.z = 1200

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      powerPreference: isMobile ? 'default' : 'high-performance'
    })
    // Force square canvas - use container dimensions or default to 600px
    const size = Math.max(container.clientWidth || 600, container.clientHeight || 600)
    renderer.setSize(size, size)
    // Lower pixel ratio on mobile for better performance
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    
    // Ensure canvas maintains square aspect ratio
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.objectFit = 'contain'
    
    container.appendChild(renderer.domElement)

    // Setup Stats.js for performance monitoring (only in development)
    let stats: Stats | null = null
    if (process.env.NODE_ENV === 'development' && !isMobile) {
      stats = new Stats()
      stats.showPanel(0) // 0: fps, 1: ms, 2: mb
      stats.dom.style.position = 'absolute'
      stats.dom.style.left = '0px'
      stats.dom.style.top = '0px'
      stats.dom.style.opacity = '0.9'
      container.appendChild(stats.dom)
    }

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

      // POLAR COORDINATE SAMPLING - Optimized for performance
      const numRings = Math.floor(Math.sqrt(particleCount / 3)) // Fewer rings
      
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
            
            // Size variation for organic look with smooth edge falloff
            const edgeDist = pixelDistFromCenter / maxRadius
            const edgeFactor = 1.0 - Math.pow(edgeDist, 6) * 0.25 // Smooth falloff
            // Size variation for natural, beautiful appearance
            sizes.push(particleSize * (0.9 + Math.random() * 0.25) * edgeFactor)
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
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
      geometry.setAttribute('delay', new THREE.Float32BufferAttribute(delays, 1))

      // Particle shader material
      // Theme-aware colors: indigo/cyan for light mode, purple for dark mode
      const colorOne = isDark ? COLOR_ONE : '#4f46e5' // indigo-600 in light mode
      const colorTwo = isDark ? COLOR_TWO : '#06b6d4' // cyan-500 in light mode

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mousePosition: { value: new THREE.Vector3() },
          mouseInfluence: { value: mouseInfluence },
          formationProgress: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() },
          colorOne: { value: new THREE.Color(colorOne) },
          colorTwo: { value: new THREE.Color(colorTwo) },
          flowFieldStrength: { value: 0.15 },
          isDark: { value: isDark ? 1.0 : 0.0 },
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
          
          // Simplex noise functions - SIMPLIFIED for performance
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - 0.5;
            i = mod289(i);
            vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            vec3 ns = 0.142857142857 * vec3(1.0, 1.0, 1.0);
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 s0 = floor(vec4(x.xy, y.xy))*2.0 + 1.0;
            vec4 s1 = floor(vec4(x.zw, y.zw))*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = vec4(x.xy, y.xy) + s0.xzyw*sh.xxyy;
            vec4 a1 = vec4(x.zw, y.zw) + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }
          
          // Simplified curl noise - less computation
          vec3 curlNoise(vec3 p) {
            float e = 0.1;
            return vec3(
              snoise(vec3(p.x, p.y + e, p.z)) - snoise(vec3(p.x, p.y - e, p.z)),
              snoise(vec3(p.x, p.y, p.z + e)) - snoise(vec3(p.x, p.y, p.z - e)),
              snoise(vec3(p.x + e, p.y, p.z)) - snoise(vec3(p.x - e, p.y, p.z))
            ) / (2.0 * e);
          }
          
          void main() {
            vec3 pos = position;
            vec3 targetPos = originalPosition;
            
            // Organic wave-based formation with delay
            float adjustedProgress = clamp((formationProgress - delay) / (1.0 - delay * 0.5), 0.0, 1.0);
            // Ease out cubic for smooth arrival
            float eased = 1.0 - pow(1.0 - adjustedProgress, 3.0);
            pos = mix(pos, targetPos, eased);
            
            // ORGANIC MOUSE INTERACTION - Effects only active near mouse
            float mouseActive = step(0.98, formationProgress);
            vec3 mouseDir = pos - mousePosition;
            float mouseDist = length(mouseDir);
            
            float particleEnergy = 0.0;
            
            if (mouseActive > 0.0 && mouseDist < mouseInfluence) {
              vec3 normalizedDir = normalize(mouseDir);
              float influence = smoothstep(mouseInfluence, 0.0, mouseDist);
              
              // Multi-zone interaction system for dramatic organic effect
              
              // Strong, natural bulge toward viewer effect
              if (mouseDist < mouseInfluence) {
                // Smooth cubic falloff for natural, organic feel
                float influence = smoothstep(mouseInfluence, 0.0, mouseDist);
                
                // Stronger bulge power with cubic curve for smooth, natural shape
                float bulgePower = influence * influence * influence;
                
                // Very dramatic movement toward viewer (positive Z)
                pos.z += bulgePower * 120.0;
                
                // Strong inward XY movement for dramatic depth and 3D dome effect
                vec2 mouseDir2D = vec2(normalizedDir.x, normalizedDir.y);
                pos.xy -= mouseDir2D * bulgePower * 18.0;
                
                // Enhanced energy for stronger visual feedback
                particleEnergy += influence * 0.08;
              }
            }
            
            // Enhanced idle animation - very subtle breathing only
            float idleBreath = sin(time * 0.3 + delay * 6.28) * 0.3;
            pos.z += idleBreath * formationProgress;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Dynamic sizing based on depth and energy
            float energySize = 1.0 + particleEnergy * 0.15;
            float pulse = 1.0 + sin(time * 0.5 + delay * 10.0) * 0.08 * formationProgress;
            gl_PointSize = size * pixelRatio * pulse * energySize * (750.0 / -mvPosition.z);
            
            // Pass pure color - NO white mixing at all
            vColor = color;
            
            // Fully opaque when formed
            vAlpha = adjustedProgress;
          }
        `,
        fragmentShader: `
          uniform vec3 colorOne;
          uniform vec3 colorTwo;
          uniform float isDark;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Circular particle shape with multi-layer structure
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            
            // Theme-adaptive alpha layers - ENHANCED FOR CLARITY
            float alpha = 0.0;
            
            // Much stronger, more opaque particles for clear image
            float coreStrength = mix(3.5, 1.5, isDark);     // Very strong core
            float midStrength = mix(1.8, 0.8, isDark);      // Strong mid layer
            float glowStrength = mix(0.08, 0.35, isDark);   // Minimal glow in light
            
            // Core - very sharp and opaque
            alpha += smoothstep(0.5, 0.0, dist) * vAlpha * coreStrength;
            
            // Mid layer - strong for smooth blending
            alpha += smoothstep(0.5, 0.12, dist) * vAlpha * midStrength;
            
            // Minimal outer glow
            alpha += smoothstep(0.5, 0.42, dist) * vAlpha * glowStrength;
            
            // Theme-aware color processing
            vec3 finalColor = vColor;
            
            // LIGHT MODE: Vibrant and clear
            if (isDark < 0.5) {
              // Less darkening for better visibility
              finalColor *= 0.85;
              // High saturation for vibrant appearance
              vec3 gray = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
              finalColor = mix(gray, finalColor, 1.6);
              // Boost contrast for clearer image
              finalColor = pow(finalColor, vec3(0.9));
              // Higher opacity for solid appearance
              alpha *= 1.8;
            } else {
              // DARK MODE: Keep natural colors
              vec3 themeColor = mix(colorOne, colorTwo, 0.5);
              float outerRegion = smoothstep(0.15, 0.45, dist);
              finalColor = mix(finalColor, mix(finalColor, themeColor, 0.08), outerRegion);
            }
            
            // Anti-aliased edge for smooth appearance
            float edgeSoftness = fwidth(dist) * 1.5;
            float edge = smoothstep(0.5 - edgeSoftness, 0.5, dist);
            alpha *= (1.0 - edge);
            
            // Higher cap for better coverage
            gl_FragColor = vec4(finalColor, min(alpha, 1.8));
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
      setIsLoading(false)
      onLoad?.()

      return { particles, material, geometry }
    }

    // Create GPGPU-based portal - OPTIMIZED for mobile
    const createGPGPUPortal = () => {
      // Drastically reduce particles on mobile for performance
      const numParticles = isMobile ? 50000 : 800000  // 50k vs 800k
      const textureSize = Math.ceil(Math.sqrt(numParticles))
      const actualParticles = textureSize * textureSize
      
      // Initialize particle data in textures
      const positionData = new Float32Array(actualParticles * 4) // RGBA = xyz + ring
      const velocityData = new Float32Array(actualParticles * 4) // RGBA = vxyz + seed
      
      let idx = 0
      // Fewer rings for better mobile performance
      const numRings = isMobile ? 200 : 600  // 200 vs 600
      const particlesPerRing = Math.floor(actualParticles / numRings)
      
      for (let ring = 0; ring < numRings; ring++) {
        const baseRadius = 165 + ring * 0.28  // Restored to previous spacing
        const particlesThisRing = particlesPerRing
        
        for (let i = 0; i < particlesThisRing && idx < actualParticles; i++) {
          const angle = (i / particlesThisRing) * Math.PI * 2
          // Add radial dispersion to fill gaps between rings
          const radiusVar = (Math.random() - 0.5) * 4.5  // More variation to fill space
          const radius = baseRadius + radiusVar
          
          // Position: xyz + ring index
          positionData[idx * 4 + 0] = Math.cos(angle) * radius
          positionData[idx * 4 + 1] = Math.sin(angle) * radius
          positionData[idx * 4 + 2] = (Math.random() - 0.5) * 5
          positionData[idx * 4 + 3] = ring / (numRings - 1) // Normalized ring
          
          // Velocity: vxyz + seed
          velocityData[idx * 4 + 0] = 0
          velocityData[idx * 4 + 1] = 0
          velocityData[idx * 4 + 2] = 0
          velocityData[idx * 4 + 3] = Math.random() // Random seed
          
          idx++
        }
      }
      
      // Create data textures
      const positionTexture1 = new THREE.DataTexture(
        positionData,
        textureSize,
        textureSize,
        THREE.RGBAFormat,
        THREE.FloatType
      )
      positionTexture1.needsUpdate = true
      
      const positionTexture2 = positionTexture1.clone()
      
      const velocityTexture1 = new THREE.DataTexture(
        velocityData,
        textureSize,
        textureSize,
        THREE.RGBAFormat,
        THREE.FloatType
      )
      velocityTexture1.needsUpdate = true
      
      const velocityTexture2 = velocityTexture1.clone()
      
      // Create FBO render targets
      const rtOptions = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false,
        depthBuffer: false
      }
      
      const positionRT1 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions)
      const positionRT2 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions)
      const velocityRT1 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions)
      const velocityRT2 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions)
      
      // GPGPU compute shader for particle physics
      const computeShader = `
        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;
        uniform float time;
        uniform float delta;
        uniform vec2 mousePosition;
        uniform float textureSize;
        
        varying vec2 vUv;
        
        // Simplex noise 3D
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        
        float snoise(vec3 v){ 
          const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }
        
        // Curl noise for fluid flow
        vec3 curlNoise(vec3 p) {
          float e = 0.1;
          vec3 dx = vec3(e, 0.0, 0.0);
          vec3 dy = vec3(0.0, e, 0.0);
          vec3 dz = vec3(0.0, 0.0, e);
          
          float p_x0 = snoise(p - dx);
          float p_x1 = snoise(p + dx);
          float p_y0 = snoise(p - dy);
          float p_y1 = snoise(p + dy);
          float p_z0 = snoise(p - dz);
          float p_z1 = snoise(p + dz);
          
          float x = p_y1 - p_y0 - p_z1 + p_z0;
          float y = p_z1 - p_z0 - p_x1 + p_x0;
          float z = p_x1 - p_x0 - p_y1 + p_y0;
          
          return normalize(vec3(x, y, z)) / (2.0 * e);
        }
        
        void main() {
          vec4 posData = texture2D(texturePosition, vUv);
          vec4 velData = texture2D(textureVelocity, vUv);
          
          vec3 pos = posData.xyz;
          float ring = posData.w;
          vec3 vel = velData.xyz;
          float seed = velData.w;
          
          // Calculate target radius for this ring (FIXED - won't change)
          float targetRadius = 165.0 + ring * 144.0;
          
          // Current angle and radius
          float angle = atan(pos.y, pos.x);
          float currentRadius = length(pos.xy);
          
          // Rotation speed varies by ring (inner much faster for swirl effect)
          float rotSpeed = 0.4 * (1.0 + (1.0 - ring) * 1.2);
          angle += rotSpeed * delta;
          
          // CRITICAL FIX: Start with target radius, then apply small perturbations
          // This prevents collapse - particles stay on their rings
          float newRadius = targetRadius;
          
          // Add subtle radius variation from noise
          vec3 noisePos = pos * 0.015 + time * 0.05;
          float radiusNoise = snoise(noisePos) * 2.5;
          // Add subtle breathing pulse to radius
          float breathe = sin(time * 0.35 + ring * 6.28) * 0.04 + sin(time * 0.6 + angle * 2.0) * 0.03;
          newRadius += radiusNoise + breathe * targetRadius * 0.03;
          
          // Base position on ring (always maintained)
          vec3 newPos = vec3(
            cos(angle) * newRadius,
            sin(angle) * newRadius,
            pos.z
          );
          
          // ENHANCED ORGANIC MOTION - More curl noise for fluid flow
          vec3 flowPos = pos * 0.008 + time * 0.008;
          vec3 curl1 = curlNoise(flowPos);
          vec3 curl2 = curlNoise(flowPos * 2.0 + 100.0) * 0.5;
          vec3 curl3 = curlNoise(flowPos * 0.5 + 200.0) * 0.3;
          vec3 combinedCurl = (curl1 + curl2 + curl3) * 6.0 * delta; // Reduced for subtler flow
          
          // Apply curl in all directions for organic motion
          vec2 tangent = vec2(-sin(angle), cos(angle));
          float curlTangent = dot(combinedCurl.xy, tangent);
          newPos.xy += tangent * curlTangent;
          // Add some radial curl too for breathing effect
          float curlRadial = dot(combinedCurl.xy, normalize(newPos.xy));
          newPos.xy += normalize(newPos.xy) * curlRadial * 0.03;
          newPos.z += combinedCurl.z;
          
          // Enhanced Z-wave motion - more organic variation
          float zWave = sin(time * 0.6 + seed * 6.28 + angle * 3.0) * 0.8;
          zWave += sin(time * 1.2 + seed * 3.14 + ring * 10.0) * 0.4;
          zWave += sin(time * 0.4 + angle * 1.5) * 0.06; // Additional wave
          // Noise-based organic flow
          vec3 zNoisePos = vec3(pos.xy * 0.01, time * 0.03);
          zWave += snoise(zNoisePos) * 0.05;
          newPos.z += zWave;
          newPos.z = clamp(newPos.z, -6.0, 6.0);
          
          // ============= ORGANIC MOUSE INTERACTION =============
          vec2 mouseWorld = (mousePosition - vec2(0.5)) * 750.0;
          vec2 toMouse = pos.xy - mouseWorld;
          float mouseDist = length(toMouse);
          
          // Add noise to make zones organic instead of perfect circles
          vec3 mouseNoisePos = vec3(pos.xy * 0.015, time * 0.5);
          float mouseNoise = snoise(mouseNoisePos) * 0.5 + 0.5;
          float organicFactor = 0.85 + mouseNoise * 0.03; // 0.85 to 1.15 variation
          
          if (mouseDist < 450.0 * organicFactor) { // Restored to previous range
            vec2 mouseDir = normalize(toMouse);
            
            // Organic 4-zone system with noise-based boundaries (restored)
            
            // ZONE 1: Organic void core (0-50px) - HIGHLY NOTICEABLE
            float voidSize = 50.0 * organicFactor;
            float voidZone = smoothstep(voidSize, 0.0, mouseDist);
            if (voidZone > 0.0) {
              vec2 perpendicular = vec2(-mouseDir.y, mouseDir.x);
              float voidPower = voidZone * voidZone * voidZone;
              float forceNoise = snoise(vec3(pos.xy * 0.02, time * 0.3));
              float forceMult = 0.7 + forceNoise * 0.6;
              newPos.xy -= mouseDir * voidPower * 560.0 * forceMult * delta;
              newPos.xy += perpendicular * voidPower * 290.0 * forceMult * delta;
              newPos.z += sin(time * 20.0 + seed * 6.28) * voidPower * 105.0 * delta;
            }
            
            // ZONE 2: Organic intense vortex (50-120px) - HIGHLY NOTICEABLE
            float innerSize1 = 50.0 * organicFactor;
            float innerSize2 = 120.0 * organicFactor;
            float innerZone = smoothstep(innerSize2, innerSize1, mouseDist) * (1.0 - voidZone);
            if (innerZone > 0.0) {
              vec2 perpendicular = vec2(-mouseDir.y, mouseDir.x);
              float innerPower = innerZone * innerZone;
              float vortexNoise = snoise(vec3(pos.xy * 0.018, time * 0.4));
              float vortexMult = 0.75 + vortexNoise * 0.5;
              newPos.xy -= mouseDir * innerPower * 320.0 * vortexMult * delta;
              newPos.xy += perpendicular * innerPower * 225.0 * vortexMult * delta;
              float turbulence = sin(time * 12.0 - mouseDist * 0.1 + seed * 6.28);
              newPos.z += turbulence * innerPower * 72.0 * delta;
            }
            
            // ZONE 3: Organic fluid zone (120-250px) - HIGHLY NOTICEABLE
            float midSize1 = 120.0 * organicFactor;
            float midSize2 = 250.0 * organicFactor;
            float midZone = smoothstep(midSize2, midSize1, mouseDist) * (1.0 - innerZone) * (1.0 - voidZone);
            if (midZone > 0.0) {
              vec2 perpendicular = vec2(-mouseDir.y, mouseDir.x);
              float midPower = midZone * midZone;
              float fluidNoise = snoise(vec3(pos.xy * 0.015, time * 0.35));
              float fluidMult = 0.8 + fluidNoise * 0.4;
              newPos.xy += mouseDir * midPower * 160.0 * fluidMult * delta;
              newPos.xy += perpendicular * midPower * 120.0 * fluidMult * delta;
              newPos.z += sin(time * 8.0 - mouseDist * 0.06 + fluidNoise * 3.0) * midPower * 52.0 * delta;
            }
            
            // ZONE 4: Organic ripples (250-450px) - HIGHLY NOTICEABLE
            float rippleSize1 = 250.0 * organicFactor;
            float rippleSize2 = 450.0 * organicFactor;
            float rippleZone = smoothstep(rippleSize2, rippleSize1, mouseDist) * (1.0 - midZone) * (1.0 - innerZone) * (1.0 - voidZone);
            if (rippleZone > 0.0) {
              float rippleNoise = snoise(vec3(pos.xy * 0.012, time * 0.25));
              float wave1 = sin((mouseDist * 0.08) - time * 5.0 + rippleNoise * 2.0) * rippleZone;
              float wave2 = sin((mouseDist * 0.15) - time * 3.5 + rippleNoise * 1.5) * rippleZone * 0.5;
              float combinedWave = (wave1 + wave2) * (0.8 + rippleNoise * 0.4);
              
              newPos.xy += mouseDir * combinedWave * 93.0 * delta;
              newPos.z += combinedWave * 61.0 * delta;
              vec2 tangent = vec2(-mouseDir.y, mouseDir.x);
              newPos.xy += tangent * combinedWave * 61.0 * delta;
            }
          }
          
          // Update velocity for momentum (crucial for smooth FBO ping-pong)
          vel = (newPos - pos) / max(delta, 0.001);
          vel *= 0.94; // Slight damping for stability
          
          // Clamp extreme velocities to prevent instability
          float velMag = length(vel);
          if (velMag > 500.0) {
            vel = normalize(vel) * 500.0;
          }
          
          gl_FragColor = vec4(newPos, ring);
        }
      `
      
      const velocityShader = `
        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;
        
        varying vec2 vUv;
        
        void main() {
          vec4 posData = texture2D(texturePosition, vUv);
          vec4 velData = texture2D(textureVelocity, vUv);
          
          // Just pass through velocity (already computed in position shader)
          gl_FragColor = velData;
        }
      `
      
      // Create compute materials
      const computePositionMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texturePosition: { value: positionTexture1 },
          textureVelocity: { value: velocityTexture1 },
          time: { value: 0 },
          delta: { value: 0 },
          mousePosition: { value: new THREE.Vector2(999, 999) },
          textureSize: { value: textureSize }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: computeShader
      })
      
      const computeVelocityMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texturePosition: { value: positionTexture1 },
          textureVelocity: { value: velocityTexture1 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: velocityShader
      })
      
      // Full-screen quad for compute pass
      const computeGeometry = new THREE.PlaneGeometry(2, 2)
      const computeMesh = new THREE.Mesh(computeGeometry, computePositionMaterial)
      const computeScene = new THREE.Scene()
      computeScene.add(computeMesh)
      const computeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      
      // Create particle geometry with UVs to sample from texture
      const portalParticleGeometry = new THREE.BufferGeometry()
      const particleUVs = new Float32Array(actualParticles * 2)
      const particleSizes = new Float32Array(actualParticles)
      
      for (let y = 0; y < textureSize; y++) {
        for (let x = 0; x < textureSize; x++) {
          const i = y * textureSize + x
          particleUVs[i * 2 + 0] = x / textureSize
          particleUVs[i * 2 + 1] = y / textureSize
          particleSizes[i] = 1.8 + Math.random() * 2.2  // Smaller particles for subtler effect
        }
      }
      
      // Dummy positions (will be overwritten by shader)
      const dummyPositions = new Float32Array(actualParticles * 3)
      portalParticleGeometry.setAttribute('position', new THREE.BufferAttribute(dummyPositions, 3))
      portalParticleGeometry.setAttribute('uv', new THREE.BufferAttribute(particleUVs, 2))
      portalParticleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
      
      // Render material - reads from position texture
      const portalMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texturePosition: { value: null }, // Will be set to current position RT
          textureVelocity: { value: null },
          time: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() },
          // Theme colors - indigo/cyan for light mode, purple for dark mode
          colorOne: { value: isDark ? new THREE.Color(COLOR_ONE) : new THREE.Color('#4f46e5') }, // Indigo-600 for light mode
          colorTwo: { value: isDark ? new THREE.Color(COLOR_TWO) : new THREE.Color('#06b6d4') }, // Cyan-500 for light mode
          isDark: { value: isDark ? 1.0 : 0.0 }
        },
        vertexShader: `
          uniform sampler2D texturePosition;
          uniform sampler2D textureVelocity;
          uniform float pixelRatio;
          uniform float time;
          
          attribute float size;
          
          varying vec3 vColor;
          varying float vAlpha;
          varying float vSpeed;
          varying float vRing;
          varying float vEnergy;
          
          void main() {
            vec4 posData = texture2D(texturePosition, uv);
            vec4 velData = texture2D(textureVelocity, uv);
            
            vec3 pos = posData.xyz;
            float ring = posData.w;
            vec3 vel = velData.xyz;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Velocity-based size and energy
            float speed = length(vel);
            vSpeed = speed;
            vEnergy = min(speed / 100.0, 2.0); // Normalize speed to energy level
            
            // Size increases dramatically with velocity (mouse interaction feedback)
            float sizeMult = 1.0 + vEnergy * 0.8;
            
            // Dynamic pulsing based on ring, time, and energy
            float pulse = 1.0 + sin(time * 2.5 + ring * 15.0) * 0.4;
            pulse += vEnergy * 0.3; // Extra pulse when energized
            
            gl_PointSize = size * pixelRatio * pulse * sizeMult * (750.0 / -mvPosition.z);
            
            // Dark purple color system - deep rich purple tones
            vec3 innerColor = vec3(0.31, 0.09, 0.92) * 0.25;   // Deep inner purple (#4f16eb darkened)
            vec3 midColor = vec3(0.29, 0.01, 0.35) * 0.7;       // Rich medium purple (#4b0358)
            vec3 outerColor = vec3(0.31, 0.09, 0.92) * 0.4;    // Dark outer purple
            
            // Smooth gradient across rings - dark purple tones
            vec3 color1 = mix(innerColor, midColor, smoothstep(0.0, 0.5, ring));
            vec3 baseColor = mix(color1, outerColor, smoothstep(0.5, 1.0, ring));
            
            // Energy only slightly increases brightness
            vColor = baseColor * (1.0 + vEnergy * 0.2);
            
            vAlpha = 1.0;
            vRing = ring;
          }
        `,
        fragmentShader: `
          uniform vec3 colorOne;
          uniform vec3 colorTwo;
          uniform float isDark;
          
          varying vec3 vColor;
          varying float vAlpha;
          varying float vSpeed;
          varying float vRing;
          varying float vEnergy;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            
            // Enhanced multi-layer glow system - Very subtle
            float alpha = 0.0;
            
            // Strong alpha for great portal visibility
            float outerGlow = mix(0.18, 0.10, isDark);
            float midGlow = mix(0.28, 0.16, isDark);
            float coreGlow = mix(0.38, 0.22, isDark);
            
            // Outer glow (soft falloff)
            alpha += smoothstep(0.5, 0.0, dist) * vAlpha * outerGlow;
            
            // Mid glow (medium intensity)
            alpha += smoothstep(0.5, 0.2, dist) * midGlow;
            
            // Inner core (bright center)
            alpha += smoothstep(0.35, 0.0, dist) * coreGlow;
            
            // Energy boost - minimal
            float energyBoost = mix(0.05, 0.02, isDark);
            alpha *= 1.0 + vEnergy * energyBoost;
            
            // Strong theme boost for great visibility
            float themeBoost = mix(1.3, 0.85, isDark);
            alpha *= themeBoost;
            
            // Enhanced color processing - DEEP PURPLE
            vec3 finalColor = vColor;
            
            // Ring-based brightness variation (subtle)
            finalColor *= 1.0 + (1.0 - vRing) * 0.10;
            
            // Energy increases brightness only slightly
            finalColor *= 1.0 + vEnergy * mix(0.15, 0.08, isDark);
            
            // THEME-SPECIFIC COLOR ADJUSTMENTS - Use theme colors
            if (isDark < 0.5) {
              // LIGHT MODE: Use indigo/cyan theme colors
              // Mix base color with theme colors (colorOne and colorTwo from uniforms)
              finalColor = mix(finalColor * 0.6, mix(colorTwo, colorOne, vRing), 0.5);
              
              // Moderate saturation for rich color without excessive brightness
              vec3 gray = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
              finalColor = mix(gray, finalColor, 1.8);
            } else {
              // DARK MODE: Vibrant visible purple using theme colors
              finalColor = mix(finalColor * 0.5, mix(colorTwo, colorOne, vRing), 0.4);
              vec3 gray = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
              finalColor = mix(gray, finalColor, 1.6);  // Higher saturation for vibrant purple
            }
            
            // Anti-aliased edge
            float edgeSoftness = fwidth(dist) * 2.0;
            float edge = smoothstep(0.5 - edgeSoftness, 0.5, dist);
            alpha *= (1.0 - edge);
            
            // Higher alpha cap for great visibility
            float maxAlpha = mix(0.48, 0.28, isDark);
            gl_FragColor = vec4(finalColor, min(alpha, maxAlpha));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      
      const portalPoints = new THREE.Points(portalParticleGeometry, portalMaterial)
      scene.add(portalPoints)
      
      // CRITICAL: Initialize render targets with initial particle data
      // Create a temporary scene to copy DataTexture data to GPU RenderTargets
      const initScene = new THREE.Scene()
      const initCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const initGeometry = new THREE.PlaneGeometry(2, 2)
      
      // Copy position data
      const initPosMaterial = new THREE.ShaderMaterial({
        uniforms: { tSource: { value: positionTexture1 } },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tSource;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(tSource, vUv);
          }
        `
      })
      const initPosMesh = new THREE.Mesh(initGeometry, initPosMaterial)
      initScene.add(initPosMesh)
      
      renderer.setRenderTarget(positionRT1)
      renderer.render(initScene, initCamera)
      
      // Copy velocity data
      const initVelMaterial = new THREE.ShaderMaterial({
        uniforms: { tSource: { value: velocityTexture1 } },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tSource;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(tSource, vUv);
          }
        `
      })
      initPosMesh.material = initVelMaterial
      renderer.setRenderTarget(velocityRT1)
      renderer.render(initScene, initCamera)
      
      renderer.setRenderTarget(null)
      
      // Cleanup init resources
      initGeometry.dispose()
      initPosMaterial.dispose()
      initVelMaterial.dispose()
      
      // Set initial textures for render material
      portalMaterial.uniforms.texturePosition.value = positionRT1.texture
      portalMaterial.uniforms.textureVelocity.value = velocityRT1.texture
      
      return {
        portalPoints,
        portalMaterial,
        computeMesh,
        computeScene,
        computeCamera,
        computePositionMaterial,
        computeVelocityMaterial,
        positionRT1,
        positionRT2,
        velocityRT1,
        velocityRT2,
        currentPositionRT: 0, // 0 or 1 for ping-pong
        textureSize
      }
    }

    // Create advanced particle-based portal with flow field
    const createPortalRing = () => {
      // Use GPGPU version instead
      return createGPGPUPortal()
    }

    let particles: THREE.Points | null = null
    let material: THREE.ShaderMaterial | null = null
    let portalRing: any = null
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
      
      // Create portal ring - disable on mobile for better performance
      if (!isMobile) {
        portalRing = createPortalRing()
      }
      
      console.log('Particles created:', setup.geometry.attributes.position.count)
    }
    
    // Add error handler
    img.onerror = (error) => {
      console.error('Failed to load image:', error)
    }
    
    img.src = imageUrl

    // Mouse and touch position update for real-time responsiveness
    const updatePosition = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.targetX = ((clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.targetY = -((clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        updatePosition(touch.clientX, touch.clientY)
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        updatePosition(touch.clientX, touch.clientY)
      }
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })

    // Animation loop - OPTIMIZED with throttling for mobile
    const clock = new THREE.Clock()
    let formationProgress = 0
    let lastTime = 0
    let frameCount = 0

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)

      // Throttle updates on mobile - skip every other frame for 30fps
      if (isMobile) {
        frameCount++
        if (frameCount % 2 === 0) {
          return
        }
      }

      // Performance monitoring
      if (stats) stats.begin()

      const elapsed = clock.getElapsedTime()
      const delta = Math.min(elapsed - lastTime, 0.033) // Cap to 30fps minimum
      lastTime = elapsed

      // Smooth and responsive mouse following - less damping on desktop
      const dampingFactor = isMobile ? 0.2 : 0.3
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * dampingFactor
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * dampingFactor

      // Update formation progress
      if (formationProgress < 1) {
        formationProgress = Math.min(1, formationProgress + formationSpeed)
      }

      if (material) {
        material.uniforms.time.value = elapsed
        material.uniforms.formationProgress.value = formationProgress
        
        // Convert 2D mouse to 3D space
        const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const pos = camera.position.clone().add(dir.multiplyScalar(distance))
        material.uniforms.mousePosition.value = pos
      }

      // Update GPGPU portal with ping-pong - OPTIMIZED
      if (portalRing && portalRing.computeScene && formationProgress > 0.5) {
        // Convert mouse from normalized device coords
        const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance))
        
        const normalizedMouse = new THREE.Vector2(
          (mouseWorldPos.x + 375) / 750,
          (mouseWorldPos.y + 375) / 750
        )
        
        const currentPosRT = portalRing.currentPositionRT === 0 ? portalRing.positionRT1 : portalRing.positionRT2
        const nextPosRT = portalRing.currentPositionRT === 0 ? portalRing.positionRT2 : portalRing.positionRT1
        const currentVelRT = portalRing.currentPositionRT === 0 ? portalRing.velocityRT1 : portalRing.velocityRT2
        const nextVelRT = portalRing.currentPositionRT === 0 ? portalRing.velocityRT2 : portalRing.velocityRT1
        
        // Update compute shader uniforms
        portalRing.computePositionMaterial.uniforms.texturePosition.value = currentPosRT.texture
        portalRing.computePositionMaterial.uniforms.textureVelocity.value = currentVelRT.texture
        portalRing.computePositionMaterial.uniforms.time.value = elapsed
        portalRing.computePositionMaterial.uniforms.delta.value = delta
        portalRing.computePositionMaterial.uniforms.mousePosition.value = normalizedMouse
        
        // Render compute pass
        portalRing.computeMesh.material = portalRing.computePositionMaterial
        renderer.setRenderTarget(nextPosRT)
        renderer.render(portalRing.computeScene, portalRing.computeCamera)
        
        // Update velocity
        portalRing.computeVelocityMaterial.uniforms.texturePosition.value = nextPosRT.texture
        portalRing.computeVelocityMaterial.uniforms.textureVelocity.value = currentVelRT.texture
        portalRing.computeMesh.material = portalRing.computeVelocityMaterial
        renderer.setRenderTarget(nextVelRT)
        renderer.render(portalRing.computeScene, portalRing.computeCamera)
        
        renderer.setRenderTarget(null)
        
        // Update render material
        portalRing.portalMaterial.uniforms.texturePosition.value = nextPosRT.texture
        portalRing.portalMaterial.uniforms.textureVelocity.value = nextVelRT.texture
        portalRing.portalMaterial.uniforms.time.value = elapsed
        portalRing.portalMaterial.uniforms.isDark.value = isDark ? 1.0 : 0.0
        
        if (portalRing.portalPoints) {
          portalRing.portalPoints.visible = true
        }
        
        // Swap buffers
        portalRing.currentPositionRT = 1 - portalRing.currentPositionRT
      }

      renderer.render(scene, camera)
      
      if (stats) stats.end()
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!container) return
      // Keep square aspect ratio on resize
      const size = Math.max(container.clientWidth || 600, container.clientHeight || 600)
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(size, size)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      if (stats && container.contains(stats.dom)) {
        container.removeChild(stats.dom)
      }
      scene.clear()
      renderer.dispose()
      
      // Dispose geometries and materials
      if (particles) {
        particles.geometry.dispose()
        if (particles.material instanceof THREE.Material) {
          particles.material.dispose()
        }
      }
      if (portalRing) {
        if (portalRing.portalPoints) {
          portalRing.portalPoints.geometry.dispose()
          portalRing.portalMaterial.dispose()
        }
        if (portalRing.computePositionMaterial) portalRing.computePositionMaterial.dispose()
        if (portalRing.computeVelocityMaterial) portalRing.computeVelocityMaterial.dispose()
        if (portalRing.positionRT1) portalRing.positionRT1.dispose()
        if (portalRing.positionRT2) portalRing.positionRT2.dispose()
        if (portalRing.velocityRT1) portalRing.velocityRT1.dispose()
        if (portalRing.velocityRT2) portalRing.velocityRT2.dispose()
      }
    }
  }, [mounted, imageUrl, particleCount, particleSize, formationSpeed, mouseInfluence, isMobile, theme, systemTheme])

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-32 h-32 rounded-full border-4 border-purple-500/20 animate-spin-slow" />
            {/* Middle ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-purple-500 border-r-violet-500 animate-spin" 
                 style={{ animationDuration: '1.5s' }} />
            {/* Inner pulsing circle */}
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 animate-pulse" />
            {/* Center dot */}
            <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white dark:bg-gray-900" />
          </div>
          {/* Loading text */}
          <div className="absolute mt-48 text-indigo-500 dark:text-purple-400 font-semibold animate-pulse">
            Loading particles...
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer"
        style={{ 
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          minHeight: '400px'
        }}
      />
    </div>
  )
}

export default ParticleAvatar
