import { useRef } from 'react';
import { handleDigit, handlePaste } from '../utils/visitor';

export default function OtpInput({ value, onChange }) {
  const inputs = Array.from({ length: 4 });
  const refs = inputs.map(() => useRef());

  const handleChange = (idx, val) => {
    const { value: newVal, next } = handleDigit(value, idx, val);
    onChange(newVal);
    if (next !== idx && refs[next]) refs[next].current.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      const prev = idx - 1;
      const newValue = value.split('');
      newValue[prev] = '';
      onChange(newValue.join(''));
      refs[prev].current.focus();
      e.preventDefault();
    }
  };

  const handlePasteEvent = (e) => {
    const paste = handlePaste(e.clipboardData.getData('text'));
    if (paste.length === 4) {
      onChange(paste);
      refs[3].current.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex justify-center space-x-2" onPaste={handlePasteEvent}>
      {inputs.map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-xl rounded-lg border border-white/40 dark:border-white/20 bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-main focus:border-main outline-none"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
