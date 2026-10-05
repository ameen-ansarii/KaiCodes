import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@/components/ui/AppIcon';
import { StrongButton, IconButton, tapFeedback } from '@/components/ui/Buttons';
import { Mascot } from '@/components/ui/Mascot';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { theme } from '@/constants/theme';
import { getAllTopics } from '@/content';
import type { UserProgress } from '@/services/turso';
import type { Tab } from '@/types/navigation';

export function CoursePathScreen({
  topic: topicTitle,
  progress,
  onBack,
  onPractice,
  onNav,
}: {
  topic: string;
  progress?: UserProgress;
  onBack: () => void;
  onPractice: (lessonId?: string) => void;
  onNav?: (tab: Tab) => void;
}) {
  const allTopics = getAllTopics();
  const currentTopic = useMemo(() => {
    return (
      allTopics.find(
        (t) =>
          t.title.toLowerCase() === topicTitle.toLowerCase() ||
          t.id === topicTitle ||
          t.title.toLowerCase().includes(topicTitle.toLowerCase())
      ) || allTopics[0]
    );
  }, [allTopics, topicTitle]);

  const lessons = currentTopic.lessons;
  const completed = Array.isArray(progress?.completedLessons) ? progress.completedLessons : [];
  const completedCount = lessons.filter((l) => completed.includes(l.id)).length;
  const pctComplete = Math.round((completedCount / Math.max(1, lessons.length)) * 100);

  return (
    <ScreenShell bottomNav={!!onNav} onNav={onNav} activeTab="course">
      <View style={styles.courseTop}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text style={styles.courseTopLabel}>COURSE MAP</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={styles.courseHero}>
        <View style={[styles.courseHeroIcon, { backgroundColor: currentTopic.accentColor }]}>
          <Feather name={currentTopic.icon as any} size={27} color={theme.card} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.courseEyebrow}>ACTIVE COURSE</Text>
          <Text style={styles.courseTitle}>{currentTopic.title}</Text>
          <Text style={styles.courseSub}>{currentTopic.description}</Text>
        </View>
        <View style={styles.courseProgress}>
          <Text style={styles.courseProgressNumber}>{completedCount}</Text>
          <Text style={styles.courseProgressLabel}>/ {lessons.length}</Text>
        </View>
      </View>

      <View style={styles.courseSectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Your learning path</Text>
          <Text style={styles.courseSectionSub}>Master one pattern at a time.</Text>
        </View>
        <Text style={styles.topicCount}>{pctComplete}% complete</Text>
      </View>
      <View style={styles.windingPathContainer}>
        {lessons.map((lesson, index) => {
          const isDone = completed.includes(lesson.id);
          const isPrevDone = index === 0 || completed.includes(lessons[index - 1].id);
          const isCurrent = !isDone && isPrevDone;
          const locked = !isDone && !isCurrent;
          const offsets = [0, 48, 0, -48, 0];
          const xOffset = offsets[index % offsets.length];
          const nodeBg = isDone ? theme.purple : isCurrent ? theme.purple : '#E2E8F0';
          const nodeBorderColor = isDone ? '#5B21B6' : isCurrent ? '#6D28D9' : '#CBD5E1';

          return (
            <View key={lesson.id} style={[styles.windingNodeRow, { transform: [{ translateX: xOffset }] }]}>
              {index < lessons.length - 1 ? (
                <View style={[styles.windingConnector, isDone && styles.windingConnectorDone]} />
              ) : null}
              {isCurrent ? (
                <View style={styles.pathMascotAnchor}>
                  <Mascot pose="coding" size={88} withPedestal stars={2} />
                </View>
              ) : null}
              <View style={styles.nodeWithTooltip}>
                {isCurrent ? (
                  <View style={styles.startTooltip}>
                    <Text style={styles.startTooltipText}>START</Text>
                    <View style={styles.startTooltipTail} />
                  </View>
                ) : null}
                <Pressable
                  disabled={locked}
                  onPress={() => { tapFeedback(); onPractice(lesson.id); }}
                  style={({ pressed }) => [
                    styles.windingNode,
                    {
                      backgroundColor: nodeBg,
                      borderColor: isCurrent ? theme.mintDark : nodeBorderColor,
                      borderBottomColor: nodeBorderColor,
                      borderBottomWidth: pressed ? 2 : 6,
                      transform: [{ translateY: pressed ? 4 : 0 }],
                    },
                  ]}
                >
                  {isCurrent ? <View style={styles.windingRingActive} /> : null}
                  <Feather name={isDone ? 'check' : isCurrent ? 'star' : 'lock'} size={26} color={locked ? '#94A3B8' : '#FFFFFF'} />
                </Pressable>
              </View>
              <View style={[styles.windingNodeBadge, isCurrent && styles.windingNodeBadgeActive]}>
                <Text style={[styles.windingNodeTitle, isCurrent && styles.windingNodeTitleActive]}>{lesson.title}</Text>
                <Text style={styles.windingNodeDetail}>{lesson.difficulty} · ~{lesson.estimatedMinutes}m</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.courseCallout}>
        <View style={styles.courseCalloutIcon}><Feather name="star" size={16} color={theme.yellowDark} /></View>
        <Text style={styles.courseCalloutText}>Complete reps daily to build interview muscle memory with Kai.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  courseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  courseTopLabel: { color: '#64748B', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  courseHero: { backgroundColor: theme.purple, borderRadius: 21, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: theme.purpleDark, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  courseHeroIcon: { width: 53, height: 53, borderRadius: 17, backgroundColor: theme.purpleDark, alignItems: 'center', justifyContent: 'center' },
  courseEyebrow: { color: theme.card, opacity: 0.8, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  courseTitle: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 22, marginTop: 2 },
  courseSub: { color: theme.card, opacity: 0.85, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  courseProgress: { width: 49, height: 49, borderRadius: 17, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  courseProgressNumber: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 19, lineHeight: 20 },
  courseProgressLabel: { color: theme.purpleDark, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  courseSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  courseSectionSub: { color: '#64748B', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 3 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', color: theme.ink, fontSize: 20, letterSpacing: -0.4 },
  topicCount: { color: '#64748B', fontFamily: 'Inter_500Medium', fontSize: 12 },
  windingPathContainer: { paddingVertical: 20, alignItems: 'center', gap: 28 },
  windingNodeRow: { alignItems: 'center', position: 'relative', width: '100%' },
  windingConnector: { position: 'absolute', top: 65, width: 6, height: 42, backgroundColor: '#E2E8F0', borderRadius: 3, zIndex: 0 },
  windingConnectorDone: { backgroundColor: theme.purple },
  windingNode: { width: 72, height: 72, borderRadius: 36, borderWidth: 2.5, borderBottomWidth: 6, alignItems: 'center', justifyContent: 'center', zIndex: 2, position: 'relative' },
  windingRingActive: { position: 'absolute', width: 88, height: 88, borderRadius: 44, borderWidth: 3.5, borderColor: '#A78BFA', borderStyle: 'dashed' },
  windingNodeBadge: { marginTop: 9, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', borderBottomWidth: 3.5, borderBottomColor: '#CBD5E1', paddingVertical: 6, paddingHorizontal: 13, alignItems: 'center', maxWidth: 220, zIndex: 3 },
  windingNodeBadgeActive: { borderColor: theme.purple, borderBottomColor: '#5B21B6', backgroundColor: '#F5F3FF' },
  windingNodeTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: '#0F172A', textAlign: 'center' },
  windingNodeTitleActive: { color: theme.purple },
  windingNodeDetail: { fontFamily: 'Inter_500Medium', fontSize: 10, color: '#64748B', marginTop: 1, textAlign: 'center' },
  pathMascotAnchor: { position: 'absolute', left: -94, top: -10, zIndex: 15 },
  nodeWithTooltip: { alignItems: 'center', position: 'relative' },
  startTooltip: { position: 'absolute', top: -38, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, borderWidth: 2, borderColor: '#DDD6FE', borderBottomWidth: 3.5, borderBottomColor: '#7C3AED', zIndex: 20, alignItems: 'center', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  startTooltipText: { color: '#7C3AED', fontFamily: 'Nunito_900Black', fontSize: 12, letterSpacing: 0.8 },
  startTooltipTail: { position: 'absolute', bottom: -6, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#7C3AED' },
  courseCallout: { backgroundColor: '#F5F3FF', borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderBottomWidth: 3, borderColor: '#DDD6FE', borderBottomColor: '#7C3AED' },
  courseCalloutIcon: { width: 29, height: 29, borderRadius: 9, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  courseCalloutText: { flex: 1, color: '#7C3AED', fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 17 },
});
