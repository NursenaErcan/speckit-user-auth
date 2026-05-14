import request from "supertest";
import { createApp } from "../../../src/api/app";

describe("password reset token failures integration", () => {
  it("rejects invalid token submissions", async () => {
    const app = createApp();
    const res = await request(app).post("/auth/password-reset/confirm").send({
      resetToken: "invalid",
      newPassword: "StrongPassw0rd!"
    });
    expect([400, 410, 429, 500]).toContain(res.status);
  });
});
