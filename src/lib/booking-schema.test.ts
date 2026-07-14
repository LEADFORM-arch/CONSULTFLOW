import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "./booking-schema";

const validRequest = {
  consultantSlug: "sarah-strategy",
  serviceId: "strategy-intensive",
  startAt: "2026-07-22T13:00:00-04:00",
  timezone: "America/New_York",
  client: {
    name: "Jordan Lee",
    email: "jordan@beacon.ai",
    company: "Beacon AI",
  },
  challenge:
    "Choose the strongest enterprise wedge and assign an accountable owner.",
  consentToContact: true,
} as const;

describe("booking request schema", () => {
  it("accepts a complete consented request", () => {
    expect(bookingRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it("rejects unknown consultants and services", () => {
    expect(
      bookingRequestSchema.safeParse({
        ...validRequest,
        consultantSlug: "unknown",
        serviceId: "custom-price",
      }).success,
    ).toBe(false);
  });

  it("requires explicit consent and a useful brief", () => {
    expect(
      bookingRequestSchema.safeParse({
        ...validRequest,
        challenge: "Call me",
        consentToContact: false,
      }).success,
    ).toBe(false);
  });

  it("rejects malformed client contact details", () => {
    expect(
      bookingRequestSchema.safeParse({
        ...validRequest,
        client: { name: "J", email: "not-an-email" },
      }).success,
    ).toBe(false);
  });
});
