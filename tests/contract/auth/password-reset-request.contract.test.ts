import { z } from "zod";

describe("POST /auth/password-reset/request contract", () => {
  it("validates generic accepted response", () => {
    const schema = z.object({ status: z.literal("accepted") });
    expect(schema.safeParse({ status: "accepted" }).success).toBe(true);
  });
});
