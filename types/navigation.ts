import colors from '@/constants/colors';

export type Theme = typeof colors.light;
export type Screen = 'auth' | 'onboarding' | 'home' | 'practice' | 'reward' | 'topics' | 'course' | 'profile' | 'paywall' | 'leaderboard';
export type Tab = 'home' | 'course' | 'topics' | 'leaderboard' | 'profile';
