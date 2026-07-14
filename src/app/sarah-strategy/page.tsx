import type { Metadata } from "next";
import { PublicBookingExperience } from "@/components/public-booking";

export const metadata: Metadata = {
  title: "Book a strategy session | Sarah Bennett Advisory",
  description:
    "Reserve a focused advisory session with Sarah Bennett. Clear scope, protected time, and a decision-ready outcome.",
};

export default function SarahStrategyBookingPage() {
  return <PublicBookingExperience />;
}
