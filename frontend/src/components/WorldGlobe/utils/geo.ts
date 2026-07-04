// GeoJSON → XYZ 変換ユーティリティ

/**
 * 緯度経度を Three.js の 3D 座標に変換
 * @param lat 緯度（-90 〜 90）
 * @param lng 経度（-180 〜 180）
 * @param radius 球体の半径
 * @returns {x, y, z} 座標
 */
export function latLngToXyz(lat: number, lng: number, radius: number): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return { x, y, z };
}

/**
 * 旧版：緯度経度を Three.js の 3D 座標に変換（配列版）
 * @deprecated 新版 latLngToXyz を使用してください
 */
export function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const result = latLngToXyz(lat, lng, radius);
  return [result.x, result.y, result.z];
}

/**
 * 3D 座標から緯度経度に変換
 * @param x X 座標
 * @param y Y 座標
 * @param z Z 座標
 * @param radius 球体の半径
 * @returns { lat, lng }
 */
export function xyzToLatLng(x: number, y: number, z: number, _radius: number): { lat: number; lng: number } {
  const r = Math.sqrt(x * x + y * y + z * z);
  const lat = 90 - (Math.acos(y / r) * 180) / Math.PI;
  const lng = ((Math.atan2(z, x) * 180) / Math.PI) - 180;
  return { lat, lng };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * GeoJSON の FeatureCollection から国ごとの情報を抽出
 */
export interface CountryFeature {
  name: string;
  nameEn?: string;
  geometry: any;
  properties: any;
}

export function parseGeoJSON(geojson: any): CountryFeature[] {
  if (!geojson || geojson.type !== 'FeatureCollection') {
    return [];
  }
  
  return geojson.features.map((feature: any) => ({
    name: feature.properties.name || feature.properties.NAME || 'Unknown',
    nameEn: feature.properties.name_en || feature.properties.ADMIN || undefined,
    geometry: feature.geometry,
    properties: feature.properties,
  }));
}

/**
 * 国名で検索するための正規化関数
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}
