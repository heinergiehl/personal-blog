"use client";

import { useMemo, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
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

const BackgroundParticles = ({ count = 4000 }) => {
  const { velocityFBO } = useFluid();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();

  // Memoize color to prevent uniform churn
  const color = useMemo(() => 
    theme === 'light' ? new THREE.Vector3(0.05, 0.15, 0.3) : new THREE.Vector3(0.0, 0.8, 1.0),
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
      float velocityStrength = length(velocity.xy)*10.;
      
      float time = uTime * 0.2; // Faster gentle movement
      
      // Natural floating movement
      pos.x += sin(time + aRandom.y * 6.28) * 1.0;
      pos.y += cos(time + aRandom.z * 6.28) * 1.0;
      
      // Fluid Push
      pos.xy += velocity.xy * 20.0 * velocityStrength; 
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      
      // Size: Much bigger
      // Base calculation: (BaseSize / Depth) * Random
      gl_PointSize = (150.0 + velocityStrength * 100.0) * (1.0 / -mvPosition.z) * (0.5 + aRandom.x * 0.5);
      
      // Opacity: Stronger base
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

  return (
    <points geometry={particles}>
       <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
       />
    </points>
  )
}


const FaceFluidSimulation = ({ children, faceOffset = [0,0,0], faceScale = 1, imageUrl, ...props }: any) => {
  const texture = useTexture(imageUrl);
  const pointer = useMemo(() => new THREE.Vector2(-100, -100), []); // Start off-screen
  
  useFrame((state) => {
     // Plane Z = faceOffset[2]
     const zPlane = (faceOffset && faceOffset[2]) || 0;
     const xOffset = (faceOffset && faceOffset[0]) || 0;
     const yOffset = (faceOffset && faceOffset[1]) || 0;
     
     // Update raycaster with global pointer
     state.raycaster.setFromCamera(state.pointer, state.camera);
     const ray = state.raycaster.ray;
     
     // Intersect plane Z
     const denom = ray.direction.z;
     if (Math.abs(denom) > 1e-6) {
        const t = (zPlane - ray.origin.z) / denom;
        if (t >= 0) {
            const hitX = ray.origin.x + t * ray.direction.x;
            const hitY = ray.origin.y + t * ray.direction.y;
            
            // Transform to local space
            const localX = hitX - xOffset;
            const localY = hitY - yOffset;
            
            // Normalize
            // Face size is 10 units * scale
            // Image Aspect affects width: 10 * aspect * scale
            // We want pointer -1..1 over the content
            const aspect = texture.image ? (texture.image.width / texture.image.height) : 1;
            
            // Map [-5*scale*aspect, 5*scale*aspect] to [-1, 1] for X
            // Map [-5*scale, 5*scale] to [-1, 1] for Y
            
            pointer.x = localX / (5 * faceScale * aspect);
            pointer.y = localY / (5 * faceScale);
        } else {
            pointer.set(-100, -100);
        }
     } else {
        pointer.set(-100, -100);
     }
  });

  return (
    // <FluidSimulation pointer={pointer} {...props}>
        <group position={faceOffset} scale={faceScale}>
           {children}
        </group>
    // </FluidSimulation>
  );
};

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
      uPointSize: { value: pointSize }
  }), [texture, pointSize]);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
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
    attribute vec3 aRandom;
    varying vec2 vUv;
    varying float vAlpha;
    varying vec3 vColor;
    
    void main() {
      vUv = uv; // Keep texture UV for sample color
      
      // Sample color
      vec4 texColor = texture2D(uTexture, uv);
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      
      // Position
      vec3 pos = position;

      // Calculate correct Screen UV for fluid sampling based on world position
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vec4 viewPos = viewMatrix * worldPos;
      vec4 clipPos = projectionMatrix * viewPos;
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
      // Reduced to 0.05 to keep the face mostly flat but add slight volume
      pos.z += brightness * 1.05;
      
      // 2. Fluid Interaction
      // Move along velocity vector
      float drift = 5.0;
      pos.xy += velocity.xy * drift * progress;
      
      // 3. Fluid "Lift" or "Twist" on Z axis for organic feel
      pos.z += velocityStrength * 2.0 * sin(progress * 10.0);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size Dynamic
      float baseSize = uPointSize * 10.0; // Reduced from 200.0 for cleaner look
      // Scale up by brightness (fake glow) and velocity (limited)
      float scale = 0.8 + (brightness * 0.4) + (smoothstep(0.0, 0.2, velocityStrength) * 1.5);
      
      gl_PointSize = (baseSize / -mvPosition.z) * scale;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float vAlpha;
    
    void main() {
        // Circle shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        // Soft edge
        float circleAlpha = 1.0 - smoothstep(0.4, 0.9, dist);
        
        if(circleAlpha < 0.01) discard;
        
        // Color
        vec4 texColor = texture2D(uTexture, vUv);
        
        // Enhance saturation slightly for better look
        vec3 color = texColor.rgb;
        
        // Output
        gl_FragColor = vec4(color, texColor.a * vAlpha * circleAlpha);
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
  particleCount = 131072, // Increased resolution (roughly 362x362)
  particleSize = 1.0,     // Smaller particles for higher density
  mouseInfluence = 100,
  faceOffset = [0, 0, 0],
  faceScale = 1.0
}: ParticleAvatarProps) => {

  const { theme } = useTheme();
  // Double size in light mode for visibility
  const dynamicSize = theme === 'light' ? particleSize * 2.0 : particleSize;

  const gridSize = useMemo(() => Math.ceil(Math.sqrt(particleCount)), [particleCount]);

  // Failsafe: if texture loading fails or takes too long, 
  // ensure the loading screen is removed after a timeout.
  useEffect(() => {
     const timer = setTimeout(() => {
         if (onLoad) onLoad();
     }, 3000); 
     return () => clearTimeout(timer);
  }, [onLoad]);

  return (
    <div className={`w-full h-full min-h-[500px] relative ${className || ""}`}>
      <Canvas 
        camera={{ position: [0, 0, 18], fov: 35 }} 
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
         <Suspense fallback={null}>
            {/* r3f-fluid-sim provider */}
             <FluidSimulation 
                size={256}          
                forceStrength={(mouseInfluence / 100) * 10}   
                viscosity={0.01}
                advectionDecay={0.97}
             >
           
            <group position={faceOffset as any} scale={faceScale}>
                   <BackgroundParticles count={4000} />
                  <ParticleSystem 
                      imageUrl={imageUrl} 
                      onLoad={onLoad}
                      size={gridSize}
                      pointSize={dynamicSize} 
                  />
                </group>
             </FluidSimulation>
         </Suspense>
      </Canvas>
    </div>
  )
}

export default ParticleAvatar;
