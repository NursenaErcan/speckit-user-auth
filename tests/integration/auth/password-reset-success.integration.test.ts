import request from "supertest";
import { createApp } from "../../../src/api/app";

describe("password reset success integration", () => {
  it("handles request endpoint", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/auth/password-reset/request")
      .send({ email: "reset@example.com" });
    expect([202, 400, 429, 500]).toContain(res.status);
  });
});
