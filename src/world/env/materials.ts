/**
 * Chất liệu dùng chung của khuôn viên + danh sách chất liệu "phát sáng ban đêm" (đèn lồng, ô cửa, đèn đá…).
 */
import * as THREE from 'three';
import * as T from './textures';
import { lerp } from './core';

export interface GlowEntry { mat: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial; day: number; night: number }

export interface Mats {
  stone: THREE.MeshStandardMaterial;
  stoneDark: THREE.MeshStandardMaterial;
  paving: THREE.MeshStandardMaterial;
  plaster: THREE.MeshStandardMaterial;
  lacquer: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  darkWood: THREE.MeshStandardMaterial;
  roof: THREE.MeshStandardMaterial;
  roofEdge: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  bronze: THREE.MeshStandardMaterial;
  paint: THREE.MeshStandardMaterial;
  paintDouble: THREE.MeshStandardMaterial;
  jade: THREE.MeshStandardMaterial;
  foliage: THREE.MeshStandardMaterial;
  bark: THREE.MeshStandardMaterial;
  door: THREE.MeshStandardMaterial;
  lanternRed: THREE.MeshStandardMaterial;
  windowGlow: THREE.MeshStandardMaterial;
  stoneGlow: THREE.MeshStandardMaterial;
  aureole: THREE.MeshBasicMaterial;
  glow: GlowEntry[];
  textures: {
    stone: THREE.Texture; grass: THREE.Texture; gravel: THREE.Texture; dirt: THREE.Texture; noise: THREE.Texture;
    glow: THREE.Texture; heart: THREE.Texture;
  };
  update(night: number): void;
  dispose(): void;
}

export function createMaterials(): Mats {
  const own: THREE.Texture[] = [];
  const keep = <X extends THREE.Texture>(t: X): X => { own.push(t); return t; };
  const stoneT = keep(T.stoneTexture());
  const grassT = keep(T.grassTexture());
  const gravelT = keep(T.gravelTexture());
  const dirtT = keep(T.dirtTexture());
  const noiseT = keep(T.noiseTexture());
  const glowT = keep(T.glowTexture());
  const heartT = keep(T.heartLeafTexture());

  const std = (p: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial({ vertexColors: true, ...p });
  const roofT = keep(T.roofTexture());
  const lacqT = keep(T.lacquerTexture());
  const woodT = keep(T.woodTexture());
  const doorT = keep(T.doorTexture());

  const glow: GlowEntry[] = [];
  const stone = std({ color: 0xa8a39a, roughness: 0.92 });
  const stoneDark = std({ color: 0x6f6b66, roughness: 0.95 });
  const paving = std({ map: stoneT, roughness: 0.9 });
  const plaster = std({ color: 0xece3cf, roughness: 0.95 });
  const lacquer = std({ map: lacqT, roughness: 0.4, metalness: 0.08 });
  const wood = std({ map: woodT, roughness: 0.78 });
  const darkWood = std({ color: 0x5b3a26, roughness: 0.75 });
  const roof = std({ map: roofT, roughness: 0.72, side: THREE.DoubleSide });
  const roofEdge = std({ color: 0x6b3a22, roughness: 0.7 });
  const gold = std({ color: 0xe8b84a, roughness: 0.3, metalness: 0.85, emissive: 0x5a3a08, emissiveIntensity: 0.35 });
  const bronze = std({ color: 0xa8743c, roughness: 0.4, metalness: 0.8, emissive: 0x2a1604, emissiveIntensity: 0.3 });
  const paint = std({ color: 0xffffff, roughness: 0.82 });
  const paintDouble = std({ color: 0xffffff, roughness: 0.8, side: THREE.DoubleSide });
  const jade = std({ color: 0xf4f2ea, side: THREE.DoubleSide, roughness: 0.32, emissive: 0xfff2d0, emissiveIntensity: 0.05 });
  const foliage = std({ color: 0xffffff, roughness: 0.85 });
  const bark = std({ color: 0x6e5440, roughness: 0.95 });
  const door = std({ map: doorT, roughness: 0.55, metalness: 0.1 });
  const lanternRed = std({ color: 0xd8341f, roughness: 0.55, emissive: 0xff4a1c, emissiveIntensity: 0.15 });
  const windowGlow = std({ color: 0xffd9a0, roughness: 0.6, emissive: 0xffa545, emissiveIntensity: 0.1 });
  const stoneGlow = std({ color: 0xffe2b0, roughness: 0.6, emissive: 0xffa040, emissiveIntensity: 0.1 });
  const aureole = new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
  glow.push({ mat: lanternRed, day: 0.15, night: 1.7 }, { mat: windowGlow, day: 0.1, night: 1.8 }, { mat: stoneGlow, day: 0.08, night: 2.2 });

  return {
    stone, stoneDark, paving, plaster, lacquer, wood, darkWood, roof, roofEdge, gold, bronze, paint, paintDouble, jade, foliage, bark, door,
    lanternRed, windowGlow, stoneGlow, aureole, glow,
    textures: { stone: stoneT, grass: grassT, gravel: gravelT, dirt: dirtT, noise: noiseT, glow: glowT, heart: heartT },
    update(night: number): void {
      for (const g of glow) (g.mat as THREE.MeshStandardMaterial).emissiveIntensity = lerp(g.day, g.night, night);
      gold.emissiveIntensity = lerp(0.35, 0.55, night);
      jade.emissiveIntensity = lerp(0.05, 0.28, night);
      aureole.opacity = lerp(0.42, 0.8, night);
    },
    dispose(): void {
      for (const m of [stone, stoneDark, paving, plaster, lacquer, wood, darkWood, roof, roofEdge, gold, bronze, paint, paintDouble, jade, foliage, bark, door, lanternRed, windowGlow, stoneGlow, aureole]) m.dispose();
      for (const t of own) t.dispose();
    },
  };
}
