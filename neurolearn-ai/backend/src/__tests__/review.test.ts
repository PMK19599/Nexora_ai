import { calculateSM2, calculateRetention, predictForgetDate } from '../services/reviewService';

describe('SM-2 Algorithm', () => {
  it('increases interval after correct', () => { const r = calculateSM2(4, 0, 2.5, 0); expect(r.interval).toBe(1); expect(r.repetitions).toBe(1); });
  it('resets on poor answer', () => { const r = calculateSM2(1, 5, 2.5, 30); expect(r.repetitions).toBe(0); expect(r.interval).toBe(1); });
  it('increases progressively', () => { let r = calculateSM2(4, 0, 2.5, 0); r = calculateSM2(4, r.repetitions, r.easinessFactor, r.interval); expect(r.interval).toBe(6); });
  it('min easiness 1.3', () => { const r = calculateSM2(0, 0, 1.3, 0); expect(r.easinessFactor).toBeGreaterThanOrEqual(1.3); });
});

describe('Retention', () => {
  it('100% at t=0', () => expect(calculateRetention(0, 5)).toBe(100));
  it('decreases over time', () => { expect(calculateRetention(1, 5)).toBeGreaterThan(calculateRetention(3, 5)); });
  it('better with higher strength', () => { expect(calculateRetention(3, 10)).toBeGreaterThan(calculateRetention(3, 1)); });
});

describe('Forget date', () => {
  it('is in the future', () => expect(predictForgetDate(5).getTime()).toBeGreaterThan(Date.now()));
  it('earlier for weak memory', () => expect(predictForgetDate(1).getTime()).toBeLessThan(predictForgetDate(10).getTime()));
});
