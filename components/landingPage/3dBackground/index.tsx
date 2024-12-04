import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"
import gsap from "gsap"
interface ParticlesProps {
  section: number
}
const Particles: React.FC<ParticlesProps> = ({ section }) => {
  const particlesRef = useRef<THREE.Points>(null)
  const [positions, setPositions] = useState<Float32Array>(new Float32Array())
  useEffect(() => {
    const generatePositions = () => {
      const tempPositions: number[] = []
      for (let i = 0; i < 500; i++) {
        tempPositions.push(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        )
      }
      return new Float32Array(tempPositions)
    }
    setPositions(generatePositions())
  }, [])
  useEffect(() => {
    if (particlesRef.current) {
      gsap.to(particlesRef.current.rotation, {
        y: section * Math.PI * 0.25,
        duration: 1.5,
        ease: "power2.inOut",
      })
    }
  }, [section])
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
    }
  })
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={section === 4 ? "hotpink" : "white"}
        opacity={0.8}
        transparent
      />
    </points>
  )
}
interface ContactCardProps {
  visible: boolean
}
const ContactCard: React.FC<ContactCardProps> = ({ visible }) => {
  const cardRef = useRef<THREE.Group>(null)
  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current.position, {
        y: visible ? 0 : -5,
        duration: 1.2,
        ease: "power3.out",
      })
      gsap.to(cardRef.current.rotation, {
        y: visible ? Math.PI * 0.05 : 0,
        duration: 1.2,
        ease: "power3.out",
      })
    }
  }, [visible])
  return (
    <group ref={cardRef} position={[0, -5, 0]} rotation={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Contact Me
      </Text>
    </group>
  )
}
interface SceneProps {
  section: number
}
const Scene: React.FC<SceneProps> = ({ section }) => {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      camera={{ position: [0, 0, 10], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <Particles section={section} />
      <ContactCard visible={section === 4} />
    </Canvas>
  )
}
export { Scene, Particles, ContactCard }
