import type { Question, OperationType, PracticeMode, Difficulty } from '../types';

/** Random integer in [min, max] inclusive */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate a single addition question at the given difficulty */
function generateAddition(difficulty: Difficulty): Question {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      // No carrying: ones digits sum < 10, tens digits sum < 10
      a = randInt(1, 40);
      b = randInt(1, 40);
      // Ensure no carrying
      while (
        (a % 10) + (b % 10) >= 10 ||
        a + b > 100
      ) {
        a = randInt(1, 40);
        b = randInt(1, 40);
      }
      break;
    case 'medium':
      // Sums up to 100, may or may not require carrying
      a = randInt(10, 60);
      b = randInt(10, 40);
      while (a + b > 100) {
        b = randInt(10, 40);
      }
      break;
    case 'regrouping':
      // Force carrying: ones digits sum >= 10
      a = randInt(15, 70);
      b = randInt(15, 30);
      while (
        (a % 10) + (b % 10) < 10 ||
        a + b > 100
      ) {
        a = randInt(15, 70);
        b = randInt(15, 30);
      }
      break;
  }

  return {
    id: 0,
    operand1: a,
    operand2: b,
    operation: 'addition',
    correctAnswer: a + b,
    difficulty,
  };
}

/** Generate a single subtraction question at the given difficulty */
function generateSubtraction(difficulty: Difficulty): Question {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      // No borrowing: each digit of b <= corresponding digit of a
      a = randInt(20, 80);
      b = randInt(1, 30);
      while (
        (a % 10) < (b % 10) ||
        a - b < 0
      ) {
        a = randInt(20, 80);
        b = randInt(1, 30);
      }
      break;
    case 'medium':
      // General subtraction, result >= 0
      a = randInt(30, 99);
      b = randInt(10, 50);
      while (a - b < 0) {
        b = randInt(10, 50);
      }
      break;
    case 'regrouping':
      // Force borrowing: ones digit of b > ones digit of a
      a = randInt(20, 90);
      b = randInt(5, 40);
      while (
        (a % 10) >= (b % 10) ||
        (b % 10) === 0 ||
        a - b < 0
      ) {
        a = randInt(20, 90);
        b = randInt(5, 40);
      }
      break;
  }

  return {
    id: 0,
    operand1: a,
    operand2: b,
    operation: 'subtraction',
    correctAnswer: a - b,
    difficulty,
  };
}

/** Pick which operation to use based on practice mode */
function pickOperation(mode: PracticeMode): OperationType {
  if (mode === 'addition') return 'addition';
  if (mode === 'subtraction') return 'subtraction';
  return Math.random() < 0.5 ? 'addition' : 'subtraction';
}

/** Distribute difficulties across the question count for balanced practice */
function distributeDifficulties(count: number): Difficulty[] {
  const difficulties: Difficulty[] = [];
  // Roughly 30% easy, 40% medium, 30% regrouping
  const easyCount = Math.round(count * 0.3);
  const regroupCount = Math.round(count * 0.3);
  const mediumCount = count - easyCount - regroupCount;

  for (let i = 0; i < easyCount; i++) difficulties.push('easy');
  for (let i = 0; i < mediumCount; i++) difficulties.push('medium');
  for (let i = 0; i < regroupCount; i++) difficulties.push('regrouping');

  // Shuffle using Fisher-Yates
  for (let i = difficulties.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [difficulties[i], difficulties[j]] = [difficulties[j], difficulties[i]];
  }

  return difficulties;
}

/**
 * Generate a set of math questions for a practice session.
 * Avoids duplicate questions within the same set.
 */
export function generateQuestions(count: number, mode: PracticeMode): Question[] {
  const difficulties = distributeDifficulties(count);
  const questions: Question[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < count; i++) {
    const operation = pickOperation(mode);
    let question: Question;
    let key: string;
    let attempts = 0;

    // Retry to avoid duplicates (with a safety limit)
    do {
      question =
        operation === 'addition'
          ? generateAddition(difficulties[i])
          : generateSubtraction(difficulties[i]);
      key = `${question.operand1}${question.operation}${question.operand2}`;
      attempts++;
    } while (seen.has(key) && attempts < 50);

    question.id = i + 1;
    seen.add(key);
    questions.push(question);
  }

  return questions;
}
