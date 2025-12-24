"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { COLOR_ONE, COLOR_TWO } from "@/config";
import Stats from "stats.js";

interface ParticleAvatarProps {
  imageUrl: string;
  particleCount?: number;
  particleSize?: number;
  formationSpeed?: number;
  mouseInfluence?: number;
  isMobile?: boolean;
  onLoad?: () => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const mouseRef = useRef({ x: 9999, y: 9999, targetX: 9999, targetY: 9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const resolvedTheme = theme === "system" ? systemTheme : theme;
    const isDark = resolvedTheme === "dark";

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.z = 1200;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? "default" : "high-performance",
    });
    
    const size = Math.max(container.clientWidth || 600, container.clientHeight || 600);
    renderer.setSize(size, size);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.objectFit = "contain";
    container.appendChild(renderer.domElement);

    // Stats
    let stats: Stats | null = null;
    if (process.env.NODE_ENV === "development" && !isMobile) {
      stats = new Stats();
      stats.showPanel(0);
      stats.dom.style.position = "absolute";
      stats.dom.style.left = "0px";
      stats.dom.style.top = "0px";
      container.appendChild(stats.dom);
    }

    // ==========================================
    // FACE SYSTEM (CPU Generation + Vertex Shader)
    // ==========================================
    let faceMaterial: THREE.ShaderMaterial | null = null;

