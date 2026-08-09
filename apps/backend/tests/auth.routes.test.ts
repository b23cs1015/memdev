import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

const mockGoogleOAuth2Client = vi.hoisted(() => ({
  generateAuthUrl: vi.fn(),
  getToken: vi.fn(),
  verifyIdToken: vi.fn(),
}));

vi.mock("../src/config/prisma.js", () => ({
  prisma: mockPrisma,
}));

vi.mock("../src/config/google.js", () => ({
  googleOAuth2Client: mockGoogleOAuth2Client,
}));

import app from "../src/app.js";

describe("Authentication API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("rejects an invalid email and short password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "not-an-email",
          password: "123",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid registration data",
        errors: {
          email: ["Please provide a valid email address"],
          password: ["Password must be at least 8 characters long"],
        },
      });
    });

    it("creates a user with a hashed password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        email: "newuser@example.com",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "NewUser@Example.com",
          password: "password123",
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        user: {
          id: "user-1",
          email: "newuser@example.com",
          createdAt: "2026-08-09T00:00:00.000Z",
        },
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "newuser@example.com",
        },
      });

      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);

      const createCall = mockPrisma.user.create.mock.calls[0][0];

      expect(createCall.data.email).toBe("newuser@example.com");
      expect(createCall.data.passwordHash).toBeTypeOf("string");
      expect(createCall.data.passwordHash).not.toBe("password123");
    });

    it("rejects an existing email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "existing-user",
        email: "existing@example.com",
        passwordHash: "hashed-password",
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "existing@example.com",
          password: "password123",
        });

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        message: "An account with this email already exists",
      });

      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/login", () => {
    it("rejects invalid login data", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "not-an-email",
          password: "",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Invalid login data",
        errors: {
          email: ["Please provide a valid email address"],
          password: ["Password is required"],
        },
      });
    });

    it("rejects an unknown user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "unknown@example.com",
          password: "password123",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });

    it("logs in a user with valid credentials", async () => {
      const bcrypt = await import("bcryptjs");

      const passwordHash = await bcrypt.hash(
        "password123",
        12,
      );

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        passwordHash,
        googleId: null,
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "USER@EXAMPLE.COM",
          password: "password123",
        });

      expect(response.status).toBe(200);

      expect(response.body.token).toEqual(expect.any(String));

      expect(response.body.user).toEqual({
        id: "user-1",
        email: "user@example.com",
        createdAt: "2026-08-09T00:00:00.000Z",
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
      });
    });

    it("rejects a Google-only account using password login", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "google-user",
        email: "google@example.com",
        passwordHash: null,
        googleId: "google-sub-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "google@example.com",
          password: "password123",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });
  });

  describe("GET /api/auth/me", () => {
    it("rejects requests without authentication", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Authentication required",
      });
    });

    it("rejects an invalid JWT", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Invalid or expired authentication token",
      });
    });
  });

  describe("GET /api/auth/google", () => {
    it("redirects to Google authorization", async () => {
      mockGoogleOAuth2Client.generateAuthUrl.mockReturnValue(
        "https://accounts.google.com/test-auth-url",
      );

      const response = await request(app).get("/api/auth/google");

      expect(response.status).toBe(302);

      expect(response.headers.location).toBe(
        "https://accounts.google.com/test-auth-url",
      );

      expect(
        mockGoogleOAuth2Client.generateAuthUrl,
      ).toHaveBeenCalledWith({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
        prompt: "select_account",
      });
    });
  });

  describe("GET /api/auth/google/callback", () => {
    it("rejects a callback without an authorization code", async () => {
      const response = await request(app).get(
        "/api/auth/google/callback",
      );

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Google authorization code is missing",
      });

      expect(
        mockGoogleOAuth2Client.getToken,
      ).not.toHaveBeenCalled();
    });

    it("creates a new user from a verified Google identity", async () => {
      mockGoogleOAuth2Client.getToken.mockResolvedValue({
        tokens: {
          id_token: "mock-google-id-token",
        },
      });

      mockGoogleOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: "google-sub-123",
          email: "GoogleUser@Example.com",
        }),
      });

      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      mockPrisma.user.create.mockResolvedValue({
        id: "google-user-1",
        email: "googleuser@example.com",
        passwordHash: null,
        googleId: "google-sub-123",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .get("/api/auth/google/callback")
        .query({
          code: "mock-google-code",
        });

      expect(response.status).toBe(200);

      expect(response.body.token).toEqual(expect.any(String));

      expect(response.body.user).toEqual({
        id: "google-user-1",
        email: "googleuser@example.com",
        createdAt: "2026-08-09T00:00:00.000Z",
      });

      expect(
        mockGoogleOAuth2Client.getToken,
      ).toHaveBeenCalledWith("mock-google-code");

      expect(
        mockGoogleOAuth2Client.verifyIdToken,
      ).toHaveBeenCalledWith({
        idToken: "mock-google-id-token",
        audience: expect.any(String),
      });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "googleuser@example.com",
          googleId: "google-sub-123",
        },
      });
    });

    it("logs in an existing Google user", async () => {
      mockGoogleOAuth2Client.getToken.mockResolvedValue({
        tokens: {
          id_token: "mock-google-id-token",
        },
      });

      mockGoogleOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: "google-sub-existing",
          email: "existing@example.com",
        }),
      });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "existing-google-user",
        email: "existing@example.com",
        passwordHash: null,
        googleId: "google-sub-existing",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .get("/api/auth/google/callback")
        .query({
          code: "mock-google-code",
        });

      expect(response.status).toBe(200);

      expect(response.body.token).toEqual(expect.any(String));

      expect(response.body.user).toEqual({
        id: "existing-google-user",
        email: "existing@example.com",
        createdAt: "2026-08-09T00:00:00.000Z",
      });

      expect(mockPrisma.user.create).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it("links Google to an existing email account", async () => {
      mockGoogleOAuth2Client.getToken.mockResolvedValue({
        tokens: {
          id_token: "mock-google-id-token",
        },
      });

      mockGoogleOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: "google-sub-new",
          email: "existing@example.com",
        }),
      });

      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "existing-email-user",
          email: "existing@example.com",
          passwordHash: "hashed-password",
          googleId: null,
          createdAt: new Date("2026-08-09T00:00:00.000Z"),
          updatedAt: new Date("2026-08-09T00:00:00.000Z"),
        });

      mockPrisma.user.update.mockResolvedValue({
        id: "existing-email-user",
        email: "existing@example.com",
        passwordHash: "hashed-password",
        googleId: "google-sub-new",
        createdAt: new Date("2026-08-09T00:00:00.000Z"),
        updatedAt: new Date("2026-08-09T00:00:00.000Z"),
      });

      const response = await request(app)
        .get("/api/auth/google/callback")
        .query({
          code: "mock-google-code",
        });

      expect(response.status).toBe(200);

      expect(response.body.token).toEqual(expect.any(String));

      expect(response.body.user).toEqual({
        id: "existing-email-user",
        email: "existing@example.com",
        createdAt: "2026-08-09T00:00:00.000Z",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: {
          id: "existing-email-user",
        },
        data: {
          googleId: "google-sub-new",
        },
      });

      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });
});