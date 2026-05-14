import { RequestPasswordResetService } from "../../../src/domain/services/request-password-reset-service";
import { AppError } from "../../../src/shared/errors/app-error";

describe("RequestPasswordResetService", () => {
  const userRepository = { findByEmail: jest.fn() };
  const tokenRepository = { create: jest.fn() };
  const emailService = { send: jest.fn() };
  const audit = { write: jest.fn() };
  const rateLimit = { isBlocked: jest.fn(), registerAttempt: jest.fn() };

  const service = new RequestPasswordResetService(
    userRepository as never,
    tokenRepository as never,
    emailService as never,
    audit as never,
    rateLimit as never
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects blocked reset request", async () => {
    rateLimit.isBlocked.mockResolvedValue(true);
    await expect(service.execute("u@example.com", "1.1.1.1")).rejects.toBeInstanceOf(AppError);
  });

  it("does not leak account existence", async () => {
    rateLimit.isBlocked.mockResolvedValue(false);
    userRepository.findByEmail.mockResolvedValue(null);

    await service.execute("u@example.com", "1.1.1.1");

    expect(tokenRepository.create).not.toHaveBeenCalled();
  });

  it("creates and sends reset token for existing user", async () => {
    rateLimit.isBlocked.mockResolvedValue(false);
    userRepository.findByEmail.mockResolvedValue({ id: "u1" });

    await service.execute("u@example.com", "1.1.1.1");

    expect(tokenRepository.create).toHaveBeenCalled();
    expect(emailService.send).toHaveBeenCalled();
    expect(audit.write).toHaveBeenCalled();
  });
});
