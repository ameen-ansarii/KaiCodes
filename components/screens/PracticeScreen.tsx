import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@/components/ui/AppIcon';
import { StrongButton, IconButton, ProgressBar, tapFeedback } from '@/components/ui/Buttons';
import { Mascot } from '@/components/ui/Mascot';
import { FlowchartCard } from '@/components/FlowchartCard';
import { TheoryCard } from '@/components/TheoryCard';
import { theme } from '@/constants/theme';
import { getLessonById } from '@/content';

const JS_KEYWORDS = new Set([
  'function', 'const', 'let', 'var', 'for', 'if', 'else', 'return',
  'new', 'export', 'import', 'from', 'default', 'class', 'while', 'switch', 'case', 'break', 'in', 'of'
]);
const JS_BUILTINS = new Set(['Map', 'Set', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'Math', 'JSON']);
const JS_METHODS = new Set(['has', 'get', 'set', 'push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'length']);

function CodeShowcaseCard({ code, onChangeCode }: { code: string; onChangeCode?: (newCode: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    tapFeedback();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = useMemo(() => code.split('\n'), [code]);
  const tokenRegex = useMemo(
    () => /(\b(?:function|const|let|var|for|if|else|return|new|export|import|from|default|class|while|switch|case|break|in|of)\b)|(\b(?:Map|Set|Array|Object|String|Number|Boolean|Promise|Math|JSON)\b)|(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\b)|(\.(?:has|get|set|push|pop|shift|unshift|slice|splice|length)\b)/gm,
    [],
  );

  return (
    <View style={styles.codeCard}>
      <Pressable onPress={handleCopy} style={styles.codeCopyButton}>
        <Feather name={copied ? 'check' : 'copy'} size={14} color={copied ? '#10B981' : '#64748B'} />
      </Pressable>
      {isEditing ? (
        <TextInput
          style={styles.codeEditInput}
          value={code}
          onChangeText={onChangeCode}
          multiline
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <Pressable onPress={() => onChangeCode && setIsEditing(true)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.codeScrollContent}>
            <View style={styles.codeContainer}>
              {lines.map((line, i) => (
                <Text key={i} style={styles.codeLineText}>
                  <Text style={{ color: '#94A3B8' }}>{String(i + 1).padStart(2, ' ')}  </Text>
                  {line.split(tokenRegex).map((part, j) => {
                    if (!part) return null;
                    let color = '#334155';
                    if (JS_KEYWORDS.has(part)) color = '#7C3AED';
                    else if (JS_BUILTINS.has(part)) color = '#0284C7';
                    else if (part.startsWith('//')) color = '#94A3B8';
                    else if (/^["'`]/.test(part)) color = '#059669';
                    else if (/^\d+$/.test(part)) color = '#D97706';
                    else if (JS_METHODS.has(part.replace('.', ''))) color = '#0284C7';
                    return <Text key={j} style={{ color }}>{part}</Text>;
                  })}
                  {'\n'}
                </Text>
              ))}
            </View>
          </ScrollView>
        </Pressable>
      )}
    </View>
  );
}

export function PracticeScreen({
  lessonId,
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
    return (lessonId ? getLessonById(lessonId) : undefined) || getLessonById('two-sum')!;
  }, [lessonId]);

  const currentImpl = useMemo(() => {
    return lesson.implementations.find((impl) => impl.language === selectedLang) || lesson.implementations[0];
  }, [lesson, selectedLang]);

  const [code, setCode] = useState(currentImpl?.code || '');

  useEffect(() => {
    if (currentImpl) setCode(currentImpl.code);
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.practiceScroll} contentContainerStyle={styles.practiceScrollContent}>
        <View style={styles.lessonContextRow}>
          <View style={styles.lessonContextIcon}><Feather name="layers" size={16} color={theme.skyDark} /></View>
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
          {(['code', 'flowchart', 'theory'] as const).map((mode) => (
            <Pressable key={mode} onPress={() => setViewMode(mode)} style={[styles.segmentBtn, viewMode === mode && styles.segmentBtnActive]}>
              <Feather name={mode === 'code' ? 'code' : mode === 'flowchart' ? 'git-branch' : 'book-open'} size={14} color={viewMode === mode ? '#7C3AED' : '#64748B'} />
              <Text style={[styles.segmentText, viewMode === mode && styles.segmentTextActive]}>
                {mode === 'code' ? 'Code' : mode === 'flowchart' ? 'Flowchart Trace' : 'Deep Theory'}
              </Text>
            </Pressable>
          ))}
        </View>

        {viewMode === 'flowchart' && lesson?.flowchart && (
          <FlowchartCard title={lesson.flowchart.title} caption={lesson.flowchart.caption} steps={lesson.flowchart.steps} />
        )}
        {viewMode === 'theory' && lesson?.theory && (
          <TheoryCard overview={lesson.theory.overview} whyItMatters={lesson.theory.whyItMatters} mentalModel={lesson.theory.mentalModel} keyTakeaways={lesson.theory.keyTakeaways} />
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
                const label = lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : lang === 'java' ? 'Java' : 'TypeScript';
                return (
                  <Pressable key={lang} onPress={() => { tapFeedback(); setSelectedLang(lang); }} style={[styles.langPill, isSelected && styles.langPillActive]}>
                    <Text style={[styles.langPillText, isSelected && styles.langPillTextActive]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <CodeShowcaseCard code={code} onChangeCode={setCode} />

            <Pressable onPress={() => setShowExplanation((v) => !v)} style={styles.explanationToggle}>
              <View style={styles.explanationIcon}><Feather name="book-open" size={17} color={theme.mintDark} /></View>
              <Text style={styles.explanationText}>{showExplanation ? 'Hide explanation' : 'Need a hint? View explanation'}</Text>
              <Feather name={showExplanation ? 'chevron-up' : 'chevron-down'} size={17} color={theme.mintDark} />
            </Pressable>
            {showExplanation && (
              <View style={styles.explanationCard}>
                <View style={styles.explanationHeaderRow}>
                  <Mascot pose="eureka" size={80} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.explanationTitle}>Kai's Eureka Breakdown</Text>
                    <Text style={styles.explanationBody}>{currentImpl?.explanation || lesson.theory.mentalModel}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.complexityRow}>
              <View style={styles.complexityItem}><Text style={styles.complexityLabel}>TIME</Text><Text style={styles.complexityValue}>{lesson.complexity.time}</Text></View>
              <View style={styles.complexityDivider} />
              <View style={styles.complexityItem}><Text style={styles.complexityLabel}>SPACE</Text><Text style={styles.complexityValue}>{lesson.complexity.space}</Text></View>
              <View style={styles.complexityDivider} />
              <View style={styles.complexityItem}><Text style={styles.complexityLabel}>ESTIMATED</Text><Text style={styles.complexityValue}>~{lesson.estimatedMinutes}m</Text></View>
            </View>

            {checkpoint && (
              <View style={styles.quizCard}>
                <View style={styles.quizHeaderRow}>
                  <View style={styles.quizBadge}><Text style={styles.quizBadgeText}>CHECKPOINT DRILL</Text></View>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#64748B' }}>Active Recall Challenge</Text>
                </View>
                <Text style={styles.quizQuestion}>{checkpoint.question}</Text>
                <View style={{ gap: 8 }}>
                  {checkpoint.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isAnswerCorrect = idx === checkpoint.correctIndex;
                    let optionStyle: any = styles.quizOptionBtn;
                    if (quizSubmitted) {
                      if (isAnswerCorrect) optionStyle = [styles.quizOptionBtn, styles.quizOptionCorrect];
                      else if (isSelected) optionStyle = [styles.quizOptionBtn, styles.quizOptionWrong];
                    }
                    return (
                      <Pressable key={idx} onPress={() => handleSelectOption(idx)} style={optionStyle}>
                        <View style={styles.quizOptionIndex}><Text style={styles.quizOptionIndexText}>{String.fromCharCode(65 + idx)}</Text></View>
                        <Text style={styles.quizOptionText}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                {quizSubmitted && (
                  <View style={styles.quizFeedbackBox}>
                    <Mascot pose={isQuizCorrect ? 'accepted' : 'frustrated'} size={48} />
                    <Text style={styles.quizFeedbackText}>{isQuizCorrect ? checkpoint.kaiAcceptedQuote : checkpoint.kaiFrustratedQuote}</Text>
                  </View>
                )}
              </View>
            )}
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  practiceFixedHeader: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.background },
  practiceScroll: { flex: 1 },
  practiceScrollContent: { paddingHorizontal: 20, paddingTop: 7, paddingBottom: 26, gap: 16 },
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
  segmentContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 4, gap: 4, marginVertical: 4 },
  segmentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  segmentBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  segmentText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 12, color: '#64748B' },
  segmentTextActive: { color: '#7C3AED' },
  coachBubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 8 },
  coachSpeechBubble: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#E2E8F0', borderBottomWidth: 3.5, borderBottomColor: '#CBD5E1', padding: 12, paddingHorizontal: 14, position: 'relative' },
  speechTail: { position: 'absolute', left: -7, top: '50%', marginTop: -5, width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 7, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#CBD5E1' },
  speechBubbleTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, color: '#0F172A', marginBottom: 2 },
  speechBubbleBody: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17, color: '#475569' },
  langSelectorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 },
  langPill: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  langPillActive: { backgroundColor: '#EDE9FE', borderColor: '#7C3AED' },
  langPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#64748B' },
  langPillTextActive: { color: '#7C3AED' },
  explanationToggle: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 2 },
  explanationIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  explanationText: { color: theme.purple, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  explanationHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  explanationCard: { borderRadius: 15, backgroundColor: '#F5F3FF', padding: 14, gap: 5 },
  explanationTitle: { color: theme.purple, fontFamily: 'Inter_700Bold', fontSize: 13 },
  explanationBody: { color: theme.navy, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  complexityRow: { borderRadius: 15, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.line, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  complexityItem: { alignItems: 'center', gap: 4, flex: 1 },
  complexityLabel: { color: theme.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  complexityValue: { color: theme.ink, fontFamily: 'Inter_700Bold', fontSize: 13 },
  complexityDivider: { width: 1, height: 28, backgroundColor: theme.line },
  codeCard: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', padding: 18, paddingTop: 16, position: 'relative', minHeight: 240, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3 },
  codeCopyButton: { position: 'absolute', top: 14, right: 14, zIndex: 10, width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  codeScrollContent: { paddingRight: 36 },
  codeContainer: { minWidth: '100%' },
  codeLineText: { fontFamily: 'monospace', fontSize: 13, lineHeight: 22, letterSpacing: -0.2 },
  codeEditInput: { flex: 1, padding: 0, paddingRight: 36, color: '#0F172A', fontFamily: 'monospace', fontSize: 13, lineHeight: 22, minHeight: 210 },
  quizCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1.5, borderBottomWidth: 4, borderColor: '#E2E8F0', borderBottomColor: '#CBD5E1', padding: 16, marginVertical: 14, gap: 12 },
  quizHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quizBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  quizBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: '#D97706', letterSpacing: 0.6 },
  quizQuestion: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#0F172A', lineHeight: 22 },
  quizOptionBtn: { borderRadius: 14, borderWidth: 1.5, borderBottomWidth: 3, borderColor: '#E2E8F0', borderBottomColor: '#CBD5E1', backgroundColor: '#F8FAFC', padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  quizOptionCorrect: { backgroundColor: '#ECFDF5', borderColor: '#10B981', borderBottomColor: '#059669' },
  quizOptionWrong: { backgroundColor: '#FEF2F2', borderColor: '#EF4444', borderBottomColor: '#DC2626' },
  quizOptionIndex: { width: 24, height: 24, borderRadius: 8, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  quizOptionIndexText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#475569' },
  quizOptionText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#1E293B', flex: 1, lineHeight: 18 },
  quizFeedbackBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, backgroundColor: '#F5F3FF', marginTop: 4 },
  quizFeedbackText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#6D28D9', lineHeight: 18 },
  practiceActionBar: { paddingTop: 12, paddingHorizontal: 20, borderTopWidth: 1.5, borderTopColor: theme.line, backgroundColor: theme.card },
});
