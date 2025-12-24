"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from 'next-themes'
import { COLOR_ONE, COLOR_TWO } from '@/config'

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
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000)
    camera.position.z = 1200

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile,
      powerPreference: isMobile ? 'default' : 'high-performance'
    })
    
    const size = Math.max(container.clientWidth || 600, container.clientHeight || 600)
    renderer.setSize(size, size)
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.objectFit = 'contain'
    
    container.appendChild(renderer.domElement)

    // Load and process image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    const setupGPGPUParticles = (imageData: ImageData) => {
      const width = imageData.width
      const height = imageData.height
      const data = imageData.data

      // Calculate texture size for GPGPU (must be square power of 2 for best performance)
      const textureSize = Math.ceil(Math.sqrt(particleCount))
      const actualParticles = textureSize * textureSize

      console.log(`GPGPU Setup: ${actualParticles} particles in ${textureSize}x${textureSize} texture`)

      // Sample particles from image using polar coordinates
      const sampledParticles: Array<{
        targetPos: THREE.Vector3
        color: THREE.Color
        size: number
      }> = []

      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = width / 2

      const numRings = Math.floor(Math.sqrt(particleCount / (isMobile ? 2 : 3)))
      
      for (let ring = 0; ring < numRings; ring++) {
        const radiusFraction = ring / (numRings - 1)
        const radius = radiusFraction * maxRadius
        const circumference = 2 * Math.PI * Math.max(1, radius)
        const particlesThisRing = ring === 0 ? 1 : Math.floor(circumference * (isMobile ? 1.0 : 1.5))
        
        for (let i = 0; i < particlesThisRing && sampledParticles.length < particleCount; i++) {
          const angle = (i / particlesThisRing) * Math.PI * 2
          const sampledX = centerX + Math.cos(angle) * radius
          const sampledY = centerY + Math.sin(angle) * radius
          
          if (sampledX < 0 || sampledX >= width || sampledY < 0 || sampledY >= height) continue
          
          const pixelIndex = (Math.floor(sampledY) * width + Math.floor(sampledX)) * 4
          const r = data[pixelIndex] / 255
          const g = data[pixelIndex + 1] / 255
          const b = data[pixelIndex + 2] / 255
          const a = data[pixelIndex + 3] / 255

          if (a > 0.1) {
            const scale = 180.0
            const targetRadius = radiusFraction * scale
            const px = Math.cos(angle) * targetRadius
            const py = Math.sin(angle) * targetRadius

            sampledParticles.push({
              targetPos: new THREE.Vector3(px, py, 0),
              color: new THREE.Color(r, g, b),
              size: particleSize * (0.9 + Math.random() * 0.25)
            })
          }
        }
      }

      // Create data textures for GPGPU
      const positionData = new Float32Array(actualParticles * 4) // RGBA
      const targetData = new Float32Array(actualParticles * 4)
      const colorData = new Float32Array(actualParticles * 4)
      const sizeData = new Float32Array(actualParticles * 4)

      for (let i = 0; i < actualParticles; i++) {
        if (i < sampledParticles.length) {
          const p = sampledParticles[i]
          
          // Starting position (explosion)
          const explosionAngle = Math.random() * Math.PI * 2
          const explosionRadius = 250 + Math.random() * 200
          positionData[i * 4 + 0] = Math.cos(explosionAngle) * explosionRadius
          positionData[i * 4 + 1] = Math.sin(explosionAngle) * explosionRadius
          positionData[i * 4 + 2] = (Math.random() - 0.5) * 400
          positionData[i * 4 + 3] = Math.random() // delay
          
          // Target position
          targetData[i * 4 + 0] = p.targetPos.x
          targetData[i * 4 + 1] = p.targetPos.y
          targetData[i * 4 + 2] = p.targetPos.z
          targetData[i * 4 + 3] = 1.0
          
          // Color
          colorData[i * 4 + 0] = p.color.r
          colorData[i * 4 + 1] = p.color.g
          colorData[i * 4 + 2] = p.color.b
          colorData[i * 4 + 3] = 1.0
          
          // Size
          sizeData[i * 4 + 0] = p.size
          sizeData[i * 4 + 1] = 0
          sizeData[i * 4 + 2] = 0
          sizeData[i * 4 + 3] = 0
        } else {
          // Inactive particles
          positionData[i * 4 + 3] = -1.0
          targetData[i * 4 + 3] = 0.0
        }
      }

      // Create textures
      const createDataTexture = (data: Float32Array) => {
        const texture = new THREE.DataTexture(
          data,
          textureSize,
          textureSize,
          THREE.RGBAFormat,
          THREE.FloatType
        )
        texture.needsUpdate = true
        return texture
      }

      const positionTexture = createDataTexture(positionData)
      const targetTexture = createDataTexture(targetData)
      const colorTexture = createDataTexture(colorData)
      const sizeTexture = createDataTexture(sizeData)

      // Create render targets for ping-pong
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

      // Initialize render targets with initial data
      const initScene = new THREE.Scene()
      const initCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const initGeometry = new THREE.PlaneGeometry(2, 2)
      const initMaterial = new THREE.ShaderMaterial({
        uniforms: { tSource: { value: positionTexture } },
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
      const initMesh = new THREE.Mesh(initGeometry, initMaterial)
      initScene.add(initMesh)

      renderer.setRenderTarget(positionRT1)
      renderer.render(initScene, initCamera)
      renderer.setRenderTarget(null)

      initGeometry.dispose()
      initMaterial.dispose()

      // GPGPU Compute shader for particle physics
      const computeShader = new THREE.ShaderMaterial({
        uniforms: {
          tPosition: { value: positionRT1.texture },
          tTarget: { value: targetTexture },
          time: { value: 0 },
          delta: { value: 0 },
          formationProgress: { value: 0 },
          formationSpeed: { value: formationSpeed },
          isMobile: { value: isMobile ? 1.0 : 0.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tPosition;
          uniform sampler2D tTarget;
          uniform float time;
          uniform float delta;
          uniform float formationProgress;
          uniform float formationSpeed;
          uniform float isMobile;
          
          varying vec2 vUv;
          
          void main() {
            vec4 posData = texture2D(tPosition, vUv);
            vec4 targetData = texture2D(tTarget, vUv);
            
            // If inactive particle, skip
            if (posData.w < 0.0 || targetData.w < 0.5) {
              gl_FragColor = posData;
              return;
            }
            
            vec3 pos = posData.xyz;
            vec3 target = targetData.xyz;
            float delay = posData.w;
            
            // Formation progress with delay
            float adjustedProgress = clamp((formationProgress - delay) / (1.0 - delay * 0.5), 0.0, 1.0);
            
            // Ease function - simpler on mobile
            float eased = isMobile > 0.5 ? adjustedProgress : 1.0 - pow(1.0 - adjustedProgress, 3.0);
            
            // Interpolate to target
            pos = mix(pos, target, eased);
            
            // Desktop only: subtle idle animation
            if (isMobile < 0.5 && formationProgress > 0.98) {
              float idleBreath = sin(time * 0.3 + delay * 6.28) * 0.3;
              pos.z += idleBreath;
            }
            
            gl_FragColor = vec4(pos, delay);
          }
        `
      })

      // Compute scene (fullscreen quad)
      const computeScene = new THREE.Scene()
      const computeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const computeGeometry = new THREE.PlaneGeometry(2, 2)
      const computeMesh = new THREE.Mesh(computeGeometry, computeShader)
      computeScene.add(computeMesh)

      // Render particles using texture data
      const particleGeometry = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(actualParticles * 3)
      const particleUVs = new Float32Array(actualParticles * 2)

      for (let i = 0; i < actualParticles; i++) {
        particlePositions[i * 3 + 0] = 0
        particlePositions[i * 3 + 1] = 0
        particlePositions[i * 3 + 2] = 0
        
        const x = (i % textureSize) / textureSize
        const y = Math.floor(i / textureSize) / textureSize
        particleUVs[i * 2 + 0] = x
        particleUVs[i * 2 + 1] = y
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
      particleGeometry.setAttribute('uv', new THREE.BufferAttribute(particleUVs, 2))

      const colorOne = isDark ? COLOR_ONE : '#4f46e5'
      const colorTwo = isDark ? COLOR_TWO : '#06b6d4'

      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tPosition: { value: positionRT1.texture },
          tColor: { value: colorTexture },
          tSize: { value: sizeTexture },
          time: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() },
          formationProgress: { value: 0 },
          isDark: { value: isDark ? 1.0 : 0.0 },
          colorOne: { value: new THREE.Color(colorOne) },
          colorTwo: { value: new THREE.Color(colorTwo) }
        },
        vertexShader: `
          uniform sampler2D tPosition;
          uniform sampler2D tColor;
          uniform sampler2D tSize;
          uniform float time;
          uniform float pixelRatio;
          uniform float formationProgress;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec4 posData = texture2D(tPosition, uv);
            vec4 colorData = texture2D(tColor, uv);
            vec4 sizeData = texture2D(tSize, uv);
            
            // Skip inactive particles
            if (posData.w < 0.0) {
              gl_Position = vec4(0.0, 0.0, -9999.0, 1.0);
              vAlpha = 0.0;
              return;
            }
            
            vec3 pos = posData.xyz;
            float delay = posData.w;
            
            float adjustedProgress = clamp((formationProgress - delay) / (1.0 - delay * 0.5), 0.0, 1.0);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            float particleSize = sizeData.x;
            gl_PointSize = particleSize * pixelRatio * (750.0 / -mvPosition.z);
            
            vColor = colorData.rgb;
            vAlpha = adjustedProgress;
          }
        `,
        fragmentShader: `
          uniform float isDark;
          uniform vec3 colorOne;
          uniform vec3 colorTwo;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            
            float alpha = 0.0;
            
            float coreStrength = mix(3.5, 1.5, isDark);
            float midStrength = mix(1.8, 0.8, isDark);
            float glowStrength = mix(0.08, 0.35, isDark);
            
            alpha += smoothstep(0.5, 0.0, dist) * vAlpha * coreStrength;
            alpha += smoothstep(0.5, 0.12, dist) * vAlpha * midStrength;
            alpha += smoothstep(0.5, 0.42, dist) * vAlpha * glowStrength;
            
            vec3 finalColor = vColor;
            
            if (isDark < 0.5) {
              finalColor *= 0.85;
              vec3 gray = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
              finalColor = mix(gray, finalColor, 1.6);
              finalColor = pow(finalColor, vec3(0.9));
              alpha *= 1.8;
            }
            
            float edgeSoftness = fwidth(dist) * 1.5;
            float edge = smoothstep(0.5 - edgeSoftness, 0.5, dist);
            alpha *= (1.0 - edge);
            
            gl_FragColor = vec4(finalColor, min(alpha, 1.8));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        vertexColors: false
      })

      const particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      console.log('GPGPU Particles created:', actualParticles)
      setIsLoading(false)
      onLoad?.()

      return {
        particles,
        particleMaterial,
        computeScene,
        computeCamera,
        computeShader,
        positionRT1,
        positionRT2,
        currentRT: 0,
        targetTexture,
        colorTexture,
        sizeTexture
      }
    }

    let gpgpuSystem: any = null
    let animationId: number

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      
      const size = 200
      canvas.width = size
      canvas.height = size
      
      const imgAspect = img.width / img.height
      let drawWidth = size
      let drawHeight = size
      let offsetX = 0
      let offsetY = 0
      
      if (imgAspect > 1) {
        drawWidth = size * imgAspect
        offsetX = (size - drawWidth) / 2
      } else if (imgAspect < 1) {
        drawHeight = size / imgAspect
        offsetY = (size - drawHeight) / 2
      }
      
      ctx.save()
      ctx.beginPath()
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      ctx.translate(0, size)
      ctx.scale(1, -1)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      ctx.restore()

      const imageData = ctx.getImageData(0, 0, size, size)
      gpgpuSystem = setupGPGPUParticles(imageData)
    }
    
    img.onerror = (error) => {
      console.error('Failed to load image:', error)
    }
    
    img.src = imageUrl

    // Animation loop - PURE GPU
    const clock = new THREE.Clock()
    let formationProgress = 0
    let lastTime = 0

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()
      const delta = Math.min(elapsed - lastTime, 0.033)
      lastTime = elapsed

      // Update formation progress
      if (formationProgress < 1) {
        formationProgress = Math.min(1, formationProgress + formationSpeed)
      }

      if (gpgpuSystem) {
        // Ping-pong: read from current, write to next
        const currentRT = gpgpuSystem.currentRT === 0 ? gpgpuSystem.positionRT1 : gpgpuSystem.positionRT2
        const nextRT = gpgpuSystem.currentRT === 0 ? gpgpuSystem.positionRT2 : gpgpuSystem.positionRT1

        // Update compute shader
        gpgpuSystem.computeShader.uniforms.tPosition.value = currentRT.texture
        gpgpuSystem.computeShader.uniforms.time.value = elapsed
        gpgpuSystem.computeShader.uniforms.delta.value = delta
        gpgpuSystem.computeShader.uniforms.formationProgress.value = formationProgress

        // Render compute pass to update positions
        renderer.setRenderTarget(nextRT)
        renderer.render(gpgpuSystem.computeScene, gpgpuSystem.computeCamera)
        renderer.setRenderTarget(null)

        // Update particle material to use new positions
        gpgpuSystem.particleMaterial.uniforms.tPosition.value = nextRT.texture
        gpgpuSystem.particleMaterial.uniforms.time.value = elapsed
        gpgpuSystem.particleMaterial.uniforms.formationProgress.value = formationProgress

        // Swap buffers
        gpgpuSystem.currentRT = 1 - gpgpuSystem.currentRT
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!container) return
      const size = Math.max(container.clientWidth || 600, container.clientHeight || 600)
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(size, size)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      scene.clear()
      renderer.dispose()
      
      if (gpgpuSystem) {
        gpgpuSystem.particles?.geometry.dispose()
        gpgpuSystem.particleMaterial?.dispose()
        gpgpuSystem.computeShader?.dispose()
        gpgpuSystem.positionRT1?.dispose()
        gpgpuSystem.positionRT2?.dispose()
        gpgpuSystem.targetTexture?.dispose()
        gpgpuSystem.colorTexture?.dispose()
        gpgpuSystem.sizeTexture?.dispose()
      }
    }
  }, [mounted, imageUrl, particleCount, particleSize, formationSpeed, mouseInfluence, isMobile, theme, systemTheme])

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-purple-500/20 animate-spin-slow" />
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-purple-500 border-r-violet-500 animate-spin" 
                 style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 animate-pulse" />
            <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white dark:bg-gray-900" />
          </div>
          <div className="absolute mt-48 text-indigo-500 dark:text-purple-400 font-semibold animate-pulse">
            Initializing GPGPU...
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full"
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
