// FloatingPin コンポーネント - 3D フローティングピンマーカー

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface FloatingPinProps {
  lat: number;
  lng: number;
  radius: number;
  color?: string;
  label?: string;
  onClick?: () => void;
}

export default function FloatingPin({ 
  lat, 
  lng, 
  radius, 
  color = '#FF6B6B',
  label,
  onClick 
}: FloatingPinProps) {
  const pinGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!pinGroupRef.current) return;

    const group = pinGroupRef.current;
    
    // ピンの位置を計算
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    group.position.set(x, y, z);
    group.lookAt(new THREE.Vector3(0, 0, 0));

    // フローティングアニメーション
    const startTime = performance.now();
    const baseHeight = 0.05;
    const floatAmplitude = 0.02;
    const floatSpeed = 2;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const floatOffset = Math.sin(elapsed * 0.001 * floatSpeed) * floatAmplitude;
      
      const direction = group.position.clone().normalize();
      group.position.copy(direction.multiplyScalar(radius + baseHeight + floatOffset));

      // ラベルがあれば更新
      if (label && group.userData.labelSprite) {
        group.userData.labelSprite.position.y = 0.15 + floatOffset;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lat, lng, radius, label]);

  useEffect(() => {
    if (!pinGroupRef.current) return;

    const group = pinGroupRef.current;
    group.clear();

    // ピン本体（円錐）
    const pinGeometry = new THREE.ConeGeometry(0.03, 0.12, 8);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.2,
      emissive: color,
      emissiveIntensity: 0.3,
    });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.rotation.x = Math.PI / 2;
    pin.position.y = 0.06;
    group.add(pin);

    // ベース（球）
    const baseGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.3,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    group.add(base);

    // リング（トーラス）
    const ringGeometry = new THREE.TorusGeometry(0.05, 0.008, 8, 24);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.4,
      emissive: color,
      emissiveIntensity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    group.add(ring);

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
      
      group.userData.particles = group.userData.particles || [];
      group.userData.particles.push(particle);
      group.add(particle);
    }

    // クリックイベント
    if (onClick) {
      group.userData.onClick = onClick;
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
        
        ctx.strokeStyle = color;
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
        
        group.add(sprite);
        group.userData.labelSprite = sprite;
      }
    }
  }, [color, label]);

  return null;
}
