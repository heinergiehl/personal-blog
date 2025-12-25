"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
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
  particleCount = 32,
  particleSize = 0.2,
  formationSpeed = 0.02,
  mouseInfluence = 200,
  isMobile = false,
  onLoad,
}: ParticleAvatarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const mouseRef = useRef({ x: 9999, y: 9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let mounted = true;

    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 18);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
    });
    
    const size = Math.max(container.clientWidth || 600, container.clientHeight || 600);
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    
    renderer.setSize(size, size);
    renderer.setPixelRatio(pixelRatio);
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

    /**
     * Displacement
     */
    const displacement: any = {};
    
    // 2D canvas
    displacement.canvas = document.createElement('canvas');
    displacement.canvas.width = 128;
    displacement.canvas.height = 128;
    
    // Context
    displacement.context = displacement.canvas.getContext('2d')!;
    displacement.context.fillStyle = '#000000';
    displacement.context.fillRect(0, 0, 128, 128);
    
    // Glow image (create radial gradient)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d')!;
    const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 64, 64);
    displacement.glowImage = glowCanvas;
    
    // Interactive plane
    displacement.interactivePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(displacement.interactivePlane);
    
    // Raycaster
    displacement.raycaster = new THREE.Raycaster();
    
    // Coordinates
    displacement.screenCursor = new THREE.Vector2(9999, 9999);
    displacement.canvasCursor = new THREE.Vector2(9999, 9999);
    displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);
    
    // Texture
    displacement.texture = new THREE.CanvasTexture(displacement.canvas);

    // Detect current theme
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    /**
     * Load image and create particles
     */
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (pictureTexture) => {
      if (!mounted) return;

      // Shaders
      const vertexShader =/* glsl */ `
        uniform vec2 uResolution;
        uniform sampler2D uPictureTexture;
        uniform sampler2D uDisplacementTexture;
        
        attribute float aIntensity;
        attribute float aAngle;
        
        varying vec3 vColor;
        
        void main()
        {
          // Displacement
          vec3 newPosition = position;
          float displacementIntensity = texture2D(uDisplacementTexture, uv).r;
          displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
      
          vec3 displacementVec = vec3(
            cos(aAngle) * 0.2,
            sin(aAngle) * 0.2,
            1.0
          );
          displacementVec = normalize(displacementVec);
          displacementVec *= displacementIntensity;
          displacementVec *= 3.0;
          displacementVec *= aIntensity;
          
          newPosition += displacementVec;
      
          // Final position
          vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
      
          // Picture
          float pictureIntensity = texture2D(uPictureTexture, uv).r;
      
          // Point size
          gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
          gl_PointSize *= (1.0 / - viewPosition.z);
      
          // Varyings
          vColor = vec3(pow(pictureIntensity, 2.0));
        }
      `;

      const fragmentShader = /* glsl */ `
        varying vec3 vColor;
        
        void main()
        {
          vec2 uv = gl_PointCoord;
          float distanceToCenter = length(uv - vec2(0.5));
      
          if(distanceToCenter > 0.5)
            discard;
      
          gl_FragColor = vec4(vColor, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `;

      // Geometry - using fixed 128x128 like the example
      const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
      particlesGeometry.setIndex(null);
      particlesGeometry.deleteAttribute('normal');
      
      const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count);
      const anglesArray = new Float32Array(particlesGeometry.attributes.position.count);
      
      for(let i = 0; i < particlesGeometry.attributes.position.count; i++)
      {
        intensitiesArray[i] = Math.random();
        anglesArray[i] = Math.random() * Math.PI * 2;
      }
      
      particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1));
      particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1));
      
      // Material
      const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uResolution: new THREE.Uniform(new THREE.Vector2(size * pixelRatio, size * pixelRatio)),
          uPictureTexture: new THREE.Uniform(pictureTexture),
          uDisplacementTexture: new THREE.Uniform(displacement.texture)
        },
        blending: THREE.AdditiveBlending
      });
      
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      setIsLoading(false);
      onLoad?.();
    });

    /**
     * Mouse move handler
     */
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouseRef.current.x = (x / rect.width) * 2 - 1;
      mouseRef.current.y = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('pointermove', handleMouseMove);

    /**
     * Animate
     */
    const animate = () => {
      if (!mounted) return;
      rafRef.current = requestAnimationFrame(animate);
      if (stats) stats.begin();

      /**
       * Raycaster
       */
      displacement.raycaster.setFromCamera(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        camera
      );
      const intersections = displacement.raycaster.intersectObject(displacement.interactivePlane);

      if (intersections.length) {
        const uv = intersections[0].uv!;
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
      }

      /**
       * Displacement
       */
      // Fade out
      displacement.context.globalCompositeOperation = 'source-over';
      displacement.context.globalAlpha = 0.02;
      displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

      // Speed alpha
      const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor);
      displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
      const alpha = Math.min(cursorDistance * 0.05, 1);
      
      // Draw glow
      const glowSize = displacement.canvas.width * 0.25;
      displacement.context.globalCompositeOperation = 'lighten';
      displacement.context.globalAlpha = alpha;
      displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
      );

      // Texture
      displacement.texture.needsUpdate = true;

      // Render
      renderer.render(scene, camera);

      if (stats) stats.end();
    };

    animate();

    /**
     * Cleanup
     */
    return () => {
      mounted = false;
      window.removeEventListener('pointermove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (stats) {
        container.removeChild(stats.dom);
      }
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [imageUrl, particleCount, particleSize, isMobile, theme, systemTheme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] flex items-center justify-center"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm opacity-50">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default ParticleAvatar;
