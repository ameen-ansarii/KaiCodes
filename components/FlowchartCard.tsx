import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FlowchartStep } from '../types/content';
import colors from '../constants/colors';

const theme = colors.light;

interface FlowchartCardProps {
  title: string;
  caption: string;
  steps: FlowchartStep[];
}

export function FlowchartCard({ title, caption, steps }: FlowchartCardProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Feather name="git-merge" size={16} color={theme.purple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </View>

      <View style={styles.stepIndicatorRow}>
        {steps.map((s, index) => {
          const isActive = index === activeStepIndex;
          const isDone = index < activeStepIndex;
          return (
            <Pressable
              key={s.stepNumber}
              onPress={() => setActiveStepIndex(index)}
              style={[
                styles.stepChip,
                isActive && styles.stepChipActive,
                isDone && styles.stepChipDone
              ]}
            >
              <Text style={[styles.stepChipText, isActive && styles.stepChipTextActive]}>
                Step {s.stepNumber}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.stepContentBox}>
        <Text style={styles.stepLabel}>{currentStep.label}</Text>
        <Text style={styles.stepExplanation}>{currentStep.explanation}</Text>

        {currentStep.stateIllustration?.values && (
          <View style={styles.stateContainer}>
            <Text style={styles.stateHeader}>Array & Pointer State</Text>
            <View style={styles.arrayRow}>
              {currentStep.stateIllustration.values.map((val, idx) => {
                const isPrimary = currentStep.stateIllustration?.primaryPointer === idx;
                const isHighlight = currentStep.stateIllustration?.highlightIndices?.includes(idx);
                return (
                  <View key={idx} style={styles.cellWrapper}>
                    <View
                      style={[
                        styles.arrayCell,
                        isPrimary && styles.cellPrimary,
                        isHighlight && styles.cellHighlight
                      ]}
                    >
                      <Text style={[styles.cellText, (isPrimary || isHighlight) && styles.cellTextActive]}>
                        {val}
                      </Text>
                    </View>
                    <Text style={styles.indexLabel}>[{idx}]</Text>
                    {isPrimary && (
                      <View style={styles.pointerPill}>
                        <Text style={styles.pointerPillText}>i</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {currentStep.stateIllustration.mapState && (
              <View style={styles.mapBox}>
                <Text style={styles.mapTitle}>Hash Map Memory Table:</Text>
                <View style={styles.mapChipsRow}>
                  {Object.entries(currentStep.stateIllustration.mapState).map(([k, v]) => (
                    <View key={k} style={styles.mapChip}>
                      <Text style={styles.mapKey}>{k}</Text>
                      <Text style={styles.mapArrow}>→</Text>
                      <Text style={styles.mapValue}>index {v}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.footerNav}>
        <Pressable
          disabled={activeStepIndex === 0}
          onPress={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
          style={[styles.navBtn, activeStepIndex === 0 && styles.navBtnDisabled]}
        >
          <Feather name="chevron-left" size={16} color={activeStepIndex === 0 ? '#94A3B8' : theme.ink} />
          <Text style={[styles.navBtnText, activeStepIndex === 0 && styles.navBtnTextDisabled]}>Previous</Text>
        </Pressable>

        <Pressable
          disabled={activeStepIndex === steps.length - 1}
          onPress={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
          style={[styles.navBtn, styles.navBtnPrimary, activeStepIndex === steps.length - 1 && styles.navBtnDisabled]}
        >
          <Text style={[styles.navBtnText, styles.navBtnTextPrimary]}>
            {activeStepIndex === steps.length - 1 ? 'End of Trace' : 'Next Step'}
          </Text>
          <Feather name="chevron-right" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
    padding: 16,
    gap: 14,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#0F172A',
  },
  caption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepChipActive: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
  },
  stepChipDone: {
    backgroundColor: '#F1F5F9',
  },
  stepChipText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#64748B',
  },
  stepChipTextActive: {
    color: '#7C3AED',
  },
  stepContentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  stepLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#0F172A',
  },
  stepExplanation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
  },
  stateContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  stateHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrayRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cellWrapper: {
    alignItems: 'center',
    gap: 3,
  },
  arrayCell: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPrimary: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  cellHighlight: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  cellText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#0F172A',
  },
  cellTextActive: {
    color: '#7C3AED',
  },
  indexLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#94A3B8',
  },
  pointerPill: {
    backgroundColor: '#7C3AED',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  pointerPillText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 9,
  },
  mapBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  mapTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#475569',
  },
  mapChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mapChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  mapKey: {
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#7C3AED',
    fontSize: 12,
  },
  mapArrow: {
    color: '#94A3B8',
    fontSize: 12,
  },
  mapValue: {
    fontFamily: 'Inter_500Medium',
    color: '#475569',
    fontSize: 11,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  navBtnPrimary: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9',
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#0F172A',
  },
  navBtnTextPrimary: {
    color: '#FFFFFF',
  },
  navBtnTextDisabled: {
    color: '#94A3B8',
  },
});
