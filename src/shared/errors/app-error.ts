/**
 * Application-level typed error for API responses.
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(code);
  }
}
