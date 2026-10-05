import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@/components/ui/AppIcon';
import { IconButton, tapFeedback } from '@/components/ui/Buttons';
import { Mascot } from '@/components/ui/Mascot';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { SubjectPicker } from '@/components/SubjectPicker';
import { theme } from '@/constants/theme';
import { getAllSubjects, getSubjectById } from '@/content';
import type { SubjectId } from '@/types/content';
import type { Tab } from '@/types/navigation';

function Ring({ progress, color, size = 82 }: { progress: number; color: string; size?: number }) {
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: theme.line }]}>
      <View style={[styles.ringArc, { width: size, height: size, borderRadius: size / 2, borderColor: color, borderRightColor: 'transparent', borderBottomColor: progress > 0.5 ? color : 'transparent', transform: [{ rotate: `${-45 + progress * 360}deg` }] }]} />
      <Text style={[styles.ringText, { color }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

export function TopicsScreen({ onNav, onTopic }: { onNav: (tab: Tab) => void; onTopic: (topic: string) => void }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('dsa');
  const subjects = getAllSubjects();
  const currentSubject = getSubjectById(selectedSubjectId) || subjects[0];

  return (
    <ScreenShell bottomNav onNav={onNav} activeTab="topics">
      <View style={styles.pageTop}><View><Text style={styles.eyebrow}>CURRICULUM</Text><Text style={styles.pageTitle}>Explore Subjects</Text></View><IconButton icon="search" onPress={() => undefined} /></View>
      <Text style={styles.pageBody}>Switch between engineering disciplines to build deep problem-solving intuition.</Text>

      <SubjectPicker subjects={subjects} selectedSubjectId={selectedSubjectId} onSelectSubject={setSelectedSubjectId} />

      <View style={[styles.topicFeatured, { backgroundColor: currentSubject.accentColor, shadowColor: currentSubject.darkColor, borderBottomColor: currentSubject.darkColor }]}>
        <View style={[styles.featuredIcon, { backgroundColor: currentSubject.darkColor }]}>
          <Feather name={currentSubject.icon as any} size={25} color={theme.card} strokeWidth={3} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.featuredLabel, { color: currentSubject.labelColor || '#DDD6FE' }]}>ACTIVE SUBJECT</Text>
          <Text style={styles.featuredTitle}>{currentSubject.title}</Text>
          <Text style={[styles.featuredSub, { color: currentSubject.subTextColor || '#EDE9FE' }]}>{currentSubject.tagline}</Text>
        </View>
        <Mascot pose="point_right" size={68} style={{ alignSelf: 'center', marginRight: -4 }} />
      </View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Topics in {currentSubject.title}</Text><Text style={styles.topicCount}>{currentSubject.topics.length} topics</Text></View>
      <View style={styles.topicGrid}>
        {currentSubject.topics.map((topic) => (
          <Pressable key={topic.id} onPress={() => { tapFeedback(); onTopic(topic.title); }} style={styles.topicCard}>
            <Ring progress={topic.completedLessons / Math.max(1, topic.totalLessons)} color={topic.accentColor} />
            <Text style={styles.topicName}>{topic.title}</Text>
            <Text style={styles.topicProgress}>{topic.completedLessons} / {topic.totalLessons} lessons</Text>
            <View style={[styles.topicMiniIcon, { backgroundColor: `${topic.accentColor}18` }]}><Feather name={topic.icon as any} size={15} color={topic.accentColor} strokeWidth={2.5} /></View>
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pageTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontFamily: 'Nunito_800ExtraBold', color: theme.purple, letterSpacing: 1.4, fontSize: 11 },
  pageTitle: { fontFamily: 'Nunito_900Black', fontSize: 32, letterSpacing: -0.8, color: theme.ink },
  pageBody: { fontFamily: 'Inter_400Regular', color: theme.mutedForeground, fontSize: 16, lineHeight: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', color: theme.ink, fontSize: 20, letterSpacing: -0.4 },
  topicCount: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  topicFeatured: { backgroundColor: theme.purple, borderRadius: 21, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 5, borderBottomColor: theme.purpleDark, shadowColor: theme.purpleDark, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  featuredIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: theme.purpleDark, alignItems: 'center', justifyContent: 'center' },
  featuredLabel: { color: '#DDD6FE', fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  featuredTitle: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 3, marginBottom: 9 },
  featuredSub: { color: '#EDE9FE', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 7 },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  topicCard: { width: '48%', backgroundColor: theme.card, borderRadius: 19, borderWidth: 1.5, borderColor: theme.line, padding: 14, minHeight: 170, alignItems: 'center', gap: 5 },
  topicName: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 2, textAlign: 'center' },
  topicProgress: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11 },
  topicMiniIcon: { position: 'absolute', right: 11, top: 11, width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  ring: { alignItems: 'center', justifyContent: 'center', borderWidth: 7, position: 'relative', overflow: 'hidden' },
  ringArc: { position: 'absolute', borderWidth: 7 },
  ringText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
});
