import type { Session } from '../types';
import { getFeedbackMessage } from '../logic/scoring';

interface Props {
  session: Session;
  onHome: () => void;
  onRetry: () => void;
}

const operationSymbol = { addition: '+', subtraction: '−' } as const;

export function ResultsPage({ session, onHome, onRetry }: Props) {
  const feedback = getFeedbackMessage(session.scorePercent);

  return (
    <div className="page results-page">
      <h2 className="results-title">סיכום תרגול</h2>

      <div className="results-feedback">{feedback}</div>

      <div className="results-stats">
        <div className="stat">
          <span className="stat-value">{session.totalQuestions}</span>
          <span className="stat-label">שאלות</span>
        </div>
        <div className="stat stat-correct">
          <span className="stat-value">{session.correctCount}</span>
          <span className="stat-label">נכון</span>
        </div>
        <div className="stat stat-wrong">
          <span className="stat-value">{session.wrongCount}</span>
          <span className="stat-label">שגוי</span>
        </div>
        <div className="stat stat-score">
          <span className="stat-value">{session.scorePercent}%</span>
          <span className="stat-label">ציון</span>
        </div>
      </div>

      <div className="results-detail">
        <h3>פירוט שאלות:</h3>
        <ul className="results-questions">
          {session.questions.map((q, i) => (
            <li key={i} className={q.isCorrect ? 'q-correct' : 'q-wrong'}>
              <span className="q-text">
                {q.operand1} {operationSymbol[q.operation]} {q.operand2} = {q.correctAnswer}
              </span>
              <span className="q-answer">
                {q.isCorrect
                  ? 'V'
                  : `תשובתך: ${q.childAnswer}`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={onRetry} type="button">
          תרגול נוסף
        </button>
        <button className="btn-secondary" onClick={onHome} type="button">
          חזרה לדף הבית
        </button>
      </div>
    </div>
  );
}
