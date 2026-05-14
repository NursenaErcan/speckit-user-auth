import { AppError } from "../../shared/errors/app-error";
import { SessionRecordRepository } from "../../infra/db/repositories/session-record-repository";

interface SessionDecisionInput {
  revokedAt: Date | null;
  expiresAt: Date;
}

/** Pure decision helper for session usability checks. */
export function isSessionUsable(input: SessionDecisionInput, now: Date): boolean {
  if (input.revokedAt) {
    return false;
  }
  return input.expiresAt.getTime() > now.getTime();
}

/** Validates whether a token session remains active and non-revoked. */
export class ValidateSessionService {
  constructor(private readonly sessionRepository: SessionRecordRepository) {}

  async execute(jwtId: string): Promise<{ active: boolean; expiresAt: string }> {
    const session = await this.sessionRepository.findByJwtId(jwtId);
    if (!session) {
      throw new AppError("UNAUTHORIZED", 401);
    }

    if (!isSessionUsable({ revokedAt: session.revokedAt, expiresAt: session.expiresAt }, new Date())) {
      throw new AppError("UNAUTHORIZED", 401);
    }

    return {
      active: true,
      expiresAt: session.expiresAt.toISOString()
    };
  }
}
