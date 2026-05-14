import { AppError } from "../../shared/errors/app-error";

/** Normalized email value object with format validation. */
export class Email {
  readonly value: string;

  constructor(raw: string) {
    const value = raw.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new AppError("INVALID_EMAIL", 400);
    }
    this.value = value;
  }
}
