import { isSessionUsable } from "../../../src/domain/services/validate-session-service";

describe("session validation decision", () => {
  it("rejects revoked sessions", () => {
    expect(
      isSessionUsable({ revokedAt: new Date(), expiresAt: new Date(Date.now() + 1000) }, new Date())
    ).toBe(false);
  });

  it("rejects expired sessions", () => {
    expect(
      isSessionUsable({ revokedAt: null, expiresAt: new Date(Date.now() - 1000) }, new Date())
    ).toBe(false);
  });

  it("accepts active sessions", () => {
    expect(
      isSessionUsable({ revokedAt: null, expiresAt: new Date(Date.now() + 1000) }, new Date())
    ).toBe(true);
  });
});
