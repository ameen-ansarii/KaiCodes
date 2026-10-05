import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Updates from 'expo-updates';
import colors from '@/constants/colors';
import { getAllSubjects, getSubjectById, getAllTopics, getTopicById, getLessonById } from '@/content';
import { SubjectId, LessonContent } from '@/types/content';
import { SubjectPicker } from '@/components/SubjectPicker';
import { FlowchartCard } from '@/components/FlowchartCard';
import { TheoryCard } from '@/components/TheoryCard';
import { AuthScreen } from '@/components/AuthScreen';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import {
  getStoredSession,
  saveSession,
  getUserProfile,
  getUserProgress,
  recordLessonCompleted,
  getGlobalLeaderboard,
  getTopicStats,
  LeaderboardRank,
  UserAccount,
  UserProfile,
  UserProgress,
} from '@/services/turso';

type Theme = typeof colors.light;
type Screen = 'auth' | 'onboarding' | 'home' | 'practice' | 'reward' | 'topics' | 'course' | 'profile' | 'paywall' | 'leaderboard';
type Tab = 'home' | 'course' | 'topics' | 'leaderboard' | 'profile';

const theme = colors.light as Theme;
const { width: windowWidth } = Dimensions.get('window');
const isCompact = windowWidth < 380;

const iconMap = {
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
} as const;
type IconName = keyof typeof iconMap;

function AppIcon({
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

const Feather = AppIcon;

const topics = [
  { name: 'Arrays', icon: 'grid' as const, color: theme.purple, progress: 0.72, count: '18 / 25' },
  { name: 'Hash maps', icon: 'hash' as const, color: theme.sky, progress: 0.45, count: '9 / 20' },
  { name: 'Two pointers', icon: 'move' as const, color: theme.purple, progress: 0.3, count: '6 / 20' },
  { name: 'Stacks', icon: 'layers' as const, color: theme.purpleDark, progress: 0.8, count: '16 / 20' },
  { name: 'Binary trees', icon: 'git-branch' as const, color: theme.coral, progress: 0.18, count: '3 / 16' },
  { name: 'Graphs', icon: 'share-2' as const, color: theme.yellowDark, progress: 0.08, count: '1 / 14' },
];

function tapFeedback() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function StrongButton({
  label,
  onPress,
  color = theme.purple,
  textColor = '#FFFFFF',
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
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.strongButton,
        {
          backgroundColor: secondary ? '#F8FAFC' : color,
          borderWidth: secondary ? 1.5 : 0,
          borderColor: secondary ? '#E2E8F0' : 'transparent',
          shadowColor: secondary ? '#64748B' : color,
          shadowOpacity: secondary ? 0.08 : 0.28,
        },
        pressed && styles.buttonPressed,
        disabled && styles.disabledButton,
      ]}
    >
      {icon ? (
        <Feather
          name={icon}
          size={22}
          color={secondary ? color : textColor}
          strokeWidth={2.4}
        />
      ) : null}
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

const APP_NAME = 'kaicode';

type MascotPose =
  | 'primary'
  | 'coach'
  | 'celebrate'
  | 'thinking'
  | 'accepted'
  | 'coding'
  | 'eureka'
  | 'frustrated'
  | 'facepalm'
  | 'mindblown'
  | 'speedrun'
  | 'sleepy'
  | 'crying'
  | 'stop'
  | 'point_right'
  | 'whisper';

const mascotImages: Record<MascotPose, any> = {
  primary: require('@/assets/images/kai_accepted.png'),
  accepted: require('@/assets/images/kai_accepted.png'),
  coach: require('@/assets/images/kai_whisper.png'),
  celebrate: require('@/assets/images/kai_accepted.png'),
  thinking: require('@/assets/images/kai_thinking.png'),
  coding: require('@/assets/images/kai_coding.png'),
  eureka: require('@/assets/images/kai_eureka.png'),
  frustrated: require('@/assets/images/kai_frustrated.png'),
  facepalm: require('@/assets/images/kai_facepalm.png'),
  mindblown: require('@/assets/images/kai_mindblown.png'),
  speedrun: require('@/assets/images/kai_speedrun.png'),
  sleepy: require('@/assets/images/kai_sleepy.png'),
  crying: require('@/assets/images/kai_crying.png'),
  stop: require('@/assets/images/kai_stop.png'),
  point_right: require('@/assets/images/kai_point_right.png'),
  whisper: require('@/assets/images/kai_whisper.png'),
};

function Mascot({
  pose = 'primary',
  size,
  small = false,
  style,
  withPedestal = false,
  stars = 0,
}: {
  pose?: MascotPose;
  size?: number;
  small?: boolean;
  style?: any;
  withPedestal?: boolean;
  stars?: number;
}) {
  const actualSize = size ?? (small ? 48 : 140);
  const imgElement = (
    <Image
      source={mascotImages[pose]}
      style={[{ width: actualSize, height: actualSize }, style]}
      resizeMode="contain"
    />
  );

  if (withPedestal) {
    return (
      <View style={styles.pedestalWrapper}>
        <View style={styles.pedestalBase}>
          {imgElement}
          <View style={[styles.pedestalDisc, { width: Math.round(actualSize * 0.85) }]} />
        </View>
        <View style={styles.pedestalStars}>
          {[...Array(3)].map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name="star"
              size={13}
              color={i < stars ? '#EAB308' : '#CBD5E1'}
            />
          ))}
        </View>
      </View>
    );
  }

  return imgElement;
}

function LogoLockup({ compact = false, showTitle = true, title }: { compact?: boolean; showTitle?: boolean; title?: string }) {
  return (
    <View style={[styles.logoLockup, compact && styles.logoLockupCompact]}>
      <Mascot pose="accepted" size={compact ? 38 : 50} />
      {showTitle ? (
        <Text style={[styles.logoText, compact && styles.logoTextCompact]}>
          {title ? (
            title
          ) : (
            <>
              kai<Text style={{ color: theme.purple }}>code</Text>
            </>
          )}
        </Text>
      ) : null}
    </View>
  );
}

function useAppUpdates() {
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch (err) {
      console.warn('App reload failed:', err);
    }
  }, []);

  const check = useCallback(async () => {
    if (!Updates.isEnabled) return;
    try {
      setChecking(true);
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        setUpdateAvailable(true);
        setStatusMessage('Update found! Downloading...');
        setDownloading(true);
        await Updates.fetchUpdateAsync();
        setDownloading(false);
        setUpdateReady(true);
        setStatusMessage('Update ready ✓');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Show "Update ready" for 2s then reload — gives user feedback before restart
        setTimeout(() => {
          void Updates.reloadAsync().catch(() => {});
        }, 2000);
      } else {
        setStatusMessage(null);
      }
    } catch (err: any) {
      console.warn('Update check failed:', err);
      setStatusMessage(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!Updates.isEnabled) return;
    // Delay check so app fully renders before doing any network work
    const timer = setTimeout(() => { void check(); }, 3000);
    return () => clearTimeout(timer);
  }, [check]);

  return {
    checking,
    downloading,
    updateAvailable,
    updateReady,
    statusMessage,
    check,
    reload,
    updateId: Updates.updateId || null,
    channel: Updates.channel || null,
    isEmbedded: Updates.isEmbeddedLaunch || false,
  };
}

function UpdateBanner({
  downloading,
  updateReady,
  onReload,
}: {
  downloading: boolean;
  updateReady: boolean;
  onReload: () => void;
}) {
  if (!downloading && !updateReady) return null;

  return (
    <View style={styles.updateFloatingBanner}>
      <Mascot pose={updateReady ? 'accepted' : 'speedrun'} size={44} />
      <View style={{ flex: 1 }}>
        <Text style={styles.updateFloatingTitle}>
          {updateReady ? 'New Version Ready!' : 'Downloading Update...'}
        </Text>
        <Text style={styles.updateFloatingSub}>
          {updateReady
            ? 'Two Pointers, Binary Search and live leaderboards are ready.'
            : 'Kai is fetching the latest problem set in background.'}
        </Text>
      </View>
      {updateReady ? (
        <Pressable onPress={onReload} style={styles.updateFloatingButton}>
          <Text style={styles.updateFloatingButtonText}>Restart</Text>
          <Feather name="refresh-cw" size={13} color="#FFFFFF" />
        </Pressable>
      ) : (
        <View style={styles.updateSpinnerPill}>
          <Text style={styles.updateSpinnerPillText}>Syncing</Text>
        </View>
      )}
    </View>
  );
}

