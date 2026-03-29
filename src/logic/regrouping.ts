import type { Question } from '../types';

/** Whether this question requires regrouping (carrying or borrowing) */
export function needsRegrouping(q: Question): boolean {
  if (q.operation === 'addition') {
    return (q.operand1 % 10) + (q.operand2 % 10) >= 10;
  }
  // subtraction: borrowing needed when ones digit of top < ones digit of bottom
  return (q.operand1 % 10) < (q.operand2 % 10);
}

/** Regrouping state for subtraction (borrowing) */
export interface BorrowState {
  tensCrossedOut: boolean;   // original tens digit crossed out
  newTensDigit: number | null; // reduced tens digit written above
  onesCarry: boolean;          // +10 shown in ones column
}

/** Regrouping state for addition (carrying) */
export interface CarryState {
  carryDigit: number | null;   // carry digit above tens column
}

export function getInitialBorrowState(): BorrowState {
  return { tensCrossedOut: false, newTensDigit: null, onesCarry: false };
}

export function getInitialCarryState(): CarryState {
  return { carryDigit: null };
}
