/** Supported operation types */
export type OperationType = 'addition' | 'subtraction';

/** Practice mode selection */
export type PracticeMode = 'addition' | 'subtraction' | 'mixed';

/** Difficulty level for question generation */
export type Difficulty = 'easy' | 'medium' | 'regrouping';

/** A single math question */
export interface Question {
  id: number;
  operand1: number;
  operand2: number;
  operation: OperationType;
  correctAnswer: number;
  difficulty: Difficulty;
}

/** A child's answer to a question */
export interface AnsweredQuestion extends Question {
  childAnswer: number | null;
  isCorrect: boolean;
}

/** A completed practice session */
export interface Session {
  id: string;
  date: string; // ISO string
  mode: PracticeMode;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercent: number;
  questions: AnsweredQuestion[];
}

/** App page routing */
export type Page = 'home' | 'practice' | 'results' | 'history';
