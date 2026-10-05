import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@/components/ui/AppIcon';
import { StrongButton, IconButton, ProgressBar } from '@/components/ui/Buttons';
import { Mascot } from '@/components/ui/Mascot';
import { ScreenShell } from '@/components/layout/ScreenShell';
import { theme } from '@/constants/theme';
import type { useAppUpdates } from '@/hooks/useAppUpdates';
import type { UserAccount, UserProfile, UserProgress } from '@/services/turso';
import type { Tab } from '@/types/navigation';

export function ProfileScreen({
  user, profile, progress, updates, onSignOut, onNav, onPaywall,
}: {
  user?: UserAccount | null; profile?: UserProfile | null; progress?: UserProgress | null;
  updates?: ReturnType<typeof useAppUpdates>; onSignOut?: () => void; onNav: (tab: Tab) => void; onPaywall: () => void;
}) {
  const streak = progress?.streakCount || 1;
  const xp = progress?.xp || 0;
  const repsCompleted = Array.isArray(progress?.completedLessons) ? progress.completedLessons.length : 0;
  const weekReps = Math.min(7, repsCompleted);
  const consistencyPct = Math.round((weekReps / 7) * 100);

  return (
    <ScreenShell bottomNav activeTab="profile">
      <View style={styles.profileHeader}><IconButton icon="settings" onPress={() => undefined} /><Text style={styles.profileHeaderTitle}>Your profile</Text><IconButton icon="share-2" onPress={() => undefined} /></View>
      <View style={styles.profileIdentity}>
        <View style={styles.avatarLarge}><Mascot pose={(user?.avatarPose as any) || 'accepted'} size={68} /></View>
        <Text style={styles.profileName}>{user?.displayName || 'Alex Morgan'}</Text>
        <Text style={styles.profileSince}>@{user?.username || 'alex_code'}</Text>
      </View>
      <View style={styles.companionCard}>
        <Mascot pose="speedrun" size={72} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.companionTitle}>Coding Companion: Kai</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.companionSub}>Streak Buddy · {streak} Day Streak</Text>
            <Image source={require('@/assets/images/streak_emoji.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />
          </View>
        </View>
        <View style={styles.companionBadge}><Text style={styles.companionBadgeText}>ACTIVE</Text></View>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.profileStat}>
          <Image source={require('@/assets/images/streak_emoji.png')} style={{ width: 22, height: 22, marginBottom: 2 }} resizeMode="contain" />
          <Text style={styles.profileStatValue}>{streak}</Text><Text style={styles.profileStatLabel}>day streak</Text>
        </View>
        <View style={styles.profileStat}>
          <Feather name="star" size={20} color={theme.yellowDark} strokeWidth={2.8} />
          <Text style={styles.profileStatValue}>{xp.toLocaleString()}</Text><Text style={styles.profileStatLabel}>total XP</Text>
        </View>
        <View style={styles.profileStat}>
          <Feather name="check-circle" size={20} color={theme.purple} strokeWidth={2.8} />
          <Text style={styles.profileStatValue}>{repsCompleted}</Text><Text style={styles.profileStatLabel}>reps solved</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Weekly consistency</Text><Text style={styles.seeAll}>This week</Text></View>
      <View style={styles.consistencyCard}>
        <View style={styles.consistencyTop}><Text style={styles.consistencyTitle}>You're building a real habit.</Text><Text style={styles.consistencyPercent}>{consistencyPct}%</Text></View>
        <ProgressBar value={consistencyPct / 100} color={theme.mintDark} height={12} />
        <Text style={styles.consistencyNote}>{weekReps} out of 7 daily reps completed</Text>
      </View>
      <View style={styles.proBadgeCard}><View style={styles.proIcon}><Feather name="award" size={24} color={theme.purpleDark} strokeWidth={2.6} /></View><View style={{ flex: 1 }}><Text style={styles.proTitle}>Get more from your reps</Text><Text style={styles.proSub}>Unlock smart review plans and deeper stats.</Text></View><Pressable onPress={onPaywall}><Feather name="chevron-right" size={20} color={theme.purpleDark} /></Pressable></View>

      <Text style={styles.settingsLabel}>TURSO DATABASE & ONBOARDING DATA</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingsRow}><Feather name="database" size={18} color={theme.purple} /><Text style={styles.settingsText}>Database Engine</Text><Text style={styles.settingsValue}>Turso Edge DB</Text></View>
        <View style={styles.settingsRow}><Feather name={'clock' as any} size={18} color={theme.mutedForeground} /><Text style={styles.settingsText}>Daily Practice Goal</Text><Text style={styles.settingsValue}>{profile?.dailyGoalMinutes || 10} min / day</Text></View>
        <View style={styles.settingsRow}><Feather name="layers" size={18} color={theme.mutedForeground} /><Text style={styles.settingsText}>Selected Tracks</Text><Text style={styles.settingsValue}>{(profile?.prioritySubjects || ['dsa']).join(', ').toUpperCase()}</Text></View>
      </View>

      <Text style={styles.settingsLabel}>APP VERSION & OVER-THE-AIR UPDATES</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingsRow}><Feather name="download-cloud" size={18} color={theme.purple} /><Text style={styles.settingsText}>EAS Update Channel</Text><Text style={styles.settingsValue}>preview (Live)</Text></View>
        <View style={styles.settingsRow}><Feather name="git-commit" size={18} color={theme.mutedForeground} /><Text style={styles.settingsText}>Release Build ID</Text><Text style={styles.settingsValue}>{updates?.updateId ? updates.updateId.slice(0, 8) : 'Embedded v1.0'}</Text></View>
        {updates?.statusMessage ? (<View style={styles.updateStatusNotice}><Feather name="info" size={14} color={theme.purpleDark} /><Text style={styles.updateStatusNoticeText}>{updates.statusMessage}</Text></View>) : null}
        <Pressable
          disabled={updates?.checking || updates?.downloading}
          onPress={() => { if (updates?.updateReady) { void updates.reload(); } else if (updates?.check) { void updates.check(); } }}
          style={styles.checkUpdateBtn}
        >
          <Feather name={updates?.checking || updates?.downloading ? 'loader' : 'refresh-cw'} size={16} color="#FFFFFF" />
          <Text style={styles.checkUpdateBtnText}>
            {updates?.checking ? 'Checking for updates...' : updates?.downloading ? 'Downloading update...' : updates?.updateReady ? 'Update ready! Tap to reload' : 'Check for updates'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.settingsLabel}>ACCOUNT ACTIONS</Text>
      <View style={styles.settingsCard}>
        <Pressable onPress={onSignOut} style={styles.settingsRow}>
          <Feather name="log-out" size={18} color="#DC2626" /><Text style={[styles.settingsText, { color: '#DC2626' }]}>Sign out of KaiCode</Text><Feather name="chevron-right" size={17} color="#DC2626" />
        </Pressable>
      </View>
    </ScreenShell>
  );
}

