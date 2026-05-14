import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { SessionRecordRepository } from "../../infra/db/repositories/session-record-repository";
import { ValidateSessionService } from "../../domain/services/validate-session-service";

export const sessionRoutes = Router();

const sessionRepository = new SessionRecordRepository();
const validateSessionService = new ValidateSessionService(sessionRepository);

sessionRoutes.get("/session/validate", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await validateSessionService.execute(req.auth!.jti);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
