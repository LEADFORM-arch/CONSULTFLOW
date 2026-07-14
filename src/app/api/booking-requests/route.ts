import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/booking-schema";
import {
  getBookingService,
  isBookingConflictCode,
  isPublishedBookingSlot,
} from "@/lib/booking-domain";
import { getSupabaseAdmin } from "@/server/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please review the booking details.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const service = getBookingService(parsed.data.serviceId);

  if (!service || !isPublishedBookingSlot(parsed.data.startAt)) {
    return NextResponse.json(
      { error: "That service or time is no longer available." },
      { status: 409 },
    );
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { error: "Booking is temporarily unavailable." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("booking_requests")
    .insert({
      consultant_slug: parsed.data.consultantSlug,
      service_id: service.id,
      start_at: parsed.data.startAt,
      timezone: parsed.data.timezone,
      duration_minutes: service.duration,
      price_cents: service.price * 100,
      currency: "USD",
      client_name: parsed.data.client.name,
      client_email: parsed.data.client.email.toLowerCase(),
      company: parsed.data.client.company || null,
      challenge: parsed.data.challenge,
      consent_to_contact: parsed.data.consentToContact,
      status: "requested",
      source: "public_booking",
    })
    .select("id, status")
    .single();

  if (error) {
    if (isBookingConflictCode(error.code)) {
      return NextResponse.json(
        { error: "That time was just requested. Please choose another." },
        { status: 409 },
      );
    }

    console.error("booking_request_insert_failed", {
      code: error.code,
      message: error.message,
    });

    return NextResponse.json(
      { error: "We could not save the request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { bookingId: data.id, status: data.status },
    { status: 201 },
  );
}
