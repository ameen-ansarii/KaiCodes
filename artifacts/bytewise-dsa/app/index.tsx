import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '@/constants/colors';

type Theme = typeof colors.light;
type Screen = 'onboarding' | 'goals' | 'home' | 'practice' | 'reward' | 'topics' | 'profile' | 'paywall';
type Tab = 'home' | 'topics' | 'profile';

const theme = colors.light as Theme;
const { width: windowWidth } = Dimensions.get('window');
const isCompact = windowWidth < 380;

const iconMap = {
  star: 'star',
  zap: 'lightning-bolt',
  bell: 'bell-outline',
  code: 'code-tags',
  home: 'home',
  compass: 'compass-outline',
  user: 'account-outline',
  'arrow-right': 'arrow-right',
  'arrow-left': 'arrow-left',
  x: 'close',
  coffee: 'coffee',
  sun: 'white-balance-sunny',
  award: 'medal-outline',
  check: 'check',
  grid: 'view-grid-outline',
  hash: 'pound',
  move: 'cursor-move',
  layers: 'layers',
  'git-branch': 'source-branch',
  'share-2': 'share-variant',
  'arrow-up-right': 'arrow-top-right',
  'bar-chart-2': 'chart-bar',
  'chevron-right': 'chevron-right',
  lock: 'lock-outline',
  copy: 'content-copy',
  'book-open': 'book-open-variant',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  'check-circle': 'check-circle-outline',
  'trending-up': 'trending-up',
  search: 'magnify',
  settings: 'cog-outline',
} as const;
type IconName = keyof typeof iconMap;

function AppIcon({
  name,
  size = 20,
  color = theme.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}) {
  return <MaterialCommunityIcons name={iconMap[name]} size={size} color={color} />;
}

const Feather = AppIcon;

const topics = [
  { name: 'Arrays', icon: 'grid' as const, color: theme.sky, progress: 0.72, count: '18 / 25' },
  { name: 'Hash maps', icon: 'hash' as const, color: theme.purple, progress: 0.45, count: '9 / 20' },
  { name: 'Two pointers', icon: 'move' as const, color: theme.orange, progress: 0.3, count: '6 / 20' },
  { name: 'Stacks', icon: 'layers' as const, color: theme.mintDark, progress: 0.8, count: '16 / 20' },
  { name: 'Binary trees', icon: 'git-branch' as const, color: theme.coral, progress: 0.18, count: '3 / 16' },
  { name: 'Graphs', icon: 'share-2' as const, color: theme.yellowDark, progress: 0.08, count: '1 / 14' },
];

function tapFeedback() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function StrongButton({
  label,
  onPress,
  color = theme.sky,
  textColor = theme.card,
  icon,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      testID={`button-${label.toLowerCase().replace(/\s/g, '-')}`}
      onPress={() => {
        if (disabled) return;
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.strongButton,
        {
          backgroundColor: secondary ? theme.card : color,
          borderColor: secondary ? theme.line : color,
          shadowColor: secondary ? theme.line : color === theme.yellow ? theme.yellowDark : theme.skyDark,
        },
        pressed && styles.buttonPressed,
        disabled && styles.disabledButton,
      ]}
    >
      {icon ? <Feather name={icon} size={18} color={secondary ? color : textColor} strokeWidth={3} /> : null}
      <Text style={[styles.buttonLabel, { color: secondary ? color : textColor }]}>{label}</Text>
    </Pressable>
  );
}

function IconButton({
  icon,
  onPress,
  backgroundColor = theme.card,
  color = theme.ink,
}: {
  icon: IconName;
  onPress?: () => void;
  backgroundColor?: string;
  color?: string;
}) {
  return (
    <Pressable
      testID={`icon-${icon}`}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [styles.iconButton, { backgroundColor }, pressed && styles.buttonPressed]}
    >
      <Feather name={icon} size={20} color={color} strokeWidth={2.8} />
    </Pressable>
  );
}

function ProgressBar({ value, color = theme.sky, height = 10 }: { value: number; color?: string; height?: number }) {
  return (
    <View style={[styles.progressTrack, { height }]}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: color, height }]} />
    </View>
  );
}

function HeaderStats({ onProfile }: { onProfile: () => void }) {
  return (
    <View style={styles.headerStats}>
      <Pressable onPress={onProfile} style={styles.avatarTiny}>
        <Text style={styles.avatarTinyText}>A</Text>
      </Pressable>
      <View style={styles.statPill}>
        <Feather name="star" size={16} color={theme.yellowDark} fill={theme.yellowDark} />
        <Text style={styles.statValue}>1,240</Text>
      </View>
      <View style={styles.statPill}>
        <Feather name="zap" size={17} color={theme.orange} fill={theme.orange} />
        <Text style={styles.statValue}>7</Text>
      </View>
      <Pressable onPress={onProfile} style={styles.bellButton}>
        <Feather name="bell" size={18} color={theme.ink} strokeWidth={2.5} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.logoLockup, compact && styles.logoLockupCompact]}>
      <View style={styles.logoMark}>
        <Feather name="code" size={compact ? 16 : 22} color={theme.card} strokeWidth={3.2} />
      </View>
      {!compact ? <Text style={styles.logoText}>bytewise</Text> : null}
    </View>
  );
}

