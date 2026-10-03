export type SubjectId = 'dsa' | 'system-design' | 'core-cs' | 'dev-interviews';

export type ContentType = 'THEORY' | 'FLOWCHART' | 'CODE_WALK' | 'CHECKPOINT';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface FlowchartStep {
  stepNumber: number;
  label: string;
  explanation: string;
  stateIllustration?: {
    type: 'array' | 'pointers' | 'hashmap' | 'tree' | 'network';
    primaryPointer?: number;
    secondaryPointer?: number;
    highlightIndices?: number[];
    values?: (string | number)[];
    mapState?: Record<string, string | number>;
  };
}

export interface CodeImplementation {
  language: 'python' | 'cpp' | 'java' | 'typescript';
  code: string;
  highlightLines?: number[];
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  kaiAcceptedQuote: string;
  kaiFrustratedQuote: string;
}

export interface LessonContent {
  id: string;
  topicId: string;
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  kaiTip: string;
  theory: {
    overview: string;
    whyItMatters: string;
    mentalModel: string;
    keyTakeaways: string[];
  };
  flowchart: {
    title: string;
    caption: string;
    steps: FlowchartStep[];
  };
  implementations: CodeImplementation[];
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  checkpoint: QuizQuestion;
}

export interface Topic {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  totalLessons: number;
  completedLessons: number;
  lessons: LessonContent[];
}

export interface Subject {
  id: SubjectId;
  title: string;
  tagline: string;
  icon: string;
  accentColor: string;
  darkColor: string;
  labelColor?: string;
  subTextColor?: string;
  topics: Topic[];
}
