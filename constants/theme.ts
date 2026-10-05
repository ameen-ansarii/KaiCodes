import { Dimensions } from 'react-native';
import colors from './colors';
import type { Theme } from '@/types/navigation';

/** Resolved design tokens for the active palette. */
export const theme = colors.light as Theme;

export const { width: windowWidth } = Dimensions.get('window');
export const isCompact = windowWidth < 380;
