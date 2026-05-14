jest.mock("../../../src/infra/db/postgres", () => ({
  getPool: jest.fn()
}));

import { RateLimitService } from "../../../src/domain/services/rate-limit-service";
import { getPool } from "../../../src/infra/db/postgres";

describe("RateLimitService", () => {
  const query = jest.fn();
  (getPool as jest.Mock).mockReturnValue({ query });

  const service = new RateLimitService();

  beforeEach(() => {
    jest.clearAllMocks();
    (getPool as jest.Mock).mockReturnValue({ query });
  });

  it("registers attempts for ip and account scopes", async () => {
    query.mockResolvedValue({});
    await service.registerAttempt("LOGIN", "1.1.1.1", "u@example.com");
    expect(query).toHaveBeenCalledTimes(2);
  });

  it("returns false when no blocks exist", async () => {
    query.mockResolvedValue({ rowCount: 0, rows: [] });
    const blocked = await service.isBlocked("LOGIN", "1.1.1.1", "u@example.com");
    expect(blocked).toBe(false);
  });

  it("returns true when bucket is blocked", async () => {
    query.mockResolvedValue({ rowCount: 1, rows: [{ blocked_until: new Date(Date.now() + 10000) }] });
    const blocked = await service.isBlocked("LOGIN", "1.1.1.1", "u@example.com");
    expect(blocked).toBe(true);
  });
});
