export type BookingService = {
  id: "decision-session" | "strategy-intensive" | "advisory-fit";
  name: string;
  descriptor: string;
  duration: number;
  price: number;
  idealFor: string;
  outcome: string;
};

export const bookingServices: readonly BookingService[] = [
  {
    id: "decision-session",
    name: "Executive Decision Session",
    descriptor: "A focused working session",
    duration: 60,
    price: 750,
    idealFor: "One high-stakes decision that cannot drift",
    outcome: "Decision memo + 3 accountable next steps",
  },
  {
    id: "strategy-intensive",
    name: "Strategy Intensive",
    descriptor: "Pre-work, workshop, and decision brief",
    duration: 90,
    price: 1250,
    idealFor: "Growth, positioning, or operating model questions",
    outcome: "Prioritized thesis + 30-day action plan",
  },
  {
    id: "advisory-fit",
    name: "Advisory Fit Conversation",
    descriptor: "A qualified path to ongoing advisory",
    duration: 30,
    price: 0,
    idealFor: "Leaders considering a quarterly engagement",
    outcome: "Mutual fit decision + recommended scope",
  },
];

export const bookingDays = [
  { id: "2026-07-21", day: "Tue", date: "21", month: "Jul" },
  { id: "2026-07-22", day: "Wed", date: "22", month: "Jul" },
  { id: "2026-07-23", day: "Thu", date: "23", month: "Jul" },
  { id: "2026-07-24", day: "Fri", date: "24", month: "Jul" },
] as const;

export const bookingTimesByDay: Record<string, readonly string[]> = {
  "2026-07-21": ["9:30 AM", "11:00 AM", "2:30 PM"],
  "2026-07-22": ["10:00 AM", "1:00 PM", "3:30 PM"],
  "2026-07-23": ["9:00 AM", "12:30 PM", "4:00 PM"],
  "2026-07-24": ["10:30 AM", "1:30 PM"],
};

export function getBookingService(serviceId: string) {
  return bookingServices.find((service) => service.id === serviceId);
}

export function toEasternIso(day: string, time: string) {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(time);
  if (!match) return null;

  const rawHour = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3];
  const hour = meridiem === "PM" ? (rawHour % 12) + 12 : rawHour % 12;

  return `${day}T${String(hour).padStart(2, "0")}:${minutes}:00-04:00`;
}

export function isPublishedBookingSlot(startAt: string) {
  return bookingDays.some((day) =>
    (bookingTimesByDay[day.id] ?? []).some(
      (time) => toEasternIso(day.id, time) === startAt,
    ),
  );
}
