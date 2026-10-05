import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const iconMap = {
  star: 'star',
  zap: 'lightning-bolt',
  bell: 'bell',
  code: 'code-tags',
  home: 'home',
  compass: 'compass',
  user: 'account',
  'arrow-right': 'arrow-right-bold',
  'arrow-left': 'arrow-left-bold',
  x: 'close-thick',
  coffee: 'coffee',
  sun: 'white-balance-sunny',
  award: 'medal',
  check: 'check-bold',
  grid: 'view-grid',
  hash: 'pound-box',
  move: 'cursor-move',
  layers: 'layers',
  'git-branch': 'source-branch',
  'share-2': 'share-variant',
  'arrow-up-right': 'arrow-top-right-thick',
  'bar-chart-2': 'chart-box',
  'chevron-right': 'chevron-right',
  lock: 'lock',
  copy: 'content-copy',
  'book-open': 'book-open-page-variant',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  'check-circle': 'check-circle',
  'trending-up': 'trending-up',
  search: 'magnify',
  settings: 'cog',
  fire: 'fire',
  trophy: 'trophy',
  database: 'database',
  'log-out': 'logout',
  'refresh-cw': 'reload',
  'download-cloud': 'cloud-download',
  'git-commit': 'source-commit',
  info: 'information',
  loader: 'loading',
  cpu: 'cpu-64-bit',
  map: 'map',
  clock: 'clock-outline',
} as const;

export type IconName = keyof typeof iconMap;

export function AppIcon({
  name,
  size = 20,
  color = '#0F172A',
}: {
  name: IconName;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}) {
  const glyph = (iconMap as Record<string, string>)[name] || 'circle-outline';
  return <MaterialCommunityIcons name={glyph as any} size={size} color={color} />;
}

/** Alias so existing code that references `Feather` keeps working. */
export const Feather = AppIcon;
