import { describe, expect, it } from "vitest";
import {
  getBookingService,
  isBookingConflictCode,
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
    const beforeAvailability = new Date("2026-07-20T12:00:00Z");

    expect(
      isPublishedBookingSlot(
        "2026-07-22T13:00:00-04:00",
        beforeAvailability,
      ),
    ).toBe(true);
    expect(
      isPublishedBookingSlot(
        "2026-07-22T13:15:00-04:00",
        beforeAvailability,
      ),
    ).toBe(false);
  });

  it("fails closed once a published slot is in the past", () => {
    expect(
      isPublishedBookingSlot(
        "2026-07-22T13:00:00-04:00",
        new Date("2026-07-22T17:00:01Z"),
      ),
    ).toBe(false);
  });

  it("recognizes unique and overlapping database conflicts", () => {
    expect(isBookingConflictCode("23505")).toBe(true);
    expect(isBookingConflictCode("23P01")).toBe(true);
    expect(isBookingConflictCode("42501")).toBe(false);
  });

  it("uses the trusted server-side service catalog", () => {
    expect(getBookingService("strategy-intensive")).toMatchObject({
      duration: 90,
      price: 1250,
    });
    expect(getBookingService("invented-service")).toBeUndefined();
  });
});
