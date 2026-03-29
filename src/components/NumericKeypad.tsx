interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

/**
 * Large, child-friendly numeric keypad for entering answers.
 * Limits input to 3 digits (max answer is 100).
 */
export function NumericKeypad({ value, onChange, onSubmit }: Props) {
  const handleDigit = (digit: number) => {
    if (value.length < 3) {
      onChange(value + digit.toString());
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="keypad-container">
      <div className="answer-display">
        <span className="answer-value">{value || '...'}</span>
      </div>
      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            className="keypad-btn keypad-digit"
            onClick={() => handleDigit(digit)}
            type="button"
          >
            {digit}
          </button>
        ))}
        <button
          className="keypad-btn keypad-clear"
          onClick={handleClear}
          type="button"
        >
          נקה
        </button>
        <button
          className="keypad-btn keypad-digit"
          onClick={() => handleDigit(0)}
          type="button"
        >
          0
        </button>
        <button
          className="keypad-btn keypad-backspace"
          onClick={handleBackspace}
          type="button"
        >
          ⌫
        </button>
      </div>
      <button
        className="keypad-btn keypad-submit"
        onClick={onSubmit}
        disabled={value.length === 0}
        type="button"
      >
        שלח תשובה
      </button>
    </div>
  );
}
