export function confirmPasswordValidator(password: string, confirmPassword: string): boolean {
  return password === confirmPassword ? true : false;
}

export function containsUppercase(value: string): boolean {
  const regex = /[A-Z]/;
  return regex.test(value) ? true : false;
}

export function containsNumber(value: string): boolean {
  const regex = /[0-9]/;
  return regex.test(value) ? true : false;
}

export function validatePrice(value: string | number): boolean {
  const PRICE_REGEXP = /^[0-9]+(.[0-9]{1,2})?$/;

  if (value === null || value === '') {
    return false;
  }

  return PRICE_REGEXP.test(String(value)) ? true : false;
}
