// GeoJSON から Canvas テクスチャを生成

import * as THREE from 'three';

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = 1024;

/**
 * 手描き風の地球儀テクスチャを生成
 */
export function generateGlobeTexture(geojson: any): Promise<THREE.CanvasTexture> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // 海の背景（グラデーション - クレイ調）
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#2D3748');
    gradient.addColorStop(0.5, '#4A5568');
    gradient.addColorStop(1, '#2D3748');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 波模様のノイズ（手描き風）
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * CANVAS_WIDTH;
      const y = Math.random() * CANVAS_HEIGHT;
      const w = Math.random() * 30 + 10;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + w / 2, y - 5, x + w / 2, y + 5, x + w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // GeoJSON の描画
    if (geojson && geojson.type === 'FeatureCollection') {
      // 各国を塗り分け
      geojson.features.forEach((feature: any, index: number) => {
        if (feature.geometry.type === 'Polygon') {
          drawPolygon(ctx, feature.geometry.coordinates, CANVAS_WIDTH, CANVAS_HEIGHT, index);
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((polygon: any[]) => {
            drawPolygon(ctx, polygon, CANVAS_WIDTH, CANVAS_HEIGHT, index);
          });
        }
      });

      // 国境線の描画（手描き風）
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      geojson.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Polygon') {
          strokePolygon(ctx, feature.geometry.coordinates, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((polygon: any[]) => {
            strokePolygon(ctx, polygon, CANVAS_WIDTH, CANVAS_HEIGHT);
          });
        }
      });
      ctx.globalAlpha = 1.0;
    }

    // テクスチャとして読み込み
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    resolve(texture);
  });
}

/**
 * Polygon を Canvas に描画（塗りつぶし）
 */
function drawPolygon(
  ctx: CanvasRenderingContext2D,
  coordinates: number[][][],
  canvasWidth: number,
  canvasHeight: number,
  colorIndex: number
) {
  ctx.fillStyle = getCountryColor(colorIndex);
  
  coordinates.forEach((ring: number[][]) => {
    ctx.beginPath();
    ring.forEach((point: number[], i: number) => {
      const [lng, lat] = point;
      const x = ((lng + 180) / 360) * canvasWidth;
      const y = ((90 - lat) / 180) * canvasHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
  });
}

/**
 * Polygon の輪郭を描画
 */
function strokePolygon(
  ctx: CanvasRenderingContext2D,
  coordinates: number[][][],
  canvasWidth: number,
  canvasHeight: number
) {
  coordinates.forEach((ring: number[][]) => {
    ctx.beginPath();
    ring.forEach((point: number[], i: number) => {
      const [lng, lat] = point;
      const x = ((lng + 180) / 360) * canvasWidth;
      const y = ((90 - lat) / 180) * canvasHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();
  });
}

/**
 * 国ごとの色を生成（クレイ調パステルカラー - #6C63FF ベースの統一テーマ）
 */
function getCountryColor(index: number): string {
  const colors = [
    '#6C63FF', // メインパープル
    '#FF6B6B', // コーラルレッド
    '#FFD93D', // イエロー
    '#4ECDC4', // ティールグリーン
    '#FF85A2', // ピンク
    '#4D96FF', // ブルー
    '#A78BFA', // ラベンダー
    '#F472B6', // ローズ
    '#34D399', // エメラルド
    '#FB923C', // オレンジ
    '#60A5FA', // スカイブルー
    '#C084FC', // パープル
    '#2DD4BF', // アクア
    '#FBBF24', // アンバー
    '#F87171', // レッド
  ];
  return colors[index % colors.length];
}
