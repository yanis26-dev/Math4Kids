interface Props {
  onDigit: (digit: number) => void;
  onDelete: () => void;
  onClear: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

/**
 * Large, child-friendly numeric keypad.
 * Now delegates digit placement to parent via onDigit callback.
 */
export function NumericKeypad({ onDigit, onDelete, onClear, onSubmit, canSubmit }: Props) {
  return (
    <div className="keypad-container">
      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            className="keypad-btn keypad-digit"
            onClick={() => onDigit(digit)}
            type="button"
          >
            {digit}
          </button>
        ))}
        <button
          className="keypad-btn keypad-clear"
          onClick={onClear}
          type="button"
        >
          נקה
        </button>
        <button
          className="keypad-btn keypad-digit"
          onClick={() => onDigit(0)}
          type="button"
        >
          0
        </button>
        <button
          className="keypad-btn keypad-backspace"
          onClick={onDelete}
          type="button"
        >
          ⌫
        </button>
      </div>
      <button
        className="keypad-btn keypad-submit"
        onClick={onSubmit}
        disabled={!canSubmit}
        type="button"
      >
        שלח תשובה
      </button>
    </div>
  );
}
