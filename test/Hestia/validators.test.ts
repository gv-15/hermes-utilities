import { confirmPasswordValidator, containsNumber, containsUppercase, validatePrice } from '../../src/Hestia/validators';

describe('Hestia service', () => {
  it('should validate same password', () => {
    expect(confirmPasswordValidator('MonkeyD.', 'MonkeyD.')).toBe(true);
    expect(confirmPasswordValidator('KobeB24', 'KobeB8')).toBe(false);
  });

  it('should validate contains uppercase', () => {
    expect(containsUppercase('MonkeyD.')).toBe(true);
    expect(containsUppercase('monkeydluffy')).toBe(false);
  });

  it('should validate contains number', () => {
    expect(containsNumber('MonkeyD.')).toBe(false);
    expect(containsNumber('monkeyD1')).toBe(true);
  });

  it('should validate price', () => {
    expect(validatePrice('MonkeyD.')).toBe(false);
    expect(validatePrice('12')).toBe(true);
    expect(validatePrice('12.2')).toBe(true);
    expect(validatePrice('')).toBe(false);
  });
});
