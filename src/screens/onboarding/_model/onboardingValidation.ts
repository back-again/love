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

export function getDatingDateErrorMessage(
  datingStartedAt: string,
  birthYear: string
): string | null {
  if (!datingStartedAt) return null;
  const clean = datingStartedAt.replace(/[^0-9]/g, '');
  if (clean.length < 8) {
    return '올바른 형식(8자리 숫자)으로 입력해 주세요.';
  }

  const year = parseInt(clean.slice(0, 4), 10);
  const month = parseInt(clean.slice(4, 6), 10);
  const day = parseInt(clean.slice(6, 8), 10);

  if (month < 1 || month > 12) {
    return '올바른 월(1월~12월)을 입력해 주세요.';
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return '올바른 일자(1일~31일)를 입력해 주세요.';
  }

  const datingDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (datingDate > today) {
    return '연애 시작일은 미래의 날짜일 수 없습니다.';
  }

  if (birthYear) {
    const bYear = parseInt(birthYear, 10);
    if (!isNaN(bYear) && year < bYear) {
      return '연애 시작일은 출생년도보다 빠를 수 없습니다.';
    }
  }

  return null;
}

export function isDatingDateValid(datingStartedAt: string, birthYear: string): boolean {
  const clean = datingStartedAt.replace(/[^0-9]/g, '');
  return clean.length === 8 && getDatingDateErrorMessage(datingStartedAt, birthYear) === null;
}

export function isFormComplete(
  birthYear: string,
  datingStartedAt: string,
  termsAgreed: boolean
): boolean {
  return isBirthYearValid(birthYear) && isDatingDateValid(datingStartedAt, birthYear) && termsAgreed;
}
