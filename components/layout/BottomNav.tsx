import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Tab } from '@/types/navigation';

const navIconMap: Record<string, string> = {
  home: 'home',
  map: 'map',
  layers: 'layers',
  award: 'medal',
  user: 'account',
};

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ key: Tab; label: string; icon: string; hasBadge?: boolean }> = [
    { key: 'home', label: 'Today', icon: 'home' },
    { key: 'course', label: 'Path', icon: 'map' },
    { key: 'topics', label: 'Explore', icon: 'layers' },
    { key: 'leaderboard', label: 'Leagues', icon: 'award', hasBadge: true },
    { key: 'profile', label: 'Profile', icon: 'user' },
  ];

  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = items.findIndex((i) => i.key === active);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const initialLayoutDone = useRef(false);

  const itemWidth = containerWidth > 0 ? (containerWidth - 16) / items.length : 0;

  useEffect(() => {
    if (containerWidth === 0) return;
    const toX = safeIndex * itemWidth;
    if (!initialLayoutDone.current) {
      slideAnim.setValue(toX);
      initialLayoutDone.current = true;
    } else {
      Animated.spring(slideAnim, {
        toValue: toX,
        useNativeDriver: true,
        damping: 18,
        stiffness: 200,
        mass: 0.7,
      }).start();
    }
  }, [safeIndex, containerWidth, itemWidth, slideAnim]);

  return (
    <View
      style={styles.bottomNav}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.animatedTabIndicator,
            { width: itemWidth, transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.indicatorPill} />
        </Animated.View>
      )}
      {items.map((item) => {
        const isActive = item.key === active;
        const glyph = navIconMap[item.icon] || 'circle-outline';
        return (
          <Pressable
            key={item.key}
            testID={`tab-${item.key}`}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(item.key);
            }}
            style={styles.navItem}
          >
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons
                name={glyph as any}
                size={19}
                color={isActive ? '#FFFFFF' : '#64748B'}
                strokeWidth={isActive ? 2.8 : 2.2}
              />
              {item.hasBadge && (
                <View
                  style={[
                    styles.navBadgeDot,
                    isActive && styles.navBadgeDotActive,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute', left: 14, right: 14, bottom: 16, height: 68, borderRadius: 34,
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderBottomWidth: 3.5, borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 8,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
  },
  animatedTabIndicator: { position: 'absolute', left: 8, top: 6, bottom: 6, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  indicatorPill: { width: '92%', height: 52, borderRadius: 24, backgroundColor: '#7C3AED', borderBottomWidth: 3.5, borderBottomColor: '#5B21B6', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 2, gap: 2, height: '100%' },
  navIconWrapper: { width: 28, height: 24, alignItems: 'center', justifyContent: 'center' },
  navLabel: { color: '#64748B', fontFamily: 'Nunito_700Bold', fontSize: 10, letterSpacing: 0.2 },
  navLabelActive: { color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold' },
  navBadgeDot: { position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },
  navBadgeDotActive: { backgroundColor: '#FDE047', borderColor: '#7C3AED' },
});
