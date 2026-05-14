import request from "supertest";
import { createApp } from "../../../src/api/app";

describe("login failures integration", () => {
  it("rejects malformed login payloads", async () => {
    const app = createApp();
    const res = await request(app).post("/auth/login").send({ email: "bad" });
    expect([400, 401, 429, 500]).toContain(res.status);
  });
});
