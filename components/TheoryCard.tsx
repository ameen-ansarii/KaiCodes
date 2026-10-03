import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';

const theme = colors.light;

interface TheoryCardProps {
  overview: string;
  whyItMatters: string;
  mentalModel: string;
  keyTakeaways: string[];
}

export function TheoryCard({ overview, whyItMatters, mentalModel, keyTakeaways }: TheoryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Feather name="book-open" size={16} color={theme.purple} />
          <Text style={styles.sectionHeader}>Concept Overview</Text>
        </View>
        <Text style={styles.bodyText}>{overview}</Text>
      </View>

      <View style={styles.callout}>
        <View style={styles.calloutIcon}>
          <Feather name="zap" size={16} color="#7C3AED" />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.calloutTitle}>Why Engineers Need This</Text>
          <Text style={styles.calloutBody}>{whyItMatters}</Text>
        </View>
      </View>

      <View style={styles.mentalModelBox}>
        <Text style={styles.mentalModelLabel}>Mental Model</Text>
        <Text style={styles.mentalModelText}>"{mentalModel}"</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Key Takeaways</Text>
        <View style={styles.takeawaysList}>
          {keyTakeaways.map((item, idx) => (
            <View key={idx} style={styles.takeawayItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.takeawayText}>{item}</Text>
            </View>
          ))}
        </View>
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
    padding: 18,
    gap: 16,
    marginVertical: 6,
  },
  section: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeader: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  bodyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
  },
  callout: {
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  calloutIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  calloutTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#7C3AED',
  },
  calloutBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },
  mentalModelBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 13,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    gap: 4,
  },
  mentalModelLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mentalModelText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 19,
    color: '#0F172A',
    fontStyle: 'italic',
  },
  takeawaysList: {
    gap: 8,
    marginTop: 2,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    marginTop: 6,
  },
  takeawayText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
  },
});
