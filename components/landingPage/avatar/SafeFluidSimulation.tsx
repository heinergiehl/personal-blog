"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { PropsWithChildren } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
}

interface FluidContextType {
  velocityFBO: DoubleFBO | null;
  fboSize: number;
}

export interface SafeFluidSimulationProps extends PropsWithChildren {
  size?: number;
  viscosity?: number;
  viscousIterations?: number;
  pressureIterations?: number;
  dt?: number;
  advectionDecay?: number;
  forceRadius?: number;
  forceStrength?: number;
  forceClamp?: number;
  bfecc?: boolean;
  interaction?: boolean;
  pointer?: THREE.Vector2;
}

const FluidContext = createContext<FluidContextType>({
  velocityFBO: null,
  fboSize: 128,
});

export const useFluid = () => useContext(FluidContext);

const fullscreenVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const clearFragmentShader = /* glsl */ `
  void main() {
    gl_FragColor = vec4(0.0);
  }
`;

const splatFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTarget;
  uniform vec2 uPoint;
  uniform vec2 uForce;
  uniform float uRadius;
  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uTarget, vUv).xy;
    vec2 delta = vUv - uPoint;
    float impulse = exp(-dot(delta, delta) / max(uRadius, 0.00001));
    float swirl = 0.2 * length(uForce);

    velocity += uForce * impulse;
    velocity += vec2(-delta.y, delta.x) * swirl * impulse;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const advectionFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform float uDt;
  uniform float uDissipation;
  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 coord = clamp(vUv - velocity * uDt, vec2(0.001), vec2(0.999));
    gl_FragColor = texture2D(uSource, coord) * uDissipation;
  }
`;

const diffusionFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexel;
  uniform float uAlpha;
  varying vec2 vUv;

  void main() {
    vec2 left = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).xy;
    vec2 right = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).xy;
    vec2 bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).xy;
    vec2 top = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).xy;
    vec2 source = texture2D(uSource, vUv).xy;
    vec2 velocity = (source + uAlpha * (left + right + bottom + top)) / (1.0 + 4.0 * uAlpha);

    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const curlFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 uTexel;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
    float right = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
    float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
    float top = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
    float curl = 0.5 * (right - left - top + bottom);

    gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
  }
`;

const vorticityFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 uTexel;
  uniform float uDt;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    float left = abs(texture2D(uCurl, vUv - vec2(uTexel.x, 0.0)).x);
    float right = abs(texture2D(uCurl, vUv + vec2(uTexel.x, 0.0)).x);
    float bottom = abs(texture2D(uCurl, vUv - vec2(0.0, uTexel.y)).x);
    float top = abs(texture2D(uCurl, vUv + vec2(0.0, uTexel.y)).x);
    float center = texture2D(uCurl, vUv).x;
    vec2 gradient = vec2(right - left, top - bottom);
    float lengthSq = max(dot(gradient, gradient), 0.00001);

    gradient *= inversesqrt(lengthSq);
    velocity += vec2(gradient.y, -gradient.x) * center * uStrength * uDt;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const divergenceFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 uTexel;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
    float right = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
    float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
    float top = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
    float divergence = 0.5 * (right - left + top - bottom);

    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
  }
`;

const pressureFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexel;
  varying vec2 vUv;

  void main() {
    float left = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
    float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
    float top = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (left + right + bottom + top - divergence) * 0.25;

    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uPressure;
  uniform vec2 uTexel;
  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    float left = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
    float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
    float top = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;

    velocity -= vec2(right - left, top - bottom) * 0.5;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const copyFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uSource;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(uSource, vUv);
  }
`;

function createFullscreenTriangle() {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
      3,
    ),
  );
  geometry.setAttribute(
    "uv",
    new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2),
  );

  return geometry;
}

function createRenderTarget(size: number) {
  const target = new THREE.WebGLRenderTarget(size, size, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  });

  target.texture.colorSpace = THREE.NoColorSpace;
  return target;
}

function createDoubleFBO(size: number): DoubleFBO {
  return {
    read: createRenderTarget(size),
    write: createRenderTarget(size),
    swap() {
      const nextRead = this.write;
      this.write = this.read;
      this.read = nextRead;
    },
  };
}

function createMaterial(
  fragmentShader: string,
  uniforms: THREE.ShaderMaterialParameters["uniforms"] = {},
) {
  return new THREE.ShaderMaterial({
    vertexShader: fullscreenVertexShader,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
    toneMapped: false,
  });
}

function materialReadsTarget(
  material: THREE.ShaderMaterial,
  target: THREE.WebGLRenderTarget,
) {
  return Object.values(material.uniforms).some(
    (uniform) => uniform.value === target.texture,
  );
}

