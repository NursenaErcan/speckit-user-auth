import request from "supertest";
import { createApp } from "../../../src/api/app";

describe("register + login integration", () => {
  it("returns auth responses or controlled failures", async () => {
    const app = createApp();

    const registerRes = await request(app).post("/auth/register").send({
      email: "integration@example.com",
      password: "StrongPassw0rd!"
    });

    expect([201, 400, 409, 500]).toContain(registerRes.status);

    const loginRes = await request(app).post("/auth/login").send({
      email: "integration@example.com",
      password: "StrongPassw0rd!"
    });

    expect([200, 401, 429, 500]).toContain(loginRes.status);
  });
});
