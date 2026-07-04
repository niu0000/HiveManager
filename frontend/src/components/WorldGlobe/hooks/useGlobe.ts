// useGlobe Hook - Three.js 地球儀の制御

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { generateGlobeTexture } from '../utils/textureGenerator';
import { xyzToLatLng } from '../utils/geo';

const GEOJSON_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

export interface UseGlobeOptions {
  onCountryClick?: (countryName: string, lat: number, lng: number) => void;
}

export function useGlobe(containerRef: React.RefObject<HTMLDivElement>, options: UseGlobeOptions = {}) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期化
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // シーン
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8F9FF);
    sceneRef.current = scene;

    // カメラ
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // レンダラー
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ライティング
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 地球儀の作成
    createGlobe(scene);

    // イベントリスナー
    setupEventListeners(container);

    // アニメーションループ
    animate();

    // リサイズ対応
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
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
      // クリーンアップ
      disposeScene(scene);
    };
  }, []);

  // 地球儀の作成
  const createGlobe = async (scene: THREE.Scene) => {
    try {
      // GeoJSON の読み込み
      const response = await fetch(GEOJSON_URL);
      const geojson = await response.json();

      // テクスチャ生成
      const texture = await generateGlobeTexture(geojson);

      // 球体ジオメトリ
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.1,
      });

      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);
      globeRef.current = globe;

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load globe');
      setIsLoading(false);
    }
  };

  // イベントリスナーの設定
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

      // Raycaster でクリック位置を取得
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObject(globeRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const { lat, lng } = xyzToLatLng(point.x, point.y, point.z, 1.5);
        
        // 簡易的な国名取得（実際には GeoJSON データと照合が必要）
        const countryName = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
        options.onCountryClick?.(countryName, lat, lng);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('wheel', onWheel);
    container.addEventListener('click', onClick);

    // クリーンアップ用に関数を返す
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
    };
  };

  // アニメーションループ
  const animate = useCallback(() => {
    animationFrameRef.current = requestAnimationFrame(animate);

    if (globeRef.current && !isDragging.current) {
      // 慣性回転
      globeRef.current.rotation.x += rotationVelocity.current.x * 0.95;
      globeRef.current.rotation.y += rotationVelocity.current.y * 0.95;

      // 減衰
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  // シーンの破棄
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

  // 指定した位置にカメラを移動（フライアニメーション）
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

  return {
    isLoading,
    error,
    flyTo,
    scene: sceneRef.current,
    camera: cameraRef.current,
    globe: globeRef.current,
  };
}
