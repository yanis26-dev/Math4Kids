import { useState, useCallback } from 'react';
import type { Page, PracticeMode, Session } from './types';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [practiceConfig, setPracticeConfig] = useState({
    count: 10,
    mode: 'mixed' as PracticeMode,
  });
  const [lastSession, setLastSession] = useState<Session | null>(null);

  const handleStart = useCallback((count: number, mode: PracticeMode) => {
    setPracticeConfig({ count, mode });
    setPage('practice');
  }, []);

  const handleFinish = useCallback((session: Session) => {
    setLastSession(session);
    setPage('results');
  }, []);

  const handleRetry = useCallback(() => {
    setPage('practice');
  }, []);

  switch (page) {
    case 'home':
      return (
        <HomePage
          onStart={handleStart}
          onHistory={() => setPage('history')}
        />
      );
    case 'practice':
      return (
        <PracticePage
          key={Date.now()} // Force remount on retry
          questionCount={practiceConfig.count}
          mode={practiceConfig.mode}
          onFinish={handleFinish}
          onQuit={() => setPage('home')}
        />
      );
    case 'results':
      return lastSession ? (
        <ResultsPage
          session={lastSession}
          onHome={() => setPage('home')}
          onRetry={handleRetry}
        />
      ) : (
        <HomePage
          onStart={handleStart}
          onHistory={() => setPage('history')}
        />
      );
    case 'history':
      return <HistoryPage onHome={() => setPage('home')} />;
  }
}
