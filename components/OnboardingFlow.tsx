import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { saveOnboardingProfile, UserAccount } from '@/services/turso';

interface OnboardingFlowProps {
  user: UserAccount;
  onComplete: () => void;
}

const AVATAR_OPTIONS = [
  { pose: 'accepted', label: 'Confident Dev', tag: 'Balanced and steady', image: require('@/assets/images/kai_accepted.png') },
  { pose: 'coding', label: 'Terminal Hacker', tag: 'Hands on builder', image: require('@/assets/images/kai_coding.png') },
  { pose: 'eureka', label: 'Lightbulb Thinker', tag: 'Aha moments', image: require('@/assets/images/kai_eureka.png') },
  { pose: 'speedrun', label: 'Speedrunner', tag: 'Fast pace solver', image: require('@/assets/images/kai_speedrun.png') },
];

const TRACK_OPTIONS = [
  { id: 'dsa', title: 'Data Structures & Algorithms', desc: 'Arrays, Two Pointers, Trees, Graphs, DP', icon: 'code' as const, color: '#7C3AED' },
  { id: 'core-cs', title: 'Core Computer Science', desc: 'Operating Systems, DBMS, Computer Networks', icon: 'cpu' as const, color: '#EAB308' },
  { id: 'system-design', title: 'System Design', desc: 'Distributed Caching, Microservices, Scalability', icon: 'layers' as const, color: '#0284C7' },
];

const EXPERIENCE_OPTIONS = [
  { id: 'beginner', title: 'Beginning my journey', detail: 'College 1st or 2nd year, learning syntax and basics' },
  { id: 'intermediate', title: 'Practicing fundamentals', detail: 'Know core loops and arrays, leveling up problem solving' },
  { id: 'advanced', title: 'Interview prep grind', detail: 'Targeting top tier product companies and FAANG' },
];

const TIME_OPTIONS = [
  { minutes: 5, label: '5 min / day', tag: 'Casual daily warmup', icon: 'coffee' as const },
  { minutes: 10, label: '10 min / day', tag: 'Recommended sweet spot', icon: 'sun' as const, isPopular: true },
  { minutes: 15, label: '15 min / day', tag: 'Serious interview prep', icon: 'zap' as const },
  { minutes: 20, label: '20 min / day', tag: 'Beast mode mastery', icon: 'award' as const },
];

