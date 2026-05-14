import { RegisterUserService } from "../../../src/domain/services/register-user-service";
import { AppError } from "../../../src/shared/errors/app-error";

describe("RegisterUserService", () => {
  const userRepository = {
    findByEmail: jest.fn(),
    create: jest.fn()
  };
  const hasher = { hash: jest.fn() };
  const audit = { write: jest.fn() };
  const breached = { isBreached: jest.fn() };

  const service = new RegisterUserService(
    userRepository as never,
    hasher as never,
    audit as never,
    breached as never
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers user successfully", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue("hash");
    userRepository.create.mockResolvedValue({ id: "u1", email: "user@example.com" });
    breached.isBreached.mockResolvedValue(false);

    const result = await service.execute({
      email: "User@example.com",
      password: "StrongPassw0rd!",
      sourceIp: "127.0.0.1"
    });

    expect(result.userId).toBe("u1");
    expect(audit.write).toHaveBeenCalledWith("REGISTER_SUCCESS", "u1", "127.0.0.1", {});
  });

  it("rejects weak password", async () => {
    await expect(
      service.execute({ email: "u@example.com", password: "weak", sourceIp: null })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects breached password", async () => {
    breached.isBreached.mockResolvedValue(true);
    await expect(
      service.execute({ email: "u@example.com", password: "StrongPassw0rd!", sourceIp: null })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects duplicate email", async () => {
    breached.isBreached.mockResolvedValue(false);
    userRepository.findByEmail.mockResolvedValue({ id: "u1" });
    await expect(
      service.execute({ email: "u@example.com", password: "StrongPassw0rd!", sourceIp: null })
    ).rejects.toBeInstanceOf(AppError);
  });
});
