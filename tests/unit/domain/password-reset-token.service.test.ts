import { isResetTokenExpired } from "../../../src/domain/services/password-reset-token-utils";

describe("password reset token rules", () => {
  it("marks token older than 15 minutes as expired", () => {
    const issuedAt = new Date(Date.now() - 16 * 60 * 1000);
    expect(isResetTokenExpired(issuedAt, new Date())).toBe(true);
  });

  it("keeps recent token active", () => {
    const issuedAt = new Date(Date.now() - 5 * 60 * 1000);
    expect(isResetTokenExpired(issuedAt, new Date())).toBe(false);
  });
});
