import { describe, it, expect } from "vitest";
import { validateIcsUrl } from "~/utils/url-validation";

describe("validateIcsUrl()", () => {
  // --- Valid URLs ---
  it("accepts https:// URLs", () => {
    expect(validateIcsUrl("https://calendar.google.com/calendar.ics")).toEqual({ ok: true });
  });

  it("accepts webcal:// URLs", () => {
    expect(validateIcsUrl("webcal://calendar.example.com/cal.ics")).toEqual({ ok: true });
  });

  // --- Blocked protocols ---
  it("rejects http:// URLs", () => {
    expect(validateIcsUrl("http://example.com/cal.ics").ok).toBe(false);
  });

  it("rejects file:// URLs", () => {
    expect(validateIcsUrl("file:///etc/passwd").ok).toBe(false);
  });

  it("rejects ftp:// URLs", () => {
    expect(validateIcsUrl("ftp://evil.com/data").ok).toBe(false);
  });

  it("rejects javascript: URLs", () => {
    expect(validateIcsUrl("javascript:alert(1)").ok).toBe(false);
  });

  // --- SSRF: private and internal IPs ---
  it("blocks localhost", () => {
    expect(validateIcsUrl("https://localhost/cal.ics").ok).toBe(false);
  });

  it("blocks 127.0.0.1", () => {
    expect(validateIcsUrl("https://127.0.0.1/cal.ics").ok).toBe(false);
  });

  it("blocks [::1]", () => {
    expect(validateIcsUrl("https://[::1]/cal.ics").ok).toBe(false);
  });

  it("blocks 10.x.x.x", () => {
    expect(validateIcsUrl("https://10.0.0.1/cal.ics").ok).toBe(false);
  });

  it("blocks 192.168.x.x", () => {
    expect(validateIcsUrl("https://192.168.1.1/cal.ics").ok).toBe(false);
  });

  it("blocks 172.16-31.x.x", () => {
    expect(validateIcsUrl("https://172.16.0.1/cal.ics").ok).toBe(false);
    expect(validateIcsUrl("https://172.20.5.1/cal.ics").ok).toBe(false);
    expect(validateIcsUrl("https://172.31.255.255/cal.ics").ok).toBe(false);
  });

  it("allows 172.32.x.x (not private)", () => {
    expect(validateIcsUrl("https://172.32.0.1/cal.ics").ok).toBe(true);
  });

  it("blocks .local domains", () => {
    expect(validateIcsUrl("https://myserver.local/cal.ics").ok).toBe(false);
  });

  it("blocks 0.0.0.0", () => {
    expect(validateIcsUrl("https://0.0.0.0/cal.ics").ok).toBe(false);
  });

  it("blocks AWS metadata endpoint", () => {
    expect(validateIcsUrl("https://169.254.169.254/latest/meta-data/").ok).toBe(false);
  });

  // --- Invalid URLs ---
  it("rejects garbage strings", () => {
    expect(validateIcsUrl("not-a-url").ok).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateIcsUrl("").ok).toBe(false);
  });
});