    const setupFaceParticles = (imageData: ImageData) => {
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      const positions: number[] = [];
      const colors: number[] = [];
      const originalPositions: number[] = [];
      const sizes: number[] = [];
      const delays: number[] = [];

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = width / 2;

      const numRings = isMobile
        ? Math.floor(Math.sqrt(particleCount / 2))
        : Math.floor(Math.sqrt(particleCount / 3));

      for (let ring = 0; ring < numRings; ring++) {
        const radiusFraction = ring / (numRings - 1);
        const radius = radiusFraction * maxRadius;
        const circumference = 2 * Math.PI * Math.max(1, radius);
        const particlesThisRing = ring === 0 ? 1 : Math.floor(circumference * (isMobile ? 1.0 : 1.5));

        for (let i = 0; i < particlesThisRing; i++) {
          const angle = (i / particlesThisRing) * Math.PI * 2;
          const sampledX = centerX + Math.cos(angle) * radius;
          const sampledY = centerY + Math.sin(angle) * radius;

          if (sampledX < 0 || sampledX >= width || sampledY < 0 || sampledY >= height) continue;

          const pixelIndex = (Math.floor(sampledY) * width + Math.floor(sampledX)) * 4;
          const r = data[pixelIndex] / 255;
          const g = data[pixelIndex + 1] / 255;
          const b = data[pixelIndex + 2] / 255;
          const a = data[pixelIndex + 3] / 255;

          if (a > 0.1) {
            const scale = 180.0;
            const targetRadius = radiusFraction * scale;
            const px = Math.cos(angle) * targetRadius;
            const py = Math.sin(angle) * targetRadius;
            const pz = 0;

            originalPositions.push(px, py, pz);

            const explosionAngle = angle + (Math.random() - 0.5) * 0.3;
            const explosionRadius = 250 + Math.random() * 200 + radiusFraction * maxRadius * 0.5;
            positions.push(
              Math.cos(explosionAngle) * explosionRadius,
              Math.sin(explosionAngle) * explosionRadius,
              (Math.random() - 0.5) * 400
            );

            const saturation = 1.05;
            const brightness = 1.15;
            colors.push(
              Math.min(1, r * saturation * brightness),
              Math.min(1, g * saturation * brightness),
              Math.min(1, b * saturation * brightness)
            );

            const pixelDistFromCenter = Math.sqrt((sampledX - centerX) ** 2 + (sampledY - centerY) ** 2);
            const normalizedCircularDist = pixelDistFromCenter / maxRadius;
            delays.push(normalizedCircularDist * 0.5);

            const edgeDist = pixelDistFromCenter / maxRadius;
            const edgeFactor = 1.0 - Math.pow(edgeDist, 6) * 0.25;
            sizes.push(particleSize * (0.9 + Math.random() * 0.25) * edgeFactor);
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute("originalPosition", new THREE.Float32BufferAttribute(originalPositions, 3));
      geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
      geometry.setAttribute("delay", new THREE.Float32BufferAttribute(delays, 1));

      const colorOne = isDark ? COLOR_ONE : "#4f46e5";
      const colorTwo = isDark ? COLOR_TWO : "#06b6d4";

      faceMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mousePosition: { value: new THREE.Vector3(9999, 9999, 0) },
          mouseInfluence: { value: mouseInfluence },
          formationProgress: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() },
          colorOne: { value: new THREE.Color(colorOne) },
          colorTwo: { value: new THREE.Color(colorTwo) },
          isDark: { value: isDark ? 1.0 : 0.0 },
          isMobile: { value: isMobile ? 1.0 : 0.0 },
        },
        vertexShader: `
          uniform float time;
          uniform vec3 mousePosition;
          uniform float mouseInfluence;
          uniform float formationProgress;
          uniform float pixelRatio;
          uniform float isMobile;
          
          attribute vec3 originalPosition;
          attribute float size;
          attribute float delay;
          
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec3 pos = position;
            vec3 targetPos = originalPosition;
            
            float adjustedProgress = clamp((formationProgress - delay) / (1.0 - delay * 0.5), 0.0, 1.0);
            float eased = isMobile > 0.5 ? adjustedProgress : 1.0 - pow(1.0 - adjustedProgress, 3.0);
            pos = mix(pos, targetPos, eased);
            
            if (isMobile < 0.5 && mouseInfluence > 0.0) {
              float mouseActive = step(0.98, formationProgress);
              vec3 mouseDir = pos - mousePosition;
              float mouseDist = length(mouseDir);
              
              if (mouseActive > 0.0 && mouseDist < mouseInfluence) {
                vec3 normalizedDir = normalize(mouseDir);
                float influence = smoothstep(mouseInfluence, 0.0, mouseDist);
                float bulgePower = influence * influence * influence;
                
                pos.z += bulgePower * 120.0;
                vec2 mouseDir2D = vec2(normalizedDir.x, normalizedDir.y);
                pos.xy -= mouseDir2D * bulgePower * 18.0;
              }
            }
            
            if (isMobile < 0.5) {
              float idleBreath = sin(time * 0.3 + delay * 6.28) * 0.3;
              pos.z += idleBreath * formationProgress;
            }
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            float pulse = isMobile > 0.5 ? 1.0 : 1.0 + sin(time * 0.5 + delay * 10.0) * 0.08 * formationProgress;
            gl_PointSize = size * pixelRatio * pulse * (750.0 / -mvPosition.z);
            
            vColor = color;
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
            } else {
              vec3 themeColor = mix(colorOne, colorTwo, 0.5);
              float outerRegion = smoothstep(0.15, 0.45, dist);
              finalColor = mix(finalColor, mix(finalColor, themeColor, 0.08), outerRegion);
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
        vertexColors: true,
      });

      const particles = new THREE.Points(geometry, faceMaterial);
      scene.add(particles);
    };

    // ==========================================
    // RING SYSTEM (GPGPU)
    // ==========================================
    let ringSystem: any = null;

    const createRingSystem = () => {
      const numParticles = isMobile ? 50000 : 150000; // Optimized count
      const textureSize = Math.ceil(Math.sqrt(numParticles));
      const actualParticles = textureSize * textureSize;

      const positionData = new Float32Array(actualParticles * 4);
      const velocityData = new Float32Array(actualParticles * 4);

      const numRings = isMobile ? 200 : 400;
      const particlesPerRing = Math.floor(actualParticles / numRings);
      let idx = 0;

      for (let ring = 0; ring < numRings; ring++) {
        const baseRadius = 165 + ring * 0.28;
        for (let i = 0; i < particlesPerRing && idx < actualParticles; i++) {
          const angle = (i / particlesPerRing) * Math.PI * 2;
          const radius = baseRadius + (Math.random() - 0.5) * 4.5;
          
          positionData[idx * 4 + 0] = Math.cos(angle) * radius;
          positionData[idx * 4 + 1] = Math.sin(angle) * radius;
          positionData[idx * 4 + 2] = (Math.random() - 0.5) * 5;
          positionData[idx * 4 + 3] = ring / (numRings - 1);

          velocityData[idx * 4 + 0] = 0;
          velocityData[idx * 4 + 1] = 0;
          velocityData[idx * 4 + 2] = 0;
          velocityData[idx * 4 + 3] = Math.random();
          idx++;
        }
      }

      const tPos = new THREE.DataTexture(positionData, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
      tPos.needsUpdate = true;
      const tVel = new THREE.DataTexture(velocityData, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
      tVel.needsUpdate = true;

      const rtOptions = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false,
        depthBuffer: false,
      };

      const rtPos1 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions);
      const rtPos2 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions);
      const rtVel1 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions);
      const rtVel2 = new THREE.WebGLRenderTarget(textureSize, textureSize, rtOptions);

      // Init RenderTargets
      const initScene = new THREE.Scene();
      const initCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const initMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
        uniforms: { tSource: { value: tPos } },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `uniform sampler2D tSource; varying vec2 vUv; void main() { gl_FragColor = texture2D(tSource, vUv); }`
      }));
      initScene.add(initMesh);

      renderer.setRenderTarget(rtPos1); renderer.render(initScene, initCamera);
      renderer.setRenderTarget(rtPos2); renderer.render(initScene, initCamera);
      initMesh.material.uniforms.tSource.value = tVel;
      renderer.setRenderTarget(rtVel1); renderer.render(initScene, initCamera);
      renderer.setRenderTarget(rtVel2); renderer.render(initScene, initCamera);
      renderer.setRenderTarget(null);

      // Compute Shaders
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
          angle -= rotSpeed * delta;
          
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
          vec2 mouseWorld = (mousePosition - vec2(0.5)) * 1000.0;
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
      `;

      const matSimPos = new THREE.ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null },
          time: { value: 0 },
          delta: { value: 0 },
          mousePosition: { value: new THREE.Vector2(999, 999) },
          textureSize: { value: textureSize }
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
        fragmentShader: computeShader
      });

      const matSimVel = new THREE.ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null }
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
          uniform sampler2D texturePosition;
          uniform sampler2D textureVelocity;
          varying vec2 vUv;
          void main() {
             vec4 velData = texture2D(textureVelocity, vUv);
             gl_FragColor = velData; // Pass through, velocity calculated in pos shader
          }
        `
      });

      const computeScene = new THREE.Scene();
      const computeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const computeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matSimPos);
      computeScene.add(computeMesh);

      // Render Material
      const ringUVs = new Float32Array(actualParticles * 2);
      const ringSizes = new Float32Array(actualParticles);
      for(let y=0; y<textureSize; y++) {
         for(let x=0; x<textureSize; x++) {
            const i = y*textureSize + x;
            ringUVs[i*2] = x/textureSize;
            ringUVs[i*2+1] = y/textureSize;
            ringSizes[i] = 1.8 + Math.random() * 2.2;
         }
      }
      
      const ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(actualParticles*3), 3));
      ringGeo.setAttribute('uv', new THREE.BufferAttribute(ringUVs, 2));
      ringGeo.setAttribute('size', new THREE.BufferAttribute(ringSizes, 1));

      const ringRenderMat = new THREE.ShaderMaterial({
        uniforms: {
          texturePosition: { value: null },
          textureVelocity: { value: null },
          pixelRatio: { value: renderer.getPixelRatio() },
          time: { value: 0 },
          isDark: { value: isDark ? 1.0 : 0.0 },
          colorOne: { value: new THREE.Color(COLOR_ONE) },
          colorTwo: { value: new THREE.Color(COLOR_TWO) }
        },
        vertexShader: `
          uniform sampler2D texturePosition;
          uniform sampler2D textureVelocity;
          uniform float pixelRatio;
          uniform float time;
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
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
            
            float speed = length(vel);
            vEnergy = min(speed / 100.0, 2.0);
            float sizeMult = 1.0 + vEnergy * 0.8;
            float pulse = 1.0 + sin(time * 2.5 + ring * 15.0) * 0.4;
            
            gl_PointSize = size * pixelRatio * pulse * sizeMult * (750.0 / -mvPosition.z);
            
            vec3 innerColor = vec3(0.31, 0.09, 0.92) * 0.25;
            vec3 midColor = vec3(0.29, 0.01, 0.35) * 0.7;
            vec3 outerColor = vec3(0.31, 0.09, 0.92) * 0.4;
            
            vec3 baseColor = mix(innerColor, midColor, smoothstep(0.0, 0.5, ring));
            baseColor = mix(baseColor, outerColor, smoothstep(0.5, 1.0, ring));
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
          varying float vRing;
          varying float vEnergy;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            
            float alpha = 0.0;
            float outerGlow = mix(0.18, 0.10, isDark);
            float midGlow = mix(0.28, 0.16, isDark);
            float coreGlow = mix(0.38, 0.22, isDark);
            
            alpha += smoothstep(0.5, 0.0, dist) * outerGlow;
            alpha += smoothstep(0.5, 0.2, dist) * midGlow;
            alpha += smoothstep(0.35, 0.0, dist) * coreGlow;
            
            float themeBoost = mix(1.3, 0.85, isDark);
            alpha *= themeBoost;
            
            vec3 finalColor = vColor;
            finalColor *= 1.0 + (1.0 - vRing) * 0.10;
            
            if (isDark < 0.5) {
               finalColor = mix(finalColor * 0.6, mix(colorTwo, colorOne, vRing), 0.5);
               vec3 gray = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
               finalColor = mix(gray, finalColor, 1.8);
            } else {
               finalColor = mix(finalColor * 0.5, mix(colorTwo, colorOne, vRing), 0.4);
               vec3 gray = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
               finalColor = mix(gray, finalColor, 1.6);
            }
            
            float edgeSoftness = fwidth(dist) * 2.0;
            float edge = smoothstep(0.5 - edgeSoftness, 0.5, dist);
            alpha *= (1.0 - edge);
            
            float maxAlpha = mix(0.48, 0.28, isDark);
            gl_FragColor = vec4(finalColor, min(alpha, maxAlpha));
          }
        `,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
      });

      const ringPoints = new THREE.Points(ringGeo, ringRenderMat);
      scene.add(ringPoints);

      ringSystem = {
        rtPos1, rtPos2, rtVel1, rtVel2,
        matSimPos, matSimVel,
        computeScene, computeCamera, computeMesh,
        renderMat: ringRenderMat,
        current: 0
      };
    };

    // Load Image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const size = 200;
      canvas.width = size;
      canvas.height = size;
      
      const imgAspect = img.width / img.height;
      let drawWidth = size, drawHeight = size, offsetX = 0, offsetY = 0;
      if (imgAspect > 1) { drawWidth = size * imgAspect; offsetX = (size - drawWidth) / 2; }
      else if (imgAspect < 1) { drawHeight = size / imgAspect; offsetY = (size - drawHeight) / 2; }
      
      ctx.save();
      ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI*2); ctx.closePath(); ctx.clip();
      ctx.translate(0, size); ctx.scale(1, -1);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      const imageData = ctx.getImageData(0, 0, size, size);
      setupFaceParticles(imageData);
      createRingSystem();
      setIsLoading(false);
      onLoad?.();
    };
    img.src = imageUrl;

    // Animation
    const clock = new THREE.Clock();
    let formationProgress = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (stats) stats.begin();

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);
      
      if (formationProgress < 1) formationProgress += formationSpeed;

      // Mouse
      const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Update Face
      if (faceMaterial) {
        faceMaterial.uniforms.time.value = elapsed;
        faceMaterial.uniforms.formationProgress.value = formationProgress;
        faceMaterial.uniforms.mousePosition.value = mouseWorldPos;
      }

      // Update Ring (GPGPU)
      if (ringSystem) {
         const curPos = ringSystem.current === 0 ? ringSystem.rtPos1 : ringSystem.rtPos2;
         const nextPos = ringSystem.current === 0 ? ringSystem.rtPos2 : ringSystem.rtPos1;
         const curVel = ringSystem.current === 0 ? ringSystem.rtVel1 : ringSystem.rtVel2;
         const nextVel = ringSystem.current === 0 ? ringSystem.rtVel2 : ringSystem.rtVel1;
         
         // Pos
         ringSystem.matSimPos.uniforms.texturePosition.value = curPos.texture;
         ringSystem.matSimPos.uniforms.textureVelocity.value = curVel.texture;
         ringSystem.matSimPos.uniforms.time.value = elapsed;
         ringSystem.matSimPos.uniforms.delta.value = delta;
         
         const mouseNDC = new THREE.Vector2(
            (mouseRef.current.targetX + 1) / 2,
            (mouseRef.current.targetY + 1) / 2
         );
         ringSystem.matSimPos.uniforms.mousePosition.value = mouseNDC;

         ringSystem.computeMesh.material = ringSystem.matSimPos;
         renderer.setRenderTarget(nextPos);
         renderer.render(ringSystem.computeScene, ringSystem.computeCamera);
         
         // Vel (Pass through)
         ringSystem.matSimVel.uniforms.textureVelocity.value = curVel.texture;
         ringSystem.computeMesh.material = ringSystem.matSimVel;
         renderer.setRenderTarget(nextVel);
         renderer.render(ringSystem.computeScene, ringSystem.computeCamera);
         
         renderer.setRenderTarget(null);
         ringSystem.renderMat.uniforms.texturePosition.value = nextPos.texture;
         ringSystem.renderMat.uniforms.textureVelocity.value = nextVel.texture;
         ringSystem.renderMat.uniforms.time.value = elapsed;
         
         ringSystem.current = 1 - ringSystem.current;
      }

      renderer.render(scene, camera);
      
      if (!isMobile) {
         mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
         mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      }
      
      if (stats) stats.end();
    };
    animate();

    const handleResize = () => {
       if (!container) return;
       const size = Math.max(container.clientWidth || 600, container.clientHeight || 600);
       renderer.setSize(size, size);
       if (faceMaterial) faceMaterial.uniforms.pixelRatio.value = renderer.getPixelRatio();
       if (ringSystem) ringSystem.renderMat.uniforms.pixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener("resize", handleResize);
    
    const onMouseMove = (e: MouseEvent) => {
       const rect = container.getBoundingClientRect();
       mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
       mouseRef.current.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    if (!isMobile) container.addEventListener("mousemove", onMouseMove);

    return () => {
       cancelAnimationFrame(rafRef.current);
       window.removeEventListener("resize", handleResize);
       if (!isMobile) container.removeEventListener("mousemove", onMouseMove);
       if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
       scene.clear();
       renderer.dispose();
    };
  }, [imageUrl, particleCount, particleSize, isMobile, theme, systemTheme]);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
           <div className="text-indigo-500 dark:text-purple-400 font-semibold animate-pulse">
            Loading particles...
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full cursor-pointer" style={{ opacity: isLoading ? 0 : 1, transition: "opacity 1s" }} />
    </div>
  );
};

export default ParticleAvatar;
