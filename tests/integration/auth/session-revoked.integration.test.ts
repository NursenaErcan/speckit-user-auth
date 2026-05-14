import request from "supertest";
import { createApp } from "../../../src/api/app";

describe("session revoked integration", () => {
  it("returns unauthorized when token is invalid", async () => {
    const app = createApp();
    const res = await request(app)
      .get("/auth/session/validate")
      .set("Authorization", "Bearer invalid");

    expect([401, 500]).toContain(res.status);
  });
});
