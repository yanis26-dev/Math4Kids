import { useState, useCallback } from 'react';
import type { Question, AnsweredQuestion, PracticeMode } from '../types';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { NumericKeypad } from '../components/NumericKeypad';
import { generateQuestions } from '../logic/questionGenerator';
import { calculateSession } from '../logic/scoring';
import { saveSession } from '../logic/storage';
import type { Session } from '../types';

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
  const [inputValue, setInputValue] = useState('');
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = useCallback(() => {
    if (!inputValue) return;

    const childAnswer = parseInt(inputValue, 10);
    const isCorrect = childAnswer === currentQuestion.correctAnswer;

    const answeredQuestion: AnsweredQuestion = {
      ...currentQuestion,
      childAnswer,
      isCorrect,
    };

    const newAnswered = [...answered, answeredQuestion];
    setAnswered(newAnswered);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Show feedback briefly, then advance
    setTimeout(() => {
      setFeedback(null);
      setInputValue('');

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Session complete
        const session = calculateSession(newAnswered, mode);
        saveSession(session);
        onFinish(session);
      }
    }, 1200);
  }, [inputValue, currentQuestion, answered, currentIndex, questions.length, mode, onFinish]);

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
      />

      <NumericKeypad
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
