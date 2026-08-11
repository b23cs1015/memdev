import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("CORS", () => {
  it("allows requests from the MemDev browser extension", async () => {
    const extensionOrigin =
      "chrome-extension://memdev-test";

    const response = await request(app)
      .get("/api/auth/me")
      .set("Origin", extensionOrigin);

    expect(
      response.headers[
        "access-control-allow-origin"
      ],
    ).toBe(extensionOrigin);

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });
  });

  it("allows requests from the MemDev web app", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set(
        "Origin",
        "http://localhost:5173",
      );

    expect(
      response.headers[
        "access-control-allow-origin"
      ],
    ).toBe("http://localhost:5173");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });
  });
});