import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Subject, SubjectId } from '../types/content';

interface SubjectPickerProps {
  subjects: Subject[];
  selectedSubjectId: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
}

export function SubjectPicker({
  subjects,
  selectedSubjectId,
  onSelectSubject
}: SubjectPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {subjects.map((subject) => {
        const isSelected = subject.id === selectedSubjectId;
        return (
          <Pressable
            key={subject.id}
            onPress={() => onSelectSubject(subject.id)}
            style={[
              styles.pill,
              isSelected && styles.pillSelected,
              isSelected && { borderColor: subject.accentColor }
            ]}
          >
            <Feather
              name={subject.icon as any}
              size={14}
              color={isSelected ? subject.accentColor : '#64748B'}
            />
            <Text
              style={[
                styles.pillText,
                isSelected && styles.pillTextSelected,
                isSelected && { color: subject.accentColor }
              ]}
            >
              {subject.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
  },
  pillSelected: {
    backgroundColor: '#F5F3FF',
    borderBottomWidth: 3,
  },
  pillText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#64748B',
  },
  pillTextSelected: {
    fontFamily: 'Nunito_800ExtraBold',
  },
});
