import { describe, expect, it } from "vitest";
import {
  getBookingService,
  isPublishedBookingSlot,
  toEasternIso,
} from "./booking-domain";

describe("booking domain", () => {
  it("normalizes Eastern Time slots with an explicit offset", () => {
    expect(toEasternIso("2026-07-22", "1:00 PM")).toBe(
      "2026-07-22T13:00:00-04:00",
    );
    expect(toEasternIso("2026-07-23", "9:00 AM")).toBe(
      "2026-07-23T09:00:00-04:00",
    );
  });

  it("rejects malformed time labels", () => {
    expect(toEasternIso("2026-07-22", "13:00")).toBeNull();
  });

  it("only accepts slots published by the consultant", () => {
    expect(
      isPublishedBookingSlot("2026-07-22T13:00:00-04:00"),
    ).toBe(true);
    expect(
      isPublishedBookingSlot("2026-07-22T13:15:00-04:00"),
    ).toBe(false);
  });

  it("uses the trusted server-side service catalog", () => {
    expect(getBookingService("strategy-intensive")).toMatchObject({
      duration: 90,
      price: 1250,
    });
    expect(getBookingService("invented-service")).toBeUndefined();
  });
});
