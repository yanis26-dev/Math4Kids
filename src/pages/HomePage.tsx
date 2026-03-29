import { useState } from 'react';
import type { PracticeMode } from '../types';

interface Props {
  onStart: (count: number, mode: PracticeMode) => void;
  onHistory: () => void;
}

const questionOptions = [5, 10, 20];

const modeLabels: Record<PracticeMode, string> = {
  addition: 'חיבור בלבד',
  subtraction: 'חיסור בלבד',
  mixed: 'מעורב',
};

export function HomePage({ onStart, onHistory }: Props) {
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<PracticeMode>('mixed');

  return (
    <div className="page home-page">
      <div className="home-hero">
        <h1 className="home-title">תרגול חשבון</h1>
        <p className="home-subtitle">כיתה ב׳</p>
      </div>

      <div className="home-settings">
        <div className="setting-group">
          <label className="setting-label">מספר שאלות:</label>
          <div className="setting-options">
            {questionOptions.map((n) => (
              <button
                key={n}
                className={`option-btn ${count === n ? 'active' : ''}`}
                onClick={() => setCount(n)}
                type="button"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">סוג תרגיל:</label>
          <div className="setting-options">
            {(Object.keys(modeLabels) as PracticeMode[]).map((m) => (
              <button
                key={m}
                className={`option-btn ${mode === m ? 'active' : ''}`}
                onClick={() => setMode(m)}
                type="button"
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn-primary btn-start"
        onClick={() => onStart(count, mode)}
        type="button"
      >
        התחילו לתרגל!
      </button>

      <button
        className="btn-secondary btn-history"
        onClick={onHistory}
        type="button"
      >
        היסטוריית תוצאות
      </button>
    </div>
  );
}
