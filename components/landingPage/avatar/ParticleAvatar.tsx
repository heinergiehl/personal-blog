"use client";

import { useMemo, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Stats } from "@react-three/drei";
import { FluidSimulation, useFluid } from "r3f-fluid-sim";
import { useTheme } from "next-themes";

interface ParticleAvatarProps {
  imageUrl: string;
  particleCount?: number;
  particleSize?: number;
  formationSpeed?: number;
  mouseInfluence?: number;
  isMobile?: boolean;
  className?: string; // Add className support
  onLoad?: () => void;
  faceOffset?: [number, number, number]; // New prop for positioning the face
  faceScale?: number; // New prop for scaling the face
}

const BackgroundParticles = ({ count = 2000 }) => {
  const { velocityFBO } = useFluid();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();

  // Memoize color to prevent uniform churn
  const color = useMemo(() => 
    theme === 'light' ? new THREE.Vector3(0.2, 0.3, 0.5) : new THREE.Vector3(0.1, 0.5, 0.8),
  [theme]);

  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        // Spread massive for full screen background
        positions[i * 3] = (Math.random() - 0.5) * 80;     // Width: 80
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60; // Height: 60
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10; // Z: -20 to 0 (Deeper)
        
        randoms[i * 3] = Math.random();
        randoms[i * 3 + 1] = Math.random();
        randoms[i * 3 + 2] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    return geometry;
  }, [count]);

  const uniforms = useMemo(() => ({
      uTime: { value: 0 },
      uVelocity: { value: null },
      uColor: { value: color }
  }), []); // Init once, update in useFrame

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        materialRef.current.uniforms.uColor.value.copy(color); // Copy value, don't replace object
        if (velocityFBO && velocityFBO.read) {
             materialRef.current.uniforms.uVelocity.value = velocityFBO.read.texture;
        }
    }
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uVelocity;
    attribute vec3 aRandom;
    varying float vAlpha;
    
    void main() {
      vec3 pos = position;
      
      // Calculate correct Screen UV for fluid sampling
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vec4 clipPosition = projectionMatrix * mvPosition;
      vec2 screenUv = (clipPosition.xy / clipPosition.w) * 0.5 + 0.5;
      
      // Sample Fluid Velocity
      vec4 velocity = texture2D(uVelocity, screenUv);
      float velocityStrength = length(velocity.xy);
      
      // Very subtle drift (reduced from 1.0 to 0.1 for less interference)
      float time = uTime * 0.1;
      pos.x += sin(time + aRandom.y * 6.28) * 0.15;
      pos.y += cos(time + aRandom.z * 6.28) * 0.15;
      
      // Realistic fluid push - directly apply velocity with moderate scaling
      pos.xy += velocity.xy * 15.0;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      
      // Size: Scale with velocity for visual feedback
      gl_PointSize = (350.0 + velocityStrength * 80.0) * (1.0 / -mvPosition.z) * (0.5 + aRandom.x * 0.5);
      
      // Opacity: Respond to velocity
      vAlpha = 0.6 + (velocityStrength * 0.4);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    
    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        // Sharper center, soft edge
        float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vAlpha;
        gl_FragColor = vec4(uColor, alpha * 0.8); 
    }
  `;

  const blending = useMemo(() => theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending, [theme]);

  return (
    <points geometry={particles}>
       <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          blending={blending}
       />
    </points>
  )
}




const ParticleSystem = ({ 
  imageUrl, 
  onLoad,
  size,
  pointSize
}: { 
  imageUrl: string, 
  onLoad?: () => void,
  size: number,
  pointSize: number
}) => {
  const { velocityFBO } = useFluid(); 
  const texture = useTexture(imageUrl);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Notify parent that texture is loaded (simple approximation)
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(size * size * 3);
    const uvs = new Float32Array(size * size * 2);
    const randoms = new Float32Array(size * size * 3);
    
    // Calculate aspect ratio only if image is loaded
    const imageAspect = texture.image ? (texture.image.width / texture.image.height) : 1;
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const index = (i * size + j);
            
            // Grid formation centered at 0,0
            // Map 0..size to -5..5
            // Apply aspect ratio to X
            const x = (i / size - 0.5) * 10 * imageAspect;
            const y = (j / size - 0.5) * 10;
            
            positions[index * 3] = x;
            positions[index * 3 + 1] = y;
            positions[index * 3 + 2] = 0;
            
            // UVs for texture sampling - flip Y for correct orientation if needed
            uvs[index * 2] = i / size;
            uvs[index * 2 + 1] = j / size;
            
            // Random attributes for lifetime variation
            randoms[index * 3] = Math.random(); 
            randoms[index * 3 + 1] = Math.random();
            randoms[index * 3 + 2] = Math.random();
        }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    return geometry;
  }, [size, texture]);

  const uniforms = useMemo(() => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uVelocity: { value: null }, 
      uPointSize: { value: pointSize },
      uIsDarkMode: { value: isDarkMode ? 1.0 : 0.0 }
  }), [texture, pointSize, isDarkMode]);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        materialRef.current.uniforms.uIsDarkMode.value = isDarkMode ? 1.0 : 0.0;
        // Inject fluid velocity texture
        if (velocityFBO && velocityFBO.read) {
             materialRef.current.uniforms.uVelocity.value = velocityFBO.read.texture;
        }
    }
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uVelocity;
    uniform sampler2D uTexture;
    uniform float uPointSize;
    uniform float uIsDarkMode; // Needed for size logic
    attribute vec3 aRandom;
    varying vec2 vUv;
    varying float vAlpha;
    varying vec3 vColor;
    
    // Pseudo-random function for glitch
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
      vUv = uv; // Keep texture UV for sample color
      
      // Position
      vec3 pos = position;
      
      // GLITCH EFFECT (Vertex Displacement)
      // Occasional "twitch" or "tear"
      float glitchTrigger = sin(uTime * 4.0) + sin(uTime * 8.5); // Chaotically interfering waves
      if (glitchTrigger > 1.5) { // Only happen during peaks
          float tear = sin(pos.y * 20.0 + uTime * 20.0);
          // Shift X based on Y stripe
          if (tear > 0.9) {
             pos.x += 0.4 * sign(sin(uTime)); 
          }
      }
      
      // Sample color brightness (moved before position calc for early opt)
      vec4 texColor = texture2D(uTexture, uv);
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

      // Calculate correct Screen UV for fluid sampling based on world position
      // Optimization: Use modelViewMatrix directly instead of separated model/view matrices
      vec4 mvPositionOriginal = modelViewMatrix * vec4(pos, 1.0);
      vec4 clipPos = projectionMatrix * mvPositionOriginal;
      vec2 screenUv = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
      
      // Fluid Velocity (Sampled from Screen Space to match background sim)
      vec4 velocity = texture2D(uVelocity, screenUv);
      float velocityStrength = length(velocity.xy);
      
      // Lifetime Logic
      float lifetime = 5.0 + aRandom.x * 2.0;
      float offset = aRandom.y * 1000.0;
      float age = mod(uTime + offset, lifetime);
      float progress = age / lifetime;
      
      // Dynamic Opacity: Stable (1.0) when static, Cycling (fades) when moving
      float fadeCycle = smoothstep(0.0, 0.1, progress) * (1.0 - smoothstep(0.9, 1.0, progress));
      float movementThreshold = smoothstep(0.0, 0.05, velocityStrength);
      vAlpha = mix(1.0, fadeCycle, movementThreshold);
      
      // 1. Z-displacement based on brightness (Depth map effect)
      // Reduced displacement to prevent "spiky" look, kept enough for 3D feel
      pos.z += brightness * 1.5;
      
      // Idle Animation: Subtle "breathing" wave
      pos.z += sin(uTime * 0.5 + pos.x * 0.5) * 0.2;
      
      // 2. Fluid Interaction
      // Move along velocity vector
      float drift = 5.0;
      pos.xy += velocity.xy * drift * progress;
      
      // 3. Fluid "Lift" or "Twist" on Z axis for organic feel
      pos.z += velocityStrength * 5.0 * sin(progress * 10.0);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size Dynamic
      float baseSize = uPointSize * 25.0;
      
      float scale;
      if (uIsDarkMode > 0.5) {
         // Dark Mode: Brighter = Bigger (Glow)
         scale = 0.8 + (brightness * 0.5) + (smoothstep(0.0, 0.2, velocityStrength) * 1.5);
      } else {
         // Light Mode: Darker = Bigger (Ink Density), Brighter = Tiny/Invisible
         // Invert brightness influence. 
         // brightness 1.0 (skin/white) -> scale 0.8
         // brightness 0.1 (shadow/feature) -> scale 1.8
         scale = 1.8 - (brightness * 1.0); 
         
         // Add velocity pop
         scale += smoothstep(0.0, 0.2, velocityStrength) * 1.0;
      }
      
      gl_PointSize = (baseSize / -mvPosition.z) * scale;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uIsDarkMode;
    uniform float uTime;
    varying vec2 vUv;
    varying float vAlpha;
    varying vec3 vColor;
    
    // Pseudo-random for fragment shader
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
        // Circle shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        // Soft edge for a dreamy look
        float circleAlpha = 1.0 - smoothstep(0.3, 0.5, dist);
        
        if(circleAlpha < 0.01) discard;
        
        // --- GLITCH: CHROMATIC ABERRATION ---
        // Shift RGB channels slightly differently during glitches
        float glitchTrigger = sin(uTime * 8.0) * sin(uTime * .5); // similar beat to vertex
        vec2 rOffset = vec2(0.0);
        vec2 bOffset = vec2(0.0);
        
        if (glitchTrigger > 0.8) {
           float shift = 0.02 * sin(uTime * 20.0 + vUv.y * 10.0);
           rOffset = vec2(shift, 0.0);
           bOffset = vec2(-shift, 0.0);
        }
        
        vec4 texColor = texture2D(uTexture, vUv);
        vec4 texColorR = texture2D(uTexture, vUv + rOffset);
        vec4 texColorB = texture2D(uTexture, vUv + bOffset);
        
        // Reconstruct color with shifted channels
        vec3 color = vec3(texColorR.r, texColor.g, texColorB.b);
        
        // Edge Artifact Removal: Discard particles near texture edges
        if (vUv.x < 0.02 || vUv.x > 0.98 || vUv.y < 0.02 || vUv.y > 0.98) discard;

        // Detect and remove white/light gray background (improved logic)
        // 1. Calculate Perceived Brightness
        float brightness = dot(color, vec3(0.299, 0.587, 0.114));
        
        // 2. Calculate Saturation (max channel - min channel)
        float maxChan = max(color.r, max(color.g, color.b));
        float minChan = min(color.r, min(color.g, color.b));
        float saturation = maxChan - minChan;

        // 3. Thresholds
        // Relaxed thresholds to restore teeth and highlights
        // Only remove pixels that are SUPER bright and SUPER neutral
        float whiteThreshold = 0.82; // Was 0.8 - now only affects near-pure white
        float satThreshold = 0.09;   // Was 0.15 - lowers the bar for "color", preserving subtle tints
        
        if (brightness > whiteThreshold && saturation < satThreshold) {
            discard;
        }

        // --- HOLOGRAPHIC TINTING ---
        // To better fit the "space/cyber" theme, we desaturate the photo
        // and map it to the site's color palette (Cyan/Indigo) when in dark mode.
        // This solves the "awkward photo in a sci-fi UI" problem.
        if (uIsDarkMode > 0.5) {
            // 1. Desaturate
            float luminance = dot(color, vec3(0.299, 0.587, 0.114));
            
            // 2. Define Theme Palette (NOW UPDATED TO PURPLE/VIOLET THEME)
            // Matching the "Heiner" Gradient: Indigo -> Violet -> Cyan
            vec3 darkTone = vec3(0.15, 0.05, 0.35);   // Deep Indigo
            vec3 midTone = vec3(0.35, 0.25, 0.85);    // Violet
            vec3 lightTone = vec3(0.1, 0.9, 0.9);     // Cyan Pop
            
            // 3. Map Luminance to Palette
            vec3 holoColor = mix(darkTone, midTone, smoothstep(0.0, 0.5, luminance));
            holoColor = mix(holoColor, lightTone, smoothstep(0.5, 1.0, luminance));
            
            // 4. Blend: 85% Holo, 15% Original (to keep skin warmth slightly)
            color = mix(color, holoColor, 0.90);
            
            // 5. Scanline Effect (PROMINENT & GLITCHY)
            float scanSpeed = uTime * 1.0;
            float scanline = sin(vUv.y * 150.0 - scanSpeed); 
            scanline = smoothstep(0.4, 0.6, scanline); 
            
            // Darken the dark bands significantly
            color *= (0.8 + 0.5 * scanline); 
            
            // 6. Cyber Bloom
            color *= 1.3; 
            
            gl_FragColor = vec4(color, texColor.a * vAlpha * circleAlpha);
        } else {
             // Light Mode: "Detailed Stippling" Style
             // High contrast, feature-rich look using particle sizing + opacity
             
             // 1. Calculate luminance (Standard Rec. 601)
             float lum = dot(color, vec3(0.299, 0.587, 0.114));
             
             // 2. Color Palette: Dark Navy & Charcoal (Sharper than blue)
             vec3 charcoal = vec3(0.05, 0.05, 0.1);    // Almost black for deepest shadows
             vec3 navy     = vec3(0.1, 0.15, 0.4);     // Navy for mid-shadows
             vec3 steel    = vec3(0.4, 0.5, 0.7);      // Steel blue for mid-tones
             
             // 3. Tri-Tone Mapping for definition
             // Map 0.0-0.3 -> Charcoal
             // Map 0.3-0.6 -> Navy
             // Map 0.6-1.0 -> Steel/Transparent
             
             vec3 inkColor = mix(charcoal, navy, smoothstep(0.0, 0.4, lum));
             inkColor = mix(inkColor, steel, smoothstep(0.4, 0.8, lum));
             
             // 4. Visibility Logic (Inverted from typical glow)
             // We want DARK pixels to be OPAQUE.
             // We want BRIGHT pixels (skin) to be TRANSPARENT but present.
             
             // Shadows (0.0 - 0.5) -> High Alpha (0.9 - 0.7)
             // Highlights (0.5 - 1.0) -> Low Alpha (0.3 - 0.1)
             float opacityMap = 1.0 - smoothstep(0.2, 0.9, lum);
             
             // Clamp opacity so highlights don't vanish fully, but stay subtle
             opacityMap = clamp(opacityMap, 0.15, 1.0);
             
             // 5. Apply
             color = inkColor;

             // Output
             gl_FragColor = vec4(color, texColor.a * vAlpha * circleAlpha * opacityMap);
        }
    }
  `;

  return (
    <points geometry={particles}>
       <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
       />
    </points>
  );
}

