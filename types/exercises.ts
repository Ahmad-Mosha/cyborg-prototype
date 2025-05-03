// Exercise base type
export interface Exercise {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  image: string;
  instructions: string[];
  frequency: number;
  lastPerformed: string;
}

// Exercise history related types
export interface ExerciseHistorySet {
  reps: number;
  weight: number;
  oneRepMax: number;
}

export interface ExerciseHistorySession {
  date: string;
  sets: ExerciseHistorySet[];
}

// Records related types
export interface RepRecord {
  reps: number;
  weight: number;
  sets: number;
  date: string;
  estimated: number;
}

export interface ExerciseRecords {
  estimatedOneRepMax: number;
  maxVolume: number;
  maxWeight: number;
  bestPerformance: RepRecord[];
  lifetimeStats: {
    totalReps: number;
    totalVolume: number;
  };
  recordsHistory: {
    estimated1RM: Array<{ value: number; date: string }>;
    maxWeight: Array<{ value: number; date: string }>;
    maxVolume: Array<{ value: number; date: string }>;
  };
}

// Component Props interfaces
export interface ExerciseDetailModalProps {
  visible: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  isFavorite: boolean;
  onToggleFavorite: (exerciseId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exerciseHistoryData: ExerciseHistorySession[];
  exerciseRecordsData: ExerciseRecords;
  onViewRecordsHistory: () => void;
  formatDate: (dateString: string) => string;
}

export interface ExerciseItemProps {
  item: Exercise;
  onPress: (exercise: Exercise) => void;
}

export interface AboutTabProps {
  exercise: Exercise | null;
  formatDate: (dateString: string) => string;
}

export interface HistoryTabProps {
  exerciseHistoryData: ExerciseHistorySession[];
}

export interface RecordsTabProps {
  exerciseRecordsData: ExerciseRecords;
  onViewRecordsHistory: () => void;
}
