export const logEvent = (name, data) => {
  // placeholder analytics
  console.log('analytics', name, data);
};

export const handleDigit = (value, idx, input) => {
  const digit = input.replace(/\D/g, '').slice(-1);
  const arr = value.split('');
  arr[idx] = digit || '';
  const next = digit && idx < 3 ? idx + 1 : idx;
  return { value: arr.join(''), next };
};

export const handlePaste = (text) => text.replace(/\D/g, '').slice(0, 4);
