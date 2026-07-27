export function getBirthYearErrorMessage(birthYear: string): string | null {
  if (!birthYear || birthYear.length < 4) {
    return null;
  }
  const yearNum = parseInt(birthYear, 10);
  if (isNaN(yearNum)) {
    return null;
  }
  const currentYear = new Date().getFullYear();

  if (yearNum < 1920 || yearNum > currentYear) {
    return '출생년도를 다시 확인해주세요.';
  }
  if (currentYear - yearNum < 14) {
    return '14세 이상부터 이용 가능합니다.';
  }
  return null;
}

export function isBirthYearValid(birthYear: string): boolean {
  return birthYear.length === 4 && getBirthYearErrorMessage(birthYear) === null;
}

export function isFormComplete(
  birthYear: string,
  termsAgreed: boolean
): boolean {
  return isBirthYearValid(birthYear) && termsAgreed;
}
