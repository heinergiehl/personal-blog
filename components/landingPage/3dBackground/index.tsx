"use client";
import React, {
  useRef,
  useEffect,
  useState,
  Suspense,
  useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
interface ThreeDGlowGridProps {
  gridSize?: number;
  spacing?: number;
  cubeSize?: number;
  depth?: number;
  fadeDuration?: number;
  baseHighlight?: number;
  neighborRadius?: number;
  chaosRange?: number;
  formationDuration?: number;
  chaosDuration?: number;
  highlightIntensity?: number;
  neighborHighlightIntensity?: number;
  neighborScale?: number;
  mainScale?: number;
  mainPopZ?: number;
  neighborPopZ?: number;
  intersectionThreshold?: number;
  cameraPosition?: [number, number, number];
  fov?: number;
  baseColor?: [number, number, number]; // RGB
  mainSpread?: number;
  neighborSpread?: number;
  revertOnFade?: boolean; // New prop to control reverting behavior
}

const vertexShader =/* glsl*/ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}

`;
const fragmentShader = /* glsl*/ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform float highlight;
uniform float alpha;
uniform vec3 baseColor;
void main() {
    float dist = distance(vUv, vec2(0.5, 0.5));
    float radialFactor = 1.0 - smoothstep(0.0, 0.5, dist);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - dot(normalize(vNormal), viewDir), 33.0);
    vec3 color = baseColor * highlight * (0.5 + 0.5 * radialFactor);
    color += fresnel * highlight * 2.0 * vec3(1.0, 1.0, 1.0);
    gl_FragColor = vec4(color, alpha);
}

`;
interface SceneProps extends Required<ThreeDGlowGridProps> {
  startFormation: boolean;
}

