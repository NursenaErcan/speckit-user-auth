import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { JwtTokenService } from "../../infra/tokens/jwt-token-service";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        jti: string;
        email: string;
      };
    }
  }
}

const tokenService = new JwtTokenService();

/** Validates bearer access tokens and decorates request auth context. */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError("UNAUTHORIZED", 401));
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = tokenService.verify(token);
    req.auth = {
      userId: payload.sub,
      jti: payload.jti,
      email: payload.email
    };
    next();
  } catch {
    next(new AppError("UNAUTHORIZED", 401));
  }
}