function Mascot({ small = false }: { small?: boolean }) {
  return (
    <View style={[styles.mascot, small && styles.mascotSmall]}>
      <View style={styles.mascotEyeRow}>
        <View style={styles.mascotEye}><View style={styles.mascotPupil} /></View>
        <View style={styles.mascotEye}><View style={styles.mascotPupil} /></View>
      </View>
      <View style={styles.mascotBeak} />
      <View style={styles.mascotWingLeft} />
      <View style={styles.mascotWingRight} />
      <View style={styles.mascotFeet}>
        <View style={styles.mascotFoot} />
        <View style={styles.mascotFoot} />
      </View>
    </View>
  );
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ key: Tab; label: string; icon: IconName }> = [
    { key: 'home', label: 'Today', icon: 'home' },
    { key: 'topics', label: 'Topics', icon: 'compass' },
    { key: 'profile', label: 'You', icon: 'user' },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <Pressable
            testID={`tab-${item.key}`}
            key={item.key}
            onPress={() => {
              tapFeedback();
              onChange(item.key);
            }}
            style={styles.navItem}
          >
            <View style={[styles.navIcon, isActive && styles.navIconActive]}>
              <Feather name={item.icon} size={20} color={isActive ? theme.sky : theme.mutedForeground} strokeWidth={isActive ? 3 : 2.2} />
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ScreenShell({
  children,
  scroll = true,
  bottomNav,
  onNav,
  activeTab = 'home',
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bottomNav?: boolean;
  onNav?: (tab: Tab) => void;
  activeTab?: Tab;
}) {
  const insets = useSafeAreaInsets();
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: bottomNav ? 112 : insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>{children}</View>
  );
  return (
    <View style={styles.screen}>
      {content}
      {bottomNav && onNav ? <BottomNav active={activeTab} onChange={onNav} /> : null}
    </View>
  );
}

function Onboarding({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenShell scroll={false}>
      <View style={styles.onboarding}>
        <LogoLockup />
        <View style={styles.onboardingArt}>
          <View style={styles.artBlob} />
          <View style={[styles.spark, styles.sparkOne]}><Text style={styles.sparkText}>+</Text></View>
          <View style={[styles.spark, styles.sparkTwo]}><Text style={styles.sparkText}>×</Text></View>
          <Mascot />
          <View style={styles.floatingCode}><Text style={styles.floatingCodeText}>{'{ }'}</Text></View>
        </View>
        <View style={styles.onboardingCopy}>
          <Text style={styles.eyebrow}>YOUR DAILY CODING COACH</Text>
          <Text style={styles.heroTitle}>Small reps.{'\n'}Big breakthroughs.</Text>
          <Text style={styles.heroBody}>Build the DSA habit in 10 minutes a day. Practice smart, stay sharp, and keep your streak alive.</Text>
        </View>
        <View style={styles.onboardingActions}>
          <StrongButton label="Start practicing" icon="arrow-right" onPress={onContinue} />
          <Text style={styles.smallNote}>No pressure. Just one problem today.</Text>
        </View>
      </View>
    </ScreenShell>
  );
}

