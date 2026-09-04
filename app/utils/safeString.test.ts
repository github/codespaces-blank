import { describe, it, expect } from "vitest";
import { safeString } from "~/utils/schemas.server";

describe("safeString()", () => {
  const schema = safeString();

  it("strips basic HTML tags", () => {
    expect(schema.parse("<b>Bold</b>")).toBe("Bold");
  });

  it("strips script tags", () => {
    expect(schema.parse('<script>alert("xss")</script>Safe')).toBe('alert("xss")Safe');
  });

  it("strips nested tags", () => {
    expect(schema.parse("<div><p>Nested</p></div>")).toBe("Nested");
  });

  it("strips tags with attributes", () => {
    expect(schema.parse('<a href="http://evil.com" onclick="steal()">Click</a>')).toBe("Click");
  });

  it("strips img tags with onerror", () => {
    expect(schema.parse('<img src=x onerror="alert(1)">')).toBe("");
  });

  it("trims whitespace", () => {
    expect(schema.parse("  hello  ")).toBe("hello");
  });

  it("preserves normal text unchanged", () => {
    expect(schema.parse("Jean Dupont")).toBe("Jean Dupont");
  });

  it("preserves accented characters", () => {
    expect(schema.parse("Éric Müller-Østgaard")).toBe("Éric Müller-Østgaard");
  });

  it("preserves plain text without angle brackets", () => {
    expect(schema.parse("score 5")).toBe("score 5");
  });
});
