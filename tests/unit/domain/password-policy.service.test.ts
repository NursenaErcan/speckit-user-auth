import { isStrongPassword } from "../../../src/domain/services/password-policy-service";

describe("password policy", () => {
  it("accepts compliant password", () => {
    expect(isStrongPassword("StrongPassw0rd!")).toBe(true);
  });

  it("rejects weak password", () => {
    expect(isStrongPassword("weak")).toBe(false);
  });
});
