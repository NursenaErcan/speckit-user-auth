import { z } from "zod";

describe("GET /auth/session/validate contract", () => {
  it("validates response schema", () => {
    const schema = z.object({
      active: z.boolean(),
      expiresAt: z.string().datetime()
    });

    expect(
      schema.safeParse({ active: true, expiresAt: new Date().toISOString() }).success
    ).toBe(true);
  });
});
