import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock database.server to avoid real DB connection
vi.mock("~/utils/database.server", () => ({
  getAccountByEmail: vi.fn(),
  getAccountById: vi.fn(),
}));

// Mock mailer
vi.mock("~/utils/mailer.server", () => ({
  sendAccountApprovedEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

import {
  requireAuth,
  requireAdmin,
  requireAuthScope,
} from "~/utils/account.server";

function buildRequest(cookieHeader?: string): Request {
  const headers = new Headers();
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }
  return new Request("http://localhost/test", { headers });
}

describe("requireAuth()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws 401 when no cookie is present", async () => {
    const req = buildRequest();
    await expect(requireAuth(req)).rejects.toSatisfy((err: unknown) => {
      return err instanceof Response && err.status === 401;
    });
  });

  it("throws 401 when cookie is invalid", async () => {
    const req = buildRequest("sp_account_id=garbage");
    await expect(requireAuth(req)).rejects.toSatisfy((err: unknown) => {
      return err instanceof Response && err.status === 401;
    });
  });
});

describe("requireAdmin()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws 401 when no cookie is present", async () => {
    const req = buildRequest();
    await expect(requireAdmin(req)).rejects.toSatisfy((err: unknown) => {
      return err instanceof Response && err.status === 401;
    });
  });
});

describe("requireAuthScope()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws 401 for anonymous sessions (no cookie)", async () => {
    const req = buildRequest();
    await expect(requireAuthScope(req)).rejects.toSatisfy((err: unknown) => {
      return err instanceof Response && err.status === 401;
    });
  });
});
