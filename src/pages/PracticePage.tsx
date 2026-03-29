import { useState, useCallback } from 'react';
import type { Question, AnsweredQuestion, PracticeMode, Session } from '../types';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { NumericKeypad } from '../components/NumericKeypad';
import { generateQuestions } from '../logic/questionGenerator';
import { calculateSession } from '../logic/scoring';
import { saveSession } from '../logic/storage';
import {
  type BorrowState,
  type CarryState,
  getInitialBorrowState,
  getInitialCarryState,
} from '../logic/regrouping';

interface Props {
  questionCount: number;
  mode: PracticeMode;
  onFinish: (session: Session) => void;
  onQuit: () => void;
}

export function PracticePage({ questionCount, mode, onFinish, onQuit }: Props) {
  const [questions] = useState<Question[]>(() =>
    generateQuestions(questionCount, mode)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Answer digit slots
  const [answerTens, setAnswerTens] = useState<number | null>(null);
  const [answerOnes, setAnswerOnes] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<'tens' | 'ones' | null>('ones');

  // Regrouping state
  const [borrowState, setBorrowState] = useState<BorrowState>(getInitialBorrowState);
  const [carryState, setCarryState] = useState<CarryState>(getInitialCarryState);

  const currentQuestion = questions[currentIndex];
  const answerNeedsTens = currentQuestion.correctAnswer >= 10;
  const answerIs100 = currentQuestion.correctAnswer === 100;

  // Build the numeric answer from the slots
  const buildAnswer = useCallback((): number | null => {
    if (answerIs100) {
      // For 100: hundreds=1 is fixed, tens and ones must both be 0
      if (answerTens === null && answerOnes === null) return null;
      return 100 + (answerTens ?? 0) * 10 + (answerOnes ?? 0);
    }
    if (answerNeedsTens) {
      if (answerTens === null && answerOnes === null) return null;
      if (answerTens !== null && answerOnes !== null) return answerTens * 10 + answerOnes;
      if (answerTens !== null) return answerTens * 10;
      return answerOnes;
    }
    return answerOnes;
  }, [answerTens, answerOnes, answerNeedsTens, answerIs100]);

  const canSubmit = answerOnes !== null || answerTens !== null;

  const resetForNextQuestion = useCallback(() => {
    setAnswerTens(null);
    setAnswerOnes(null);
    setActiveSlot('ones');
    setBorrowState(getInitialBorrowState());
    setCarryState(getInitialCarryState());
  }, []);

  const handleDigit = useCallback((digit: number) => {
    if (feedback) return; // Ignore input during feedback
    const slot = activeSlot ?? 'ones';
    if (slot === 'tens') {
      setAnswerTens(digit);
      // Auto-advance to ones after filling tens
      setActiveSlot('ones');
    } else {
      setAnswerOnes(digit);
    }
  }, [activeSlot, feedback]);

  const handleDelete = useCallback(() => {
    if (feedback) return;
    const slot = activeSlot ?? 'ones';
    if (slot === 'tens') {
      setAnswerTens(null);
    } else {
      if (answerOnes !== null) {
        setAnswerOnes(null);
      } else if (answerTens !== null) {
        setAnswerTens(null);
        setActiveSlot('tens');
      }
    }
  }, [activeSlot, answerOnes, answerTens, feedback]);

  const handleClear = useCallback(() => {
    if (feedback) return;
    setAnswerTens(null);
    setAnswerOnes(null);
    setActiveSlot(answerNeedsTens ? 'tens' : 'ones');
  }, [answerNeedsTens, feedback]);

  const handleSlotSelect = useCallback((slot: 'tens' | 'ones') => {
    if (feedback) return;
    setActiveSlot(slot);
  }, [feedback]);

  const handleSubmit = useCallback(() => {
    if (feedback) return;
    const childAnswer = buildAnswer();
    if (childAnswer === null) return;

    const isCorrect = childAnswer === currentQuestion.correctAnswer;
    const answeredQuestion: AnsweredQuestion = {
      ...currentQuestion,
      childAnswer,
      isCorrect,
    };

    const newAnswered = [...answered, answeredQuestion];
    setAnswered(newAnswered);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      resetForNextQuestion();

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const session = calculateSession(newAnswered, mode);
        saveSession(session);
        onFinish(session);
      }
    }, 1200);
  }, [feedback, buildAnswer, currentQuestion, answered, currentIndex, questions.length, mode, onFinish, resetForNextQuestion]);

  return (
    <div className="page practice-page">
      <div className="practice-header">
        <button className="btn-quit" onClick={onQuit} type="button">
          חזרה
        </button>
        <div className="practice-score-bar">
          {answered.filter((a) => a.isCorrect).length} / {answered.length}
        </div>
      </div>

      {feedback && (
        <div className={`feedback-overlay feedback-${feedback}`}>
          {feedback === 'correct' ? 'נכון!' : `לא נכון. התשובה: ${currentQuestion.correctAnswer}`}
        </div>
      )}

      <QuestionDisplay
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answerTens={answerTens}
        answerOnes={answerOnes}
        activeSlot={activeSlot}
        onSlotSelect={handleSlotSelect}
        borrowState={borrowState}
        onBorrowChange={setBorrowState}
        carryState={carryState}
        onCarryChange={setCarryState}
      />

      <NumericKeypad
        onDigit={handleDigit}
        onDelete={handleDelete}
        onClear={handleClear}
        onSubmit={handleSubmit}
        canSubmit={canSubmit}
      />
    </div>
  );
}