function Goals({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState('10 min');
  const options = [
    { label: '5 min', detail: 'A quick warm-up', icon: 'coffee' as const },
    { label: '10 min', detail: 'The daily sweet spot', icon: 'sun' as const },
    { label: '20 min', detail: 'Go deeper today', icon: 'award' as const },
  ];
  return (
    <ScreenShell>
      <View style={styles.topRow}>
        <IconButton icon="arrow-left" onPress={onContinue} />
        <Text style={styles.stepLabel}>STEP 1 OF 2</Text>
        <View style={styles.stepDots}><View style={styles.stepDotActive} /><View style={styles.stepDot} /></View>
      </View>
      <View style={styles.goalIntro}>
        <Text style={styles.pageTitle}>Let’s make it a habit.</Text>
        <Text style={styles.pageBody}>How much time can you give your future self each day?</Text>
      </View>
      <View style={styles.goalList}>
        {options.map((option) => {
          const active = selected === option.label;
          return (
            <Pressable
              key={option.label}
              onPress={() => {
                tapFeedback();
                setSelected(option.label);
              }}
              style={[styles.goalCard, active && styles.goalCardActive]}
            >
              <View style={[styles.goalIcon, { backgroundColor: active ? theme.sky : theme.blueWash }]}>
                <Feather name={option.icon} size={22} color={active ? theme.card : theme.sky} strokeWidth={2.5} />
              </View>
              <View style={styles.goalCopy}>
                <Text style={[styles.goalLabel, active && styles.goalLabelActive]}>{option.label} a day</Text>
                <Text style={[styles.goalDetail, active && styles.goalDetailActive]}>{option.detail}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>{active ? <View style={styles.radioInner} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.goalBottom}>
        <Mascot small />
        <Text style={styles.goalTip}>Consistency beats intensity.</Text>
        <StrongButton label="Set my goal" onPress={onContinue} color={theme.mintDark} icon="check" />
      </View>
    </ScreenShell>
  );
}

function Home({ onPractice, onTopics, onProfile, onPaywall }: { onPractice: () => void; onTopics: () => void; onProfile: () => void; onPaywall: () => void }) {
  return (
    <ScreenShell bottomNav onNav={(tab) => tab === 'topics' ? onTopics() : tab === 'profile' ? onProfile() : undefined}>
      <HeaderStats onProfile={onProfile} />
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Good morning, Alex</Text>
          <Text style={styles.greetingSub}>Ready for a quick win?</Text>
        </View>
        <View style={styles.streakBadge}>
          <Feather name="zap" size={17} color={theme.orange} fill={theme.orange} />
          <Text style={styles.streakNumber}>7</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>
      <View style={styles.dailyCard}>
        <View style={styles.dailyCardTop}>
          <View style={styles.tag}><Text style={styles.tagText}>TODAY’S REP</Text></View>
          <Text style={styles.dailyMinutes}>~ 8 MIN</Text>
        </View>
        <Text style={styles.dailyTitle}>Two Sum</Text>
        <Text style={styles.dailyDescription}>Find two numbers that add up to a target. A classic warm-up for your problem-solving muscles.</Text>
        <View style={styles.dailyMetaRow}>
          <View style={styles.metaItem}><Feather name="bar-chart-2" size={16} color={theme.sky} /><Text style={styles.metaText}>Easy</Text></View>
          <View style={styles.metaItem}><Feather name="layers" size={16} color={theme.sky} /><Text style={styles.metaText}>Arrays</Text></View>
          <View style={styles.xpChip}><Text style={styles.xpChipText}>+40 XP</Text></View>
        </View>
        <StrongButton label="Solve today’s problem" onPress={onPractice} color={theme.sky} icon="arrow-up-right" />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your momentum</Text>
        <Pressable onPress={onPaywall}><Text style={styles.seeAll}>See insights <Feather name="chevron-right" size={14} color={theme.sky} /></Text></Pressable>
      </View>
      <View style={styles.momentumCard}>
        <View style={styles.momentumNumber}><Text style={styles.momentumBig}>4</Text><Text style={styles.momentumUnit}>/ 7</Text><Text style={styles.momentumCaption}>reps this week</Text></View>
        <View style={styles.weekBars}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <View key={`${day}-${index}`} style={styles.weekDay}>
              <View style={[styles.weekBarTrack, index < 4 && styles.weekBarDone, index === 3 && styles.weekBarToday]} />
              <Text style={[styles.weekDayText, index === 3 && styles.weekDayToday]}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.unlockRow}>
        <View style={styles.unlockIcon}><Feather name="lock" size={16} color={theme.purpleDark} /></View>
        <View style={{ flex: 1 }}><Text style={styles.unlockTitle}>Unlock personalized insights</Text><Text style={styles.unlockSub}>See where your patterns are getting stronger.</Text></View>
        <Pressable onPress={onPaywall}><Feather name="chevron-right" size={18} color={theme.purpleDark} /></Pressable>
      </View>
    </ScreenShell>
  );
}

function Practice({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [code, setCode] = useState(`function twoSum(nums, target) {\n  const seen = new Map();\n\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) {\n      return [seen.get(complement), i];\n    }\n    seen.set(nums[i], i);\n  }\n}`);
  return (
    <ScreenShell>
      <View style={styles.practiceHeader}>
        <IconButton icon="x" onPress={onBack} />
        <View style={styles.practiceProgressWrap}><Text style={styles.practiceProgressText}>1 / 3</Text><ProgressBar value={0.33} color={theme.yellow} height={8} /></View>
        <View style={styles.xpTiny}><Text style={styles.xpTinyText}>+40</Text></View>
      </View>
      <View style={styles.problemIntro}>
        <View style={styles.problemTagRow}><Text style={styles.problemTag}>ARRAYS</Text><Text style={styles.problemDifficulty}>EASY</Text></View>
        <Text style={styles.problemTitle}>Two Sum</Text>
        <Text style={styles.problemPrompt}>Given an array of integers and a target, return the indices of the two numbers that add up to the target.</Text>
      </View>
      <View style={styles.exampleCard}>
        <View><Text style={styles.exampleLabel}>INPUT</Text><Text style={styles.exampleValue}>nums = [2, 7, 11, 15]</Text></View>
        <View><Text style={styles.exampleLabel}>TARGET</Text><Text style={styles.exampleValue}>target = 9</Text></View>
        <View><Text style={styles.exampleLabel}>OUTPUT</Text><Text style={styles.exampleValue}>[0, 1]</Text></View>
      </View>
      <View style={styles.editorCard}>
        <View style={styles.editorTop}><View style={styles.editorDots}><View style={[styles.editorDot, { backgroundColor: theme.coral }]} /><View style={[styles.editorDot, { backgroundColor: theme.yellow }]} /><View style={[styles.editorDot, { backgroundColor: theme.lime }]} /></View><Text style={styles.editorLanguage}>JAVASCRIPT</Text><Feather name="copy" size={16} color={theme.mutedForeground} /></View>
        <TextInput
          testID="code-editor"
          value={code}
          onChangeText={setCode}
          multiline
          spellCheck={false}
          autoCapitalize="none"
          style={styles.codeInput}
          textAlignVertical="top"
        />
      </View>
      <Pressable onPress={() => setShowExplanation((value) => !value)} style={styles.explanationToggle}>
        <View style={styles.explanationIcon}><Feather name="book-open" size={17} color={theme.sky} /></View>
        <Text style={styles.explanationText}>{showExplanation ? 'Hide explanation' : 'Need a hint? View explanation'}</Text>
        <Feather name={showExplanation ? 'chevron-up' : 'chevron-down'} size={17} color={theme.sky} />
      </Pressable>
      {showExplanation ? (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>The pattern: complement lookup</Text>
          <Text style={styles.explanationBody}>As you scan each number, ask: “Have I already seen its complement?” A Map makes that lookup constant time, so the whole solution stays O(n).</Text>
        </View>
      ) : null}
      <StrongButton label="Check solution" onPress={onComplete} color={theme.mintDark} icon="check-circle" />
      <Text style={styles.editorFooter}>Your code is saved automatically</Text>
    </ScreenShell>
  );
}

function Reward({ onContinue }: { onContinue: () => void }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 110 }),
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
    ]).start();
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [opacity, scale]);
  return (
    <ScreenShell scroll={false}>
      <View style={styles.rewardScreen}>
        <View style={styles.rewardTop}><LogoLockup compact /><Text style={styles.rewardTopLabel}>REP COMPLETE</Text></View>
        <View style={styles.confetti} pointerEvents="none">
          {[...Array(12)].map((_, index) => <View key={index} style={[styles.confettiPiece, { left: `${10 + ((index * 17) % 80)}%`, top: `${10 + ((index * 23) % 27)}%`, backgroundColor: [theme.sky, theme.yellow, theme.coral, theme.purple][index % 4], transform: [{ rotate: `${index * 27}deg` }] }]} />)}
        </View>
        <Animated.View style={[styles.rewardContent, { transform: [{ scale }], opacity }]}>
          <View style={styles.rewardBadge}><Feather name="check" size={47} color={theme.card} strokeWidth={3.5} /></View>
          <Text style={styles.rewardTitle}>Nice work!</Text>
          <Text style={styles.rewardSubtitle}>That’s one more pattern in your toolkit.</Text>
          <View style={styles.rewardStats}>
            <View style={styles.rewardStat}><Text style={styles.rewardStatValue}>+40</Text><Text style={styles.rewardStatLabel}>XP EARNED</Text></View>
            <View style={styles.rewardDivider} />
            <View style={styles.rewardStat}><Text style={styles.rewardStatValue}>7</Text><Text style={styles.rewardStatLabel}>DAY STREAK</Text></View>
          </View>
          <View style={styles.streakCallout}><Feather name="zap" size={20} color={theme.orange} fill={theme.orange} /><Text style={styles.streakCalloutText}>Your streak is safe for another day.</Text></View>
        </Animated.View>
        <View style={styles.rewardBottom}><StrongButton label="Back to today" onPress={onContinue} color={theme.sky} icon="arrow-right" /></View>
      </View>
    </ScreenShell>
  );
}

