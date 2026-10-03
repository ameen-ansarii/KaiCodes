import { Subject, Topic, LessonContent, SubjectId } from '../types/content';
import { arraysTopic } from './subjects/dsa/arrays';
import { twoPointersTopic } from './subjects/dsa/two-pointers';
import { binarySearchTopic } from './subjects/dsa/binary-search';
import { cachingTopic } from './subjects/system-design/caching';
import { operatingSystemsTopic } from './subjects/core-cs/os-and-db';

export const allSubjects: Subject[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    tagline: 'Patterns, complexity, and coding interview reps',
    icon: 'layers',
    accentColor: '#7C3AED',
    darkColor: '#5B21B6',
    labelColor: '#DDD6FE',
    subTextColor: '#EDE9FE',
    topics: [arraysTopic, twoPointersTopic, binarySearchTopic]
  },
  {
    id: 'system-design',
    title: 'System Design & Scalability',
    tagline: 'High-availability architecture and caching',
    icon: 'database',
    accentColor: '#0284C7',
    darkColor: '#0369A1',
    labelColor: '#BAE6FD',
    subTextColor: '#E0F2FE',
    topics: [cachingTopic]
  },
  {
    id: 'core-cs',
    title: 'Core Computer Science',
    tagline: 'OS, DBMS, networks, and engineering fundamentals',
    icon: 'cpu',
    accentColor: '#FFC800',
    darkColor: '#DDA900',
    labelColor: '#FFFBEB',
    subTextColor: '#FEF3C7',
    topics: [operatingSystemsTopic]
  }
];

export function getAllSubjects(): Subject[] {
  return allSubjects;
}

export function getSubjectById(subjectId: SubjectId): Subject | undefined {
  return allSubjects.find((s) => s.id === subjectId);
}

export function getAllTopics(): Topic[] {
  return allSubjects.flatMap((s) => s.topics);
}

export function getTopicById(topicId: string): Topic | undefined {
  return getAllTopics().find((t) => t.id === topicId);
}

export function getLessonById(lessonId: string): LessonContent | undefined {
  for (const topic of getAllTopics()) {
    const found = topic.lessons.find((l) => l.id === lessonId);
    if (found) return found;
  }
  return undefined;
}
