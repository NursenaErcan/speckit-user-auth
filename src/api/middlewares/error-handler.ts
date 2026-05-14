import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { logger } from "../../shared/logging/logger";

const SENSITIVE_AUTH_CODES = new Set([
  "EMAIL_ALREADY_EXISTS",
  "INVALID_CREDENTIALS",
  "INVALID_RESET_TOKEN",
  "EXPIRED_RESET_TOKEN",
  "BREACHED_PASSWORD",
  "WEAK_PASSWORD"
]);

/** Centralized HTTP error translation middleware. */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  void next;
  if (error instanceof AppError) {
    const publicCode = SENSITIVE_AUTH_CODES.has(error.code) ? "REQUEST_REJECTED" : error.code;
    res.status(error.statusCode).json({ error: publicCode, details: error.details ?? null });
    return;
  }

  logger.error({ err: error }, "Unhandled error");
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
}
