import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

/** Validates request body payloads against Zod schema definitions. */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new AppError("VALIDATION_ERROR", 400, parsed.error.issues));
      return;
    }
    req.body = parsed.data;
    next();
  };
}
