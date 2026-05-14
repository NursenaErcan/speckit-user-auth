import { randomUUID } from "crypto";
import { AppError } from "../../shared/errors/app-error";
import { UserRepository } from "../../infra/db/repositories/user-repository";
import { BcryptPasswordHasher } from "../../infra/crypto/bcrypt-password-hasher";
import { JwtTokenService } from "../../infra/tokens/jwt-token-service";
import { AuthAuditRepository } from "../../infra/db/repositories/auth-audit-repository";
import { RateLimitService } from "./rate-limit-service";
import { Email } from "../value-objects/email";
import { SessionRecordRepository } from "../../infra/db/repositories/session-record-repository";

export interface LoginUserInput {
  email: string;
  password: string;
  sourceIp: string;
}

/** Handles credential login with throttling, audit logging, and token issuance. */
export class LoginUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly tokenService: JwtTokenService,
    private readonly auditRepository: AuthAuditRepository,
    private readonly rateLimitService: RateLimitService,
    private readonly sessionRepository: SessionRecordRepository
  ) {}

  async execute(input: LoginUserInput): Promise<{ accessToken: string; tokenType: string; expiresInSeconds: number }> {
    const email = new Email(input.email).value;

    if (await this.rateLimitService.isBlocked("LOGIN", input.sourceIp, email)) {
      await this.auditRepository.write("RATE_LIMITED", null, input.sourceIp, { endpoint: "LOGIN", email });
      throw new AppError("RATE_LIMITED", 429);
    }

    const user = await this.userRepository.findByEmail(email);
    const valid = user ? await this.passwordHasher.verify(input.password, user.passwordHash) : false;
    if (!user || !valid) {
      await this.rateLimitService.registerAttempt("LOGIN", input.sourceIp, email);
      await this.auditRepository.write("LOGIN_FAILURE", user?.id ?? null, input.sourceIp, { email });
      throw new AppError("INVALID_CREDENTIALS", 401);
    }

    await this.userRepository.updateLastLogin(user.id);

    const jti = randomUUID();
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 24 * 60 * 60 * 1000);

    const accessToken = this.tokenService.issue({
      sub: user.id,
      jti,
      email: user.email
    });

    await this.sessionRepository.create({
      userId: user.id,
      jwtId: jti,
      issuedAt,
      expiresAt,
      revokedAt: null,
      revokedReason: null,
      sourceIp: input.sourceIp,
      userAgent: null
    });

    await this.auditRepository.write("LOGIN_SUCCESS", user.id, input.sourceIp, {});

    return {
      accessToken,
      tokenType: "Bearer",
      expiresInSeconds: 86400
    };
  }
}
