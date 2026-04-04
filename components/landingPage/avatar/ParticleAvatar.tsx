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
  className?: string;
  onLoad?: () => void;
  faceOffset?: [number, number, number];
  faceScale?: number;
}

// ─── Desktop Background Particles (with fluid) ───────────────────────────────
const BackgroundParticlesDesktop = ({ count = 2000 }) => {
  const { velocityFBO } = useFluid();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();

  const color = useMemo(
    () =>
      theme === "light"
        ? new THREE.Vector3(0.2, 0.3, 0.5)
        : new THREE.Vector3(0.1, 0.5, 0.8),
    [theme]
  );

  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    return geometry;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: null },
      uColor: { value: color },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uColor.value.copy(color);
      if (velocityFBO && velocityFBO.read) {
        materialRef.current.uniforms.uVelocity.value =
          velocityFBO.read.texture;
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
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vec4 clipPosition = projectionMatrix * mvPosition;
      vec2 screenUv = (clipPosition.xy / clipPosition.w) * 0.5 + 0.5;
      vec4 velocity = texture2D(uVelocity, screenUv);
      float velocityStrength = length(velocity.xy);
      float time = uTime * 0.1;
      pos.x += sin(time + aRandom.y * 6.28) * 0.15;
      pos.y += cos(time + aRandom.z * 6.28) * 0.15;
      pos.xy += velocity.xy * 15.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (350.0 + velocityStrength * 80.0) * (1.0 / -mvPosition.z) * (0.5 + aRandom.x * 0.5);
      vAlpha = 0.6 + (velocityStrength * 0.4);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vAlpha;
      gl_FragColor = vec4(uColor, alpha * 0.8);
    }
  `;

  const blending = useMemo(
    () => (theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending),
    [theme]
  );

  return (
    <points geometry={particles}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={blending}
      />
    </points>
  );
};

// ─── Mobile Background Particles (no fluid, ultra-lightweight) ───────────────
const BackgroundParticlesMobile = ({ count = 400 }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();

  const color = useMemo(
    () =>
      theme === "light"
        ? new THREE.Vector3(0.2, 0.3, 0.5)
        : new THREE.Vector3(0.1, 0.5, 0.8),
    [theme]
  );

  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    return geometry;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: color },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uColor.value.copy(color);
    }
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    attribute vec3 aRandom;
    varying float vAlpha;
    void main() {
      vec3 pos = position;
      float time = uTime * 0.08;
      pos.x += sin(time + aRandom.y * 6.28) * 0.2;
      pos.y += cos(time + aRandom.z * 6.28) * 0.2;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = 300.0 * (1.0 / -mvPosition.z) * (0.4 + aRandom.x * 0.6);
      vAlpha = 0.4 + aRandom.x * 0.3;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = (1.0 - smoothstep(0.1, 0.5, dist)) * vAlpha;
      gl_FragColor = vec4(uColor, alpha * 0.6);
    }
  `;

  const blending = useMemo(
    () => (theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending),
    [theme]
  );

  return (
    <points geometry={particles}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={blending}
      />
    </points>
  );
};

