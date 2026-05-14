import { z } from "zod";

describe("POST /auth/login contract", () => {
  const loginResponseSchema = z.object({
    accessToken: z.string().min(1),
    tokenType: z.literal("Bearer"),
    expiresInSeconds: z.literal(86400)
  });

  it("validates login response payload shape", () => {
    const parsed = loginResponseSchema.safeParse({
      accessToken: "token",
      tokenType: "Bearer",
      expiresInSeconds: 86400
    });

    expect(parsed.success).toBe(true);
  });
});
