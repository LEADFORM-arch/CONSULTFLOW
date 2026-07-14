"use client";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { serviceCatalog, type ServiceCatalogItem } from "@/lib/service-catalog";

type Step = 1 | 2 | 3 | 4;

const days = [
  { id: "2026-07-21", day: "Tue", date: "21", month: "Jul" },
  { id: "2026-07-22", day: "Wed", date: "22", month: "Jul" },
  { id: "2026-07-23", day: "Thu", date: "23", month: "Jul" },
  { id: "2026-07-24", day: "Fri", date: "24", month: "Jul" },
];

const timesByDay: Record<string, string[]> = {
  "2026-07-21": ["9:30 AM", "11:00 AM", "2:30 PM"],
  "2026-07-22": ["10:00 AM", "1:00 PM", "3:30 PM"],
  "2026-07-23": ["9:00 AM", "12:30 PM", "4:00 PM"],
  "2026-07-24": ["10:30 AM", "1:30 PM"],
};

const stepLabels = ["Service", "Time", "Context", "Confirm"];

function money(value: number) {
  return value === 0
    ? "Complimentary"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
}

export function PublicBookingExperience() {
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState("strategy-intensive");
  const [day, setDay] = useState("2026-07-22");
  const [time, setTime] = useState("1:00 PM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [challenge, setChallenge] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const service = useMemo(
    () => serviceCatalog.find((item) => item.id === serviceId) ?? serviceCatalog[1],
    [serviceId],
  );

  const selectedDay = days.find((item) => item.id === day) ?? days[1];
  const canContinue =
    step === 1
      ? Boolean(serviceId)
      : step === 2
        ? Boolean(day && time)
        : step === 3
          ? Boolean(name.trim() && email.includes("@") && challenge.trim())
          : true;

  const next = () => {
    if (!canContinue) return;
    setStep((current) => Math.min(4, current + 1) as Step);
  };

  const back = () => setStep((current) => Math.max(1, current - 1) as Step);

  if (confirmed) {
    return (
      <main className="min-h-screen px-4 py-8 text-[#152033] sm:grid sm:place-items-center sm:py-16">
        <section className="surface-raised w-full max-w-[720px] overflow-hidden rounded-[16px] border border-[#152033]/10 bg-[#fbfaf7]">
          <div className="surface-ink px-6 py-7 text-white sm:px-10 sm:py-9">
            <div className="mb-7 grid size-11 place-items-center rounded-full bg-[#dcece5] text-[#1d725b]">
              <CheckCircle2 size={23} />
            </div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
              Time protected
            </p>
            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.04em] sm:text-[36px]">
              You’re on Sarah’s calendar.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">
              Your preparation note is saved locally in this prototype. A production confirmation would be sent to {email || "your email"}.
            </p>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_210px] sm:p-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#89919c]">Engagement</p>
              <h2 className="mt-3 text-lg font-semibold">{service.name}</h2>
              <div className="mt-5 space-y-3 text-xs text-[#687483]">
                <p className="flex items-center gap-2"><CalendarDays size={14} className="text-[#24529a]" /> {selectedDay.day}, {selectedDay.month} {selectedDay.date}, 2026</p>
                <p className="flex items-center gap-2"><Clock3 size={14} className="text-[#24529a]" /> {time} EDT · {service.duration} minutes</p>
                <p className="flex items-center gap-2"><Video size={14} className="text-[#24529a]" /> Private Google Meet link</p>
              </div>
            </div>
            <div className="rounded-[10px] border border-[#152033]/9 bg-white p-4">
              <p className="text-[10px] font-semibold">What happens next</p>
              <ol className="mt-4 space-y-3">
                {["Preparation brief reviewed", "Private meeting link issued", "Decision memo delivered"].map((item, index) => (
                  <li key={item} className="flex gap-2 text-[10px] leading-4 text-[#6f7a88]"><span className="font-mono text-[#24529a]">0{index + 1}</span>{item}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-[#152033]/8 px-6 py-5 sm:flex-row sm:justify-end sm:px-10">
            <Link href="/" className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#152033]/12 bg-white px-4 text-xs font-semibold hover:bg-[#f1efea]">View ConsultFlow demo</Link>
            <button type="button" onClick={() => { setConfirmed(false); setStep(1); }} className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#24529a] px-4 text-xs font-semibold text-white hover:bg-[#1d4788]">Book another session</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen text-[#152033]">
      <header className="border-b border-[#152033]/8 bg-[#f8f7f3]">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="surface-ink grid size-9 place-items-center rounded-[8px] text-[11px] font-semibold tracking-[0.08em] text-white shadow-[var(--shadow-sm)]">SB</div>
            <div><p className="text-sm font-semibold tracking-[-0.02em]">Sarah Bennett</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.13em] text-[#8a929d]">Strategy advisory</p></div>
          </div>
          <div className="hidden items-center gap-2 text-[10px] text-[#667281] sm:flex"><ShieldCheck size={14} className="text-[#1d725b]" /> Confidential · Secure · Decision-focused</div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 py-6 sm:px-7 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#697483] hover:text-[#24529a]"><ArrowLeft size={13} /> ConsultFlow demo</Link>
          <div className="flex items-center gap-1.5 text-[9px] text-[#8a929d]"><Globe2 size={12} /> English · USD</div>
        </div>

        <div className="surface-raised grid overflow-hidden rounded-[16px] border border-[#152033]/10 bg-[#fbfaf7] lg:grid-cols-[270px_minmax(0,1fr)_280px]">
          <aside className="surface-ink border-b border-white/8 p-6 text-white lg:border-b-0 lg:border-r lg:border-white/8 lg:p-7">
            <div className="flex items-center gap-3 lg:block">
              <div className="grid size-14 shrink-0 place-items-center rounded-full border border-white/12 bg-[#e7e2d8] text-sm font-semibold text-[#26354b] lg:size-16">SB</div>
              <div className="lg:mt-5"><p className="text-base font-semibold">Sarah Bennett</p><p className="mt-1 text-[10px] leading-4 text-white/43">Growth and operating strategy for B2B SaaS leadership teams.</p></div>
            </div>
            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/31">Working principle</p>
              <blockquote className="mt-3 text-[12px] leading-5 text-white/68">“Leave with a decision, an owner, and a next move.”</blockquote>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 lg:grid-cols-1">
              <TrustPoint icon={BriefcaseBusiness} value="86" label="Executive sessions" />
              <TrustPoint icon={FileCheck2} value="92%" label="Actions completed" />
              <TrustPoint icon={ShieldCheck} value="4.9" label="Client rating" />
            </div>
          </aside>

          <section className="min-w-0 border-b border-[#152033]/8 p-5 sm:p-7 lg:border-b-0 lg:p-9">
            <div className="mb-8 flex items-center gap-1.5" aria-label={`Step ${step} of 4`}>
              {stepLabels.map((label, index) => {
                const number = (index + 1) as Step;
                const active = step === number;
                const complete = step > number;
                return (
                  <div key={label} className="flex flex-1 items-center gap-1.5">
                    <button type="button" onClick={() => complete && setStep(number)} disabled={!complete} className="flex min-w-0 items-center gap-2 text-left disabled:cursor-default">
                      <span className={`grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[9px] ${complete ? "border-[#1d725b] bg-[#1d725b] text-white" : active ? "border-[#24529a] bg-[#e7edf6] font-semibold text-[#24529a]" : "border-[#152033]/12 text-[#9aa1aa]"}`}>{complete ? <Check size={11} /> : number}</span>
                      <span className={`hidden truncate text-[9px] font-semibold sm:block ${active ? "text-[#2d3b50]" : "text-[#9299a3]"}`}>{label}</span>
                    </button>
                    {index < stepLabels.length - 1 && <span className={`h-px flex-1 ${complete ? "bg-[#1d725b]/35" : "bg-[#152033]/9"}`} />}
                  </div>
                );
              })}
            </div>

            {step === 1 && <ServiceStep serviceId={serviceId} select={setServiceId} />}
            {step === 2 && <TimeStep day={day} time={time} selectDay={(value) => { setDay(value); setTime(""); }} selectTime={setTime} />}
            {step === 3 && <ContextStep name={name} email={email} company={company} challenge={challenge} setName={setName} setEmail={setEmail} setCompany={setCompany} setChallenge={setChallenge} />}
            {step === 4 && <ConfirmStep service={service} day={selectedDay} time={time} name={name} />}

            <div className="mt-8 flex items-center justify-between border-t border-[#152033]/8 pt-5">
              <button type="button" onClick={back} className={`inline-flex h-10 items-center gap-2 rounded-[8px] px-3 text-xs font-semibold text-[#697483] hover:bg-[#152033]/5 ${step === 1 ? "invisible" : ""}`}><ArrowLeft size={14} /> Back</button>
              {step < 4 ? (
                <button type="button" onClick={next} disabled={!canContinue} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-gradient-to-b from-[#2a5aa6] to-[#204c92] px-4 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(18,41,75,0.3),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all hover:shadow-[0_2px_10px_rgba(18,41,75,0.28),inset_0_1px_0_rgba(255,255,255,0.14)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">Continue <ArrowRight size={14} /></button>
              ) : (
                <button type="button" onClick={() => setConfirmed(true)} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-gradient-to-b from-[#22826a] to-[#1a6a54] px-4 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(18,75,57,0.3),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all hover:shadow-[0_2px_10px_rgba(18,75,57,0.28),inset_0_1px_0_rgba(255,255,255,0.14)]">Confirm session <Check size={14} /></button>
              )}
            </div>
          </section>

          <aside className="bg-[#f7f5f0] p-5 sm:p-7 lg:border-l lg:border-[#152033]/8">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8a929d]">Engagement summary</p>
            <h2 className="mt-4 text-base font-semibold leading-6 tracking-[-0.02em]">{service.name}</h2>
            <p className="mt-1 text-[10px] text-[#7c8692]">{service.descriptor}</p>
            <div className="mt-5 space-y-3 border-y border-[#152033]/8 py-4">
              <SummaryRow icon={Clock3} label="Duration" value={`${service.duration} min`} />
              <SummaryRow icon={Video} label="Location" value="Private video" />
              <SummaryRow icon={CalendarDays} label="When" value={step >= 2 && time ? `${selectedDay.day}, ${time}` : "Select a time"} />
            </div>
            <div className="mt-5 flex items-end justify-between"><span className="text-[10px] text-[#7c8692]">Session fee</span><span className="font-mono text-lg font-semibold tracking-[-0.03em]">{money(service.price)}</span></div>
            {service.price > 0 && <p className="mt-2 text-[9px] leading-4 text-[#8c949e]">Payment will be required before the calendar invitation is issued.</p>}
            <div className="mt-6 rounded-[9px] border border-[#1d725b]/12 bg-[#e9f1ed] p-3.5"><div className="flex gap-2"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#1d725b]" /><p className="text-[9px] leading-4 text-[#55756a]">100% refund up to 24 hours before the session. Your preparation notes remain private.</p></div></div>
          </aside>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-center text-[9px] text-[#9299a2] sm:flex-row sm:items-center sm:justify-between sm:text-left"><span>Prototype booking flow — no payment is processed.</span><span className="flex items-center justify-center gap-1.5"><LockKeyhole size={11} /> Powered privately by ConsultFlow</span></div>
      </main>
    </div>
  );
}

function TrustPoint({ icon: Icon, value, label }: { icon: typeof BriefcaseBusiness; value: string; label: string }) {
  return <div className="rounded-[8px] border border-white/8 bg-white/[0.035] p-3"><Icon size={13} className="text-[#87a6ce]" /><p className="mt-2 font-mono text-[11px] font-semibold">{value}</p><p className="mt-1 text-[8px] leading-3 text-white/31">{label}</p></div>;
}

function ServiceStep({ serviceId, select }: { serviceId: string; select: (id: string) => void }) {
  return <div><Eyebrow>Choose the right engagement</Eyebrow><h1 className="mt-2 text-[23px] font-semibold tracking-[-0.035em] sm:text-[28px]">What decision are we moving forward?</h1><p className="mt-2 max-w-xl text-xs leading-5 text-[#6e7987]">Each format is scoped to produce an explicit outcome, not just another conversation.</p><div className="mt-6 space-y-3">{serviceCatalog.map((service) => { const selected = serviceId === service.id; return <button type="button" key={service.id} onClick={() => select(service.id)} aria-pressed={selected} className={`w-full rounded-[10px] border p-4 text-left transition-all sm:p-5 ${selected ? "border-[#24529a]/45 bg-[#edf2f8] shadow-[inset_3px_0_0_#24529a]" : "border-[#152033]/9 bg-white hover:border-[#152033]/18 hover:bg-[#faf9f6]"}`}><div className="flex items-start gap-3"><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-[#24529a] bg-[#24529a] text-white" : "border-[#152033]/18 text-transparent"}`}><Check size={11} /></span><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"><h2 className="text-xs font-semibold text-[#26344a]">{service.name}</h2><span className="font-mono text-[11px] font-semibold text-[#26344a]">{money(service.price)}</span></div><p className="mt-1 text-[10px] text-[#7d8793]">{service.duration} minutes · {service.descriptor}</p><div className="mt-3 grid gap-2 text-[9px] leading-4 text-[#657181] sm:grid-cols-2"><p><span className="font-semibold text-[#435166]">Best for:</span> {service.idealFor}</p><p><span className="font-semibold text-[#435166]">You leave with:</span> {service.outcome}</p></div></div></div></button>; })}</div></div>;
}

function TimeStep({ day, time, selectDay, selectTime }: { day: string; time: string; selectDay: (value: string) => void; selectTime: (value: string) => void }) {
  return <div><Eyebrow>Protect the time</Eyebrow><h1 className="mt-2 text-[23px] font-semibold tracking-[-0.035em] sm:text-[28px]">Choose a focused window.</h1><p className="mt-2 text-xs leading-5 text-[#6e7987]">Preparation and debrief time are already held around every session.</p><div className="mt-6 grid grid-cols-4 gap-2">{days.map((item) => <button key={item.id} type="button" onClick={() => selectDay(item.id)} aria-pressed={day === item.id} className={`rounded-[9px] border px-2 py-3 text-center ${day === item.id ? "border-[#24529a]/45 bg-[#e9eff7] text-[#20467e]" : "border-[#152033]/9 bg-white text-[#596677] hover:border-[#152033]/18"}`}><span className="block text-[9px] font-semibold uppercase tracking-[0.08em]">{item.day}</span><span className="mt-1 block font-mono text-base font-semibold">{item.date}</span><span className="mt-0.5 block text-[8px] opacity-65">{item.month}</span></button>)}</div><div className="mt-6 flex items-center justify-between"><p className="text-[10px] font-semibold text-[#4d5a6d]">Available times</p><p className="flex items-center gap-1.5 text-[9px] text-[#848d98]"><Globe2 size={11} /> Eastern Time · EDT</p></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{timesByDay[day].map((item) => <button type="button" key={item} onClick={() => selectTime(item)} aria-pressed={time === item} className={`h-11 rounded-[8px] border font-mono text-[10px] font-semibold ${time === item ? "border-[#24529a] bg-[#24529a] text-white" : "border-[#152033]/10 bg-white text-[#455367] hover:border-[#24529a]/35 hover:text-[#24529a]"}`}>{item}</button>)}</div></div>;
}

function ContextStep({ name, email, company, challenge, setName, setEmail, setCompany, setChallenge }: { name: string; email: string; company: string; challenge: string; setName: (value: string) => void; setEmail: (value: string) => void; setCompany: (value: string) => void; setChallenge: (value: string) => void }) {
  return <div><Eyebrow>Prepare the room</Eyebrow><h1 className="mt-2 text-[23px] font-semibold tracking-[-0.035em] sm:text-[28px]">What must be true when we finish?</h1><p className="mt-2 text-xs leading-5 text-[#6e7987]">A concise brief lets the session begin at the decision — not the backstory.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><BookingField label="Your name" value={name} setValue={setName} placeholder="Jordan Lee" type="text" /><BookingField label="Work email" value={email} setValue={setEmail} placeholder="jordan@company.com" type="email" /><BookingField label="Company" value={company} setValue={setCompany} placeholder="Company, Inc." type="text" optional /></div><label className="mt-4 block"><span className="mb-2 flex items-center justify-between text-[10px] font-semibold text-[#536073]"><span>The decision or challenge</span><span className="font-normal text-[#999fa8]">{challenge.length}/400</span></span><textarea value={challenge} onChange={(event) => setChallenge(event.target.value.slice(0, 400))} placeholder="Describe the decision, what is blocking it, and what a valuable outcome would look like." rows={5} className="w-full resize-none rounded-[8px] border border-[#152033]/11 bg-[#eeece7] px-3 py-3 text-xs leading-5 outline-none transition-colors placeholder:text-[#989fa8] focus:border-[#24529a]/55 focus:bg-white" /></label><div className="mt-4 flex gap-2 rounded-[8px] border border-[#152033]/8 bg-white p-3"><Sparkles size={14} className="mt-0.5 shrink-0 text-[#24529a]" /><p className="text-[9px] leading-4 text-[#697584]">Sarah reviews this personally. ConsultFlow would use it only to prepare the agenda and your decision brief.</p></div></div>;
}

function BookingField({ label, value, setValue, placeholder, type, optional }: { label: string; value: string; setValue: (value: string) => void; placeholder: string; type: "text" | "email"; optional?: boolean }) {
  return <label><span className="mb-2 block text-[10px] font-semibold text-[#536073]">{label} {optional && <span className="font-normal text-[#9aa1aa]">· Optional</span>}</span><input type={type} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-[8px] border border-[#152033]/11 bg-[#eeece7] px-3 text-xs outline-none transition-colors placeholder:text-[#989fa8] focus:border-[#24529a]/55 focus:bg-white" /></label>;
}

function ConfirmStep({ service, day, time, name }: { service: ServiceCatalogItem; day: { day: string; date: string; month: string }; time: string; name: string }) {
  return <div><Eyebrow>Review and protect</Eyebrow><h1 className="mt-2 text-[23px] font-semibold tracking-[-0.035em] sm:text-[28px]">Everything is clear before you commit.</h1><p className="mt-2 text-xs leading-5 text-[#6e7987]">No card details are collected in this prototype.</p><div className="surface-card mt-6 overflow-hidden rounded-[11px] border border-[#152033]/10 bg-white"><div className="surface-ink p-5 text-white"><p className="text-[9px] uppercase tracking-[0.12em] text-white/40">Prepared for {name || "you"}</p><h2 className="mt-2 text-base font-semibold">{service.name}</h2><p className="mt-1 text-[10px] text-white/45">{day.day}, {day.month} {day.date} · {time} EDT</p></div><div className="grid gap-4 p-5 sm:grid-cols-2"><div><p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8a929d]">Outcome</p><p className="mt-2 text-[10px] leading-5 text-[#596678]">{service.outcome}</p></div><div><p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8a929d]">Protection</p><p className="mt-2 text-[10px] leading-5 text-[#596678]">Full refund until 24 hours before the session.</p></div></div></div><div className="mt-4 flex items-center justify-between rounded-[9px] border border-[#1d725b]/12 bg-[#e9f1ed] p-4"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#1d725b]" /><div><p className="text-[10px] font-semibold text-[#245a49]">Prototype checkout</p><p className="mt-0.5 text-[9px] text-[#658177]">No payment will be processed</p></div></div><p className="font-mono text-sm font-semibold text-[#245a49]">{money(service.price)}</p></div></div>;
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div className="flex items-center gap-2.5"><Icon size={13} className="text-[#7a8797]" /><span className="flex-1 text-[9px] text-[#7d8793]">{label}</span><span className="text-[9px] font-semibold text-[#455267]">{value}</span></div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#24529a]">{children}</p>;
}
