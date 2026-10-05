import React, { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@/components/ui/AppIcon';
import { StrongButton } from '@/components/ui/Buttons';
import { Mascot } from '@/components/ui/Mascot';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { HeaderStats } from '@/components/layout/HeaderStats';
import { theme } from '@/constants/theme';
import { getAllTopics } from '@/content';
import type { UserAccount, UserProfile, UserProgress } from '@/services/turso';
import type { Tab } from '@/types/navigation';

export function HomeScreen({
  user,
  profile,
  progress,
  isUpdating = false,
  onPractice,
  onTopics,
  onCourse,
  onProfile,
  onPaywall,
  onLeaderboard,
  onNav,
}: {
  user?: UserAccount | null;
  profile?: UserProfile | null;
  progress?: UserProgress;
  isUpdating?: boolean;
  onPractice: (lessonId?: string) => void;
  onTopics: () => void;
  onCourse: () => void;
  onProfile: () => void;
  onPaywall: () => void;
  onLeaderboard: () => void;
  onNav: (tab: Tab) => void;
}) {
  const nextLesson = useMemo(() => {
    const all = getAllTopics().flatMap((t) => t.lessons);
    const completed = Array.isArray(progress?.completedLessons) ? progress.completedLessons : [];
    return all.find((l) => !completed.includes(l.id)) || all[0];
  }, [progress]);

  const streak = progress?.streakCount || 1;
  const repsCompleted = Array.isArray(progress?.completedLessons) ? progress.completedLessons.length : 0;

  return (
    <ScreenShell bottomNav activeTab="home">
      <HeaderStats onProfile={onProfile} xp={progress?.xp || 0} streak={streak} isUpdating={isUpdating} />
      <View style={styles.greetingBanner}>
        <View style={styles.greetingCopy}>
          <Text style={styles.greeting}>Good morning, {user?.displayName || 'Engineer'}</Text>
          <Text style={styles.greetingSub}>Keep your {streak}-day streak alive today!</Text>
          <View style={styles.streakBadgeInline}>
            <Image
              source={require('@/assets/images/streak_emoji.png')}
              style={{ width: 19, height: 19 }}
              resizeMode="contain"
            />
            <Text style={styles.streakNumberInline}>{streak}-DAY STREAK</Text>
          </View>
        </View>
        <Mascot pose="speedrun" size={118} style={{ marginBottom: -8 }} />
      </View>
      <View style={styles.dailyCard}>
        <View style={styles.dailyCardTop}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>TODAY'S REP</Text>
          </View>
          <Text style={styles.dailyMinutes}>~ {nextLesson.estimatedMinutes} MIN</Text>
        </View>
        <Text style={styles.dailyTitle}>{nextLesson.title}</Text>
        <Text style={styles.dailyDescription}>{nextLesson.subtitle}</Text>
        <View style={styles.dailyMetaRow}>
          <View style={styles.metaItem}>
            <Feather name="bar-chart-2" size={16} color={theme.sky} />
            <Text style={styles.metaText}>{nextLesson.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="layers" size={16} color={theme.sky} />
            <Text style={styles.metaText}>{nextLesson.topicId.split('-')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.xpChip}>
            <Text style={styles.xpChipText}>+40 XP</Text>
          </View>
        </View>
        <StrongButton
          label="Solve today's problem"
          onPress={() => onPractice(nextLesson.id)}
          color={theme.purple}
          icon="arrow-up-right"
        />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your momentum</Text>
        <Pressable onPress={onPaywall}>
          <Text style={styles.seeAll}>
            See insights <Feather name="chevron-right" size={14} color={theme.sky} />
          </Text>
        </Pressable>
      </View>
      <View style={styles.momentumCard}>
        <View style={styles.momentumNumber}>
          <Text style={styles.momentumBig}>{Math.min(7, repsCompleted)}</Text>
          <Text style={styles.momentumUnit}>/ 7</Text>
          <Text style={styles.momentumCaption}>reps this week</Text>
        </View>
        <View style={styles.weekBars}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <View key={`${day}-${index}`} style={styles.weekDay}>
              <View
                style={[
                  styles.weekBarTrack,
                  index < Math.min(7, repsCompleted) && styles.weekBarDone,
                  index === Math.min(6, repsCompleted) && styles.weekBarToday,
                ]}
              />
              <Text style={[styles.weekDayText, index === Math.min(6, repsCompleted) && styles.weekDayToday]}>
                {day}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.unlockRow}>
        <View style={styles.unlockIcon}>
          <Feather name="lock" size={16} color={theme.purpleDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.unlockTitle}>Unlock personalized insights</Text>
          <Text style={styles.unlockSub}>See where your patterns are getting stronger.</Text>
        </View>
        <Pressable onPress={onPaywall}>
          <Feather name="chevron-right" size={18} color={theme.purpleDark} />
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  greetingBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.card, borderRadius: 22, padding: 18, borderWidth: 1.5, borderBottomWidth: 4.5, borderColor: theme.line, borderBottomColor: '#CBD5E1', marginTop: 4 },
  greetingCopy: { flex: 1, gap: 4 },
  greeting: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 26, letterSpacing: -0.5 },
  greetingSub: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  streakBadgeInline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start', borderWidth: 1, borderBottomWidth: 2.5, borderColor: '#DDD6FE', borderBottomColor: '#7C3AED' },
  streakNumberInline: { color: '#7C3AED', fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 0.5 },
  dailyCard: { backgroundColor: theme.card, borderRadius: 24, borderWidth: 2, borderBottomWidth: 5, borderBottomColor: '#CBD5E1', borderColor: theme.line, padding: 20, gap: 14 },
  dailyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#F5F3FF' },
  tagText: { color: '#7C3AED', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.7 },
  dailyMinutes: { color: theme.mutedForeground, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 0.8 },
  dailyTitle: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 30, letterSpacing: -0.8 },
  dailyDescription: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: -6 },
  dailyMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: theme.navy, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  xpChip: { marginLeft: 'auto', backgroundColor: theme.yellow, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderBottomWidth: 2.5, borderColor: '#DDA900' },
  xpChipText: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', color: theme.ink, fontSize: 20, letterSpacing: -0.4 },
  seeAll: { color: theme.purple, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  momentumCard: { backgroundColor: theme.card, borderRadius: 20, borderWidth: 1.5, borderBottomWidth: 4, borderBottomColor: '#CBD5E1', borderColor: theme.line, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 17 },
  momentumNumber: { minWidth: 70 },
  momentumBig: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 32, letterSpacing: -1 },
  momentumUnit: { color: theme.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 13, position: 'absolute', left: 28, bottom: 5 },
  momentumCaption: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: -1 },
  weekBars: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 },
  weekDay: { alignItems: 'center', gap: 7 },
  weekBarTrack: { width: 19, height: 50, borderRadius: 8, backgroundColor: theme.line },
  weekBarDone: { height: 58, backgroundColor: theme.purple },
  weekBarToday: { height: 70, backgroundColor: theme.yellow, borderWidth: 2, borderColor: theme.yellowDark },
  weekDayText: { color: theme.mutedForeground, fontFamily: 'Nunito_800ExtraBold', fontSize: 10 },
  weekDayToday: { color: theme.yellowDark },
  unlockRow: { backgroundColor: theme.lavenderWash, padding: 13, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderBottomWidth: 3, borderColor: '#DDD6FE', borderBottomColor: '#C4B5FD' },
  unlockIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#E1DAFF', alignItems: 'center', justifyContent: 'center' },
  unlockTitle: { color: theme.purpleDark, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 },
  unlockSub: { color: theme.purpleDark, opacity: 0.7, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
});
