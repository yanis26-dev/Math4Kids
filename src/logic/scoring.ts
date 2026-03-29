import type { AnsweredQuestion, Session, PracticeMode } from '../types';

/**
 * Calculate a session result from the answered questions.
 */
export function calculateSession(
  questions: AnsweredQuestion[],
  mode: PracticeMode
): Session {
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const wrongCount = questions.length - correctCount;
  const scorePercent =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mode,
    totalQuestions: questions.length,
    correctCount,
    wrongCount,
    scorePercent,
    questions,
  };
}

/**
 * Return encouraging feedback text (Hebrew) based on score percentage.
 */
export function getFeedbackMessage(scorePercent: number): string {
  if (scorePercent === 100) return 'מושלם! כל הכבוד! 🌟';
  if (scorePercent >= 80) return 'עבודה מצוינת! כמעט מושלם! ⭐';
  if (scorePercent >= 60) return 'טוב מאוד! המשיכו לתרגל! 💪';
  if (scorePercent >= 40) return 'לא רע! עם עוד תרגול תשתפרו! 📚';
  return 'אל תוותרו! תרגול עושה מושלם! 💖';
}
