jest.mock("../../../src/infra/db/postgres", () => ({
  getPool: jest.fn()
}));

import { ConfirmPasswordResetService } from "../../../src/domain/services/confirm-password-reset-service";
import { AppError } from "../../../src/shared/errors/app-error";
import { getPool } from "../../../src/infra/db/postgres";

describe("ConfirmPasswordResetService", () => {
  const tokenRepository = { findByRawToken: jest.fn(), markUsed: jest.fn() };
  const userRepository = {};
  const hasher = { hash: jest.fn() };
  const audit = { write: jest.fn() };
  const breached = { isBreached: jest.fn() };

  const poolQuery = jest.fn();
  (getPool as jest.Mock).mockReturnValue({ query: poolQuery });

  const service = new ConfirmPasswordResetService(
    tokenRepository as never,
    userRepository as never,
    hasher as never,
    audit as never,
    breached as never
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (getPool as jest.Mock).mockReturnValue({ query: poolQuery });
  });

  it("rejects weak password", async () => {
    await expect(service.execute("token", "weak", "1.1.1.1")).rejects.toBeInstanceOf(AppError);
  });

  it("rejects breached password", async () => {
    breached.isBreached.mockResolvedValue(true);
    await expect(service.execute("token", "StrongPassw0rd!", "1.1.1.1")).rejects.toBeInstanceOf(AppError);
  });

  it("rejects invalid token", async () => {
    breached.isBreached.mockResolvedValue(false);
    tokenRepository.findByRawToken.mockResolvedValue(null);
    await expect(service.execute("token", "StrongPassw0rd!", "1.1.1.1")).rejects.toBeInstanceOf(AppError);
  });

  it("completes reset for valid token", async () => {
    breached.isBreached.mockResolvedValue(false);
    hasher.hash.mockResolvedValue("hash");
    tokenRepository.findByRawToken.mockResolvedValue({
      id: "r1",
      userId: "u1",
      expiresAt: new Date(Date.now() + 10000),
      invalidatedAt: null,
      usedAt: null
    });
    poolQuery.mockResolvedValueOnce({ rowCount: 1 }).mockResolvedValue({ rowCount: 1 });

    await service.execute("token", "StrongPassw0rd!", "1.1.1.1");

    expect(hasher.hash).toHaveBeenCalled();
    expect(tokenRepository.markUsed).toHaveBeenCalledWith("r1");
    expect(audit.write).toHaveBeenCalledWith("RESET_COMPLETED", "u1", "1.1.1.1", {});
  });
});