function HeaderStats({
  onProfile,
  xp = 0,
  streak = 1,
  isUpdating = false,
}: {
  onProfile: () => void;
  xp?: number;
  streak?: number;
  isUpdating?: boolean;
}) {
  return (
    <View style={styles.headerStats}>
      <LogoLockup compact showTitle />
      <View style={{ flex: 1 }} />
      {isUpdating ? (
        <View style={styles.updatingHeaderPill}>
          <Text style={styles.updatingHeaderPillText}>SYNCING...</Text>
        </View>
      ) : null}
      <View style={styles.statPill}>
        <Feather name="star" size={15} color={theme.yellowDark} fill={theme.yellowDark} />
        <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
      </View>
      <View style={styles.statPill}>
        <Image
          source={require('@/assets/images/streak_emoji.png')}
          style={{ width: 17, height: 17 }}
          resizeMode="contain"
        />
        <Text style={styles.statValue}>{streak}</Text>
      </View>
      <Pressable onPress={onProfile} style={styles.bellButton}>
        <Feather name="bell" size={17} color={theme.ink} strokeWidth={2.5} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ key: Tab; label: string; icon: any; hasBadge?: boolean }> = [
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

  const paddingX = 8;
  const availableWidth = containerWidth > 0 ? containerWidth - paddingX * 2 : 0;
  const tabWidth = availableWidth > 0 ? availableWidth / items.length : 0;

  useEffect(() => {
    if (tabWidth > 0) {
      if (!initialLayoutDone.current) {
        slideAnim.setValue(safeIndex * tabWidth);
        initialLayoutDone.current = true;
      } else {
        Animated.spring(slideAnim, {
          toValue: safeIndex * tabWidth,
          damping: 20,
          stiffness: 260,
          mass: 0.7,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [safeIndex, tabWidth]);

  return (
    <View
      style={styles.bottomNav}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.animatedTabIndicator,
            {
              width: tabWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.indicatorPill} />
        </Animated.View>
      )}

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
            <View style={styles.navIconWrapper}>
              <Feather
                name={item.icon}
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

function ScreenShell({
  children,
  scroll = true,
  bottomNav,
  refreshControl,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bottomNav?: boolean;
  onNav?: (tab: Tab) => void;
  activeTab?: Tab;
  refreshControl?: React.ReactElement<any>;
}) {
  const insets = useSafeAreaInsets();
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: bottomNav ? 112 : insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>{children}</View>
  );
  return (
    <View style={styles.screen}>
      {content}
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
          <Mascot pose="coding" size={isCompact ? 190 : 225} />
          <View style={styles.floatingCode}><Text style={styles.floatingCodeText}>{'{ }'}</Text></View>
        </View>
        <View style={styles.onboardingCopy}>
          <Text style={styles.eyebrow}>YOUR DAILY CODING COACH</Text>
          <Text style={styles.heroTitle}>Small reps.{'\n'}Big breakthroughs.</Text>
          <Text style={styles.heroBody}>Build the DSA habit in 10 minutes a day with Kai. Practice smart, stay sharp, and keep your streak alive.</Text>
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
        <Mascot pose="thinking" size={100} />
        <Text style={styles.goalTip}>Consistency beats intensity. Kai has your back.</Text>
        <StrongButton label="Set my goal" onPress={onContinue} color={theme.purple} icon="check" />
      </View>
    </ScreenShell>
  );
}

function Home({
  user,
  profile,
  progress,
  isUpdating,
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
  const currentTopic = useMemo(() => {
    const primarySubjectId = profile?.prioritySubjects?.[0];
    const subjects = getAllSubjects();
    const matchedSubject = subjects.find((s) => s.id === primarySubjectId) || subjects[0];
    return matchedSubject.topics[0] || getAllTopics()[0];
  }, [profile]);

  const streak = progress?.streakCount || 1;
  const repsCompleted = Array.isArray(progress?.completedLessons) ? progress.completedLessons.length : 0;
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isGoalCompletedToday = useMemo(() => {
    return progress?.lastActiveDate === todayStr && repsCompleted > 0;
  }, [progress?.lastActiveDate, todayStr, repsCompleted]);

  const nextLesson = useMemo(() => {
    const completed = Array.isArray(progress?.completedLessons) ? progress.completedLessons : [];
    // Prioritize next uncompleted lesson in the user's active topic
    const topicLesson = currentTopic.lessons.find((l) => !completed.includes(l.id));
    if (topicLesson) return topicLesson;

    // Otherwise fallback to next uncompleted lesson in any topic
    const all = getAllTopics().flatMap((t) => t.lessons);
    return all.find((l) => !completed.includes(l.id)) || all[0];
  }, [progress, currentTopic]);

  const topicStats = useMemo(() => {
    const lessonIds = currentTopic.lessons.map((l) => l.id);
    const completed = Array.isArray(progress?.completedLessons) ? progress.completedLessons : [];
    return getTopicStats(lessonIds, completed, currentTopic.totalLessons);
  }, [currentTopic, progress]);

  // Current day of week: 0 = Mon, 6 = Sun
  const currentDayOfWeek = useMemo(() => {
    return (new Date().getDay() + 6) % 7;
  }, []);

  return (
    <ScreenShell bottomNav activeTab="home">
      <HeaderStats onProfile={onProfile} xp={progress?.xp || 0} streak={streak} isUpdating={isUpdating} />

      {/* Greeting Banner */}
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
        <Mascot pose={isGoalCompletedToday ? 'accepted' : 'speedrun'} size={118} style={{ marginBottom: -8 }} />
      </View>

      {/* BLOCK 1: Dynamic Daily Mission Card */}
      {!isGoalCompletedToday ? (
        <View style={styles.dailyCard}>
          <View style={styles.dailyCardTop}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>TODAY’S REP</Text>
            </View>
            <Text style={styles.dailyMinutes}>~ {nextLesson.estimatedMinutes} MIN</Text>
          </View>
          <Text style={styles.dailyTitle}>{nextLesson.title}</Text>
          <Text style={styles.dailyDescription}>{nextLesson.subtitle}</Text>
          <View style={styles.dailyMetaRow}>
            <View style={styles.metaItem}>
              <Feather name="bar-chart-2" size={15} color={theme.sky} />
              <Text style={styles.metaText}>{nextLesson.difficulty.toUpperCase()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="layers" size={15} color={theme.sky} />
              <Text style={styles.metaText}>{currentTopic.title.toUpperCase()}</Text>
            </View>
            <View style={styles.xpChip}>
              <Text style={styles.xpChipText}>+40 XP</Text>
            </View>
          </View>
          <StrongButton
            label="Solve today’s problem"
            onPress={() => onPractice(nextLesson.id)}
            color={theme.purple}
            icon="arrow-up-right"
          />
        </View>
      ) : (
        <View style={[styles.dailyCard, styles.dailyCardDone]}>
          <View style={styles.dailyCardTop}>
            <View style={styles.tagDone}>
              <Text style={styles.tagDoneText}>DAILY GOAL CRUSHED</Text>
            </View>
            <Text style={styles.dailyMinutesDone}>STREAK SECURED</Text>
          </View>
          <View style={styles.doneBodyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dailyTitle}>You're Locked In!</Text>
              <Text style={styles.dailyDescription}>
                You completed today's engineering rep. Keep this momentum going tomorrow.
              </Text>
            </View>
            <Mascot pose="accepted" size={78} />
          </View>
          <StrongButton
            label="Practice bonus rep"
            onPress={() => onPractice(nextLesson.id)}
            secondary
            color={theme.purple}
            icon="zap"
          />
        </View>
      )}

      {/* BLOCK 2: Active Track Card (Bridge to Path) */}
      <View style={styles.activeTrackCard}>
        <View style={styles.activeTrackHeader}>
          <View style={[styles.activeTrackBadge, { backgroundColor: currentTopic.accentColor }]}>
            <Feather name={currentTopic.icon as any} size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activeTrackEyebrow}>ACTIVE TRACK</Text>
            <Text style={styles.activeTrackTitle}>{currentTopic.title}</Text>
          </View>
          <Text style={styles.activeTrackCount}>
            {topicStats.completedCount} / {topicStats.totalCount}
          </Text>
        </View>
        <Text style={styles.activeTrackDesc}>{currentTopic.description}</Text>
        <View style={styles.activeTrackProgressWrap}>
          <ProgressBar value={topicStats.percentage} color={currentTopic.accentColor} height={8} />
          <Text style={styles.activeTrackPercentText}>{Math.round(topicStats.percentage * 100)}% COMPLETE</Text>
        </View>
        <Pressable onPress={onCourse} style={styles.activeTrackFooterBtn}>
          <Text style={styles.activeTrackFooterText}>Continue on winding path</Text>
          <Feather name="chevron-right" size={16} color={theme.purple} />
        </Pressable>
      </View>

      {/* BLOCK 3: Weekly Pulse & League Snapshot */}
      <View style={styles.weeklyPulseCard}>
        <View style={styles.pulseHeader}>
          <Text style={styles.sectionTitle}>Weekly Pulse</Text>
          <Text style={styles.pulseSubtitle}>{streak}-day streak active</Text>
        </View>
        <View style={styles.weekBars}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
            const isToday = index === currentDayOfWeek;
            const isDone = index < Math.min(7, streak) || (isToday && isGoalCompletedToday);
            return (
              <View key={`${day}-${index}`} style={styles.weekDay}>
                <View
                  style={[
                    styles.weekBarTrack,
                    isDone && styles.weekBarDone,
                    isToday && styles.weekBarToday,
                  ]}
                />
                <Text style={[styles.weekDayText, isToday && styles.weekDayToday]}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Pressable onPress={onLeaderboard} style={styles.leagueSnapshotCard}>
        <View style={styles.leagueIconWrap}>
          <Feather name="award" size={22} color="#7C3AED" strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.leagueCardEyebrow}>LEAGUES</Text>
          <Text style={styles.leagueCardTitle}>Silver League · Rank #4</Text>
          <Text style={styles.leagueCardSub}>Top 5 engineers advance to Gold</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#64748B" />
      </Pressable>
    </ScreenShell>
  );
}

const JS_KEYWORDS = new Set([
  'function', 'const', 'let', 'var', 'for', 'if', 'else', 'return',
  'new', 'export', 'import', 'from', 'default', 'class', 'while', 'switch', 'case', 'break', 'in', 'of'
]);

const JS_BUILTINS = new Set([
  'Map', 'Set', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'Math', 'JSON'
]);

const JS_METHODS = new Set([
  'has', 'get', 'set', 'push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'length'
]);

function CodeShowcaseCard({
  code,
  onChangeCode,
}: {
  code: string;
  onChangeCode?: (newCode: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
    } catch (_) {}
    tapFeedback();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = useMemo(() => code.split('\n'), [code]);
  const tokenRegex = useMemo(
    () => /(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b|[{}()[\];,=+\-<>:*\/%!&|~^?:]|\s+|.)/g,
    []
  );

  return (
    <View style={styles.codeCard}>
      <Pressable
        onPress={handleCopy}
        hitSlop={8}
        style={styles.codeCopyButton}
        accessibilityLabel="Copy code"
      >
        <Feather name={copied ? 'check' : 'copy'} size={15} color={copied ? '#10B981' : '#94A3B8'} />
      </Pressable>

      {isEditing ? (
        <TextInput
          testID="code-editor"
          value={code}
          onChangeText={onChangeCode}
          onBlur={() => setIsEditing(false)}
          multiline
          autoFocus
          spellCheck={false}
          autoCapitalize="none"
          style={styles.codeEditInput}
          textAlignVertical="top"
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.codeScrollContent}
        >
          <Pressable onLongPress={() => setIsEditing(true)} delayLongPress={600} style={styles.codeContainer}>
            {lines.map((line, lineIdx) => {
              const preWrapStyle: any = Platform.OS === 'web' ? { whiteSpace: 'pre' } : {};
              if (!line) {
                return (
                  <Text key={lineIdx} style={[styles.codeLineText, preWrapStyle] as any}>
                    {' '}
                  </Text>
                );
              }
              const tokens = line.match(tokenRegex) || [line];
              return (
                <Text key={lineIdx} style={[styles.codeLineText, preWrapStyle] as any}>
                  {tokens.map((token, tokenIdx) => {
                    let color = '#1E293B';
                    let fontWeight: '400' | '600' = '400';

                    if (token.startsWith('//')) {
                      color = '#94A3B8';
                    } else if (token.startsWith('"') || token.startsWith("'")) {
                      color = '#10B981';
                    } else if (/^\d+$/.test(token)) {
                      color = '#D97706';
                    } else if (JS_KEYWORDS.has(token)) {
                      color = '#E11D48';
                      fontWeight = '600';
                    } else if (JS_BUILTINS.has(token)) {
                      color = '#0D9488';
                      fontWeight = '600';
                    } else if (token === 'twoSum' || JS_METHODS.has(token)) {
                      color = '#2563EB';
                      fontWeight = '600';
                    } else if (/^[{}()[\];,=+\-<>:*\/%!&|~^?:]$/.test(token)) {
                      color = '#64748B';
                    }

                    return (
                      <Text
                        key={tokenIdx}
                        style={{
                          color,
                          fontWeight,
                          fontFamily: 'monospace',
                          fontSize: 13,
                          lineHeight: 22,
                        }}
                      >
                        {token}
                      </Text>
                    );
                  })}
                </Text>
              );
            })}
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

function Practice({
  lessonId = 'two-sum',
  onComplete,
  onBack,
}: {
  lessonId?: string;
  onComplete: (rewardXp: number) => void;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<'code' | 'flowchart' | 'theory'>('code');
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'python' | 'cpp' | 'java' | 'typescript'>('python');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lesson = useMemo(() => {
    return getLessonById(lessonId) || getLessonById('two-sum')!;
  }, [lessonId]);

  const currentImpl = useMemo(() => {
    return (
      lesson.implementations.find((impl) => impl.language === selectedLang) ||
      lesson.implementations[0]
    );
  }, [lesson, selectedLang]);

  const [code, setCode] = useState(currentImpl?.code || '');

  useEffect(() => {
    if (currentImpl) {
      setCode(currentImpl.code);
    }
  }, [currentImpl]);

  const checkpoint = lesson.checkpoint;
  const isQuizCorrect = selectedQuizOption === checkpoint?.correctIndex;

  const handleSelectOption = (idx: number) => {
    tapFeedback();
    setSelectedQuizOption(idx);
    setQuizSubmitted(true);
    if (idx === checkpoint?.correctIndex) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.practiceFixedHeader, { paddingTop: insets.top + 16 }]}>
        <IconButton icon="x" onPress={onBack} />
        <View style={styles.practiceProgressWrap}>
          <Text style={styles.practiceProgressText}>{lesson.difficulty.toUpperCase()} PATTERN</Text>
          <ProgressBar value={quizSubmitted && isQuizCorrect ? 1.0 : 0.6} color={theme.yellow} height={8} />
        </View>
        <View style={styles.xpTiny}>
          <Text style={styles.xpTinyText}>+40 XP</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.practiceScroll}
        contentContainerStyle={styles.practiceScrollContent}
      >
        <View style={styles.lessonContextRow}>
          <View style={styles.lessonContextIcon}>
            <Feather name="layers" size={16} color={theme.skyDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.lessonContextTitle}>{lesson.title}</Text>
            <Text style={styles.lessonContextSub}>{lesson.subtitle}</Text>
          </View>
        </View>

        <View style={styles.problemIntro}>
          <View style={styles.problemTagRow}>
            <Text style={styles.problemTag}>{lesson.topicId.toUpperCase()}</Text>
            <Text style={styles.problemDifficulty}>{lesson.difficulty.toUpperCase()}</Text>
          </View>
          <Text style={styles.problemTitle}>{lesson.title}</Text>
          <Text style={styles.problemPrompt}>{lesson.theory.overview}</Text>
        </View>

        <View style={styles.segmentContainer}>
          <Pressable
            onPress={() => setViewMode('code')}
            style={[styles.segmentBtn, viewMode === 'code' && styles.segmentBtnActive]}
          >
            <Feather name="code" size={14} color={viewMode === 'code' ? '#7C3AED' : '#64748B'} />
            <Text style={[styles.segmentText, viewMode === 'code' && styles.segmentTextActive]}>Code</Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('flowchart')}
            style={[styles.segmentBtn, viewMode === 'flowchart' && styles.segmentBtnActive]}
          >
            <Feather name="git-branch" size={14} color={viewMode === 'flowchart' ? '#7C3AED' : '#64748B'} />
            <Text style={[styles.segmentText, viewMode === 'flowchart' && styles.segmentTextActive]}>Flowchart Trace</Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('theory')}
            style={[styles.segmentBtn, viewMode === 'theory' && styles.segmentBtnActive]}
          >
            <Feather name="book-open" size={14} color={viewMode === 'theory' ? '#7C3AED' : '#64748B'} />
            <Text style={[styles.segmentText, viewMode === 'theory' && styles.segmentTextActive]}>Deep Theory</Text>
          </Pressable>
        </View>

        {viewMode === 'flowchart' && lesson?.flowchart && (
          <FlowchartCard
            title={lesson.flowchart.title}
            caption={lesson.flowchart.caption}
            steps={lesson.flowchart.steps}
          />
        )}

        {viewMode === 'theory' && lesson?.theory && (
          <TheoryCard
            overview={lesson.theory.overview}
            whyItMatters={lesson.theory.whyItMatters}
            mentalModel={lesson.theory.mentalModel}
            keyTakeaways={lesson.theory.keyTakeaways}
          />
        )}

        {viewMode === 'code' && (
          <>
            <View style={styles.coachBubbleRow}>
              <Mascot pose="whisper" size={88} />
              <View style={styles.coachSpeechBubble}>
                <View style={styles.speechTail} />
                <Text style={styles.speechBubbleTitle}>Kai's Secret Key Pattern</Text>
                <Text style={styles.speechBubbleBody}>{lesson.kaiTip}</Text>
              </View>
            </View>

            <View style={styles.langSelectorRow}>
              {(['python', 'cpp', 'java', 'typescript'] as const).map((lang) => {
                const isSelected = selectedLang === lang;
                const label =
                  lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : lang === 'java' ? 'Java' : 'TypeScript';
                return (
                  <Pressable
                    key={lang}
                    onPress={() => {
                      tapFeedback();
                      setSelectedLang(lang);
                    }}
                    style={[styles.langPill, isSelected && styles.langPillActive]}
                  >
                    <Text style={[styles.langPillText, isSelected && styles.langPillTextActive]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <CodeShowcaseCard code={code} onChangeCode={setCode} />

            <Pressable onPress={() => setShowExplanation((value) => !value)} style={styles.explanationToggle}>
              <View style={styles.explanationIcon}>
                <Feather name="book-open" size={17} color={theme.mintDark} />
              </View>
              <Text style={styles.explanationText}>
                {showExplanation ? 'Hide explanation' : 'Need a hint? View explanation'}
              </Text>
              <Feather name={showExplanation ? 'chevron-up' : 'chevron-down'} size={17} color={theme.mintDark} />
            </Pressable>
            {showExplanation ? (
              <View style={styles.explanationCard}>
                <View style={styles.explanationHeaderRow}>
                  <Mascot pose="eureka" size={80} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.explanationTitle}>Kai's Eureka Breakdown</Text>
                    <Text style={styles.explanationBody}>{currentImpl?.explanation || lesson.theory.mentalModel}</Text>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={styles.complexityRow}>
              <View style={styles.complexityItem}>
                <Text style={styles.complexityLabel}>TIME</Text>
                <Text style={styles.complexityValue}>{lesson.complexity.time}</Text>
              </View>
              <View style={styles.complexityDivider} />
              <View style={styles.complexityItem}>
                <Text style={styles.complexityLabel}>SPACE</Text>
                <Text style={styles.complexityValue}>{lesson.complexity.space}</Text>
              </View>
              <View style={styles.complexityDivider} />
              <View style={styles.complexityItem}>
                <Text style={styles.complexityLabel}>ESTIMATED</Text>
                <Text style={styles.complexityValue}>~{lesson.estimatedMinutes}m</Text>
              </View>
            </View>

            {checkpoint ? (
              <View style={styles.quizCard}>
                <View style={styles.quizHeaderRow}>
                  <View style={styles.quizBadge}>
                    <Text style={styles.quizBadgeText}>CHECKPOINT DRILL</Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#64748B' }}>
                    Active Recall Challenge
                  </Text>
                </View>
                <Text style={styles.quizQuestion}>{checkpoint.question}</Text>
                <View style={{ gap: 8 }}>
                  {checkpoint.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isAnswerCorrect = idx === checkpoint.correctIndex;
                    let optionStyle = styles.quizOptionBtn;
                    if (quizSubmitted) {
                      if (isAnswerCorrect) optionStyle = [styles.quizOptionBtn, styles.quizOptionCorrect] as any;
                      else if (isSelected) optionStyle = [styles.quizOptionBtn, styles.quizOptionWrong] as any;
                    }

                    return (
                      <Pressable key={idx} onPress={() => handleSelectOption(idx)} style={optionStyle}>
                        <View style={styles.quizOptionIndex}>
                          <Text style={styles.quizOptionIndexText}>{String.fromCharCode(65 + idx)}</Text>
                        </View>
                        <Text style={styles.quizOptionText}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {quizSubmitted && (
                  <View style={styles.quizFeedbackBox}>
                    <Mascot pose={isQuizCorrect ? 'accepted' : 'frustrated'} size={48} />
                    <Text style={styles.quizFeedbackText}>
                      {isQuizCorrect ? checkpoint.kaiAcceptedQuote : checkpoint.kaiFrustratedQuote}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
      <View style={[styles.practiceActionBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <StrongButton
          label={quizSubmitted && isQuizCorrect ? 'Claim +40 XP & Complete' : 'Finish Rep'}
          onPress={() => onComplete(40)}
          color={theme.purple}
          icon="check-circle"
        />
      </View>
    </View>
  );
}

function CoursePath({
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

          const nodeBg = isDone
            ? theme.purple
            : isCurrent
            ? theme.purple
            : '#E2E8F0';

          const nodeBorderColor = isDone
            ? '#5B21B6'
            : isCurrent
            ? '#6D28D9'
            : '#CBD5E1';

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
                  onPress={() => {
                    tapFeedback();
                    onPractice(lesson.id);
                  }}
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
                  <Feather
                    name={isDone ? 'check' : isCurrent ? 'star' : 'lock'}
                    size={26}
                    color={locked ? '#94A3B8' : '#FFFFFF'}
                  />
                </Pressable>
              </View>

              <View style={[styles.windingNodeBadge, isCurrent && styles.windingNodeBadgeActive]}>
                <Text style={[styles.windingNodeTitle, isCurrent && styles.windingNodeTitleActive]}>
                  {lesson.title}
                </Text>
                <Text style={styles.windingNodeDetail}>
                  {lesson.difficulty} · ~{lesson.estimatedMinutes}m
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.courseCallout}>
        <View style={styles.courseCalloutIcon}>
          <Feather name="star" size={16} color={theme.yellowDark} />
        </View>
        <Text style={styles.courseCalloutText}>
          Complete reps daily to build interview muscle memory with Kai.
        </Text>
      </View>
    </ScreenShell>
  );
}

function Reward({
  onContinue,
  streak = 1,
}: {
  onContinue: () => void;
  streak?: number;
}) {
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
          <Mascot pose="accepted" size={210} style={{ marginBottom: 14 }} />
          <Text style={styles.rewardTitle}>Accepted!</Text>
          <Text style={styles.rewardSubtitle}>100% test cases passed. Kai says: "Clean O(n) rep!"</Text>
          <View style={styles.rewardStats}>
            <View style={styles.rewardStat}><Text style={styles.rewardStatValue}>+40</Text><Text style={styles.rewardStatLabel}>XP EARNED</Text></View>
            <View style={styles.rewardDivider} />
            <View style={styles.rewardStat}><Text style={styles.rewardStatValue}>{streak}</Text><Text style={styles.rewardStatLabel}>DAY STREAK</Text></View>
          </View>
          <View style={styles.streakCallout}>
            <Image
              source={require('@/assets/images/streak_emoji.png')}
              style={{ width: 22, height: 22 }}
              resizeMode="contain"
            />
            <Text style={styles.streakCalloutText}>Your streak is safe for another day.</Text>
          </View>
        </Animated.View>
        <View style={styles.rewardBottom}><StrongButton label="Back to today" onPress={onContinue} color={theme.purple} icon="arrow-right" /></View>
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

function Topics({ onNav, onTopic }: { onNav: (tab: Tab) => void; onTopic: (topic: string) => void }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('dsa');
  const subjects = getAllSubjects();
  const currentSubject = getSubjectById(selectedSubjectId) || subjects[0];

  return (
    <ScreenShell bottomNav onNav={onNav} activeTab="topics">
      <View style={styles.pageTop}><View><Text style={styles.eyebrow}>CURRICULUM</Text><Text style={styles.pageTitle}>Explore Subjects</Text></View><IconButton icon="search" onPress={() => undefined} /></View>
      <Text style={styles.pageBody}>Switch between engineering disciplines to build deep problem-solving intuition.</Text>

      <SubjectPicker
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={setSelectedSubjectId}
      />

      <View
        style={[
          styles.topicFeatured,
          {
            backgroundColor: currentSubject.accentColor,
            shadowColor: currentSubject.darkColor,
            borderBottomColor: currentSubject.darkColor,
          },
        ]}
      >
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

function Leaderboard({
  user,
  onNav,
  onPractice,
}: {
  user?: UserAccount | null;
  onNav: (tab: Tab) => void;
  onPractice: () => void;
}) {
  const [ranks, setRanks] = useState<LeaderboardRank[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRanks = useCallback(async () => {
    try {
      const data = await getGlobalLeaderboard(user?.id);
      setRanks(data);
    } catch (err) {
      console.warn('Leaderboard load error:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRanks();
  }, [fetchRanks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRanks();
    setRefreshing(false);
  };

  const userRankItem = ranks.find((r) => r.isUser);
  const userRank = userRankItem?.rank || 4;
  const userXp = userRankItem?.xp || 0;
  const targetAbove = ranks.find((r) => r.rank === userRank - 1);
  const diffXp = targetAbove ? Math.max(10, targetAbove.xp - userXp + 10) : 0;

  return (
    <ScreenShell
      bottomNav
      onNav={onNav}
      activeTab="leaderboard"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />}
    >
      <View style={styles.leagueHeroCard}>
        <View style={styles.leagueHeroTop}>
          <View style={styles.leagueBadgeWrap}>
            <Feather name="award" size={26} color="#FFFFFF" strokeWidth={2.8} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.leagueTimerRow}>
              <Feather name={'clock' as any} size={13} color="#DDD6FE" />
              <Text style={styles.leagueTimerText}>Live Weekly League</Text>
            </View>
            <Text style={styles.leagueTitle}>Obsidian League</Text>
          </View>
          <Pressable onPress={onRefresh} style={styles.refreshBtn} accessibilityLabel="Refresh rankings">
            <Feather name="trending-up" size={18} color="#7C3AED" />
          </Pressable>
        </View>
        <Text style={styles.leagueSubtitle}>Top 10 engineers promote to Diamond League on Sunday.</Text>
      </View>

      <View style={styles.userRankBanner}>
        <Mascot pose={(user?.avatarPose as any) || 'accepted'} size={54} />
        <View style={{ flex: 1 }}>
          <Text style={styles.userRankHeading}>
            {userRank <= 10 ? `You're #${userRank} in Promotion Zone!` : `You're #${userRank} in Obsidian League`}
          </Text>
          <Text style={styles.userRankSub}>
            {targetAbove
              ? `${diffXp} XP behind #${userRank - 1} ${targetAbove.name}. Solve 1 rep to climb.`
              : `You're leading the league! Keep practicing to stay #1.`}
          </Text>
        </View>
        <Pressable onPress={onPractice} style={styles.climbBtn}>
          <Text style={styles.climbBtnText}>Solve</Text>
          <Feather name="arrow-up-right" size={14} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weekly Standings</Text>
        <Text style={styles.topicCount}>{ranks.length} Engineers</Text>
      </View>

      <View style={styles.leaderboardList}>
        {ranks.map((item, index) => {
          const isTopThree = item.rank <= 3;
          return (
            <React.Fragment key={item.rank}>
              {index === 10 && (
                <View style={styles.promotionCutoffLine}>
                  <View style={styles.cutoffPill}>
                    <Text style={styles.cutoffPillText}>PROMOTION ZONE (TOP 10)</Text>
                  </View>
                </View>
              )}
              <View
                style={[
                  styles.rankRow,
                  item.isUser && styles.rankRowUser,
                  isTopThree && styles.rankRowTopThree,
                ]}
              >
                <View style={styles.rankNumberBox}>
                  {item.badge ? (
                    <Text style={styles.rankMedalText}>{item.badge}</Text>
                  ) : (
                    <Text
                      style={[
                        styles.rankNumberText,
                        item.isUser && styles.rankNumberTextUser,
                      ]}
                    >
                      {item.rank}
                    </Text>
                  )}
                </View>

                <View style={styles.rankAvatar}>
                  <Mascot pose={(item.avatarPose as any) || 'accepted'} size={36} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.rankName,
                      item.isUser && styles.rankNameUser,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.rankMetaRow}>
                    <Image
                      source={require('@/assets/images/streak_emoji.png')}
                      style={{ width: 13, height: 13 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.rankStreakText}>{item.streak} days</Text>
                  </View>
                </View>

                <View style={styles.rankXpBadge}>
                  <Text style={styles.rankXpValue}>{item.xp}</Text>
                  <Text style={styles.rankXpLabel}>XP</Text>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </ScreenShell>
  );
}

function Profile({
  user,
  profile,
  progress,
  updates,
  onSignOut,
  onNav,
  onPaywall,
}: {
  user?: UserAccount | null;
  profile?: UserProfile | null;
  progress?: UserProgress | null;
  updates?: ReturnType<typeof useAppUpdates>;
  onSignOut?: () => void;
  onNav: (tab: Tab) => void;
  onPaywall: () => void;
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
        <View style={styles.avatarLarge}>
          <Mascot pose={(user?.avatarPose as any) || 'accepted'} size={68} />
        </View>
        <Text style={styles.profileName}>{user?.displayName || 'Alex Morgan'}</Text>
        <Text style={styles.profileSince}>@{user?.username || 'alex_code'}</Text>
      </View>
      <View style={styles.companionCard}>
        <Mascot pose="speedrun" size={72} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.companionTitle}>Coding Companion: Kai</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.companionSub}>Streak Buddy · {streak} Day Streak</Text>
            <Image
              source={require('@/assets/images/streak_emoji.png')}
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.companionBadge}><Text style={styles.companionBadgeText}>ACTIVE</Text></View>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.profileStat}>
          <Image
            source={require('@/assets/images/streak_emoji.png')}
            style={{ width: 22, height: 22, marginBottom: 2 }}
            resizeMode="contain"
          />
          <Text style={styles.profileStatValue}>{streak}</Text>
          <Text style={styles.profileStatLabel}>day streak</Text>
        </View>
        <View style={styles.profileStat}>
          <Feather name="star" size={20} color={theme.yellowDark} strokeWidth={2.8} />
          <Text style={styles.profileStatValue}>{xp.toLocaleString()}</Text>
          <Text style={styles.profileStatLabel}>total XP</Text>
        </View>
        <View style={styles.profileStat}>
          <Feather name="check-circle" size={20} color={theme.purple} strokeWidth={2.8} />
          <Text style={styles.profileStatValue}>{repsCompleted}</Text>
          <Text style={styles.profileStatLabel}>reps solved</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Weekly consistency</Text><Text style={styles.seeAll}>This week</Text></View>
      <View style={styles.consistencyCard}>
        <View style={styles.consistencyTop}>
          <Text style={styles.consistencyTitle}>You’re building a real habit.</Text>
          <Text style={styles.consistencyPercent}>{consistencyPct}%</Text>
        </View>
        <ProgressBar value={consistencyPct / 100} color={theme.mintDark} height={12} />
        <Text style={styles.consistencyNote}>{weekReps} out of 7 daily reps completed</Text>
      </View>
      <View style={styles.proBadgeCard}><View style={styles.proIcon}><Feather name="award" size={24} color={theme.purpleDark} strokeWidth={2.6} /></View><View style={{ flex: 1 }}><Text style={styles.proTitle}>Get more from your reps</Text><Text style={styles.proSub}>Unlock smart review plans and deeper stats.</Text></View><Pressable onPress={onPaywall}><Feather name="chevron-right" size={20} color={theme.purpleDark} /></Pressable></View>
      
      <Text style={styles.settingsLabel}>TURSO DATABASE & ONBOARDING DATA</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingsRow}>
          <Feather name="database" size={18} color={theme.purple} />
          <Text style={styles.settingsText}>Database Engine</Text>
          <Text style={styles.settingsValue}>Turso Edge DB</Text>
        </View>
        <View style={styles.settingsRow}>
          <Feather name={'clock' as any} size={18} color={theme.mutedForeground} />
          <Text style={styles.settingsText}>Daily Practice Goal</Text>
          <Text style={styles.settingsValue}>{profile?.dailyGoalMinutes || 10} min / day</Text>
        </View>
        <View style={styles.settingsRow}>
          <Feather name="layers" size={18} color={theme.mutedForeground} />
          <Text style={styles.settingsText}>Selected Tracks</Text>
          <Text style={styles.settingsValue}>
            {(profile?.prioritySubjects || ['dsa']).join(', ').toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.settingsLabel}>APP VERSION & OVER-THE-AIR UPDATES</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingsRow}>
          <Feather name="download-cloud" size={18} color={theme.purple} />
          <Text style={styles.settingsText}>EAS Update Channel</Text>
          <Text style={styles.settingsValue}>preview (Live)</Text>
        </View>
        <View style={styles.settingsRow}>
          <Feather name="git-commit" size={18} color={theme.mutedForeground} />
          <Text style={styles.settingsText}>Release Build ID</Text>
          <Text style={styles.settingsValue}>
            {updates?.updateId ? updates.updateId.slice(0, 8) : 'Embedded v1.0'}
          </Text>
        </View>
        {updates?.statusMessage ? (
          <View style={styles.updateStatusNotice}>
            <Feather name="info" size={14} color={theme.purpleDark} />
            <Text style={styles.updateStatusNoticeText}>{updates.statusMessage}</Text>
          </View>
        ) : null}
        <Pressable
          disabled={updates?.checking || updates?.downloading}
          onPress={() => {
            if (updates?.updateReady) {
              void updates.reload();
            } else if (updates?.check) {
              void updates.check();
            }
          }}
          style={styles.checkUpdateBtn}
        >
          <Feather
            name={updates?.checking || updates?.downloading ? 'loader' : 'refresh-cw'}
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.checkUpdateBtnText}>
            {updates?.checking
              ? 'Checking for updates...'
              : updates?.downloading
              ? 'Downloading update...'
              : updates?.updateReady
              ? 'Update ready! Tap to reload'
              : 'Check for updates'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.settingsLabel}>ACCOUNT ACTIONS</Text>
      <View style={styles.settingsCard}>
        <Pressable onPress={onSignOut} style={styles.settingsRow}>
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={[styles.settingsText, { color: '#DC2626' }]}>Sign out of KaiCode</Text>
          <Feather name="chevron-right" size={17} color="#DC2626" />
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function Paywall({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell scroll={false}>
      <View style={styles.paywall}>
        <View style={styles.paywallTop}><IconButton icon="x" onPress={onBack} /><View style={styles.proPill}><Feather name="star" size={15} color={theme.purpleDark} fill={theme.purpleDark} /><Text style={styles.proPillText}>{APP_NAME.toUpperCase()} PRO</Text></View><View style={{ width: 44 }} /></View>
        <View style={styles.paywallArt}>
          <Mascot pose="mindblown" size={145} />
        </View>
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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string | null }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: String(error?.message || error) };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.warn('KaiCode ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#0F172A',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 22,
              fontFamily: 'Nunito_800ExtraBold',
              marginBottom: 10,
            }}
          >
            KaiCode Recovery
          </Text>
          <Text
            style={{
              color: '#CBD5E1',
              fontSize: 13,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              lineHeight: 18,
              marginBottom: 24,
            }}
          >
            {this.state.error || 'A screen loading issue occurred. Tap below to refresh.'}
          </Text>
          <Pressable
            onPress={() => this.setState({ hasError: false, error: null })}
            style={{
              backgroundColor: '#7C3AED',
              paddingHorizontal: 24,
              paddingVertical: 14,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 14 }}>
              Reload Screen
            </Text>
          </Pressable>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

function KaiCodeApp() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedTopic, setSelectedTopic] = useState('Arrays');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [practiceLessonId, setPracticeLessonId] = useState<string>('two-sum');
  const [splash, setSplash] = useState(true);
  const appUpdates = useAppUpdates();

  useEffect(() => {
    async function initSession() {
      try {
        const session = await getStoredSession();
        if (session) {
          setCurrentUser(session);
          const [profile, progress] = await Promise.all([
            getUserProfile(session.id),
            getUserProgress(session.id),
          ]);
          setUserProfile(profile);
          setUserProgress(progress);
          if (profile?.completedOnboarding) {
            setScreen('home');
          } else {
            setScreen('onboarding');
          }
        } else {
          setScreen('auth');
        }
      } catch {
        setScreen('auth');
      } finally {
        setTimeout(() => setSplash(false), 500);
      }
    }
    initSession();
  }, []);

  const handleAuthSuccess = async (user: UserAccount, isNewUser: boolean) => {
    setCurrentUser(user);
    const progress = await getUserProgress(user.id);
    setUserProgress(progress);
    if (isNewUser) {
      setScreen('onboarding');
    } else {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
      if (profile?.completedOnboarding) {
        setScreen('home');
      } else {
        setScreen('onboarding');
      }
    }
  };

  const handleOnboardingComplete = async () => {
    if (currentUser) {
      const [updatedSession, profile, progress] = await Promise.all([
        getStoredSession(),
        getUserProfile(currentUser.id),
        getUserProgress(currentUser.id),
      ]);
      if (updatedSession) {
        setCurrentUser(updatedSession);
      }
      setUserProfile(profile);
      setUserProgress(progress);

      const primaryTrack = profile?.prioritySubjects?.[0];
      if (primaryTrack === 'system-design') {
        setSelectedTopic('system-caching');
      } else if (primaryTrack === 'core-cs') {
        setSelectedTopic('os-fundamentals');
      } else {
        setSelectedTopic('arrays-and-hashing');
      }
    }
    setActiveTab('home');
    setScreen('home');
  };

  const handleSignOut = async () => {
    await saveSession(null);
    setCurrentUser(null);
    setUserProfile(null);
    setUserProgress(null);
    setActiveTab('home');
    setScreen('auth');
  };

  const startPractice = (lessonId?: string) => {
    if (lessonId) {
      setPracticeLessonId(lessonId);
    }
    setScreen('practice');
  };

  const handlePracticeComplete = async (xpReward: number) => {
    if (currentUser) {
      const updated = await recordLessonCompleted(currentUser.id, practiceLessonId, xpReward);
      setUserProgress(updated);
    }
    setScreen('reward');
  };

  const goTab = (tab: Tab) => {
    setActiveTab(tab);
    setScreen(tab);
  };

  const isTabScreen =
    screen === 'home' ||
    screen === 'course' ||
    screen === 'topics' ||
    screen === 'leaderboard' ||
    screen === 'profile';

  if (splash) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashMascotBadge}>
          <Mascot pose="accepted" size={78} />
        </View>
        <Text style={styles.splashText}>
          kai<Text style={{ color: '#BAE6FD' }}>code</Text>
        </Text>
        <Text style={styles.splashSub}>DAILY DSA WITH KAI</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {screen === 'auth' && <AuthScreen onSuccess={handleAuthSuccess} />}
      {screen === 'onboarding' && (
        <OnboardingFlow
          user={
            currentUser || {
              id: 'guest',
              email: 'guest@kaicode.dev',
              username: 'coder',
              displayName: 'Guest Engineer',
              avatarPose: 'accepted',
              createdAt: Date.now(),
            }
          }
          onComplete={handleOnboardingComplete}
        />
      )}
      {screen === 'practice' && (
        <Practice
          lessonId={practiceLessonId}
          onBack={() => setScreen(activeTab)}
          onComplete={handlePracticeComplete}
        />
      )}
      {screen === 'reward' && (
        <Reward
          streak={userProgress?.streakCount || 1}
          onContinue={() => setScreen(activeTab)}
        />
      )}
      {screen === 'paywall' && <Paywall onBack={() => setScreen('profile')} />}

      {screen === 'home' && (
        <Home
          user={currentUser}
          profile={userProfile}
          progress={userProgress || undefined}
          isUpdating={appUpdates.downloading}
          onPractice={startPractice}
          onTopics={() => goTab('topics')}
          onCourse={() => goTab('course')}
          onProfile={() => goTab('profile')}
          onPaywall={() => setScreen('paywall')}
          onLeaderboard={() => goTab('leaderboard')}
          onNav={goTab}
        />
      )}
      {screen === 'course' && (
        <CoursePath
          topic={selectedTopic}
          progress={userProgress || undefined}
          onBack={() => goTab('home')}
          onPractice={startPractice}
          onNav={goTab}
        />
      )}
      {screen === 'topics' && (
        <Topics
          onNav={goTab}
          onTopic={(topic) => {
            setSelectedTopic(topic);
            setScreen('course');
          }}
        />
      )}
      {screen === 'leaderboard' && (
        <Leaderboard
          user={currentUser}
          onNav={goTab}
          onPractice={() => startPractice()}
        />
      )}
      {screen === 'profile' && (
        <Profile
          user={currentUser}
          profile={userProfile}
          progress={userProgress}
          updates={appUpdates}
          onSignOut={handleSignOut}
          onNav={goTab}
          onPaywall={() => setScreen('paywall')}
        />
      )}

      <UpdateBanner
        downloading={appUpdates.downloading}
        updateReady={appUpdates.updateReady}
        onReload={appUpdates.reload}
      />

      {isTabScreen && <BottomNav active={activeTab} onChange={goTab} />}
    </View>
  );
}

export default function Index() {
  return (
    <ErrorBoundary>
      <KaiCodeApp />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  fixedContent: { flex: 1, paddingHorizontal: 20 },
  strongButton: { height: 58, borderRadius: 99, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 26, shadowOffset: { width: 0, height: 5 }, shadowRadius: 12, elevation: 5 },
  buttonPressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  disabledButton: { opacity: 0.5 },
  buttonLabel: { fontFamily: 'Nunito_900Black', fontSize: 18.5, letterSpacing: -0.2 },
  iconButton: { width: 44, height: 44, borderRadius: 99, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  progressTrack: { borderRadius: 99, backgroundColor: theme.line, overflow: 'hidden' },
  progressFill: { borderRadius: 99 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.purple },
  splashMark: { width: 76, height: 76, borderRadius: 25, backgroundColor: theme.purpleDark, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }], shadowColor: theme.purpleDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6 },
  splashMascotBadge: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderBottomWidth: 6,
    borderColor: '#DDD6FE',
    borderBottomColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  splashText: { marginTop: 19, color: theme.card, fontFamily: 'Nunito_900Black', fontSize: 36, letterSpacing: -1 },
  splashSub: { color: '#E9D5FF', fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 2, marginTop: 7 },
  logoLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoLockupCompact: { gap: 7 },
  logoMark: { width: 37, height: 37, borderRadius: 12, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  logoMarkMascot: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderColor: '#DDD6FE',
    borderBottomColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkMascotCompact: {
    width: 32,
    height: 32,
    borderRadius: 11,
    borderWidth: 1.5,
    borderBottomWidth: 2.5,
  },
  logoText: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 24, letterSpacing: -0.5 },
  logoTextCompact: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 18, letterSpacing: -0.5 },
  onboarding: { flex: 1, justifyContent: 'space-between', paddingBottom: 8 },
  onboardingArt: { height: isCompact ? 245 : 285, marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  artBlob: { position: 'absolute', width: 250, height: 215, borderRadius: 110, backgroundColor: '#F5F3FF', transform: [{ rotate: '12deg' }] },
  pedestalWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pedestalBase: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pedestalDisc: {
    position: 'absolute',
    bottom: -3,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    zIndex: -1,
  },
  pedestalStars: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathMascotAnchor: {
    position: 'absolute',
    left: -94,
    top: -10,
    zIndex: 15,
  },
  nodeWithTooltip: {
    alignItems: 'center',
    position: 'relative',
  },
  startTooltip: {
    position: 'absolute',
    top: -38,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    borderBottomWidth: 3.5,
    borderBottomColor: '#7C3AED',
    zIndex: 20,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  startTooltipText: {
    color: '#7C3AED',
    fontFamily: 'Nunito_900Black',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  startTooltipTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#7C3AED',
  },
  greetingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderBottomWidth: 4.5,
    borderColor: theme.line,
    borderBottomColor: '#CBD5E1',
    marginTop: 4,
  },
  greetingCopy: {
    flex: 1,
    gap: 4,
  },
  streakBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderBottomWidth: 2.5,
    borderColor: '#DDD6FE',
    borderBottomColor: '#7C3AED',
  },
  streakNumberInline: {
    color: '#7C3AED',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  explanationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trapWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderColor: '#FECACA',
    borderBottomColor: '#EF4444',
    borderRadius: 18,
    padding: 13,
    marginTop: 12,
  },
  trapWarningTitle: {
    color: '#991B1B',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    marginBottom: 2,
  },
  trapWarningBody: {
    color: '#7F1D1D',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  companionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: theme.line,
    borderBottomColor: '#CBD5E1',
    padding: 14,
    marginTop: 16,
    marginBottom: 10,
  },
  companionTitle: {
    color: theme.ink,
    fontFamily: 'Nunito_900Black',
    fontSize: 16,
  },
  companionSub: {
    color: theme.mutedForeground,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 2,
  },
  companionBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  companionBadgeText: {
    color: '#7C3AED',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
  },
  floatingCode: { position: 'absolute', right: 28, top: 27, width: 64, height: 48, borderRadius: 15, backgroundColor: theme.sky, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '9deg' }], shadowColor: theme.skyDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  floatingCodeText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 20 },
  spark: { position: 'absolute', borderRadius: 9, backgroundColor: theme.yellow, alignItems: 'center', justifyContent: 'center' },
  sparkOne: { width: 36, height: 36, left: 34, top: 57, transform: [{ rotate: '-12deg' }] },
  sparkTwo: { width: 27, height: 27, right: 47, bottom: 20, backgroundColor: theme.coral, transform: [{ rotate: '11deg' }] },
  sparkText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 22 },
  onboardingCopy: { gap: 10 },
  eyebrow: { fontFamily: 'Nunito_800ExtraBold', color: theme.purple, letterSpacing: 1.4, fontSize: 11 },
  heroTitle: { fontFamily: 'Nunito_900Black', color: theme.ink, fontSize: isCompact ? 35 : 39, lineHeight: isCompact ? 40 : 45, letterSpacing: -1 },
  heroBody: { fontFamily: 'Inter_400Regular', color: theme.mutedForeground, fontSize: 16, lineHeight: 24, maxWidth: 340 },
  onboardingActions: { gap: 12, marginTop: 16 },
  smallNote: { textAlign: 'center', color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepLabel: { fontFamily: 'Nunito_800ExtraBold', color: theme.mutedForeground, fontSize: 11, letterSpacing: 1.1 },
  stepDots: { flexDirection: 'row', gap: 5 },
  stepDot: { width: 22, height: 6, borderRadius: 5, backgroundColor: theme.line },
  stepDotActive: { width: 22, height: 6, borderRadius: 5, backgroundColor: theme.purple },
  goalIntro: { marginTop: 25, gap: 9 },
  pageTitle: { fontFamily: 'Nunito_900Black', fontSize: 32, letterSpacing: -0.8, color: theme.ink },
  pageBody: { fontFamily: 'Inter_400Regular', color: theme.mutedForeground, fontSize: 16, lineHeight: 24 },
  goalList: { gap: 12, marginTop: 13 },
  goalCard: { borderRadius: 19, borderWidth: 2, borderBottomWidth: 4.5, borderBottomColor: '#CBD5E1', borderColor: theme.line, backgroundColor: theme.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 83 },
  goalCardActive: { borderColor: theme.purple, borderBottomColor: '#5B21B6', backgroundColor: '#F5F3FF' },
  goalIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  goalCopy: { flex: 1, gap: 3 },
  goalLabel: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 17 },
  goalLabelActive: { color: theme.purpleDark },
  goalDetail: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13 },
  goalDetailActive: { color: theme.purpleDark },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: theme.purple },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.purple },
  goalBottom: { alignItems: 'center', gap: 5, marginTop: 'auto' },
  goalTip: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 11 },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  avatarTiny: { width: 34, height: 34, borderRadius: 12, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', marginRight: 'auto' },
  avatarTinyText: { color: theme.card, fontFamily: 'Nunito_800ExtraBold', fontSize: 15 },
  statPill: { height: 34, borderRadius: 12, paddingHorizontal: 10, backgroundColor: theme.card, borderWidth: 1.5, borderBottomWidth: 3, borderBottomColor: '#CBD5E1', borderColor: theme.line, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statValue: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 },
  bellButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: theme.card, borderWidth: 1.5, borderBottomWidth: 3, borderBottomColor: '#CBD5E1', borderColor: theme.line, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', top: 7, right: 7, width: 5, height: 5, backgroundColor: theme.coral, borderRadius: 3 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  greeting: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 26, letterSpacing: -0.5 },
  greetingSub: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  streakBadge: { backgroundColor: '#F5F3FF', borderRadius: 17, padding: 11, alignItems: 'center', minWidth: 74, gap: 1, borderWidth: 1.5, borderBottomWidth: 3.5, borderColor: '#DDD6FE', borderBottomColor: '#7C3AED' },
  streakNumber: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 22 },
  streakLabel: { color: '#7C3AED', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.4 },
  dailyCard: { backgroundColor: theme.card, borderRadius: 24, borderWidth: 2, borderBottomWidth: 5, borderBottomColor: '#CBD5E1', borderColor: theme.line, padding: 20, gap: 14 },
  dailyCardDone: { borderColor: '#A7F3D0', borderBottomColor: '#059669', backgroundColor: '#F0FDF4' },
  dailyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#F5F3FF' },
  tagText: { color: '#7C3AED', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.7 },
  tagDone: { backgroundColor: '#DCFCE7', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  tagDoneText: { color: '#16A34A', fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.7 },
  dailyMinutes: { color: theme.mutedForeground, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 0.8 },
  dailyMinutesDone: { color: '#16A34A', fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 0.8 },
  dailyTitle: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 28, letterSpacing: -0.8 },
  dailyDescription: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: -6 },
  dailyMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  doneBodyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: theme.navy, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  xpChip: { marginLeft: 'auto', backgroundColor: theme.yellow, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderBottomWidth: 2.5, borderColor: '#DDA900' },
  xpChipText: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  activeTrackCard: {
    backgroundColor: theme.card,
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 4.5,
    borderBottomColor: '#CBD5E1',
    borderColor: theme.line,
    padding: 18,
    gap: 12,
  },
  activeTrackHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeTrackBadge: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  activeTrackEyebrow: { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: '#64748B', letterSpacing: 0.7 },
  activeTrackTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 17, color: theme.ink, letterSpacing: -0.3 },
  activeTrackCount: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#64748B' },
  activeTrackDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#64748B', lineHeight: 18 },
  activeTrackProgressWrap: { gap: 6 },
  activeTrackPercentText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: '#64748B', letterSpacing: 0.5 },
  activeTrackFooterBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  activeTrackFooterText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: theme.purple },
  weeklyPulseCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    borderColor: theme.line,
    padding: 18,
    gap: 14,
  },
  pulseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pulseSubtitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: theme.purple },
  leagueSnapshotCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderColor: '#DDD6FE',
    borderBottomColor: '#7C3AED',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  leagueIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueCardEyebrow: { fontFamily: 'Nunito_800ExtraBold', fontSize: 10, color: '#7C3AED', letterSpacing: 0.6 },
  leagueCardTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#1E1B4B' },
  leagueCardSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6D28D9', marginTop: 1 },
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
  bottomNav: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 16,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CBD5E1',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  animatedTabIndicator: {
    position: 'absolute',
    left: 8,
    top: 6,
    bottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  indicatorPill: {
    width: '92%',
    height: 52,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    borderBottomWidth: 3.5,
    borderBottomColor: '#5B21B6',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    gap: 2,
    height: '100%',
  },
  navIconWrapper: {
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    color: '#64748B',
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
  },
  navBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  navBadgeDotActive: {
    backgroundColor: '#FDE047',
    borderColor: '#7C3AED',
  },
  leagueHeroCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 22,
    padding: 18,
    gap: 10,
    borderBottomWidth: 5,
    borderBottomColor: '#5B21B6',
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  leagueHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  leagueBadgeWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#9333EA',
  },
  leagueTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  leagueTimerText: {
    color: '#DDD6FE',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  leagueTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_900Black',
    fontSize: 22,
    letterSpacing: -0.5,
  },
  leagueSubtitle: {
    color: '#EDE9FE',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 17,
  },
  userRankBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    borderBottomWidth: 3.5,
    borderBottomColor: '#7C3AED',
  },
  userRankHeading: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#7C3AED',
  },
  userRankSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  climbBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  climbBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
  },
  leaderboardList: {
    gap: 9,
    paddingBottom: 24,
  },
  rankRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 2.5,
    borderBottomColor: '#CBD5E1',
  },
  rankRowUser: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderBottomColor: '#7C3AED',
    borderWidth: 1.5,
  },
  rankRowTopThree: {
    borderColor: '#FEF08A',
    borderBottomColor: '#FACC15',
  },
  rankNumberBox: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankMedalText: {
    fontSize: 18,
  },
  rankNumberText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#64748B',
  },
  rankNumberTextUser: {
    color: '#7C3AED',
  },
  rankAvatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankName: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#0F172A',
  },
  rankNameUser: {
    color: '#7C3AED',
  },
  rankMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  rankStreakText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#64748B',
  },
  rankXpBadge: {
    alignItems: 'flex-end',
  },
  rankXpValue: {
    fontFamily: 'Nunito_900Black',
    fontSize: 15,
    color: '#0F172A',
  },
  rankXpLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: '#94A3B8',
  },
  promotionCutoffLine: {
    alignItems: 'center',
    marginVertical: 6,
  },
  cutoffPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cutoffPillText: {
    color: '#059669',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  practiceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  practiceFixedHeader: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.background },
  practiceScroll: { flex: 1 },
  practiceScrollContent: { paddingHorizontal: 20, paddingTop: 7, paddingBottom: 26, gap: 16 },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginVertical: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#7C3AED',
  },
  practiceActionBar: { paddingTop: 12, paddingHorizontal: 20, borderTopWidth: 1.5, borderTopColor: theme.line, backgroundColor: theme.card },
  practiceProgressWrap: { flex: 1, gap: 5 },
  practiceProgressText: { textAlign: 'center', color: theme.mutedForeground, fontFamily: 'Nunito_800ExtraBold', fontSize: 10, letterSpacing: 0.5 },
  xpTiny: { backgroundColor: theme.yellow, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderBottomWidth: 2.5, borderColor: '#DDA900' },
  xpTinyText: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 11 },
  lessonContextRow: { backgroundColor: '#F5F3FF', borderRadius: 15, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderBottomWidth: 3, borderColor: '#DDD6FE', borderBottomColor: '#C4B5FD' },
  lessonContextIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  lessonContextTitle: { color: theme.purple, fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  lessonContextSub: { color: theme.purpleDark, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  problemIntro: { gap: 8, marginTop: 4 },
  problemTagRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  problemTag: { color: theme.skyDark, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 1.2 },
  problemDifficulty: { color: theme.purple, fontFamily: 'Nunito_800ExtraBold', fontSize: 11, letterSpacing: 1.2 },
  problemTitle: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 32, letterSpacing: -0.8 },
  problemPrompt: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 15, lineHeight: 22 },
  coachBubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 8 },
  coachSpeechBubble: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#E2E8F0', borderBottomWidth: 3.5, borderBottomColor: '#CBD5E1', padding: 12, paddingHorizontal: 14, position: 'relative' },
  speechTail: { position: 'absolute', left: -7, top: '50%', marginTop: -5, width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 7, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#CBD5E1' },
  speechBubbleTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#0F172A', marginBottom: 2 },
  speechBubbleBody: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17, color: '#475569' },
  exampleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  exampleItem: { gap: 2 },
  exampleDivider: { height: 1, backgroundColor: '#F1F5F9' },
  exampleLabel: { color: '#64748B', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1 },
  exampleValue: { color: '#0F172A', fontFamily: 'monospace', fontSize: 13, fontWeight: '600', marginTop: 2 },
  learningGoalCard: { backgroundColor: '#F5F3FF', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  learningGoalIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  learningGoalTitle: { color: theme.purple, fontFamily: 'Inter_700Bold', fontSize: 13 },
  learningGoalBody: { color: theme.navy, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 2 },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    paddingTop: 16,
    position: 'relative',
    minHeight: 240,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  codeCopyButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeScrollContent: { paddingRight: 36 },
  codeContainer: { minWidth: '100%' },
  codeLineText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  codeEditInput: {
    flex: 1,
    padding: 0,
    paddingRight: 36,
    color: '#0F172A',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
    minHeight: 210,
  },
  explanationToggle: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 2 },
  explanationIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  explanationText: { color: theme.purple, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  explanationCard: { borderRadius: 15, backgroundColor: '#F5F3FF', padding: 14, gap: 5 },
  explanationTitle: { color: theme.purple, fontFamily: 'Inter_700Bold', fontSize: 13 },
  explanationBody: { color: theme.navy, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  complexityRow: { borderRadius: 15, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  complexityItem: { alignItems: 'center', gap: 4, flex: 1 },
  complexityLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  complexityValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 13 },
  complexityDivider: { width: 1, height: 28, backgroundColor: theme.line },
  editorFooter: { textAlign: 'center', color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: -9 },
  rewardScreen: { flex: 1, justifyContent: 'space-between' },
  rewardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rewardTopLabel: { color: theme.purple, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, fontSize: 10 },
  rewardContent: { alignItems: 'center', marginTop: -20 },
  rewardBadge: { width: 105, height: 105, borderRadius: 36, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }], shadowColor: '#5B21B6', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 1, shadowRadius: 0, elevation: 7 },
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
  confetti: { ...StyleSheet.absoluteFill },
  confettiPiece: { position: 'absolute', width: 10, height: 17, borderRadius: 3 },
  pageTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicFeatured: {
    backgroundColor: theme.purple,
    borderRadius: 21,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 5,
    borderBottomColor: theme.purpleDark,
    shadowColor: theme.purpleDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  featuredIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: theme.purpleDark, alignItems: 'center', justifyContent: 'center' },
  featuredLabel: { color: '#DDD6FE', fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  featuredTitle: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 3, marginBottom: 9 },
  featuredSub: { color: '#EDE9FE', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 7 },
  topicCount: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  topicCard: { width: '48%', backgroundColor: theme.card, borderRadius: 19, borderWidth: 1.5, borderColor: theme.line, padding: 14, minHeight: 170, alignItems: 'center', gap: 5 },
  ring: { alignItems: 'center', justifyContent: 'center', borderWidth: 7, position: 'relative', overflow: 'hidden' },
  ringArc: { position: 'absolute', borderWidth: 7 },
  ringText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  topicName: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 2, textAlign: 'center' },
  topicProgress: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11 },
  topicMiniIcon: { position: 'absolute', right: 11, top: 11, width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  courseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  courseTopLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  courseHero: { backgroundColor: theme.purple, borderRadius: 21, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: theme.purpleDark, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  courseHeroIcon: { width: 53, height: 53, borderRadius: 17, backgroundColor: theme.purpleDark, alignItems: 'center', justifyContent: 'center' },
  courseEyebrow: { color: theme.card, opacity: 0.8, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  courseTitle: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 22, marginTop: 2 },
  courseSub: { color: theme.card, opacity: 0.85, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  courseProgress: { width: 49, height: 49, borderRadius: 17, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  courseProgressNumber: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 19, lineHeight: 20 },
  courseProgressLabel: { color: theme.purpleDark, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  courseTabs: { height: 43, borderRadius: 13, backgroundColor: theme.muted, padding: 4, flexDirection: 'row', gap: 3 },
  courseTabActive: { flex: 1, borderRadius: 10, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', shadowColor: theme.line, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2 },
  courseTab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  courseTabActiveText: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 12 },
  courseTabText: { color: theme.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  courseSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  courseSectionSub: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 3 },
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
  courseCallout: { backgroundColor: '#F5F3FF', borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderBottomWidth: 3, borderColor: '#DDD6FE', borderBottomColor: '#7C3AED' },
  courseCalloutIcon: { width: 29, height: 29, borderRadius: 9, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  courseCalloutText: { flex: 1, color: '#7C3AED', fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 17 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileHeaderTitle: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 17 },
  profileIdentity: { alignItems: 'center', gap: 7, marginTop: 7 },
  avatarLarge: { width: 85, height: 85, borderRadius: 30, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }], position: 'relative' },
  avatarLargeText: { color: theme.card, fontFamily: 'Inter_700Bold', fontSize: 38 },
  avatarCheck: { position: 'absolute', right: -4, bottom: -3, width: 25, height: 25, borderRadius: 10, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: theme.background },
  profileName: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.6 },
  profileSince: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12 },
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
  benefitCheck: { width: 24, height: 24, borderRadius: 8, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  benefitText: { color: theme.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  priceRow: { backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 21 },
  priceUnit: { color: theme.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12 },
  priceFine: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2 },
  priceSave: { color: theme.purpleDark, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 },
  paywallFine: { color: theme.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 9, textAlign: 'center', marginTop: 1 },
  langSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  langPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langPillActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  langPillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#64748B',
  },
  langPillTextActive: {
    color: '#7C3AED',
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginVertical: 14,
    gap: 12,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quizBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quizBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#D97706',
    letterSpacing: 0.6,
  },
  quizQuestion: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },
  quizOptionBtn: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quizOptionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderBottomColor: '#059669',
  },
  quizOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderBottomColor: '#DC2626',
  },
  quizOptionIndex: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionIndexText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#475569',
  },
  quizOptionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#1E293B',
    flex: 1,
    lineHeight: 18,
  },
  quizFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    marginTop: 4,
  },
  quizFeedbackText: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#6D28D9',
    lineHeight: 18,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateFloatingBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 92,
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderBottomWidth: 4,
    borderBottomColor: '#5B21B6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  updateFloatingTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
  },
  updateFloatingSub: {
    color: '#DDD6FE',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  updateFloatingButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderBottomWidth: 2.5,
    borderBottomColor: '#5B21B6',
  },
  updateFloatingButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
  },
  updateSpinnerPill: {
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  updateSpinnerPillText: {
    color: '#C4B5FD',
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },
  updateStatusNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F3FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginTop: 8,
  },
  updateStatusNoticeText: {
    color: '#6D28D9',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    flex: 1,
  },
  checkUpdateBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    borderBottomWidth: 3.5,
    borderBottomColor: '#5B21B6',
  },
  checkUpdateBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
  },
  updatingHeaderPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginRight: 6,
  },
  updatingHeaderPillText: {
    color: '#854D0E',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
  },
});