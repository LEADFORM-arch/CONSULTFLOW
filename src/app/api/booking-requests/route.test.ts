import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const validPayload = {
  consultantSlug: "sarah-strategy",
  serviceId: "decision-session",
  startAt: "2026-07-21T09:30:00-04:00",
  timezone: "America/New_York",
  client: {
    name: "Jordan Lee",
    email: "jordan@example.com",
    company: "Northstar Labs",
  },
  challenge: "We need to choose a focused growth strategy for the next quarter.",
  consentToContact: true,
};

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/booking-requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/booking-requests", () => {
  it("rejects malformed JSON", async () => {
    const request = new Request("http://localhost/api/booking-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid JSON body.",
    });
  });

  it("rejects incomplete booking details before touching persistence", async () => {
    const response = await POST(jsonRequest({ client: {} }));
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.error).toBe("Please review the booking details.");
  });

  it("rejects unpublished slots", async () => {
    const response = await POST(
      jsonRequest({ ...validPayload, startAt: "2026-07-29T09:30:00-04:00" }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "That service or time is no longer available.",
    });
  });

  it("fails closed when the database is not configured", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const response = await POST(jsonRequest(validPayload));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Booking is temporarily unavailable.",
    });
  });
});