const ParticleAvatar = ({
  imageUrl,
  className,
  isMobile = false,
  onLoad,
  particleCount = 65536, // Optimized: 256x256 grid for 120fps
  particleSize = 1.0,     // Smaller particles for higher density
  mouseInfluence = 100,
  faceOffset = [0, 0, 0],
  faceScale = 1.0
}: ParticleAvatarProps) => {

  const { theme } = useTheme();
  // Slightly adjust size in light mode, but don't double it (prevents blob look)
  const dynamicSize = theme === 'light' ? particleSize * 1.25 : particleSize;

  const gridSize = useMemo(() => Math.ceil(Math.sqrt(particleCount)), [particleCount]);

  // NON-BLOCKING LOADING:
  // We trigger onLoad almost immediately to let the background particles show up.
  // The face will "pop in" via Suspense whenever the texture is ready.
  useEffect(() => {
     // Small delay to ensure Canvas is mounted and context is ready
     const timer = setTimeout(() => {
         if (onLoad) onLoad();
     }, 100); 
     return () => clearTimeout(timer);
  }, [onLoad]);

  return (
    <div className={`w-full h-full min-h-[500px] relative ${className || ""}`}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 35 }}
        dpr={1}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        {process.env.NODE_ENV === "development" && <Stats />}
        
          {/* r3f-fluid-sim provider */}
          <FluidSimulation
            size={256}
            forceStrength={(mouseInfluence / 100) * 10}
            viscosity={0.01}
            advectionDecay={0.97}
          >
            <BackgroundParticles count={2000} />
            <Suspense fallback={null}>
              <group position={faceOffset as any} scale={faceScale}>
                <ParticleSystem
                  imageUrl={imageUrl}
                  onLoad={onLoad} // Still passed, but we might rely on global load
                  size={gridSize}
                  pointSize={dynamicSize}
                />
              </group>
            </Suspense>
          </FluidSimulation>
        
      </Canvas>
    </div>
  );
}

export default ParticleAvatar;
