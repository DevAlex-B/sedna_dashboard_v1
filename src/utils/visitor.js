export const logEvent = (name, data) => {
  // placeholder analytics
  console.log('analytics', name, data);
};

export const getTimeWindowStart = (time = Date.now()) => {
  return Math.floor(time / 1000 / 300) * 300; // seconds
};

export const generateOtp = (email, timeWindowStart = getTimeWindowStart()) => {
  const secret = process.env.OTP_HMAC_SECRET || 'test_secret';
  const data = `${email}:${timeWindowStart}`;
  const hash = require('crypto').createHmac('sha256', secret).update(data).digest('hex');
  const num = parseInt(hash.slice(-8), 16) % 10000;
  return num.toString().padStart(4, '0');
};

export const verifyOtp = (email, input, now = Date.now()) => {
  const current = generateOtp(email, getTimeWindowStart(now));
  if (current === input) return true;
  const previous = generateOtp(email, getTimeWindowStart(now - 300000));
  return previous === input;
};

export const handleDigit = (value, idx, input) => {
  const digit = input.replace(/\D/g, '').slice(-1);
  const arr = value.split('');
  arr[idx] = digit || '';
  const next = digit && idx < 3 ? idx + 1 : idx;
  return { value: arr.join(''), next };
};

export const handlePaste = (text) => text.replace(/\D/g, '').slice(0, 4);
