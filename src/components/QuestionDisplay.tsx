import type { Question } from '../types';

interface Props {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
}

const operationSymbol = {
  addition: '+',
  subtraction: '−',
} as const;

/**
 * Displays a single math question in large, child-friendly format.
 */
export function QuestionDisplay({ question, currentIndex, totalQuestions }: Props) {
  return (
    <div className="question-display">
      <div className="question-progress">
        שאלה {currentIndex + 1} מתוך {totalQuestions}
      </div>
      <div className="question-math">
        <span className="question-operand">{question.operand1}</span>
        <span className="question-operator">
          {operationSymbol[question.operation]}
        </span>
        <span className="question-operand">{question.operand2}</span>
        <span className="question-equals">=</span>
        <span className="question-placeholder">?</span>
      </div>
    </div>
  );
}
