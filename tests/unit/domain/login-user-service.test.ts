import { LoginUserService } from "../../../src/domain/services/login-user-service";
import { AppError } from "../../../src/shared/errors/app-error";

describe("LoginUserService", () => {
  const userRepository = {
    findByEmail: jest.fn(),
    updateLastLogin: jest.fn()
  };
  const hasher = { verify: jest.fn() };
  const tokenService = { issue: jest.fn() };
  const audit = { write: jest.fn() };
  const rateLimit = { isBlocked: jest.fn(), registerAttempt: jest.fn() };
  const sessions = { create: jest.fn() };

  const service = new LoginUserService(
    userRepository as never,
    hasher as never,
    tokenService as never,
    audit as never,
    rateLimit as never,
    sessions as never
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects blocked attempt", async () => {
    rateLimit.isBlocked.mockResolvedValue(true);
    await expect(
      service.execute({ email: "u@example.com", password: "p", sourceIp: "1.1.1.1" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects invalid credentials", async () => {
    rateLimit.isBlocked.mockResolvedValue(false);
    userRepository.findByEmail.mockResolvedValue({ id: "u1", passwordHash: "h" });
    hasher.verify.mockResolvedValue(false);

    await expect(
      service.execute({ email: "u@example.com", password: "bad", sourceIp: "1.1.1.1" })
    ).rejects.toBeInstanceOf(AppError);

    expect(rateLimit.registerAttempt).toHaveBeenCalled();
  });

  it("returns token for valid credentials", async () => {
    rateLimit.isBlocked.mockResolvedValue(false);
    userRepository.findByEmail.mockResolvedValue({ id: "u1", email: "u@example.com", passwordHash: "h" });
    hasher.verify.mockResolvedValue(true);
    tokenService.issue.mockReturnValue("token");

    const result = await service.execute({ email: "u@example.com", password: "ok", sourceIp: "1.1.1.1" });

    expect(result.accessToken).toBe("token");
    expect(sessions.create).toHaveBeenCalled();
    expect(userRepository.updateLastLogin).toHaveBeenCalledWith("u1");
  });
});
