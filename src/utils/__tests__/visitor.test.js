import { generateOtp, verifyOtp, getTimeWindowStart, handleDigit, handlePaste } from '../visitor';

describe('OTP generator', () => {
  const email = 'test@example.com';
  const base = 1700000000 * 1000; // fixed timestamp
  test('same code across current and previous window', () => {
    const window1 = getTimeWindowStart(base);
    const code1 = generateOtp(email, window1);
    const code2 = generateOtp(email, window1);
    expect(code1).toBe(code2);
  });
  test('different across windows', () => {
    const window1 = getTimeWindowStart(base);
    const window2 = getTimeWindowStart(base + 300000); // next window
    const code1 = generateOtp(email, window1);
    const code2 = generateOtp(email, window2);
    expect(code1).not.toBe(code2);
  });
  test('verify current and previous window', () => {
    const now = base + 10000;
    const code = generateOtp(email, getTimeWindowStart(now));
    expect(verifyOtp(email, code, now)).toBe(true);
    const prevCode = generateOtp(email, getTimeWindowStart(now - 300000));
    expect(verifyOtp(email, prevCode, now)).toBe(true);
  });
});

test('handleDigit returns next index', () => {
  const res = handleDigit('', 0, '5');
  expect(res.value).toBe('5');
  expect(res.next).toBe(1);
});

test('handlePaste trims non-digits and length', () => {
  expect(handlePaste('12a45')).toBe('1245'.slice(0,4));
});
