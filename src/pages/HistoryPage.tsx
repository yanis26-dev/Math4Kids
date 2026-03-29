import { useState, useEffect } from 'react';
import type { Session } from '../types';
import { getSessions, deleteSession, clearAllSessions } from '../logic/storage';

interface Props {
  onHome: () => void;
}

const modeLabels = {
  addition: 'חיבור',
  subtraction: 'חיסור',
  mixed: 'מעורב',
} as const;

export function HistoryPage({ onHome }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessions(getSessions());
  };

  const handleClearAll = () => {
    clearAllSessions();
    setSessions([]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page history-page">
      <div className="history-header">
        <h2 className="history-title">היסטוריית תוצאות</h2>
        <button className="btn-quit" onClick={onHome} type="button">
          חזרה
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="history-empty">
          <p>אין עדיין תוצאות.</p>
          <p>התחילו לתרגל כדי לראות את ההתקדמות!</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {sessions.map((s) => (
              <div key={s.id} className="history-card">
                <div className="history-card-header">
                  <span className="history-date">{formatDate(s.date)}</span>
                  <span className="history-mode">{modeLabels[s.mode]}</span>
                </div>
                <div className="history-card-stats">
                  <span>שאלות: {s.totalQuestions}</span>
                  <span className="hc-correct">נכון: {s.correctCount}</span>
                  <span className="hc-wrong">שגוי: {s.wrongCount}</span>
                  <span className="hc-score">ציון: {s.scorePercent}%</span>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(s.id)}
                  type="button"
                >
                  מחק
                </button>
              </div>
            ))}
          </div>

          <button
            className="btn-danger"
            onClick={handleClearAll}
            type="button"
          >
            מחק את כל ההיסטוריה
          </button>
        </>
      )}
    </div>
  );
}