function Ring({ progress, color, size = 82 }: { progress: number; color: string; size?: number }) {
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: theme.line }]}>
      <View style={[styles.ringArc, { width: size, height: size, borderRadius: size / 2, borderColor: color, borderRightColor: 'transparent', borderBottomColor: progress > 0.5 ? color : 'transparent', transform: [{ rotate: `${-45 + progress * 360}deg` }] }]} />
      <Text style={[styles.ringText, { color }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

function Topics({ onHome, onProfile, onTopic }: { onHome: () => void; onProfile: () => void; onTopic: (topic: string) => void }) {
  return (
    <ScreenShell bottomNav onNav={(tab) => tab === 'home' ? onHome() : tab === 'profile' ? onProfile() : undefined} activeTab="topics">
      <View style={styles.pageTop}><View><Text style={styles.eyebrow}>YOUR TOOLKIT</Text><Text style={styles.pageTitle}>Topics</Text></View><IconButton icon="search" onPress={() => undefined} /></View>
      <Text style={styles.pageBody}>Build range by collecting reps across the patterns that matter.</Text>
      <View style={styles.topicFeatured}>
        <View style={styles.featuredIcon}><Feather name="trending-up" size={25} color={theme.card} strokeWidth={3} /></View>
        <View style={{ flex: 1 }}><Text style={styles.featuredLabel}>CURRENT FOCUS</Text><Text style={styles.featuredTitle}>Arrays & hashing</Text><ProgressBar value={0.61} color={theme.card} height={8} /><Text style={styles.featuredSub}>27 of 45 reps complete</Text></View>
        <Feather name="chevron-right" size={21} color={theme.card} />
      </View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>All patterns</Text><Text style={styles.topicCount}>6 topics</Text></View>
      <View style={styles.topicGrid}>
        {topics.map((topic) => (
          <Pressable key={topic.name} onPress={() => { tapFeedback(); onTopic(topic.name); }} style={styles.topicCard}>
            <Ring progress={topic.progress} color={topic.color} />
            <Text style={styles.topicName}>{topic.name}</Text>
            <Text style={styles.topicProgress}>{topic.count} reps</Text>
            <View style={[styles.topicMiniIcon, { backgroundColor: `${topic.color}18` }]}><Feather name={topic.icon} size={15} color={topic.color} strokeWidth={2.5} /></View>
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

function Profile({ onHome, onTopics, onPaywall }: { onHome: () => void; onTopics: () => void; onPaywall: () => void }) {
  const stats = [
    { value: '7', label: 'day streak', icon: 'zap' as const, color: theme.orange },
    { value: '1,240', label: 'total XP', icon: 'star' as const, color: theme.yellowDark },
    { value: '28', label: 'reps solved', icon: 'check-circle' as const, color: theme.mintDark },
  ];
  return (
    <ScreenShell bottomNav onNav={(tab) => tab === 'home' ? onHome() : tab === 'topics' ? onTopics() : undefined} activeTab="profile">
      <View style={styles.profileHeader}><IconButton icon="settings" onPress={() => undefined} /><Text style={styles.profileHeaderTitle}>Your profile</Text><IconButton icon="share-2" onPress={() => undefined} /></View>
      <View style={styles.profileIdentity}><View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>A</Text><View style={styles.avatarCheck}><Feather name="check" size={12} color={theme.card} strokeWidth={3} /></View></View><Text style={styles.profileName}>Alex Morgan</Text><Text style={styles.profileSince}>Learning in public since today</Text></View>
      <View style={styles.statsGrid}>{stats.map((stat) => <View key={stat.label} style={styles.profileStat}><Feather name={stat.icon} size={20} color={stat.color} strokeWidth={2.8} /><Text style={styles.profileStatValue}>{stat.value}</Text><Text style={styles.profileStatLabel}>{stat.label}</Text></View>)}</View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Weekly consistency</Text><Text style={styles.seeAll}>This week</Text></View>
      <View style={styles.consistencyCard}><View style={styles.consistencyTop}><Text style={styles.consistencyTitle}>You’re building a real habit.</Text><Text style={styles.consistencyPercent}>57%</Text></View><ProgressBar value={0.57} color={theme.mintDark} height={12} /><Text style={styles.consistencyNote}>4 out of 7 daily reps completed</Text></View>
      <View style={styles.proBadgeCard}><View style={styles.proIcon}><Feather name="award" size={24} color={theme.purpleDark} strokeWidth={2.6} /></View><View style={{ flex: 1 }}><Text style={styles.proTitle}>Get more from your reps</Text><Text style={styles.proSub}>Unlock smart review plans and deeper stats.</Text></View><Pressable onPress={onPaywall}><Feather name="chevron-right" size={20} color={theme.purpleDark} /></Pressable></View>
      <Text style={styles.settingsLabel}>ACCOUNT</Text>
      <View style={styles.settingsCard}><Pressable style={styles.settingsRow}><Feather name="user" size={18} color={theme.mutedForeground} /><Text style={styles.settingsText}>Personal details</Text><Feather name="chevron-right" size={17} color={theme.mutedForeground} /></Pressable><Pressable style={styles.settingsRow}><Feather name="bell" size={18} color={theme.mutedForeground} /><Text style={styles.settingsText}>Practice reminders</Text><Text style={styles.settingsValue}>On</Text></Pressable></View>
    </ScreenShell>
  );
}

function Paywall({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell scroll={false}>
      <View style={styles.paywall}>
        <View style={styles.paywallTop}><IconButton icon="x" onPress={onBack} /><View style={styles.proPill}><Feather name="star" size={15} color={theme.purpleDark} fill={theme.purpleDark} /><Text style={styles.proPillText}>BYTEWISE PRO</Text></View><View style={{ width: 44 }} /></View>
        <View style={styles.paywallArt}><View style={styles.paywallOrb}><Feather name="trending-up" size={44} color={theme.card} strokeWidth={2.8} /></View><View style={[styles.orbSpark, styles.orbSparkOne]} /><View style={[styles.orbSpark, styles.orbSparkTwo]} /><Mascot small /></View>
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

export default function Index() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 700);
    return () => clearTimeout(timer);
  }, []);
  const goTab = (tab: Tab) => {
    setActiveTab(tab);
    setScreen(tab);
  };
  const app = useMemo(() => {
    if (splash) {
      return (
        <View style={styles.splash}>
          <View style={styles.splashMark}><Feather name="code" size={34} color={theme.card} strokeWidth={3.3} /></View>
          <Text style={styles.splashText}>bytewise</Text>
          <Text style={styles.splashSub}>DAILY DSA PRACTICE</Text>
        </View>
      );
    }
    switch (screen) {
      case 'onboarding': return <Onboarding onContinue={() => setScreen('goals')} />;
      case 'goals': return <Goals onContinue={() => { setActiveTab('home'); setScreen('home'); }} />;
      case 'practice': return <Practice onBack={() => setScreen('home')} onComplete={() => setScreen('reward')} />;
      case 'reward': return <Reward onContinue={() => setScreen('home')} />;
      case 'topics': return <Topics onHome={() => goTab('home')} onProfile={() => goTab('profile')} onTopic={() => setScreen('practice')} />;
      case 'profile': return <Profile onHome={() => goTab('home')} onTopics={() => goTab('topics')} onPaywall={() => setScreen('paywall')} />;
      case 'paywall': return <Paywall onBack={() => setScreen('profile')} />;
      default: return <Home onPractice={() => setScreen('practice')} onTopics={() => goTab('topics')} onProfile={() => goTab('profile')} onPaywall={() => setScreen('paywall')} />;
    }
  }, [screen, splash]);
  return app;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  fixedContent: { flex: 1, paddingHorizontal: 20 },
  strongButton: { minHeight: 58, borderRadius: 17, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, paddingHorizontal: 18, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  buttonPressed: { transform: [{ translateY: 3 }], shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  disabledButton: { opacity: 0.5 },
  buttonLabel: { fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: -0.2 },
  iconButton: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: theme.line },
  progressTrack: { borderRadius: 99, backgroundColor: theme.line, overflow: 'hidden' },
  progressFill: { borderRadius: 99 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.sky },
  splashMark: { width: 76, height: 76, borderRadius: 25, backgroundColor: theme.mintDark, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }], shadowColor: theme.skyDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6 },
  splashText: { marginTop: 19, color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 34, letterSpacing: -1.5 },
  splashSub: { color: '#C6EDFF', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 2.2, marginTop: 7 },
  logoLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoLockupCompact: { gap: 7 },
  logoMark: { width: 37, height: 37, borderRadius: 12, backgroundColor: theme.sky, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  logoText: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -1 },
  onboarding: { flex: 1, justifyContent: 'space-between', paddingBottom: 8 },
  onboardingArt: { height: isCompact ? 245 : 285, marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  artBlob: { position: 'absolute', width: 250, height: 215, borderRadius: 110, backgroundColor: theme.greenWash, transform: [{ rotate: '12deg' }] },
  mascot: { width: 168, height: 168, borderRadius: 72, backgroundColor: theme.lime, borderWidth: 5, borderColor: theme.mintDark, alignItems: 'center', justifyContent: 'center', shadowColor: theme.mintDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8, position: 'relative' },
  mascotSmall: { transform: [{ scale: 0.56 }], marginVertical: -35 },
  mascotEyeRow: { flexDirection: 'row', gap: 12, marginTop: -9 },
  mascotEye: { width: 47, height: 56, borderRadius: 25, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  mascotPupil: { width: 21, height: 26, borderRadius: 12, backgroundColor: theme.ink, marginTop: 6, marginLeft: 3 },
  mascotBeak: { width: 0, height: 0, borderLeftWidth: 13, borderRightWidth: 13, borderTopWidth: 16, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: theme.orange, marginTop: 8 },
  mascotWingLeft: { width: 30, height: 53, borderRadius: 25, backgroundColor: theme.mintDark, position: 'absolute', left: -14, top: 75, transform: [{ rotate: '25deg' }] },
  mascotWingRight: { width: 30, height: 53, borderRadius: 25, backgroundColor: theme.mintDark, position: 'absolute', right: -14, top: 75, transform: [{ rotate: '-25deg' }] },
  mascotFeet: { flexDirection: 'row', gap: 16, position: 'absolute', bottom: -10 },
  mascotFoot: { width: 26, height: 13, borderRadius: 10, backgroundColor: theme.orange },
  floatingCode: { position: 'absolute', right: 28, top: 27, width: 64, height: 48, borderRadius: 15, backgroundColor: theme.sky, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '9deg' }], shadowColor: theme.skyDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  floatingCodeText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 20 },
  spark: { position: 'absolute', borderRadius: 9, backgroundColor: theme.yellow, alignItems: 'center', justifyContent: 'center' },
  sparkOne: { width: 36, height: 36, left: 34, top: 57, transform: [{ rotate: '-12deg' }] },
  sparkTwo: { width: 27, height: 27, right: 47, bottom: 20, backgroundColor: theme.coral, transform: [{ rotate: '11deg' }] },
  sparkText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 22 },
  onboardingCopy: { gap: 10 },
  eyebrow: { fontFamily: 'Inter_700Bold', color: theme.sky, letterSpacing: 1.4, fontSize: 11 },
  heroTitle: { fontFamily: 'Inter_700Bold', color: theme.ink, fontSize: isCompact ? 35 : 39, lineHeight: isCompact ? 40 : 45, letterSpacing: -1.4 },
  heroBody: { fontFamily: 'Inter_400Regular', color: theme.mutedForeground, fontSize: 16, lineHeight: 24, maxWidth: 340 },
  onboardingActions: { gap: 12, marginTop: 16 },
  smallNote: { textAlign: 'center', color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepLabel: { fontFamily: 'Inter_700Bold', color: theme.mutedForeground, fontSize: 11, letterSpacing: 1.1 },
  stepDots: { flexDirection: 'row', gap: 5 },
  stepDot: { width: 22, height: 6, borderRadius: 5, backgroundColor: theme.line },
  stepDotActive: { width: 22, height: 6, borderRadius: 5, backgroundColor: theme.sky },
  goalIntro: { marginTop: 25, gap: 9 },
  pageTitle: { fontFamily: 'Inter_700Bold', fontSize: 31, letterSpacing: -1.1, color: theme.ink },
  pageBody: { fontFamily: 'Inter_400Regular', color: theme.mutedForeground, fontSize: 16, lineHeight: 24 },
  goalList: { gap: 12, marginTop: 13 },
  goalCard: { borderRadius: 19, borderWidth: 2, borderColor: theme.line, backgroundColor: theme.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 83 },
  goalCardActive: { borderColor: theme.sky, backgroundColor: theme.blueWash },
  goalIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  goalCopy: { flex: 1, gap: 3 },
  goalLabel: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 17 },
  goalLabelActive: { color: theme.skyDark },
  goalDetail: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13 },
  goalDetailActive: { color: theme.skyDark },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: theme.sky },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.sky },
  goalBottom: { alignItems: 'center', gap: 5, marginTop: 'auto' },
  goalTip: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 11 },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  avatarTiny: { width: 34, height: 34, borderRadius: 12, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', marginRight: 'auto' },
  avatarTinyText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 15 },
  statPill: { height: 34, borderRadius: 12, paddingHorizontal: 10, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 13 },
  bellButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', top: 7, right: 7, width: 5, height: 5, backgroundColor: theme.coral, borderRadius: 3 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  greeting: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.8 },
  greetingSub: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  streakBadge: { backgroundColor: theme.orangeWash, borderRadius: 17, padding: 11, alignItems: 'center', minWidth: 74, gap: 1 },
  streakNumber: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 20 },
  streakLabel: { color: theme.orange, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.2 },
  dailyCard: { backgroundColor: theme.card, borderRadius: 24, borderWidth: 2, borderColor: theme.line, padding: 20, gap: 14, shadowColor: theme.line, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  dailyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: theme.greenWash },
  tagText: { color: theme.mintDark, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.7 },
  dailyMinutes: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.8 },
  dailyTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -1 },
  dailyDescription: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: -6 },
  dailyMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: theme.navy, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  xpChip: { marginLeft: 'auto', backgroundColor: theme.yellow, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6 },
  xpChipText: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { fontFamily: 'Inter_700Bold', color: theme.ink, fontSize: 18, letterSpacing: -0.4 },
  seeAll: { color: theme.skyDark, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  momentumCard: { backgroundColor: theme.card, borderRadius: 20, borderWidth: 1.5, borderColor: theme.line, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 17 },
  momentumNumber: { minWidth: 70 },
  momentumBig: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 31, letterSpacing: -1.2 },
  momentumUnit: { color: theme.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 13, position: 'absolute', left: 28, bottom: 5 },
  momentumCaption: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: -1 },
  weekBars: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 },
  weekDay: { alignItems: 'center', gap: 7 },
  weekBarTrack: { width: 19, height: 50, borderRadius: 8, backgroundColor: theme.line },
  weekBarDone: { height: 58, backgroundColor: theme.mint },
  weekBarToday: { height: 70, backgroundColor: theme.yellow, borderWidth: 2, borderColor: theme.yellowDark },
  weekDayText: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 10 },
  weekDayToday: { color: theme.yellowDark },
  unlockRow: { backgroundColor: theme.lavenderWash, padding: 13, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 11 },
  unlockIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#E1DAFF', alignItems: 'center', justifyContent: 'center' },
  unlockTitle: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 13 },
  unlockSub: { color: theme.purpleDark, opacity: 0.7, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  bottomNav: { position: 'absolute', left: 12, right: 12, bottom: 12, height: 72, borderRadius: 22, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', shadowColor: theme.line, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  navItem: { alignItems: 'center', gap: 4, minWidth: 74 },
  navIcon: { width: 38, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: theme.blueWash },
  navLabel: { color: theme.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  navLabelActive: { color: theme.skyDark },
  practiceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  practiceProgressWrap: { flex: 1, gap: 5 },
  practiceProgressText: { textAlign: 'center', color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 10 },
  xpTiny: { backgroundColor: theme.yellow, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6 },
  xpTinyText: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 11 },
  problemIntro: { gap: 9, marginTop: 4 },
  problemTagRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  problemTag: { color: theme.skyDark, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  problemDifficulty: { color: theme.mintDark, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  problemTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 30, letterSpacing: -1.1 },
  problemPrompt: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  exampleCard: { backgroundColor: theme.blueWash, borderRadius: 16, padding: 15, gap: 11 },
  exampleLabel: { color: theme.skyDark, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 },
  exampleValue: { color: theme.navy, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 2 },
  editorCard: { backgroundColor: '#152B3A', borderRadius: 18, overflow: 'hidden', minHeight: 275 },
  editorTop: { height: 42, backgroundColor: '#1E3B4D', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  editorDots: { flexDirection: 'row', gap: 5, marginRight: 'auto' },
  editorDot: { width: 8, height: 8, borderRadius: 4 },
  editorLanguage: { color: '#9BB7C6', fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.1 },
  codeInput: { flex: 1, padding: 16, color: '#D8F4FF', fontFamily: 'monospace', fontSize: 12, lineHeight: 19, minHeight: 230 },
  explanationToggle: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 2 },
  explanationIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: theme.blueWash, alignItems: 'center', justifyContent: 'center' },
  explanationText: { color: theme.skyDark, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  explanationCard: { borderRadius: 15, backgroundColor: theme.greenWash, padding: 14, gap: 5 },
  explanationTitle: { color: theme.mintDark, fontFamily: 'Inter_700Bold', fontSize: 13 },
  explanationBody: { color: theme.navy, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  editorFooter: { textAlign: 'center', color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: -9 },
  rewardScreen: { flex: 1, justifyContent: 'space-between' },
  rewardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rewardTopLabel: { color: theme.mintDark, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, fontSize: 10 },
  rewardContent: { alignItems: 'center', marginTop: -20 },
  rewardBadge: { width: 105, height: 105, borderRadius: 36, backgroundColor: theme.mintDark, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }], shadowColor: '#0D7F4B', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 1, shadowRadius: 0, elevation: 7 },
  rewardTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 35, letterSpacing: -1.2, marginTop: 25 },
  rewardSubtitle: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 15, marginTop: 7 },
  rewardStats: { marginTop: 30, flexDirection: 'row', alignItems: 'center', gap: 26 },
  rewardStat: { alignItems: 'center', gap: 2 },
  rewardStatValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 29 },
  rewardStatLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  rewardDivider: { width: 1, height: 43, backgroundColor: theme.line },
  streakCallout: { marginTop: 29, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: theme.orangeWash, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakCalloutText: { color: theme.orange, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  rewardBottom: { gap: 10 },
  confetti: { ...StyleSheet.absoluteFill },
  confettiPiece: { position: 'absolute', width: 10, height: 17, borderRadius: 3 },
  pageTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicFeatured: { backgroundColor: theme.sky, borderRadius: 21, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: theme.skyDark, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  featuredIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: theme.skyDark, alignItems: 'center', justifyContent: 'center' },
  featuredLabel: { color: '#C7EEFF', fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  featuredTitle: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 3, marginBottom: 9 },
  featuredSub: { color: '#D5F3FF', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 7 },
  topicCount: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  topicCard: { width: '48%', backgroundColor: theme.card, borderRadius: 19, borderWidth: 1.5, borderColor: theme.line, padding: 14, minHeight: 170, alignItems: 'center', gap: 5 },
  ring: { alignItems: 'center', justifyContent: 'center', borderWidth: 7, position: 'relative', overflow: 'hidden' },
  ringArc: { position: 'absolute', borderWidth: 7 },
  ringText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  topicName: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 2, textAlign: 'center' },
  topicProgress: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11 },
  topicMiniIcon: { position: 'absolute', right: 11, top: 11, width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileHeaderTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 17 },
  profileIdentity: { alignItems: 'center', gap: 7, marginTop: 7 },
  avatarLarge: { width: 85, height: 85, borderRadius: 30, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }], position: 'relative' },
  avatarLargeText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 38 },
  avatarCheck: { position: 'absolute', right: -4, bottom: -3, width: 25, height: 25, borderRadius: 10, backgroundColor: theme.mintDark, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: theme.background },
  profileName: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.6 },
  profileSince: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  profileStat: { flex: 1, borderRadius: 16, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, padding: 12, gap: 6 },
  profileStatValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 20 },
  profileStatLabel: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10 },
  consistencyCard: { backgroundColor: theme.greenWash, borderRadius: 18, padding: 16, gap: 11 },
  consistencyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  consistencyTitle: { color: theme.mintDark, fontFamily: 'Inter_700Bold', fontSize: 14 },
  consistencyPercent: { color: theme.mintDark, fontFamily: 'Inter_700Bold', fontSize: 18 },
  consistencyNote: { color: theme.mintDark, fontFamily: 'Inter_400Regular', fontSize: 11 },
  proBadgeCard: { backgroundColor: theme.lavenderWash, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  proIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#E1DAFF', alignItems: 'center', justifyContent: 'center' },
  proTitle: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 13 },
  proSub: { color: theme.purpleDark, opacity: 0.72, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  settingsLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1, marginTop: -3 },
  settingsCard: { borderRadius: 17, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, overflow: 'hidden' },
  settingsRow: { minHeight: 53, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: theme.line },
  settingsText: { color: theme.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  settingsValue: { color: theme.mintDark, fontFamily: 'Inter_700Bold', fontSize: 12 },
  paywall: { flex: 1, justifyContent: 'space-between', gap: 10 },
  paywallTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  proPill: { backgroundColor: theme.lavenderWash, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 5 },
  proPillText: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8 },
  paywallArt: { alignItems: 'center', justifyContent: 'center', height: 170, position: 'relative' },
  paywallOrb: { width: 116, height: 116, borderRadius: 45, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }], shadowColor: theme.purpleDark, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 1, shadowRadius: 0, elevation: 7 },
  orbSpark: { position: 'absolute', width: 13, height: 20, borderRadius: 4, backgroundColor: theme.yellow },
  orbSparkOne: { top: 22, left: '24%', transform: [{ rotate: '-24deg' }] },
  orbSparkTwo: { bottom: 12, right: '23%', backgroundColor: theme.sky, transform: [{ rotate: '24deg' }] },
  paywallTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 32, lineHeight: 35, letterSpacing: -1.1 },
  paywallBody: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  benefitList: { gap: 10, marginTop: 3 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitCheck: { width: 24, height: 24, borderRadius: 8, backgroundColor: theme.mintDark, alignItems: 'center', justifyContent: 'center' },
  benefitText: { color: theme.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  priceRow: { backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 21 },
  priceUnit: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  priceFine: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2 },
  priceSave: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 },
  paywallFine: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 9, textAlign: 'center', marginTop: 1 },
});