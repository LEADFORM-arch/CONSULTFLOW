import { z } from "zod";

export const bookingRequestSchema = z.object({
  consultantSlug: z.literal("sarah-strategy"),
  serviceId: z.enum(["decision-session", "strategy-intensive", "advisory-fit"]),
  startAt: z.string().datetime({ offset: true }),
  timezone: z.string().trim().min(1).max(64),
  client: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    company: z.string().trim().max(120).optional(),
  }),
  challenge: z.string().trim().min(20).max(400),
  consentToContact: z.literal(true),
});

export type BookingRequestPayload = z.infer<typeof bookingRequestSchema>;

export type BookingRequestResponse = {
  bookingId: string;
  status: "requested";
};

export type BookingRequestError = {
  error: string;
  fieldErrors?: Record<string, string[]>;
};