export function PaywallScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell scroll={false}>
      <View style={styles.paywall}>
        <View style={styles.paywallTop}><IconButton icon="x" onPress={onBack} /><View style={styles.proPill}><Feather name="star" size={15} color={theme.purpleDark} fill={theme.purpleDark} /><Text style={styles.proPillText}>KAICODE PRO</Text></View><View style={{ width: 44 }} /></View>
        <View style={styles.paywallArt}><Mascot pose="mindblown" size={145} /></View>
        <Text style={styles.paywallTitle}>Make every rep{'\n'}count more.</Text>
        <Text style={styles.paywallBody}>Keep your momentum with personalized review plans, pattern insights, and unlimited practice.</Text>
        <View style={styles.benefitList}>
          {['Smart review plan built for you', 'See your strongest patterns', 'Unlimited daily practice'].map((benefit) => <View key={benefit} style={styles.benefitRow}><View style={styles.benefitCheck}><Feather name="check" size={14} color={theme.card} strokeWidth={3} /></View><Text style={styles.benefitText}>{benefit}</Text></View>)}
        </View>
        <View style={styles.priceRow}><View><Text style={styles.price}>$6.99 <Text style={styles.priceUnit}>/ month</Text></Text><Text style={styles.priceFine}>Cancel anytime</Text></View><Text style={styles.priceSave}>7 DAY FREE TRIAL</Text></View>
        <StrongButton label="Start free trial" onPress={onBack} color={theme.purple} icon="arrow-right" />
        <Text style={styles.paywallFine}>By continuing, you agree to the Terms and Privacy Policy.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_800ExtraBold', color: theme.ink, fontSize: 20, letterSpacing: -0.4 },
  seeAll: { color: theme.purple, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileHeaderTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 17 },
  profileIdentity: { alignItems: 'center', gap: 7, marginTop: 7 },
  avatarLarge: { width: 85, height: 85, borderRadius: 30, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }], position: 'relative' },
  profileName: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.6 },
  profileSince: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12 },
  companionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1.5, borderBottomWidth: 4, borderColor: theme.line, borderBottomColor: '#CBD5E1', padding: 14, marginTop: 16, marginBottom: 10 },
  companionTitle: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 16 },
  companionSub: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 2 },
  companionBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10, borderWidth: 1.5, borderColor: '#DDD6FE' },
  companionBadgeText: { color: '#7C3AED', fontFamily: 'Nunito_800ExtraBold', fontSize: 11 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  profileStat: { flex: 1, borderRadius: 16, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, padding: 12, gap: 6 },
  profileStatValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 20 },
  profileStatLabel: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10 },
  consistencyCard: { backgroundColor: '#F5F3FF', borderRadius: 18, padding: 16, gap: 11 },
  consistencyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  consistencyTitle: { color: theme.purple, fontFamily: 'Inter_700Bold', fontSize: 14 },
  consistencyPercent: { color: theme.purple, fontFamily: 'Inter_700Bold', fontSize: 18 },
  consistencyNote: { color: theme.purpleDark, fontFamily: 'Inter_400Regular', fontSize: 11 },
  proBadgeCard: { backgroundColor: theme.lavenderWash, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  proIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#E1DAFF', alignItems: 'center', justifyContent: 'center' },
  proTitle: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 13 },
  proSub: { color: theme.purpleDark, opacity: 0.72, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  settingsLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1, marginTop: -3 },
  settingsCard: { borderRadius: 17, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, overflow: 'hidden' },
  settingsRow: { minHeight: 53, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: theme.line },
  settingsText: { color: theme.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  settingsValue: { color: theme.purple, fontFamily: 'Inter_700Bold', fontSize: 12 },
  updateStatusNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F5F3FF', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#DDD6FE', marginTop: 8 },
  updateStatusNoticeText: { color: '#6D28D9', fontFamily: 'Inter_500Medium', fontSize: 12, flex: 1 },
  checkUpdateBtn: { backgroundColor: '#7C3AED', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, borderBottomWidth: 3.5, borderBottomColor: '#5B21B6' },
  checkUpdateBtnText: { color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 13 },
  // Paywall styles
  paywall: { flex: 1, justifyContent: 'space-between', gap: 10 },
  paywallTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  proPill: { backgroundColor: theme.lavenderWash, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 5 },
  proPillText: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8 },
  paywallArt: { alignItems: 'center', justifyContent: 'center', height: 170, position: 'relative' },
  paywallTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 32, lineHeight: 35, letterSpacing: -1.1 },
  paywallBody: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  benefitList: { gap: 10, marginTop: 3 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitCheck: { width: 24, height: 24, borderRadius: 8, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  benefitText: { color: theme.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  priceRow: { backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 21 },
  priceUnit: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  priceFine: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2 },
  priceSave: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 },
  paywallFine: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 9, textAlign: 'center', marginTop: 1 },
});