const Scene = ({
  startFormation,
  gridSize,
  spacing,
  cubeSize,
  depth,
  fadeDuration,
  baseHighlight,
  neighborRadius,
  chaosRange,
  formationDuration,
  chaosDuration,
  highlightIntensity,
  neighborHighlightIntensity,
  neighborScale,
  mainScale,
  mainPopZ,
  neighborPopZ,
  baseColor,
  mainSpread,
  neighborSpread,
  revertOnFade,
}: SceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const quads = useRef<
    {
      mesh: THREE.Mesh;
      targetPosition: THREE.Vector3;
      targetRotation: THREE.Euler;
    }[]
  >([]);
  const { gl, camera } = useThree();
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [mouse] = useState(() => new THREE.Vector2());
  const randomizeCube = useCallback(
    (mesh: THREE.Mesh) => {
      const randomX = (Math.random() - 0.5) * chaosRange;
      const randomY = (Math.random() - 0.5) * chaosRange;
      const randomZ = (Math.random() - 0.5) * chaosRange;
      mesh.position.set(randomX, randomY, randomZ);
      mesh.rotation.set(
        Math.random() * 0.1 * Math.PI * 2,
        Math.random() * 0.1 * Math.PI * 2,
        Math.random() * 0.1 * Math.PI * 2,
      );
    },
    [chaosRange],
  );
  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const halfSize = (gridSize * (cubeSize + spacing) - spacing) / 2;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, depth);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            highlight: { value: baseHighlight },
            alpha: { value: 1.0 },
            baseColor: { value: new THREE.Vector3(...baseColor) },
          },
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: true,
        });
        const mesh = new THREE.Mesh(cubeGeometry, material);
        randomizeCube(mesh);
        const targetPos = new THREE.Vector3(
          j * (cubeSize + spacing) - halfSize,
          i * (cubeSize + spacing) - halfSize,
          0,
        );
        const targetRot = new THREE.Euler(
          Math.random() * 0.2 - 0.1,
          Math.random() * 0.2 - 0.1,
          0,
        );
        mesh.userData = {
          originalHighlight: baseHighlight,
          originalAlpha: 1.0,
          originalZ: 0,
          targetPos,
          targetRot,
        };

        group.add(mesh);
        quads.current.push({
          mesh,
          targetPosition: targetPos,
          targetRotation: targetRot,
        });
      }
    }
  }, [
    randomizeCube,
    gridSize,
    cubeSize,
    spacing,
    depth,
    baseHighlight,
    baseColor,
  ]);
  // Animate cubes into their grid positions or back to chaos
  useEffect(() => {
    if (quads.current.length > 0) {
      const tl = gsap.timeline();
      if (startFormation) {
        // Animate into grid positions
        quads.current.forEach(({ mesh, targetPosition, targetRotation }) => {
          tl.to(
            mesh.position,
            {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: formationDuration,
              ease: "expo.inOut",
            },
            0,
          );
          tl.to(
            mesh.rotation,
            {
              x: targetRotation.x,
              y: targetRotation.y,
              z: targetRotation.z,
              duration: formationDuration,
              ease: "expo.inOut",
            },
            0,
          );
        });
      } else {
        // Animate back to chaos
        quads.current.forEach(({ mesh }) => {
          tl.to(
            mesh.position,
            {
              x: (Math.random() - 0.5) * chaosRange,
              y: (Math.random() - 0.5) * chaosRange,
              z: (Math.random() - 0.5) * chaosRange,
              duration: chaosDuration,
              ease: "expo.inOut",
            },
            0,
          );
          tl.to(
            mesh.rotation,
            {
              x: Math.random() * Math.PI * 2,
              y: Math.random() * Math.PI * 2,
              z: Math.random() * Math.PI * 2,
              duration: chaosDuration,
              ease: "expo.inOut",
            },
            0,
          );
        });
      }
    }
  }, [startFormation, chaosDuration, chaosRange, formationDuration]);
  const fadeQuad = useCallback(
    (mesh: THREE.Mesh, delay: number = 0) => {
      const material = mesh.material as THREE.ShaderMaterial;
      gsap.to(material.uniforms.highlight, {
        value: mesh.userData.originalHighlight,
        duration: fadeDuration,
        ease: "power2.out",
        delay,
      });
      gsap.to(material.uniforms.alpha, {
        value: mesh.userData.originalAlpha,
        duration: fadeDuration,
        ease: "power2.out",
        delay,
      });
      if (revertOnFade) {
        // Return to the exact pre-highlight position and rotation
        gsap.to(mesh.position, {
          x: mesh.userData.targetPos.x,
          y: mesh.userData.targetPos.y,
          z: mesh.userData.targetPos.z,
          duration: 0.5,
          delay,
          ease: "power2.out",
        });
        gsap.to(mesh.rotation, {
          x: mesh.userData.targetRot.x,
          y: mesh.userData.targetRot.y,
          z: mesh.userData.targetRot.z,
          duration: 0.5,
          delay,
          ease: "power2.out",
        });
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay });
      } else {
        // Only reset highlight and alpha without reverting position/rotation
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, delay });
      }
    },
    [fadeDuration, revertOnFade],
  );
  const highlightCube = useCallback(
    (
      mesh: THREE.Mesh,
      highlightVal: number,
      alphaVal: number,
      scaleVal: number,
      popZ: number,
      spread: number,
      hitPos: THREE.Vector3,
      fadeDelay: number = 0.5,
    ) => {
      // Store pre-highlight position and rotation
      const material = mesh.material as THREE.ShaderMaterial;
      gsap.to(material.uniforms.highlight, {
        value: highlightVal,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(material.uniforms.alpha, {
        value: alphaVal,
        duration: 0.3,
        ease: "power2.inOut",
      });
      // Direction from hitPos to this mesh
      const direction = mesh.position.clone().sub(hitPos).normalize();
      const offsetX = direction.x * spread;
      const offsetY = direction.y * spread;
      // Spread and pop out
      gsap.to(mesh.position, {
        x: mesh.userData.targetPos.x + offsetX,
        y: mesh.userData.targetPos.y + offsetY,
        z: popZ,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(mesh.scale, {
        x: scaleVal,
        y: scaleVal,
        z: scaleVal,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(mesh.rotation, {
        x: mesh.rotation.x + 0.5,
        y: mesh.rotation.y + 0.5,
        z: mesh.rotation.z + 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
      // Fade back after delay
      fadeQuad(mesh, fadeDelay);
    },
    [fadeQuad],
  );
  const handlePointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      if (groupRef.current) {
        const intersects = raycaster.intersectObjects(
          groupRef.current.children,
          true,
        );
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const hitPos = hit.position.clone();
          highlightCube(
            hit,
            highlightIntensity,
            1.0,
            mainScale,
            mainPopZ,
            mainSpread,
            hitPos,
          );
          quads.current.forEach((q) => {
            if (q.mesh !== hit) {
              const dist = q.mesh.position.distanceTo(hitPos);
              if (dist < neighborRadius) {
                highlightCube(
                  q.mesh,
                  neighborHighlightIntensity,
                  0.4,
                  neighborScale,
                  neighborPopZ,
                  neighborSpread,
                  hitPos,
                );
              }
            }
          });
        }
      }
    },
    [
      camera,
      highlightCube,
      mouse,
      quads,
      raycaster,
      highlightIntensity,
      neighborHighlightIntensity,
      neighborScale,
      mainScale,
      mainPopZ,
      neighborPopZ,
      neighborRadius,
      mainSpread,
      neighborSpread,
    ],
  );
  useEffect(() => {
    const handleMove = (e: MouseEvent) =>
      handlePointerMove(e as unknown as React.MouseEvent<HTMLDivElement>);
    gl.domElement.addEventListener("mousemove", handleMove);
    return () => {
      gl.domElement.removeEventListener("mousemove", handleMove);
    };
  }, [gl, handlePointerMove]);
  return <group ref={groupRef} rotation={[0, 0, 0]} />;
};

export const ThreeDGlowGrid = ({
  gridSize = 200,
  spacing = 0.5,
  cubeSize = 15.9,
  depth = 2.5,
  fadeDuration = 1.0,
  baseHighlight = 0.25,
  neighborRadius = 2.0,
  chaosRange = 1,
  formationDuration = 2,
  chaosDuration = 2,
  highlightIntensity = 150.0,
  neighborHighlightIntensity = 1.0,
  neighborScale = 1.2,
  mainScale = 1.6,
  mainPopZ = 4.0,
  neighborPopZ = 1.2,
  intersectionThreshold = 0.7,
  cameraPosition = [0, 0, 20],
  fov = 75,
  baseColor = [1.0, 0.0, 1.0],
  mainSpread = 4.0,
  neighborSpread = 2.0,
  revertOnFade = true, // default true
}: ThreeDGlowGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startFormation, setStartFormation] = useState(false);
  useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setStartFormation(true);
            } else {
              setStartFormation(false);
            }
          });
        },
        { threshold: intersectionThreshold },
      );
      observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [intersectionThreshold]);
  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
      }}
    >
      <Canvas camera={{ position: cameraPosition, fov }}>
        <ambientLight intensity={1.2} />

        <spotLight intensity={1} position={[0, 0, 1]} />
        <Suspense fallback={null}>
          <Scene
            startFormation={startFormation}
            gridSize={gridSize}
            spacing={spacing}
            cubeSize={cubeSize}
            depth={depth}
            fadeDuration={fadeDuration}
            baseHighlight={baseHighlight}
            neighborRadius={neighborRadius}
            chaosRange={chaosRange}
            formationDuration={formationDuration}
            chaosDuration={chaosDuration}
            highlightIntensity={highlightIntensity}
            neighborHighlightIntensity={neighborHighlightIntensity}
            neighborScale={neighborScale}
            mainScale={mainScale}
            mainPopZ={mainPopZ}
            neighborPopZ={neighborPopZ}
            baseColor={baseColor}
            intersectionThreshold={intersectionThreshold}
            cameraPosition={cameraPosition}
            fov={fov}
            mainSpread={mainSpread}
            neighborSpread={neighborSpread}
            revertOnFade={revertOnFade}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Example usage page
const Page = () => {
  return (
    <ThreeDGlowGrid
      gridSize={12}
      spacing={1.5}
      cubeSize={2.9}
      depth={2.7}
      baseHighlight={0.75}
      neighborRadius={5.0}
      chaosRange={50}
      formationDuration={2}
      chaosDuration={2}
      highlightIntensity={1.0}
      neighborHighlightIntensity={2.0}
      neighborScale={1.3}
      mainScale={1.2}
      mainPopZ={5.0}
      neighborPopZ={2.0}
      intersectionThreshold={0.7}
      cameraPosition={[0, 0, 40]}
      fov={20}
      baseColor={[1.0, 0.0, 1.0]}
      mainSpread={8.0}
      neighborSpread={4.0}
      revertOnFade={true} // Try toggling this between true and false
    />
  );
};

export default Page;