export function OnboardingFlow({ user, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarPose || 'accepted');
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['dsa']);
  const [selectedExperience, setSelectedExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [saving, setSaving] = useState(false);

  const tap = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {}
    }
  };

  const toggleTrack = (trackId: string) => {
    tap();
    if (selectedTracks.includes(trackId)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter((t) => t !== trackId));
      }
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const handleNext = async () => {
    tap();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setSaving(true);
    await saveOnboardingProfile({
      userId: user.id,
      experienceLevel: selectedExperience,
      dailyGoalMinutes: selectedMinutes,
      prioritySubjects: selectedTracks,
      targetGoal: 'faang_and_core',
    });
    setSaving(false);
    onComplete();
  };

  const handleBack = () => {
    tap();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {step > 1 ? (
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Feather name="arrow-left" size={18} color="#0F172A" />
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
        <Text style={styles.stepCounter}>STEP {step} OF 4</Text>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBarFill, { width: `${(step / 4) * 100}%` }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.heroRow}>
              <View style={styles.mascotPreviewBox}>
                <Image
                  source={AVATAR_OPTIONS.find((a) => a.pose === selectedAvatar)?.image}
                  style={styles.largeMascot}
                  resizeMode="contain"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Pick your Kai mascot</Text>
                <Text style={styles.subtitle}>
                  Hey @{user.username}! Choose the Kai avatar that represents your coding vibe.
                </Text>
              </View>
            </View>

            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = selectedAvatar === item.pose;
                return (
                  <Pressable
                    key={item.pose}
                    onPress={() => {
                      tap();
                      setSelectedAvatar(item.pose);
                    }}
                    style={[
                      styles.avatarCard,
                      isSelected && styles.avatarCardSelected,
                    ]}
                  >
                    <Image source={item.image} style={styles.gridMascot} resizeMode="contain" />
                    <Text style={[styles.avatarLabel, isSelected && styles.avatarLabelSelected]}>
                      {item.label}
                    </Text>
                    <Text style={styles.avatarTag}>{item.tag}</Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Feather name="check" size={13} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>What do you want to master?</Text>
            <Text style={styles.subtitle}>
              Select the engineering tracks you want Kai to schedule in your daily reps.
            </Text>

            <View style={styles.list}>
              {TRACK_OPTIONS.map((track) => {
                const isSelected = selectedTracks.includes(track.id);
                return (
                  <Pressable
                    key={track.id}
                    onPress={() => toggleTrack(track.id)}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                  >
                    <View style={[styles.trackIconBox, { backgroundColor: track.color }]}>
                      <Feather name={track.icon as any} size={22} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                        {track.title}
                      </Text>
                      <Text style={styles.optionDetail}>{track.desc}</Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Feather name="check" size={14} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>What is your experience level?</Text>
            <Text style={styles.subtitle}>
              Kai calibrates your problem difficulty and hints based on your background.
            </Text>

            <View style={styles.list}>
              {EXPERIENCE_OPTIONS.map((exp) => {
                const isSelected = selectedExperience === exp.id;
                return (
                  <Pressable
                    key={exp.id}
                    onPress={() => {
                      tap();
                      setSelectedExperience(exp.id as any);
                    }}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                        {exp.title}
                      </Text>
                      <Text style={styles.optionDetail}>{exp.detail}</Text>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Set your daily goal</Text>
            <Text style={styles.subtitle}>
              Consistency beats cramming. How much time can you commit each day?
            </Text>

            <View style={styles.list}>
              {TIME_OPTIONS.map((time) => {
                const isSelected = selectedMinutes === time.minutes;
                return (
                  <Pressable
                    key={time.minutes}
                    onPress={() => {
                      tap();
                      setSelectedMinutes(time.minutes);
                    }}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                  >
                    <View style={[styles.timeIconWrap, isSelected && styles.timeIconWrapSelected]}>
                      <Feather name={time.icon} size={20} color={isSelected ? '#7C3AED' : '#64748B'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                          {time.label}
                        </Text>
                        {time.isPopular && (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>POPULAR</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.optionDetail}>{time.tag}</Text>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          disabled={saving}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.continueBtn,
            pressed && styles.continueBtnPressed,
            saving && styles.continueBtnDisabled,
          ]}
        >
          <Text style={styles.continueBtnText}>
            {saving
              ? 'Saving to Turso...'
              : step === 4
              ? 'Start Practicing with Kai'
              : 'Continue'}
          </Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" strokeWidth={2.8} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCounter: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#64748B',
    letterSpacing: 0.8,
  },
  progressBarWrap: {
    width: 60,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 99,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  stepContent: {
    gap: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  mascotPreviewBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeMascot: {
    width: 58,
    height: 58,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#0F172A',
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginTop: 2,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  avatarCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CBD5E1',
    padding: 14,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  avatarCardSelected: {
    borderColor: '#7C3AED',
    borderBottomColor: '#5B21B6',
    backgroundColor: '#F5F3FF',
  },
  gridMascot: {
    width: 58,
    height: 58,
  },
  avatarLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: '#0F172A',
    textAlign: 'center',
  },
  avatarLabelSelected: {
    color: '#7C3AED',
  },
  avatarTag: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 12,
    marginTop: 6,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    gap: 14,
  },
  optionCardSelected: {
    borderColor: '#7C3AED',
    borderBottomColor: '#5B21B6',
    backgroundColor: '#F5F3FF',
  },
  trackIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeIconWrapSelected: {
    backgroundColor: '#EDE9FE',
  },
  optionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#0F172A',
  },
  optionTitleSelected: {
    color: '#7C3AED',
  },
  optionDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#7C3AED',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7C3AED',
  },
  popularBadge: {
    backgroundColor: '#FEF08A',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  popularText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 9,
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  bottomBar: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  continueBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    borderBottomWidth: 4.5,
    borderBottomColor: '#5B21B6',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueBtnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