// ─── Desktop Face Particle System (with fluid + glitch) ─────────────────────
const ParticleSystemDesktop = ({
  imageUrl,
  onLoad,
  size,
  pointSize,
}: {
  imageUrl: string;
  onLoad?: () => void;
  size: number;
  pointSize: number;
}) => {
  const { velocityFBO } = useFluid();
  const texture = useTexture(imageUrl);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(size * size * 3);
    const uvs = new Float32Array(size * size * 2);
    const randoms = new Float32Array(size * size * 3);
    const imageAspect = texture.image
      ? texture.image.width / texture.image.height
      : 1;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        const x = (i / size - 0.5) * 10 * imageAspect;
        const y = (j / size - 0.5) * 10;
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = 0;
        uvs[index * 2] = i / size;
        uvs[index * 2 + 1] = j / size;
        randoms[index * 3] = Math.random();
        randoms[index * 3 + 1] = Math.random();
        randoms[index * 3 + 2] = Math.random();
      }
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    return geometry;
  }, [size, texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uVelocity: { value: null },
      uPointSize: { value: pointSize },
      uIsDarkMode: { value: isDarkMode ? 1.0 : 0.0 },
    }),
    [texture, pointSize, isDarkMode]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uIsDarkMode.value = isDarkMode ? 1.0 : 0.0;
      if (velocityFBO && velocityFBO.read) {
        materialRef.current.uniforms.uVelocity.value =
          velocityFBO.read.texture;
      }
    }
  });

  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uVelocity;
    uniform sampler2D uTexture;
    uniform float uPointSize;
    uniform float uIsDarkMode;
    attribute vec3 aRandom;
    varying vec2 vUv;
    varying float vAlpha;
    varying vec3 vColor;
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    void main() {
      vUv = uv;
      vec3 pos = position;
      // Glitch effect
      float glitchTrigger = sin(uTime * 4.0) + sin(uTime * 8.5);
      if (glitchTrigger > 1.5) {
        float tear = sin(pos.y * 20.0 + uTime * 20.0);
        if (tear > 0.9) {
          pos.x += 0.4 * sign(sin(uTime));
        }
      }
      vec4 texColor = texture2D(uTexture, uv);
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      vec4 mvPositionOriginal = modelViewMatrix * vec4(pos, 1.0);
      vec4 clipPos = projectionMatrix * mvPositionOriginal;
      vec2 screenUv = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
      vec4 velocity = texture2D(uVelocity, screenUv);
      float velocityStrength = length(velocity.xy);
      float lifetime = 5.0 + aRandom.x * 2.0;
      float offset = aRandom.y * 1000.0;
      float age = mod(uTime + offset, lifetime);
      float progress = age / lifetime;
      float fadeCycle = smoothstep(0.0, 0.1, progress) * (1.0 - smoothstep(0.9, 1.0, progress));
      float movementThreshold = smoothstep(0.0, 0.05, velocityStrength);
      vAlpha = mix(1.0, fadeCycle, movementThreshold);
      pos.z += brightness * 1.5;
      pos.z += sin(uTime * 0.5 + pos.x * 0.5) * 0.2;
      float drift = 5.0;
      pos.xy += velocity.xy * drift * progress;
      pos.z += velocityStrength * 5.0 * sin(progress * 10.0);
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      float baseSize = uPointSize * 25.0;
      float scale;
      if (uIsDarkMode > 0.5) {
        scale = 0.8 + (brightness * 0.5) + (smoothstep(0.0, 0.2, velocityStrength) * 1.5);
      } else {
        scale = 1.8 - (brightness * 1.0);
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
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      float circleAlpha = 1.0 - smoothstep(0.3, 0.5, dist);
      if(circleAlpha < 0.01) discard;
      float glitchTrigger = sin(uTime * 8.0) * sin(uTime * .5);
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
      vec3 color = vec3(texColorR.r, texColor.g, texColorB.b);
      if (vUv.x < 0.02 || vUv.x > 0.98 || vUv.y < 0.02 || vUv.y > 0.98) discard;
      float brightness = dot(color, vec3(0.299, 0.587, 0.114));
      float maxChan = max(color.r, max(color.g, color.b));
      float minChan = min(color.r, min(color.g, color.b));
      float saturation = maxChan - minChan;
      float whiteThreshold = 0.82;
      float satThreshold = 0.09;
      if (brightness > whiteThreshold && saturation < satThreshold) discard;
      if (uIsDarkMode > 0.5) {
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        vec3 darkTone = vec3(0.15, 0.05, 0.35);
        vec3 midTone = vec3(0.35, 0.25, 0.85);
        vec3 lightTone = vec3(0.1, 0.9, 0.9);
        vec3 holoColor = mix(darkTone, midTone, smoothstep(0.0, 0.5, luminance));
        holoColor = mix(holoColor, lightTone, smoothstep(0.5, 1.0, luminance));
        color = mix(color, holoColor, 0.90);
        float scanSpeed = uTime * 1.0;
        float scanline = sin(vUv.y * 150.0 - scanSpeed);
        scanline = smoothstep(0.4, 0.6, scanline);
        color *= (0.8 + 0.5 * scanline);
        color *= 1.3;
        gl_FragColor = vec4(color, texColor.a * vAlpha * circleAlpha);
      } else {
        float lum = dot(color, vec3(0.299, 0.587, 0.114));
        vec3 charcoal = vec3(0.05, 0.05, 0.1);
        vec3 navy = vec3(0.1, 0.15, 0.4);
        vec3 steel = vec3(0.4, 0.5, 0.7);
        vec3 inkColor = mix(charcoal, navy, smoothstep(0.0, 0.4, lum));
        inkColor = mix(inkColor, steel, smoothstep(0.4, 0.8, lum));
        float opacityMap = 1.0 - smoothstep(0.2, 0.9, lum);
        opacityMap = clamp(opacityMap, 0.15, 1.0);
        color = inkColor;
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
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

// ─── Mobile Face Particle System (NO fluid, NO glitch, ultra-lean) ──────────
const ParticleSystemMobile = ({
  imageUrl,
  onLoad,
  size,
  pointSize,
}: {
  imageUrl: string;
  onLoad?: () => void;
  size: number;
  pointSize: number;
}) => {
  const texture = useTexture(imageUrl);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(size * size * 3);
    const uvs = new Float32Array(size * size * 2);
    const imageAspect = texture.image
      ? texture.image.width / texture.image.height
      : 1;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        positions[index * 3] = (i / size - 0.5) * 10 * imageAspect;
        positions[index * 3 + 1] = (j / size - 0.5) * 10;
        positions[index * 3 + 2] = 0;
        uvs[index * 2] = i / size;
        uvs[index * 2 + 1] = j / size;
      }
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    return geometry;
  }, [size, texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uPointSize: { value: pointSize },
      uIsDarkMode: { value: 0.0 },
    }),
    [texture, pointSize]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uIsDarkMode.value = isDarkMode ? 1.0 : 0.0;
    }
  });

  // Mobile vertex shader: gentle living motion without distortion
  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uPointSize;
    uniform float uIsDarkMode;
    varying vec2 vUv;
    varying float vAlpha;
    void main() {
      vUv = uv;
      vec3 pos = position;
      vec4 texColor = texture2D(uTexture, uv);
      float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

      // Depth from brightness
      pos.z += brightness * 1.0;

      // Slow breathing – whole face gently rises and falls
      pos.z += sin(uTime * 0.35) * 0.15;

      // Travelling wave across the face (sells "these are particles")
      float wave = sin(uTime * 0.6 + pos.x * 0.8 + pos.y * 0.5) * 0.08;
      pos.z += wave;

      // Very subtle lateral micro-drift per particle
      pos.x += sin(uTime * 0.25 + pos.y * 1.2) * 0.03;
      pos.y += cos(uTime * 0.3  + pos.x * 1.0) * 0.03;

      vAlpha = 1.0;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      float baseSize = uPointSize * 25.0;
      float scale;
      if (uIsDarkMode > 0.5) {
        scale = 0.8 + brightness * 0.5;
      } else {
        scale = 1.8 - brightness * 1.0;
      }
      // Gentle size pulse so particles feel alive
      scale *= 1.0 + sin(uTime * 0.5 + pos.x * 0.4 + pos.y * 0.4) * 0.04;
      gl_PointSize = (baseSize / -mvPosition.z) * scale;
    }
  `;

  // Stripped-down fragment: no chromatic aberration, no glitch
  const fragmentShader = /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uIsDarkMode;
    uniform float uTime;
    varying vec2 vUv;
    varying float vAlpha;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      float circleAlpha = 1.0 - smoothstep(0.3, 0.5, dist);
      if (circleAlpha < 0.01) discard;
      vec4 texColor = texture2D(uTexture, vUv);
      vec3 color = texColor.rgb;
      if (vUv.x < 0.02 || vUv.x > 0.98 || vUv.y < 0.02 || vUv.y > 0.98) discard;
      float brightness = dot(color, vec3(0.299, 0.587, 0.114));
      float maxChan = max(color.r, max(color.g, color.b));
      float minChan = min(color.r, min(color.g, color.b));
      float saturation = maxChan - minChan;
      if (brightness > 0.82 && saturation < 0.09) discard;
      if (uIsDarkMode > 0.5) {
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        vec3 darkTone = vec3(0.15, 0.05, 0.35);
        vec3 midTone = vec3(0.35, 0.25, 0.85);
        vec3 lightTone = vec3(0.1, 0.9, 0.9);
        vec3 holoColor = mix(darkTone, midTone, smoothstep(0.0, 0.5, luminance));
        holoColor = mix(holoColor, lightTone, smoothstep(0.5, 1.0, luminance));
        color = mix(color, holoColor, 0.90);
        // Gentle shimmer sweep
        float shimmer = sin(vUv.y * 12.0 - uTime * 0.8) * 0.5 + 0.5;
        color *= 1.15 + shimmer * 0.1;
        gl_FragColor = vec4(color, texColor.a * vAlpha * circleAlpha);
      } else {
        float lum = dot(color, vec3(0.299, 0.587, 0.114));
        vec3 charcoal = vec3(0.05, 0.05, 0.1);
        vec3 navy = vec3(0.1, 0.15, 0.4);
        vec3 steel = vec3(0.4, 0.5, 0.7);
        vec3 inkColor = mix(charcoal, navy, smoothstep(0.0, 0.4, lum));
        inkColor = mix(inkColor, steel, smoothstep(0.4, 0.8, lum));
        float opacityMap = 1.0 - smoothstep(0.2, 0.9, lum);
        opacityMap = clamp(opacityMap, 0.15, 1.0);
        gl_FragColor = vec4(inkColor, texColor.a * vAlpha * circleAlpha * opacityMap);
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
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

// ─── Desktop Scene (with FluidSimulation wrapper) ───────────────────────────
const DesktopScene = ({
  imageUrl,
  onLoad,
  gridSize,
  pointSize,
  mouseInfluence,
  faceOffset,
  faceScale,
}: {
  imageUrl: string;
  onLoad?: () => void;
  gridSize: number;
  pointSize: number;
  mouseInfluence: number;
  faceOffset: [number, number, number];
  faceScale: number;
}) => {
  return (
    <FluidSimulation
      size={256}
      forceStrength={(mouseInfluence / 100) * 10}
      viscosity={0.01}
      advectionDecay={0.97}
    >
      <BackgroundParticlesDesktop count={2000} />
      <Suspense fallback={null}>
        <group position={faceOffset as any} scale={faceScale}>
          <ParticleSystemDesktop
            imageUrl={imageUrl}
            onLoad={onLoad}
            size={gridSize}
            pointSize={pointSize}
          />
        </group>
      </Suspense>
    </FluidSimulation>
  );
};

// ─── Mobile Scene (NO FluidSimulation — just raw particles) ─────────────────
const MobileScene = ({
  imageUrl,
  onLoad,
  gridSize,
  pointSize,
  faceOffset,
  faceScale,
}: {
  imageUrl: string;
  onLoad?: () => void;
  gridSize: number;
  pointSize: number;
  faceOffset: [number, number, number];
  faceScale: number;
}) => {
  return (
    <>
      <BackgroundParticlesMobile count={400} />
      <Suspense fallback={null}>
        <group position={faceOffset as any} scale={faceScale}>
          <ParticleSystemMobile
            imageUrl={imageUrl}
            onLoad={onLoad}
            size={gridSize}
            pointSize={pointSize}
          />
        </group>
      </Suspense>
    </>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const ParticleAvatar = ({
  imageUrl,
  className,
  isMobile = false,
  onLoad,
  particleCount = 65536,
  particleSize = 1.0,
  mouseInfluence = 100,
  faceOffset = [0, 0, 0],
  faceScale = 1.0,
}: ParticleAvatarProps) => {
  const { theme } = useTheme();
  const dynamicSize =
    theme === "light" ? particleSize * 1.25 : particleSize;

  const gridSize = useMemo(
    () => Math.ceil(Math.sqrt(particleCount)),
    [particleCount]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onLoad) onLoad();
    }, 100);
    return () => clearTimeout(timer);
  }, [onLoad]);

  return (
    <div
      className={`w-full h-full min-h-[500px] relative ${className || ""}`}
    >
      <Canvas
        camera={{ position: [0, 0, 18], fov: 35 }}
        dpr={isMobile ? [1, 1] : 1}
        frameloop={isMobile ? "demand" : "always"}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: isMobile ? "low-power" : "high-performance",
          ...(isMobile ? { precision: "mediump" } : {}),
        }}
      >
        {process.env.NODE_ENV === "development" && !isMobile && <Stats />}

        {isMobile ? (
          <>
            <MobileFrameThrottle />
            <MobileScene
              imageUrl={imageUrl}
              onLoad={onLoad}
              gridSize={gridSize}
              pointSize={dynamicSize}
              faceOffset={faceOffset as [number, number, number]}
              faceScale={faceScale}
            />
          </>
        ) : (
          <DesktopScene
            imageUrl={imageUrl}
            onLoad={onLoad}
            gridSize={gridSize}
            pointSize={dynamicSize}
            mouseInfluence={mouseInfluence}
            faceOffset={faceOffset as [number, number, number]}
            faceScale={faceScale}
          />
        )}
      </Canvas>
    </div>
  );
};

// Throttle mobile rendering to ~30fps to save battery
function MobileFrameThrottle() {
  const { invalidate, gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    let visible = true;

    // Stop rendering entirely when canvas is scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Throttle to ~30fps via simple interval (lighter than rAF loop)
    const id = setInterval(() => {
      if (visible) invalidate();
    }, 33);

    return () => {
      clearInterval(id);
      observer.disconnect();
    };
  }, [invalidate, gl]);
  return null;
}

export default ParticleAvatar;