function unbindTextureUnits(
  renderer: THREE.WebGLRenderer,
  textureUnitCount: number,
) {
  const context = renderer.getContext();

  for (let i = 0; i < textureUnitCount; i++) {
    context.activeTexture(context.TEXTURE0 + i);
    context.bindTexture(context.TEXTURE_2D, null);
    context.bindTexture(context.TEXTURE_CUBE_MAP, null);
  }

  context.activeTexture(context.TEXTURE0);
  renderer.resetState();
}

function disposeFBO(fbo: DoubleFBO) {
  fbo.read.dispose();
  fbo.write.dispose();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SafeFluidSimulation({
  size = 128,
  viscosity = 0.01,
  viscousIterations = 4,
  pressureIterations = 10,
  dt = 0.016,
  advectionDecay = 0.985,
  forceRadius = 0.012,
  forceStrength = 1,
  forceClamp = 3,
  interaction = true,
  pointer,
  children,
}: SafeFluidSimulationProps) {
  const { gl } = useThree();
  const velocityFBO = useMemo(() => createDoubleFBO(size), [size]);
  const pressureFBO = useMemo(() => createDoubleFBO(size), [size]);
  const displayFBO = useMemo(() => createDoubleFBO(size), [size]);
  const divergenceFBO = useMemo(() => createRenderTarget(size), [size]);
  const curlFBO = useMemo(() => createRenderTarget(size), [size]);
  const simulationScene = useMemo(() => new THREE.Scene(), []);
  const simulationCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    [],
  );
  const previousPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const currentPointer = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
  const pointerForce = useMemo(() => new THREE.Vector2(), []);
  const texel = useMemo(() => new THREE.Vector2(1 / size, 1 / size), [size]);
  const textureUnitCount = useMemo(() => {
    const context = gl.getContext();
    return context.getParameter(context.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  }, [gl]);

  const materials = useMemo(
    () => ({
      clear: createMaterial(clearFragmentShader),
      splat: createMaterial(splatFragmentShader, {
        uTarget: { value: null },
        uPoint: { value: new THREE.Vector2(0.5, 0.5) },
        uForce: { value: new THREE.Vector2() },
        uRadius: { value: forceRadius },
      }),
      advection: createMaterial(advectionFragmentShader, {
        uVelocity: { value: null },
        uSource: { value: null },
        uDt: { value: dt },
        uDissipation: { value: advectionDecay },
      }),
      diffusion: createMaterial(diffusionFragmentShader, {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexel: { value: texel },
        uAlpha: { value: 0 },
      }),
      curl: createMaterial(curlFragmentShader, {
        uVelocity: { value: null },
        uTexel: { value: texel },
      }),
      vorticity: createMaterial(vorticityFragmentShader, {
        uVelocity: { value: null },
        uCurl: { value: null },
        uTexel: { value: texel },
        uDt: { value: dt },
        uStrength: { value: 18 },
      }),
      divergence: createMaterial(divergenceFragmentShader, {
        uVelocity: { value: null },
        uTexel: { value: texel },
      }),
      pressure: createMaterial(pressureFragmentShader, {
        uPressure: { value: null },
        uDivergence: { value: divergenceFBO.texture },
        uTexel: { value: texel },
      }),
      gradientSubtract: createMaterial(gradientSubtractFragmentShader, {
        uVelocity: { value: null },
        uPressure: { value: null },
        uTexel: { value: texel },
      }),
      copy: createMaterial(copyFragmentShader, {
        uSource: { value: null },
      }),
    }),
    [advectionDecay, divergenceFBO.texture, dt, forceRadius, texel],
  );

  const quad = useMemo(() => {
    const mesh = new THREE.Mesh(createFullscreenTriangle(), materials.clear);
    mesh.frustumCulled = false;
    simulationScene.add(mesh);
    return mesh;
  }, [materials.clear, simulationScene]);

  const renderPass = (
    material: THREE.ShaderMaterial,
    target: THREE.WebGLRenderTarget,
  ) => {
    if (materialReadsTarget(material, target)) return false;

    unbindTextureUnits(gl, textureUnitCount);
    quad.material = material;
    gl.setRenderTarget(target);
    gl.render(simulationScene, simulationCamera);
    gl.setRenderTarget(null);
    gl.resetState();
    return true;
  };

  useEffect(() => {
    const previousTarget = gl.getRenderTarget();

    for (const target of [
      velocityFBO.read,
      velocityFBO.write,
      pressureFBO.read,
      pressureFBO.write,
      displayFBO.read,
      displayFBO.write,
      divergenceFBO,
      curlFBO,
    ]) {
      renderPass(materials.clear, target);
    }

    gl.setRenderTarget(previousTarget);
    gl.resetState();
  }, [
    curlFBO,
    displayFBO,
    divergenceFBO,
    gl,
    materials.clear,
    pressureFBO,
    velocityFBO,
  ]);

  useFrame((frameState, delta) => {
    const step = clamp(delta || dt, 1 / 120, 1 / 30);
    const activePointer = pointer ?? frameState.pointer;

    currentPointer.set(
      clamp(activePointer.x * 0.5 + 0.5, 0, 1),
      clamp(activePointer.y * 0.5 + 0.5, 0, 1),
    );

    materials.advection.uniforms.uVelocity.value = velocityFBO.read.texture;
    materials.advection.uniforms.uSource.value = velocityFBO.read.texture;
    materials.advection.uniforms.uDt.value = step;
    materials.advection.uniforms.uDissipation.value = Math.pow(
      advectionDecay,
      step * 60,
    );
    if (renderPass(materials.advection, velocityFBO.write)) velocityFBO.swap();

    if (interaction) {
      pointerForce.copy(currentPointer).sub(previousPointer.current);
      pointerForce.multiplyScalar(forceStrength / Math.max(step, 1 / 120));

      if (
        forceClamp > 0 &&
        pointerForce.lengthSq() > forceClamp * forceClamp
      ) {
        pointerForce.setLength(forceClamp);
      }

      if (pointerForce.lengthSq() > 0.000001) {
        materials.splat.uniforms.uTarget.value = velocityFBO.read.texture;
        materials.splat.uniforms.uPoint.value.copy(currentPointer);
        materials.splat.uniforms.uForce.value
          .copy(pointerForce)
          .multiplyScalar(0.085);
        materials.splat.uniforms.uRadius.value = forceRadius;

        if (renderPass(materials.splat, velocityFBO.write)) velocityFBO.swap();
      }
    }

    previousPointer.current.copy(currentPointer);

    materials.curl.uniforms.uVelocity.value = velocityFBO.read.texture;
    renderPass(materials.curl, curlFBO);

    materials.vorticity.uniforms.uVelocity.value = velocityFBO.read.texture;
    materials.vorticity.uniforms.uCurl.value = curlFBO.texture;
    materials.vorticity.uniforms.uDt.value = step;
    if (renderPass(materials.vorticity, velocityFBO.write)) velocityFBO.swap();

    const diffusionAlpha = viscosity * 0.02 * step * size * size;
    if (diffusionAlpha > 0 && viscousIterations > 0) {
      for (let i = 0; i < viscousIterations; i++) {
        materials.diffusion.uniforms.uVelocity.value = velocityFBO.read.texture;
        materials.diffusion.uniforms.uSource.value = velocityFBO.read.texture;
        materials.diffusion.uniforms.uAlpha.value = diffusionAlpha;
        if (renderPass(materials.diffusion, velocityFBO.write)) {
          velocityFBO.swap();
        }
      }
    }

    materials.divergence.uniforms.uVelocity.value = velocityFBO.read.texture;
    renderPass(materials.divergence, divergenceFBO);

    renderPass(materials.clear, pressureFBO.read);
    renderPass(materials.clear, pressureFBO.write);

    for (let i = 0; i < pressureIterations; i++) {
      materials.pressure.uniforms.uPressure.value = pressureFBO.read.texture;
      materials.pressure.uniforms.uDivergence.value = divergenceFBO.texture;
      if (renderPass(materials.pressure, pressureFBO.write)) {
        pressureFBO.swap();
      }
    }

    materials.gradientSubtract.uniforms.uVelocity.value =
      velocityFBO.read.texture;
    materials.gradientSubtract.uniforms.uPressure.value =
      pressureFBO.read.texture;
    if (renderPass(materials.gradientSubtract, velocityFBO.write)) {
      velocityFBO.swap();
    }

    materials.copy.uniforms.uSource.value = velocityFBO.read.texture;
    if (renderPass(materials.copy, displayFBO.write)) displayFBO.swap();
  }, -1);

  useEffect(
    () => () => {
      disposeFBO(velocityFBO);
      disposeFBO(pressureFBO);
      disposeFBO(displayFBO);
      divergenceFBO.dispose();
      curlFBO.dispose();
    },
    [curlFBO, displayFBO, divergenceFBO, pressureFBO, velocityFBO],
  );

  useEffect(
    () => () => {
      quad.geometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
    [materials, quad],
  );

  return (
    <FluidContext.Provider value={{ velocityFBO: displayFBO, fboSize: size }}>
      {children}
    </FluidContext.Provider>
  );
}
