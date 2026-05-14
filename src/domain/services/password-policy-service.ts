/** Checks password complexity against project policy. */
export function isStrongPassword(password: string): boolean {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  return password.length >= 12 && hasUpper && hasLower && hasNumber && hasSymbol;
}
