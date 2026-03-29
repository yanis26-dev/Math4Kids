import type { Session } from '../types';

const STORAGE_KEY = 'math4kids_sessions';

/**
 * Storage abstraction layer.
 * Currently backed by localStorage, designed so swapping to a
 * database backend only requires replacing these functions.
 */

/** Retrieve all saved sessions, newest first */
export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const sessions: Session[] = JSON.parse(raw);
    return sessions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}

/** Save a completed session */
export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/** Delete a session by id */
export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/** Clear all sessions */
export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
