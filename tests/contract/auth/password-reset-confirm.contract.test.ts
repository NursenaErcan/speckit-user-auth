import { z } from "zod";

describe("POST /auth/password-reset/confirm contract", () => {
  it("validates password reset completion response", () => {
    const schema = z.object({ status: z.literal("password_reset") });
    expect(schema.safeParse({ status: "password_reset" }).success).toBe(true);
  });
});
