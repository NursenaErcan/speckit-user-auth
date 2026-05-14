import { AppError } from "../../shared/errors/app-error";
import { UserRepository } from "../../infra/db/repositories/user-repository";
import { BcryptPasswordHasher } from "../../infra/crypto/bcrypt-password-hasher";
import { AuthAuditRepository } from "../../infra/db/repositories/auth-audit-repository";
import { Email } from "../value-objects/email";
import { isStrongPassword } from "./password-policy-service";
import { BreachedPasswordService } from "./breached-password-service";

export interface RegisterUserInput {
  email: string;
  password: string;
  sourceIp: string | null;
}

/** Handles user registration with policy, uniqueness, and audit checks. */
export class RegisterUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly auditRepository: AuthAuditRepository,
    private readonly breachedPasswordService: BreachedPasswordService
  ) {}

  async execute(input: RegisterUserInput): Promise<{ userId: string; email: string }> {
    const email = new Email(input.email).value;

    if (!isStrongPassword(input.password)) {
      throw new AppError("WEAK_PASSWORD", 400);
    }

    if (await this.breachedPasswordService.isBreached(input.password)) {
      throw new AppError("BREACHED_PASSWORD", 400);
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("EMAIL_ALREADY_EXISTS", 409);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create(email, passwordHash);

    await this.auditRepository.write("REGISTER_SUCCESS", user.id, input.sourceIp, {});

    return { userId: user.id, email: user.email };
  }
}
