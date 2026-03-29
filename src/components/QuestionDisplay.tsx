import { useCallback } from 'react';
import type { Question } from '../types';
import {
  needsRegrouping,
  type BorrowState,
  type CarryState,
} from '../logic/regrouping';

interface Props {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  // Answer slots
  answerTens: number | null;
  answerOnes: number | null;
  activeSlot: 'tens' | 'ones' | null;
  onSlotSelect: (slot: 'tens' | 'ones') => void;
  // Regrouping state
  borrowState: BorrowState;
  onBorrowChange: (state: BorrowState) => void;
  carryState: CarryState;
  onCarryChange: (state: CarryState) => void;
}

const operationSymbol = {
  addition: '+',
  subtraction: '−',
} as const;

/**
 * Vertical school-style arithmetic problem with:
 * - Column-aligned digits (tens | ones)
 * - Conditional regrouping annotations
 * - Tappable answer digit slots
 */
export function QuestionDisplay({
  question,
  currentIndex,
  totalQuestions,
  answerTens,
  answerOnes,
  activeSlot,
  onSlotSelect,
  borrowState,
  onBorrowChange,
  carryState,
  onCarryChange,
}: Props) {
  const { operand1, operand2, operation, correctAnswer } = question;

  // Split numbers into tens and ones digits
  const top10 = Math.floor(operand1 / 10);
  const top1 = operand1 % 10;
  const bot10 = Math.floor(operand2 / 10);
  const bot1 = operand2 % 10;

  const showRegrouping = needsRegrouping(question);
  const isSub = operation === 'subtraction';
  const isAdd = operation === 'addition';

  // Answer can be up to 100 (3 digits), but for 2nd grade it's max 100
  const answerNeeds3 = correctAnswer === 100;
  const answerNeedsTens = correctAnswer >= 10;

  // --- Borrowing interactions (subtraction) ---
  const toggleCrossOut = useCallback(() => {
    if (!isSub || !showRegrouping) return;
    const next = !borrowState.tensCrossedOut;
    onBorrowChange({
      tensCrossedOut: next,
      newTensDigit: next ? top10 - 1 : null,
      onesCarry: next,
    });
  }, [isSub, showRegrouping, borrowState, onBorrowChange, top10]);

  // --- Carry interactions (addition) ---
  const toggleCarry = useCallback(() => {
    if (!isAdd || !showRegrouping) return;
    const onesSum = top1 + bot1;
    const carry = Math.floor(onesSum / 10);
    onCarryChange({
      carryDigit: carryState.carryDigit === null ? carry : null,
    });
  }, [isAdd, showRegrouping, top1, bot1, carryState, onCarryChange]);

  return (
    <div className="question-display">
      <div className="question-progress">
        שאלה {currentIndex + 1} מתוך {totalQuestions}
      </div>

      <div className="vertical-problem">
        {/* Carry annotation row (addition only) */}
        {isAdd && showRegrouping && (
          <div className="vp-row vp-carry-row">
            {answerNeeds3 && <div className="vp-cell vp-cell-hundreds" />}
            <div
              className={`vp-cell vp-carry-cell ${carryState.carryDigit !== null ? 'vp-carry-active' : ''}`}
              onClick={toggleCarry}
              title="לחצו להוסיף נשא"
            >
              {carryState.carryDigit !== null && (
                <span className="vp-carry-digit">{carryState.carryDigit}</span>
              )}
            </div>
            <div className="vp-cell" />
          </div>
        )}

        {/* Top number row */}
        <div className="vp-row vp-operand-row">
          {answerNeeds3 && <div className="vp-cell vp-cell-hundreds" />}
          <div className="vp-cell vp-digit-cell vp-top-tens" onClick={isSub && showRegrouping ? toggleCrossOut : undefined}>
            {/* Borrow annotation: new digit above */}
            {isSub && showRegrouping && borrowState.newTensDigit !== null && (
              <span className="vp-borrow-new">{borrowState.newTensDigit}</span>
            )}
            <span className={`vp-digit ${isSub && borrowState.tensCrossedOut ? 'vp-crossed' : ''}`}>
              {top10 > 0 ? top10 : ''}
            </span>
          </div>
          <div className="vp-cell vp-digit-cell vp-top-ones">
            {/* Borrow annotation: +10 indicator */}
            {isSub && showRegrouping && borrowState.onesCarry && (
              <span className="vp-borrow-ten">1</span>
            )}
            <span className="vp-digit">{top1}</span>
          </div>
        </div>

        {/* Operator + bottom number row */}
        <div className="vp-row vp-operand-row vp-bottom-row">
          {answerNeeds3 && <div className="vp-cell vp-cell-hundreds" />}
          <div className="vp-cell vp-digit-cell vp-operator-cell">
            <span className="vp-operator">{operationSymbol[operation]}</span>
            <span className="vp-digit">{bot10 > 0 ? bot10 : ''}</span>
          </div>
          <div className="vp-cell vp-digit-cell">
            <span className="vp-digit">{bot1}</span>
          </div>
        </div>

        {/* Answer line */}
        <div className="vp-line" />

        {/* Answer slots row */}
        <div className="vp-row vp-answer-row">
          {answerNeeds3 && (
            <div className="vp-cell vp-cell-hundreds">
              <div className="vp-answer-slot vp-slot-fixed">
                1
              </div>
            </div>
          )}
          {answerNeedsTens && (
            <div className="vp-cell">
              <div
                className={`vp-answer-slot ${activeSlot === 'tens' ? 'vp-slot-active' : ''} ${answerTens !== null ? 'vp-slot-filled' : ''}`}
                onClick={() => onSlotSelect('tens')}
              >
                {answerTens !== null ? answerTens : ''}
              </div>
            </div>
          )}
          <div className="vp-cell">
            <div
              className={`vp-answer-slot ${activeSlot === 'ones' ? 'vp-slot-active' : ''} ${answerOnes !== null ? 'vp-slot-filled' : ''}`}
              onClick={() => onSlotSelect('ones')}
            >
              {answerOnes !== null ? answerOnes : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
