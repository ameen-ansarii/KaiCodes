import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, Pressable, Animated, RefreshControl, StyleSheet } from 'react-native';
import { Feather } from '@/components/ui/AppIcon';
import { StrongButton } from '@/components/ui/Buttons';
import { Mascot, LogoLockup } from '@/components/ui/Mascot';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { theme } from '@/constants/theme';
import { getGlobalLeaderboard, type LeaderboardRank, type UserAccount } from '@/services/turso';
import type { Tab } from '@/types/navigation';

export function LeaderboardScreen({ user, onNav, onPractice }: { user?: UserAccount | null; onNav: (tab: Tab) => void; onPractice: () => void }) {
  const [ranks, setRanks] = useState<LeaderboardRank[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRanks = useCallback(async () => {
    try { const data = await getGlobalLeaderboard(user?.id); setRanks(data); } catch (err) { console.warn('Leaderboard load error:', err); }
  }, [user?.id]);

  useEffect(() => { fetchRanks(); }, [fetchRanks]);

  const onRefresh = async () => { setRefreshing(true); await fetchRanks(); setRefreshing(false); };
  const userRankItem = ranks.find((r) => r.isUser);
  const userRank = userRankItem?.rank || 4;
  const userXp = userRankItem?.xp || 0;
  const targetAbove = ranks.find((r) => r.rank === userRank - 1);
  const diffXp = targetAbove ? Math.max(10, targetAbove.xp - userXp + 10) : 0;

  return (
    <ScreenShell bottomNav onNav={onNav} activeTab="leaderboard" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />}>
      <View style={styles.leagueHeroCard}>
        <View style={styles.leagueHeroTop}>
          <View style={styles.leagueBadgeWrap}><Feather name="award" size={26} color="#FFFFFF" strokeWidth={2.8} /></View>
          <View style={{ flex: 1 }}>
            <View style={styles.leagueTimerRow}><Feather name={'clock' as any} size={13} color="#DDD6FE" /><Text style={styles.leagueTimerText}>Live Weekly League</Text></View>
            <Text style={styles.leagueTitle}>Obsidian League</Text>
          </View>
          <Pressable onPress={onRefresh} style={styles.refreshBtn} accessibilityLabel="Refresh rankings"><Feather name="trending-up" size={18} color="#7C3AED" /></Pressable>
        </View>
        <Text style={styles.leagueSubtitle}>Top 10 engineers promote to Diamond League on Sunday.</Text>
      </View>

      <View style={styles.userRankBanner}>
        <Mascot pose={(user?.avatarPose as any) || 'accepted'} size={54} />
        <View style={{ flex: 1 }}>
          <Text style={styles.userRankHeading}>{userRank <= 10 ? `You're #${userRank} in Promotion Zone!` : `You're #${userRank} in Obsidian League`}</Text>
          <Text style={styles.userRankSub}>{targetAbove ? `${diffXp} XP behind #${userRank - 1} ${targetAbove.name}. Solve 1 rep to climb.` : `You're leading the league! Keep practicing to stay #1.`}</Text>
        </View>
        <Pressable onPress={onPractice} style={styles.climbBtn}><Text style={styles.climbBtnText}>Solve</Text><Feather name="arrow-up-right" size={14} color="#FFFFFF" /></Pressable>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Weekly Standings</Text><Text style={styles.topicCount}>{ranks.length} Engineers</Text></View>

      <View style={styles.leaderboardList}>
        {ranks.map((item, index) => {
          const isTopThree = item.rank <= 3;
          return (
            <React.Fragment key={item.rank}>
              {index === 10 && (<View style={styles.promotionCutoffLine}><View style={styles.cutoffPill}><Text style={styles.cutoffPillText}>PROMOTION ZONE (TOP 10)</Text></View></View>)}
              <View style={[styles.rankRow, item.isUser && styles.rankRowUser, isTopThree && styles.rankRowTopThree]}>
                <View style={styles.rankNumberBox}>{item.badge ? (<Text style={styles.rankMedalText}>{item.badge}</Text>) : (<Text style={[styles.rankNumberText, item.isUser && styles.rankNumberTextUser]}>{item.rank}</Text>)}</View>
                <View style={styles.rankAvatar}><Mascot pose={(item.avatarPose as any) || 'accepted'} size={36} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rankName, item.isUser && styles.rankNameUser]}>{item.name}</Text>
                  <View style={styles.rankMetaRow}>
                    <Image source={require('@/assets/images/streak_emoji.png')} style={{ width: 13, height: 13 }} resizeMode="contain" />
                    <Text style={styles.rankStreakText}>{item.streak} days</Text>
                  </View>
                </View>
                <View style={styles.rankXpBadge}><Text style={styles.rankXpValue}>{item.xp}</Text><Text style={styles.rankXpLabel}>XP</Text></View>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </ScreenShell>
  );
}

export function RewardScreen({ onContinue, streak = 1 }: { onContinue: () => void; streak?: number }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 110 }),
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
    ]).start();
    void (async () => { const Haptics = await import('expo-haptics'); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); })();
  }, [opacity, scale]);

  return (
    <ScreenShell scroll={false}>
      <View style={styles.rewardScreen}>
        <View style={styles.rewardTop}><LogoLockup compact /><Text style={styles.rewardTopLabel}>REP COMPLETE</Text></View>
        <View style={styles.confetti} pointerEvents="none">
          {[...Array(12)].map((_, index) => <View key={index} style={[styles.confettiPiece, { left: `${10 + ((index * 17) % 80)}%`, top: `${10 + ((index * 23) % 27)}%`, backgroundColor: [theme.sky, theme.yellow, theme.coral, theme.purple][index % 4], transform: [{ rotate: `${index * 27}deg` }] }]} />)}
        </View>
        <Animated.View style={[styles.rewardContent, { transform: [{ scale }], opacity }]}>
          <Mascot pose="accepted" size={210} style={{ marginBottom: 14 }} />
          <Text style={styles.rewardTitle}>Accepted!</Text>
          <Text style={styles.rewardSubtitle}>100% test cases passed. Kai says: "Clean O(n) rep!"</Text>
          <View style={styles.rewardStats}>
            <View style={styles.rewardStat}><Text style={styles.rewardStatValue}>+40</Text><Text style={styles.rewardStatLabel}>XP EARNED</Text></View>
            <View style={styles.rewardDivider} />
            <View style={styles.rewardStat}><Text style={styles.rewardStatValue}>{streak}</Text><Text style={styles.rewardStatLabel}>DAY STREAK</Text></View>
          </View>
          <View style={styles.streakCallout}>
            <Image source={require('@/assets/images/streak_emoji.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
            <Text style={styles.streakCalloutText}>Your streak is safe for another day.</Text>
          </View>
        </Animated.View>
        <View style={styles.rewardBottom}><StrongButton label="Back to today" onPress={onContinue} color={theme.purple} icon="arrow-right" /></View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', color: theme.ink, fontSize: 20, letterSpacing: -0.4 },
  topicCount: { color: '#64748B', fontFamily: 'Inter_500Medium', fontSize: 12 },
  leagueHeroCard: { backgroundColor: '#7C3AED', borderRadius: 22, padding: 18, gap: 10, borderBottomWidth: 5, borderBottomColor: '#5B21B6', shadowColor: '#5B21B6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6 },
  leagueHeroTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  leagueBadgeWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#5B21B6', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#9333EA' },
  leagueTimerRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  leagueTimerText: { color: '#DDD6FE', fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 0.4 },
  leagueTitle: { color: '#FFFFFF', fontFamily: 'Nunito_900Black', fontSize: 22, letterSpacing: -0.5 },
  leagueSubtitle: { color: '#EDE9FE', fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17 },
  refreshBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  userRankBanner: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: '#DDD6FE', borderBottomWidth: 3.5, borderBottomColor: '#7C3AED' },
  userRankHeading: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#7C3AED' },
  userRankSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#475569', marginTop: 2 },
  climbBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  climbBtnText: { color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 11 },
  leaderboardList: { gap: 9, paddingBottom: 24 },
  rankRow: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E2E8F0', borderBottomWidth: 2.5, borderBottomColor: '#CBD5E1' },
  rankRowUser: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', borderBottomColor: '#7C3AED', borderWidth: 1.5 },
  rankRowTopThree: { borderColor: '#FEF08A', borderBottomColor: '#FACC15' },
  rankNumberBox: { width: 26, alignItems: 'center', justifyContent: 'center' },
  rankMedalText: { fontSize: 18 },
  rankNumberText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#64748B' },
  rankNumberTextUser: { color: '#7C3AED' },
  rankAvatar: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  rankName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#0F172A' },
  rankNameUser: { color: '#7C3AED' },
  rankMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  rankStreakText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#64748B' },
  rankXpBadge: { alignItems: 'flex-end' },
  rankXpValue: { fontFamily: 'Nunito_900Black', fontSize: 15, color: '#0F172A' },
  rankXpLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#94A3B8' },
  promotionCutoffLine: { alignItems: 'center', marginVertical: 6 },
  cutoffPill: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  cutoffPillText: { color: '#059669', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.8 },
  // Reward styles
  rewardScreen: { flex: 1, justifyContent: 'space-between' },
  rewardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rewardTopLabel: { color: theme.purple, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, fontSize: 10 },
  rewardContent: { alignItems: 'center', marginTop: -20 },
  rewardTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 35, letterSpacing: -1.2, marginTop: 25 },
  rewardSubtitle: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 15, marginTop: 7 },
  rewardStats: { marginTop: 30, flexDirection: 'row', alignItems: 'center', gap: 26 },
  rewardStat: { alignItems: 'center', gap: 2 },
  rewardStatValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 29 },
  rewardStatLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  rewardDivider: { width: 1, height: 43, backgroundColor: theme.line },
  streakCallout: { marginTop: 29, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: '#F5F3FF', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderBottomWidth: 3, borderColor: '#DDD6FE', borderBottomColor: '#7C3AED' },
  streakCalloutText: { color: '#7C3AED', fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  rewardBottom: { gap: 10 },
  confetti: { ...(StyleSheet.absoluteFill as any) },
  confettiPiece: { position: 'absolute', width: 10, height: 17, borderRadius: 3 },
});
