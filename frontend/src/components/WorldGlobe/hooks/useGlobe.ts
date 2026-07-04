// useGlobe Hook - Three.js 地球儀の制御（ポップ ver）- フェーズ 3 対応（SLERP/フローティングピン/コンパス）

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { generateGlobeTexture } from '../utils/textureGenerator';
import { xyzToLatLng, latLngToXyz } from '../utils/geo';
import type { Landmark } from '../data/landmarks';
import { landmarks } from '../data/landmarks';

const GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

export interface UseGlobeOptions {
  onCountryClick?: (countryName: string, lat: number, lng: number) => void;
  onLandmarkClick?: (landmark: Landmark) => void;
}

export interface LandmarkObject {
  mesh: THREE.Mesh;
  data: Landmark;
  sparkles: THREE.Mesh[];
}

export function useGlobe(containerRef: React.RefObject<HTMLDivElement | null>, options: UseGlobeOptions = {}) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const landmarksRef = useRef<LandmarkObject[]>([]);
  const pinsRef = useRef<THREE.Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const gradient = createGradientBackground(width, height);
    scene.background = gradient;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xFFD93D, 0.5);
    pointLight.position.set(-3, 2, 4);
    scene.add(pointLight);

    createGlobe(scene);
    setupEventListeners(container);
    animate();

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
      scene.background = createGradientBackground(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
      }
      disposeScene(scene);
    };
  }, []);

  const createGradientBackground = (width: number, height: number): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667EEA');
    gradient.addColorStop(0.5, '#764BA2');
    gradient.addColorStop(1, '#F093FB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

  const createGlobe = async (scene: THREE.Scene) => {
    try {
      const response = await fetch(GEOJSON_URL);
      const geojson = await response.json();
      const texture = await generateGlobeTexture(geojson);

      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.2,
      });

      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);
      globeRef.current = globe;

      createAtmosphere(scene);
      createLandmarks(scene);

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load globe');
      setIsLoading(false);
    }
  };

  const createLandmarks = (scene: THREE.Scene) => {
    landmarksRef.current = landmarks.map(landmark => {
      const { x, y, z } = latLngToXyz(landmark.lat, landmark.lng, 1.52);
      
      let geometry: THREE.BufferGeometry;
      switch (landmark.shape) {
        case 'cone':
          geometry = new THREE.ConeGeometry(0.08, landmark.height, 8);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(0.06, 0.02, 8, 16);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(0.07, 16, 16);
          break;
        case 'box':
        default:
          geometry = new THREE.BoxGeometry(0.1, landmark.height, 0.1);
          break;
      }

      const material = new THREE.MeshStandardMaterial({
        color: landmark.color,
        roughness: 0.3,
        metalness: 0.1,
        emissive: landmark.color,
        emissiveIntensity: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      mesh.rotateX(Math.PI / 2);
      scene.add(mesh);

      const sparkles: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const sparkleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const sparkleMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.8,
        });
        const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
        sparkle.position.copy(mesh.position);
        sparkle.position.x += (Math.random() - 0.5) * 0.3;
        sparkle.position.y += (Math.random() - 0.5) * 0.3;
        sparkle.position.z += (Math.random() - 0.5) * 0.3;
        scene.add(sparkle);
        sparkles.push(sparkle);
      }

      return { mesh, data: landmark, sparkles };
    });
  };

  const createAtmosphere = (scene: THREE.Scene) => {
    const atmosphereGeometry = new THREE.SphereGeometry(1.65, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.4, 0.8, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    atmosphereRef.current = atmosphere;
  };

  const setupEventListeners = (container: HTMLElement) => {
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      rotationVelocity.current = { x: 0, y: 0 };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !globeRef.current) return;

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      rotationVelocity.current = { x: deltaY * 0.002, y: deltaX * 0.002 };

      globeRef.current.rotation.x += rotationVelocity.current.x;
      globeRef.current.rotation.y += rotationVelocity.current.y;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onMouseLeave = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(2.5, Math.min(10, cameraRef.current.position.z));
    };

    const onClick = (e: MouseEvent) => {
      if (!globeRef.current || !cameraRef.current || !rendererRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const globeIntersects = raycaster.intersectObject(globeRef.current);
      const landmarkMeshes = landmarksRef.current.map(lm => lm.mesh);
      const landmarkIntersects = raycaster.intersectObjects(landmarkMeshes);

      if (landmarkIntersects.length > 0) {
        const clickedMesh = landmarkIntersects[0].object as THREE.Mesh;
        const clickedLandmark = landmarksRef.current.find(lm => lm.mesh === clickedMesh);
        if (clickedLandmark) {
          options.onLandmarkClick?.(clickedLandmark.data);
          jumpLandmark(clickedLandmark);
        }
      } else if (globeIntersects.length > 0) {
        const point = globeIntersects[0].point;
        const { lat, lng } = xyzToLatLng(point.x, point.y, point.z, 1.5);
        const countryName = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
        options.onCountryClick?.(countryName, lat, lng);
      }
    };

    const onDoubleClick = (e: MouseEvent) => {
      if (!globeRef.current || !cameraRef.current || !rendererRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const landmarkMeshes = landmarksRef.current.map(lm => lm.mesh);
      const landmarkIntersects = raycaster.intersectObjects(landmarkMeshes);

      if (landmarkIntersects.length > 0) {
        const clickedMesh = landmarkIntersects[0].object as THREE.Mesh;
        const clickedLandmark = landmarksRef.current.find(lm => lm.mesh === clickedMesh);
        if (clickedLandmark) {
          flyToLandmark(clickedLandmark.data);
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('wheel', onWheel);
    container.addEventListener('click', onClick);
    container.addEventListener('dblclick', onDoubleClick);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      container.removeEventListener('dblclick', onDoubleClick);
    };
  };

  const jumpLandmark = (landmarkObj: LandmarkObject) => {
    if (!landmarkObj.mesh.parent) return;

    const startPos = landmarkObj.mesh.position.clone();
    const jumpHeight = 0.3;
    const duration = 600;
    const startTime = performance.now();

    const animateJump = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const jumpProgress = Math.sin(progress * Math.PI);
      const offset = startPos.clone().normalize().multiplyScalar(jumpHeight * jumpProgress);
      
      landmarkObj.mesh.position.copy(startPos).add(offset);

      landmarkObj.sparkles.forEach((sparkle, i) => {
        sparkle.position.copy(landmarkObj.mesh.position);
        sparkle.position.x += (Math.sin(i * 2 + progress * Math.PI * 2) * 0.1);
        sparkle.position.y += (Math.cos(i * 2 + progress * Math.PI * 2) * 0.1);
      });

      if (progress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        landmarkObj.mesh.position.copy(startPos);
      }
    };

    animateJump();
  };

  const flyToLandmark = (landmark: Landmark) => {
    if (!globeRef.current || !cameraRef.current) return;

    const startRotation = { ...globeRef.current.rotation };
    const targetRotation = {
      x: -landmark.lat * (Math.PI / 180),
      y: -landmark.lng * (Math.PI / 180),
    };

    const startTime = performance.now();
    const duration = 1500;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateFly = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      if (globeRef.current) {
        globeRef.current.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easedProgress;
        globeRef.current.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easedProgress;
      }

      if (cameraRef.current) {
        const startZ = cameraRef.current.position.z;
        const targetZ = 3.0;
        cameraRef.current.position.z = startZ + (targetZ - startZ) * easedProgress;
      }

      if (progress < 1) {
        requestAnimationFrame(animateFly);
      }
    };

    animateFly();
  };

  const animate = useCallback(() => {
    animationFrameRef.current = requestAnimationFrame(animate);

    if (globeRef.current && !isDragging.current) {
      globeRef.current.rotation.x += rotationVelocity.current.x * 0.95;
      globeRef.current.rotation.y += rotationVelocity.current.y * 0.95;
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
    }

    const time = performance.now() * 0.001;
    landmarksRef.current.forEach((landmarkObj, index) => {
      const offset = Math.sin(time + index) * 0.02;
      const direction = landmarkObj.mesh.position.clone().normalize();
      landmarkObj.mesh.position.add(direction.multiplyScalar(offset));

      landmarkObj.sparkles.forEach((sparkle, i) => {
        (sparkle.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 3 + i) * 0.3;
      });
    });

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const disposeScene = (scene: THREE.Scene) => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });
  };

  const flyTo = useCallback((lat: number, lng: number, duration: number = 1200) => {
    if (!globeRef.current || !cameraRef.current) return;

    const startRotation = { ...globeRef.current.rotation };
    const targetRotation = {
      x: -lat * (Math.PI / 180),
      y: -lng * (Math.PI / 180),
    };

    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateFly = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      if (globeRef.current) {
        globeRef.current.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easedProgress;
        globeRef.current.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easedProgress;
      }

      if (progress < 1) {
        requestAnimationFrame(animateFly);
      }
    };

    animateFly();
  }, []);

  // SLERP を使用した高度なフライアニメーション
  const flyToSlerp = useCallback((lat: number, lng: number, duration: number = 1500) => {
    if (!globeRef.current || !cameraRef.current) return;

    const globe = globeRef.current;
    const camera = cameraRef.current;

    // 現在の回転をクォータニオンに変換
    const startQuaternion = new THREE.Quaternion();
    startQuaternion.setFromEuler(globe.rotation);

    // ターゲット回転を計算
    const targetEuler = new THREE.Euler(-lat * (Math.PI / 180), -lng * (Math.PI / 180), 0);
    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromEuler(targetEuler);

    // ズームターゲット
    const startZ = camera.position.z;
    const targetZ = 3.0;

    const startTime = performance.now();

    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animateSlerp = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      // SLERP でスムーズに回転
      globe.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, easedProgress);
      globe.rotation.setFromQuaternion(globe.quaternion);

      // カメラズーム
      camera.position.z = startZ + (targetZ - startZ) * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateSlerp);
      }
    };

    animateSlerp();
  }, []);

  // フローティングピンを追加
  const addFloatingPin = useCallback((lat: number, lng: number, color?: string, label?: string) => {
    if (!sceneRef.current || !globeRef.current) return null;

    const scene = sceneRef.current;
    const radius = 1.52;

    const pinGroup = new THREE.Group();
    
    // ピンの位置を計算
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    pinGroup.position.set(x, y, z);
    pinGroup.lookAt(new THREE.Vector3(0, 0, 0));

    // ピン本体（円錐）
    const pinGeometry = new THREE.ConeGeometry(0.03, 0.12, 8);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: color || 0xFF6B6B,
      roughness: 0.3,
      metalness: 0.2,
      emissive: color || 0xFF6B6B,
      emissiveIntensity: 0.3,
    });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.rotation.x = Math.PI / 2;
    pin.position.y = 0.06;
    pinGroup.add(pin);

    // ベース（球）
    const baseGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.3,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    pinGroup.add(base);

    // リング（トーラス）
    const ringGeometry = new THREE.TorusGeometry(0.05, 0.008, 8, 24);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: color || 0xFF6B6B,
      roughness: 0.3,
      metalness: 0.4,
      emissive: color || 0xFF6B6B,
      emissiveIntensity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    pinGroup.add(ring);

    // パーティクルエフェクト
    for (let i = 0; i < 5; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.01, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.6,
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      const angle = (i / 5) * Math.PI * 2;
      const distance = 0.08;
      particle.position.x = Math.cos(angle) * distance;
      particle.position.z = Math.sin(angle) * distance;
      particle.position.y = 0.02;
      
      pinGroup.add(particle);
    }

    // ラベルテキスト（オプション）
    if (label) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 256;
        canvas.height = 64;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
        ctx.fill();
        
        ctx.strokeStyle = color || '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = 0.15;
        sprite.scale.set(0.3, 0.075, 1);
        
        pinGroup.add(sprite);
      }
    }

    scene.add(pinGroup);
    pinsRef.current.push(pinGroup);
    
    return pinGroup;
  }, []);

  // フローティングピンを削除
  const removeFloatingPin = useCallback((pin: THREE.Group) => {
    if (!sceneRef.current) return;
    
    sceneRef.current.remove(pin);
    pin.clear();
    pin.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
    
    pinsRef.current = pinsRef.current.filter(p => p !== pin);
  }, []);

  // すべてのフローティングピンをクリア
  const clearFloatingPins = useCallback(() => {
    pinsRef.current.forEach(pin => {
      if (!sceneRef.current) return;
      sceneRef.current.remove(pin);
      pin.clear();
      pin.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    });
    pinsRef.current = [];
  }, []);

  return {
    isLoading,
    error,
    flyTo,
    flyToSlerp,
    addFloatingPin,
    removeFloatingPin,
    clearFloatingPins,
    scene: sceneRef.current,
    camera: cameraRef.current,
    globe: globeRef.current,
    landmarks: landmarksRef.current,
  };
}
