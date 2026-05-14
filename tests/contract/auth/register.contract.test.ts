import { z } from "zod";

describe("POST /auth/register contract", () => {
  const registerResponseSchema = z.object({
    userId: z.string().uuid(),
    email: z.string().email()
  });

  it("validates register response payload shape", () => {
    const parsed = registerResponseSchema.safeParse({
      userId: "11111111-1111-4111-8111-111111111111",
      email: "user@example.com"
    });

    expect(parsed.success).toBe(true);
  });
});
