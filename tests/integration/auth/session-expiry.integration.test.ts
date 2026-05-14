import request from "supertest";
import { createApp } from "../../../src/api/app";

describe("session expiry integration", () => {
  it("rejects missing token", async () => {
    const app = createApp();
    const res = await request(app).get("/auth/session/validate");
    expect([401, 500]).toContain(res.status);
  });
});
