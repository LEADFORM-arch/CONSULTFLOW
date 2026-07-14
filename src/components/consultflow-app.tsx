"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Command,
  Copy,
  CreditCard,
  FileText,
  Gauge,
  LayoutDashboard,
  Layers3,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { serviceCatalog, type ServiceCatalogItem } from "@/lib/service-catalog";

type ViewId =
  | "briefing"
  | "schedule"
  | "services"
  | "engagements"
  | "clients"
  | "revenue"
  | "intelligence";

type ModalId = "new-engagement" | "client-brief" | "search" | null;

type NavigationItem = {
  id: ViewId;
  label: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { id: "briefing", label: "Briefing", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "services", label: "Services", icon: Layers3 },
  { id: "engagements", label: "Engagements", icon: Briefcase },
  { id: "clients", label: "Clients", icon: Users },
  { id: "revenue", label: "Revenue", icon: CircleDollarSign },
  { id: "intelligence", label: "Intelligence", icon: Sparkles },
];

const engagementRows = [
  {
    time: "10:00",
    meridiem: "AM",
    client: "Meridian Labs",
    initials: "ML",
    service: "Growth strategy session",
    value: "$1,250",
    stage: "Ready",
    tone: "green",
    detail: "Paid · Brief complete",
  },
  {
    time: "1:30",
    meridiem: "PM",
    client: "Northstar Health",
    initials: "NH",
    service: "Executive alignment",
    value: "$2,400",
    stage: "Review",
    tone: "blue",
    detail: "Deposit secured · 92 fit score",
  },
  {
    time: "4:00",
    meridiem: "PM",
    client: "Arbor & Co.",
    initials: "AC",
    service: "Discovery intensive",
    value: "$750",
    stage: "Attention",
    tone: "amber",
    detail: "Intake due · Reminder queued",
  },
];

const clients = [
  { name: "Elena Park", company: "Meridian Labs", initials: "EP", ltv: "$18,750", last: "Today", health: "Strong", work: "Growth advisory" },
  { name: "Marcus Reid", company: "Northstar Health", initials: "MR", ltv: "$14,400", last: "Today", health: "Strong", work: "Executive advisory" },
  { name: "Nadia Brooks", company: "Arbor & Co.", initials: "NB", ltv: "$8,250", last: "Today", health: "Watch", work: "Operating model" },
  { name: "Daniel Kim", company: "Volt Systems", initials: "DK", ltv: "$7,800", last: "Jul 10", health: "Strong", work: "Market entry" },
  { name: "Priya Shah", company: "Helio Works", initials: "PS", ltv: "$5,500", last: "Jul 8", health: "Renewal", work: "Founder coaching" },
];

type PracticeService = ServiceCatalogItem & {
  status: "published" | "draft";
  bookings: number;
  revenue: number;
  qualification: "Required" | "Light";
  payment: "Upfront" | "Complimentary";
  policy: string;
};

const initialPracticeServices: PracticeService[] = serviceCatalog.map(
  (service, index): PracticeService => ({
    ...service,
    status: index === 2 ? "draft" : "published",
    bookings: [18, 11, 6][index] ?? 0,
    revenue: [13500, 13750, 0][index] ?? 0,
    qualification: index === 2 ? "Light" : "Required",
    payment: service.price === 0 ? "Complimentary" : "Upfront",
    policy: service.price === 0 ? "Flexible" : "24h · 50% retained",
  }),
);

const viewMeta: Record<ViewId, { eyebrow: string; title: string; description: string }> = {
  briefing: {
    eyebrow: "Tuesday · July 14",
    title: "Good morning, Sarah.",
    description: "Your practice is protected. Three client decisions need you today.",
  },
  schedule: {
    eyebrow: "Practice calendar",
    title: "Schedule",
    description: "Client time, preparation, and recovery — planned as one system.",
  },
  services: {
    eyebrow: "Offer architecture",
    title: "Services",
    description: "Shape, protect, and publish the engagements clients can request.",
  },
  engagements: {
    eyebrow: "Client lifecycle",
    title: "Engagements",
    description: "Move every opportunity from qualification to a paid outcome.",
  },
  clients: {
    eyebrow: "Relationship book",
    title: "Clients",
    description: "The context, history, and commercial health behind every relationship.",
  },
  revenue: {
    eyebrow: "Revenue protection",
    title: "Revenue",
    description: "What is secured, what is exposed, and what requires a decision.",
  },
  intelligence: {
    eyebrow: "ConsultFlow intelligence",
    title: "Practice intelligence",
    description: "Specific recommendations based on the way your firm actually operates.",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Mark() {
  return (
    <div className="grid size-8 place-items-center rounded-[7px] border border-white/15 bg-white/8 text-[11px] font-semibold tracking-[0.12em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      CF
    </div>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cx(
        "grid shrink-0 place-items-center rounded-full border border-[#17243a]/10 bg-[#e7e2d8] font-semibold tracking-[-0.02em] text-[#293852]",
        size === "sm" && "size-7 text-[10px]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-12 text-sm",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function StatusBadge({ tone, children }: { tone: "green" | "blue" | "amber" | "neutral"; children: React.ReactNode }) {
  const palette = {
    green: "border-[#1d725b]/15 bg-[#e8f2ed] text-[#175b49]",
    blue: "border-[#24529a]/15 bg-[#e8eef7] text-[#1f477f]",
    amber: "border-[#ad642d]/15 bg-[#f6ece3] text-[#935326]",
    neutral: "border-[#152033]/10 bg-[#eeece7] text-[#5d6775]",
  }[tone];

  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em]", palette)}>
      <span className="size-1.5 rounded-full bg-current opacity-75" />
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = "secondary",
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "inline-flex h-9 items-center justify-center gap-2 rounded-[8px] px-3.5 text-xs font-semibold transition-all duration-150 active:translate-y-px",
        variant === "primary" && "bg-[#24529a] text-white shadow-[0_1px_2px_rgba(18,41,75,0.25)] hover:bg-[#1d4788]",
        variant === "secondary" && "border border-[#152033]/12 bg-white text-[#253248] shadow-[0_1px_1px_rgba(21,32,51,0.04)] hover:border-[#152033]/20 hover:bg-[#faf9f6]",
        variant === "ghost" && "text-[#5c6878] hover:bg-[#152033]/5 hover:text-[#152033]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ConsultFlowApp() {
  const [activeView, setActiveView] = useState<ViewId>("briefing");
  const [modal, setModal] = useState<ModalId>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(2);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setModal("search");
      }
      if (event.key === "Escape") {
        setModal(null);
        setMobileMenu(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const current = viewMeta[activeView];

  const chooseView = (view: ViewId) => {
    setActiveView(view);
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ed] text-[#152033] lg:flex">
      <Sidebar activeView={activeView} chooseView={chooseView} />

      {mobileMenu && (
        <div className="modal-backdrop fixed inset-0 z-40 bg-[#0b1522]/55 lg:hidden" onClick={() => setMobileMenu(false)}>
          <div className="modal-panel h-full w-[280px] bg-[#101b2a] p-4" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white"><Mark /><span className="font-semibold">ConsultFlow</span></div>
              <button type="button" aria-label="Close menu" onClick={() => setMobileMenu(false)} className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white"><X size={18} /></button>
            </div>
            <MobileNavigation activeView={activeView} chooseView={chooseView} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#152033]/8 bg-[#f4f2ed]/92 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open menu" onClick={() => setMobileMenu(true)} className="rounded-md border border-[#152033]/10 bg-white p-2 text-[#485568] lg:hidden"><Menu size={17} /></button>
            <div className="hidden items-center gap-2 text-xs text-[#79828f] sm:flex">
              <ShieldCheck size={14} className="text-[#1d725b]" />
              <span>Practice status</span>
              <span className="font-semibold text-[#2c3a4f]">Protected</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setModal("search")} className="hidden h-9 w-[210px] items-center gap-2 rounded-[8px] border border-[#152033]/10 bg-[#ebe9e4] px-3 text-left text-xs text-[#747e8b] transition-colors hover:border-[#152033]/18 md:flex">
              <Search size={14} />
              <span className="flex-1">Search your practice</span>
              <span className="flex items-center gap-0.5 rounded border border-[#152033]/10 bg-white px-1.5 py-0.5 font-mono text-[9px] text-[#687381]"><Command size={9} />K</span>
            </button>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => { setNotifications(0); notify("You’re all caught up."); }}
              className="relative grid size-9 place-items-center rounded-[8px] text-[#687381] hover:bg-[#152033]/5 hover:text-[#152033]"
            >
              <Bell size={17} />
              {notifications > 0 && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#ad642d] ring-2 ring-[#f4f2ed]" />}
            </button>
            <button type="button" onClick={() => notify("Account controls are ready for connection.")} className="flex h-9 items-center gap-2 rounded-[8px] px-1.5 hover:bg-[#152033]/5">
              <Avatar initials="SB" size="sm" />
              <ChevronDown size={13} className="hidden text-[#7d8794] sm:block" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-7 sm:px-7 sm:pt-9 lg:px-9 lg:pb-12">
          <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="reveal">
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7b8490]">{current.eyebrow}</p>
              <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#152033] sm:text-[34px]">{current.title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#677281]">{current.description}</p>
            </div>
            <div className="reveal flex items-center gap-2">
              <Button onClick={() => notify("Weekly review queued for Friday at 4:30 PM.")}><FileText size={14} /> Weekly review</Button>
              {activeView !== "services" && <Button variant="primary" onClick={() => setModal("new-engagement")}><Plus size={15} /> New engagement</Button>}
            </div>
          </section>

          <div key={activeView} className="reveal-delay">
            {activeView === "briefing" && <BriefingView openBrief={() => setModal("client-brief")} notify={notify} />}
            {activeView === "schedule" && <ScheduleView openBrief={() => setModal("client-brief")} notify={notify} />}
            {activeView === "services" && <ServicesView notify={notify} />}
            {activeView === "engagements" && <EngagementsView openBrief={() => setModal("client-brief")} notify={notify} />}
            {activeView === "clients" && <ClientsView openBrief={() => setModal("client-brief")} />}
            {activeView === "revenue" && <RevenueView notify={notify} />}
            {activeView === "intelligence" && <IntelligenceView notify={notify} />}
          </div>
        </main>
      </div>

      <MobileBottomNav activeView={activeView} chooseView={chooseView} />

      {modal === "new-engagement" && <NewEngagementModal close={() => setModal(null)} onCreated={() => { setModal(null); setActiveView("engagements"); notify("Engagement created — intake request drafted."); }} />}
      {modal === "client-brief" && <ClientBriefModal close={() => setModal(null)} notify={notify} />}
      {modal === "search" && <SearchModal close={() => setModal(null)} chooseView={(view) => { setModal(null); setActiveView(view); }} />}

      {toast && (
        <div role="status" className="toast-in fixed bottom-20 right-4 z-[70] flex max-w-[360px] items-center gap-3 rounded-[10px] border border-white/10 bg-[#101b2a] px-4 py-3 text-xs text-white shadow-[0_18px_50px_rgba(16,27,42,0.28)] sm:bottom-6 sm:right-6">
          <CheckCircle2 size={16} className="shrink-0 text-[#7bc3a8]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function Sidebar({ activeView, chooseView }: { activeView: ViewId; chooseView: (view: ViewId) => void }) {
  return (
    <aside className="fine-scrollbar sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col overflow-y-auto border-r border-white/7 bg-[#101b2a] px-3 py-4 text-white lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <Mark />
        <div><p className="text-[14px] font-semibold tracking-[-0.02em]">ConsultFlow</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-white/35">Private practice OS</p></div>
      </div>
      <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">Operate</p>
      <MobileNavigation activeView={activeView} chooseView={chooseView} />
      <div className="mt-auto pt-8">
        <div className="mx-1 mb-3 border-t border-white/8 pt-4">
          <button type="button" className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-xs text-white/54 hover:bg-white/6 hover:text-white">
            <BookOpen size={15} /> Playbooks <span className="ml-auto rounded bg-white/7 px-1.5 py-0.5 font-mono text-[8px] text-white/35">12</span>
          </button>
          <button type="button" className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-xs text-white/54 hover:bg-white/6 hover:text-white">
            <MessageSquareText size={15} /> Support
          </button>
          <a href="/sarah-strategy" target="_blank" rel="noreferrer" className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-xs text-white/54 hover:bg-white/6 hover:text-white">
            <ArrowUpRight size={15} /> Public booking page
          </a>
        </div>
        <div className="rounded-[10px] border border-white/8 bg-white/[0.035] p-3">
          <div className="mb-2.5 flex items-center justify-between"><span className="text-[10px] font-medium text-white/56">July capacity</span><span className="font-mono text-[10px] text-[#9db8dc]">68%</span></div>
          <div className="h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[68%] rounded-full bg-[#6388bb]" /></div>
          <p className="mt-2.5 text-[9px] leading-4 text-white/32">12 protected hours remain</p>
        </div>
      </div>
    </aside>
  );
}

function MobileNavigation({ activeView, chooseView }: { activeView: ViewId; chooseView: (view: ViewId) => void }) {
  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;
        return (
          <button key={item.id} type="button" onClick={() => chooseView(item.id)} className={cx("group flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-xs transition-colors", active ? "bg-white/[0.09] font-medium text-white shadow-[inset_2px_0_0_#6e92c3]" : "text-white/48 hover:bg-white/5 hover:text-white/80") }>
            <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
            <span>{item.label}</span>
            {active && <span className="ml-auto size-1 rounded-full bg-[#88a9d2]" />}
          </button>
        );
      })}
    </nav>
  );
}

function MobileBottomNav({ activeView, chooseView }: { activeView: ViewId; chooseView: (view: ViewId) => void }) {
  const items = navigation.slice(0, 5);
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-30 grid h-[68px] grid-cols-5 border-t border-[#152033]/10 bg-[#fbfaf7]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;
        return <button key={item.id} type="button" onClick={() => chooseView(item.id)} className={cx("flex flex-col items-center justify-center gap-1 text-[9px] font-medium", active ? "text-[#24529a]" : "text-[#7b8491]")}><Icon size={17} strokeWidth={active ? 2.3 : 1.8} /><span>{item.label}</span></button>;
      })}
    </nav>
  );
}

function BriefingView({ openBrief, notify }: { openBrief: () => void; notify: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <section className="grid overflow-hidden rounded-[14px] border border-[#152033]/10 bg-[#101b2a] text-white shadow-[0_10px_35px_rgba(16,27,42,0.12)] xl:grid-cols-[1.65fr_0.7fr]">
        <div className="relative overflow-hidden p-5 sm:p-7">
          <div className="executive-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
          <div className="relative">
            <div className="mb-7 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/46">Next engagement · 10:00 AM EDT</span>
              <StatusBadge tone="green">Revenue secured</StatusBadge>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3"><Avatar initials="EP" size="lg" /><div><p className="text-[19px] font-semibold tracking-[-0.025em]">Elena Park</p><p className="mt-0.5 text-xs text-white/43">COO · Meridian Labs</p></div></div>
                <h2 className="max-w-xl text-[25px] font-medium leading-[1.25] tracking-[-0.035em] sm:text-[30px]">Turn the Q3 growth thesis into three executable bets.</h2>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/46"><span className="flex items-center gap-1.5"><Clock3 size={13} /> 60 min + 15 min debrief</span><span className="flex items-center gap-1.5"><FileText size={13} /> Brief complete</span><span className="flex items-center gap-1.5"><Gauge size={13} /> 94 fit score</span></div>
              </div>
              <Button variant="primary" onClick={openBrief} className="shrink-0 !bg-white !text-[#16243a] hover:!bg-[#eef2f7]">Open client brief <ArrowRight size={14} /></Button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 bg-white/[0.035] p-5 sm:p-7 xl:border-l xl:border-t-0">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/37">Prepared for you</p>
          <div className="space-y-4">
            {["Last decision: prioritize enterprise expansion", "Open risk: product capacity in August", "Recommended ask: appoint an accountable owner"].map((item, index) => (
              <div key={item} className="flex gap-3 text-xs leading-5 text-white/68"><span className="font-mono text-[10px] text-[#8da9cd]">0{index + 1}</span><span>{item}</span></div>
            ))}
          </div>
          <button type="button" onClick={() => notify("Executive brief copied to your clipboard queue.")} className="mt-6 flex items-center gap-2 text-[11px] font-medium text-[#9eb8d9] hover:text-white"><Sparkles size={13} /> Ask Intelligence to prepare me</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]">
        <div className="flex items-center justify-between border-b border-[#152033]/8 px-5 py-3.5"><div><p className="text-xs font-semibold">Firm pulse</p><p className="mt-0.5 text-[10px] text-[#7b8490]">July 1–14 · cash basis</p></div><button type="button" onClick={() => notify("Firm pulse refreshed just now.")} className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6c7684] hover:text-[#24529a]">Live data</button></div>
        <div className="grid divide-y divide-[#152033]/8 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          <PulseMetric label="Revenue secured" value="$18,950" note="+$3,200 vs. last period" tone="green" />
          <PulseMetric label="Billable utilization" value="71%" note="4 pts above target" tone="blue" />
          <PulseMetric label="Open receivables" value="$4,600" note="$1,200 due in 48h" tone="amber" />
          <PulseMetric label="Client follow-through" value="92%" note="11 of 12 actions closed" tone="green" />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.8fr]">
        <section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]">
          <div className="flex items-center justify-between border-b border-[#152033]/8 px-5 py-4"><div><h2 className="text-sm font-semibold tracking-[-0.015em]">Today’s engagement rail</h2><p className="mt-1 text-[10px] text-[#7b8490]">$4,400 protected across 3 client decisions</p></div><button type="button" onClick={() => notify("Calendar view is now synchronized.")} className="text-[11px] font-semibold text-[#24529a] hover:text-[#183d78]">Open schedule</button></div>
          <div className="divide-y divide-[#152033]/7">
            {engagementRows.map((row, index) => <EngagementRow key={row.client} {...row} last={index === engagementRows.length - 1} openBrief={openBrief} />)}
          </div>
        </section>
        <AttentionPanel notify={notify} />
      </div>
    </div>
  );
}

function PulseMetric({ label, value, note, tone }: { label: string; value: string; note: string; tone: "green" | "blue" | "amber" }) {
  const color = tone === "green" ? "text-[#1d725b]" : tone === "blue" ? "text-[#24529a]" : "text-[#ad642d]";
  return <div className="px-5 py-4"><p className="text-[10px] font-medium text-[#7a8491]">{label}</p><div className="mt-2 flex items-baseline justify-between gap-3"><p className="font-mono text-[20px] font-semibold tracking-[-0.04em] text-[#1d2a3e]">{value}</p><TrendingUp size={14} className={color} /></div><p className={cx("mt-1.5 text-[9px]", color)}>{note}</p></div>;
}

function EngagementRow({ time, meridiem, client, initials, service, value, stage, tone, detail, openBrief }: (typeof engagementRows)[number] & { last: boolean; openBrief: () => void }) {
  return (
    <button type="button" onClick={openBrief} className="grid w-full grid-cols-[54px_1fr_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[#f2f0eb] sm:grid-cols-[65px_1fr_130px_28px] sm:px-5">
      <div><p className="font-mono text-xs font-semibold text-[#26344a]">{time}</p><p className="mt-0.5 font-mono text-[8px] text-[#8a939e]">{meridiem}</p></div>
      <div className="flex min-w-0 items-center gap-3"><Avatar initials={initials} /><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#202d42]">{client}</p><p className="mt-1 truncate text-[10px] text-[#7a8490]">{service} · {detail}</p></div></div>
      <div className="hidden sm:block"><p className="font-mono text-[11px] font-semibold text-[#28364a]">{value}</p><div className="mt-1.5"><StatusBadge tone={tone as "green" | "blue" | "amber"}>{stage}</StatusBadge></div></div>
      <ChevronRight size={15} className="text-[#a1a8b1]" />
    </button>
  );
}

function AttentionPanel({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5">
      <div className="mb-5 flex items-start justify-between"><div><h2 className="text-sm font-semibold">Needs your judgment</h2><p className="mt-1 text-[10px] text-[#7b8490]">Two items, about six minutes</p></div><span className="grid size-6 place-items-center rounded-full bg-[#f3e7db] font-mono text-[10px] font-semibold text-[#9a5929]">2</span></div>
      <div className="space-y-3">
        <div className="rounded-[10px] border border-[#152033]/9 bg-white p-4"><div className="mb-3 flex items-center gap-2"><CreditCard size={14} className="text-[#ad642d]" /><p className="text-[11px] font-semibold">Invoice #1042 is due tomorrow</p></div><p className="text-[10px] leading-5 text-[#707b89]">$1,200 · Volt Systems · viewed twice</p><div className="mt-3 flex gap-2"><Button onClick={() => notify("A professional payment reminder was sent.")} className="h-8 flex-1">Send reminder</Button><Button variant="ghost" onClick={() => notify("Invoice #1042 opened.")} className="h-8 px-2.5"><ArrowUpRight size={13} /></Button></div></div>
        <div className="rounded-[10px] border border-[#152033]/9 bg-white p-4"><div className="mb-3 flex items-center gap-2"><Gauge size={14} className="text-[#24529a]" /><p className="text-[11px] font-semibold">Protect next Thursday</p></div><p className="text-[10px] leading-5 text-[#707b89]">5.5 hours booked without a focus block.</p><Button onClick={() => notify("A 90-minute focus block was placed on hold.")} className="mt-3 h-8 w-full">Reserve focus time</Button></div>
      </div>
    </section>
  );
}

function ScheduleView({ openBrief, notify }: { openBrief: () => void; notify: (message: string) => void }) {
  const [mode, setMode] = useState<"Day" | "Week">("Day");
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
      <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#152033]/8 px-5 py-4"><div className="flex items-center gap-3"><button type="button" className="text-[#77818e]"><ChevronRight size={16} className="rotate-180" /></button><p className="text-sm font-semibold">Tuesday, July 14</p><button type="button" className="text-[#77818e]"><ChevronRight size={16} /></button></div><div className="flex rounded-[8px] bg-[#ebe9e4] p-1">{(["Day", "Week"] as const).map((item) => <button type="button" key={item} onClick={() => setMode(item)} className={cx("rounded-[6px] px-3 py-1.5 text-[10px] font-semibold", mode === item ? "bg-white text-[#253248] shadow-sm" : "text-[#7a8491]")}>{item}</button>)}</div></div>
        {mode === "Day" ? (
          <div className="relative px-4 py-2 sm:px-6">
            {["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"].map((time, index) => (
              <div key={time} className="grid min-h-[62px] grid-cols-[48px_1fr] border-b border-[#152033]/6 last:border-0"><span className="pt-2 font-mono text-[8px] text-[#9299a2]">{time}</span><div className="relative border-l border-[#152033]/7">{index === 0 && <CalendarBlock top="8px" title="Preparation" meta="Meridian Labs · private" tone="prep" onClick={() => notify("Preparation brief opened.")} />}{index === 2 && <CalendarBlock top="3px" title="Growth strategy session" meta="Elena Park · $1,250 secured" tone="client" onClick={openBrief} />}{index === 5 && <CalendarBlock top="32px" title="Executive alignment" meta="Marcus Reid · $2,400 deposit" tone="client" onClick={openBrief} />}{index === 7 && <CalendarBlock top="38px" title="Debrief & decision log" meta="Private work block" tone="debrief" onClick={() => notify("Decision log opened.")} />}</div></div>
            ))}
          </div>
        ) : <WeekGrid openBrief={openBrief} />}
      </section>
      <section className="space-y-5">
        <div className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5"><p className="text-xs font-semibold">Capacity guardrails</p><div className="mt-5 space-y-4"><Capacity label="Client work" value="4h 15m" width="72%" color="bg-[#24529a]" /><Capacity label="Preparation" value="1h 30m" width="42%" color="bg-[#8099b8]" /><Capacity label="Recovery" value="45m" width="28%" color="bg-[#a47635]" /></div><p className="mt-5 border-t border-[#152033]/8 pt-4 text-[10px] leading-5 text-[#707b89]">You have a healthy 2h 15m of uncommitted capacity today.</p></div>
        <div className="rounded-[12px] border border-[#1d725b]/15 bg-[#eaf2ed] p-5"><ShieldCheck size={18} className="text-[#1d725b]" /><p className="mt-3 text-xs font-semibold text-[#174f40]">Revenue is fully protected</p><p className="mt-2 text-[10px] leading-5 text-[#477064]">Every external meeting today is paid or deposit-secured.</p></div>
      </section>
    </div>
  );
}

function CalendarBlock({ top, title, meta, tone, onClick }: { top: string; title: string; meta: string; tone: "prep" | "client" | "debrief"; onClick: () => void }) {
  const palette = tone === "client" ? "border-[#24529a]/20 bg-[#e5edf7] text-[#1f477f]" : tone === "prep" ? "border-[#7289a4]/20 bg-[#edf0f3] text-[#4d627a]" : "border-[#a47635]/20 bg-[#f4ede3] text-[#80602f]";
  return <button type="button" onClick={onClick} style={{ top }} className={cx("absolute left-2 right-2 z-10 rounded-[7px] border px-3 py-2 text-left transition-transform hover:translate-x-0.5", palette)}><p className="text-[10px] font-semibold">{title}</p><p className="mt-0.5 text-[8px] opacity-70">{meta}</p></button>;
}

function WeekGrid({ openBrief }: { openBrief: () => void }) {
  return <div className="overflow-x-auto p-4"><div className="grid min-w-[650px] grid-cols-5 gap-2">{["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17"].map((day, index) => <div key={day}><p className={cx("mb-3 py-2 text-center font-mono text-[9px]", index === 1 ? "font-semibold text-[#24529a]" : "text-[#7f8995]")}>{day}</p><div className="min-h-[420px] space-y-2 border-l border-[#152033]/7 px-2">{index === 1 && engagementRows.map((row) => <button type="button" onClick={openBrief} key={row.client} className="w-full rounded-[7px] border border-[#24529a]/15 bg-[#e8eef7] p-2 text-left"><p className="font-mono text-[8px] text-[#24529a]">{row.time} {row.meridiem}</p><p className="mt-1 truncate text-[9px] font-semibold">{row.client}</p></button>)}{index !== 1 && <div className="mt-8 rounded-[7px] border border-[#152033]/8 bg-white p-2 text-[9px] text-[#6e7987]">{index + 1} client sessions</div>}</div></div>)}</div></div>;
}

function Capacity({ label, value, width, color }: { label: string; value: string; width: string; color: string }) {
  return <div><div className="mb-2 flex justify-between text-[10px]"><span className="text-[#687483]">{label}</span><span className="font-mono font-semibold text-[#334156]">{value}</span></div><div className="h-1.5 rounded-full bg-[#e7e4de]"><div className={cx("h-full rounded-full", color)} style={{ width }} /></div></div>;
}

function formatServicePrice(price: number) {
  return price === 0
    ? "Complimentary"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price);
}

function ServicesView({ notify }: { notify: (message: string) => void }) {
  const [services, setServices] = useState<PracticeService[]>(initialPracticeServices);
  const [selectedId, setSelectedId] = useState(initialPracticeServices[0].id);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const selected = services.find((service) => service.id === selectedId) ?? services[0];
  const visible = services.filter((service) => filter === "all" || service.status === filter);
  const published = services.filter((service) => service.status === "published");
  const protectedRevenue = published.reduce((total, service) => total + service.revenue, 0);
  const totalBookings = services.reduce((total, service) => total + service.bookings, 0);

  function updateSelected<K extends keyof PracticeService>(key: K, value: PracticeService[K]) {
    setServices((current) =>
      current.map((service) =>
        service.id === selectedId ? { ...service, [key]: value } : service,
      ),
    );
  }

  function createService() {
    const id = `service-${Date.now()}`;
    const service: PracticeService = {
      id,
      name: "Untitled advisory offer",
      descriptor: "Define the engagement promise",
      duration: 60,
      price: 0,
      idealFor: "The client situation this offer is built for",
      outcome: "A specific, accountable client outcome",
      status: "draft",
      bookings: 0,
      revenue: 0,
      qualification: "Required",
      payment: "Upfront",
      policy: "24h · 50% retained",
    };

    setServices((current) => [...current, service]);
    setSelectedId(id);
    setFilter("all");
    notify("Draft service created locally.");
  }

  function duplicateService() {
    if (!selected) return;
    const id = `${selected.id}-copy-${Date.now()}`;
    setServices((current) => [
      ...current,
      { ...selected, id, name: `${selected.name} — Copy`, status: "draft", bookings: 0, revenue: 0 },
    ]);
    setSelectedId(id);
    setFilter("all");
    notify("A private draft copy is ready to refine.");
  }

  async function copyBookingLink() {
    const bookingUrl = `${window.location.origin}/sarah-strategy`;
    try {
      await navigator.clipboard.writeText(bookingUrl);
      notify("Public booking link copied.");
    } catch {
      notify(`Booking link: ${bookingUrl}`);
    }
  }

  if (!selected) {
    return (
      <section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] px-6 py-16 text-center">
        <Layers3 size={24} className="mx-auto text-[#8d96a1]" />
        <h2 className="mt-4 text-sm font-semibold">Build your first client offer</h2>
        <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-[#77818d]">Define the decision, commercial terms, and qualification gate before publishing.</p>
        <Button variant="primary" onClick={createService} className="mt-5"><Plus size={14} /> New service</Button>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#101b2a] text-white">
        <div className="grid divide-y divide-white/8 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:divide-x sm:divide-y-0">
          <div className="p-5 sm:p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/36">Offer ledger</p>
            <p className="mt-2 text-base font-semibold">{published.length} published · {services.length - published.length} private</p>
            <p className="mt-1 text-[10px] text-white/42">One trusted catalog powers every booking surface.</p>
          </div>
          <div className="p-5 sm:p-6"><p className="text-[9px] text-white/38">Requests · last 90 days</p><p className="mt-2 font-mono text-xl font-semibold">{totalBookings}</p><p className="mt-1 text-[9px] text-[#8fc5b1]">68% qualified</p></div>
          <div className="p-5 sm:p-6"><p className="text-[9px] text-white/38">Revenue represented</p><p className="mt-2 font-mono text-xl font-semibold">{formatServicePrice(protectedRevenue)}</p><p className="mt-1 text-[9px] text-[#8fc5b1]">Upfront terms applied</p></div>
          <div className="flex items-center gap-2 p-5 sm:p-6"><Button onClick={copyBookingLink} className="!border-white/10 !bg-white/7 !text-white hover:!bg-white/12"><Copy size={13} /> Copy link</Button><Button variant="primary" onClick={createService}><Plus size={14} /> New</Button></div>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]">
          <div className="flex flex-col gap-4 border-b border-[#152033]/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-sm font-semibold">Client-facing offers</h2><p className="mt-1 text-[10px] text-[#7b8490]">Select an offer to inspect its commercial guardrails.</p></div>
            <div className="flex rounded-[8px] bg-[#ebe9e4] p-1">{(["all", "published", "draft"] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={cx("rounded-[6px] px-3 py-1.5 text-[9px] font-semibold capitalize", filter === item ? "bg-white text-[#253248] shadow-sm" : "text-[#78828f]")}>{item}</button>)}</div>
          </div>
          <div className="hidden grid-cols-[minmax(0,1.5fr)_110px_145px_100px] border-b border-[#152033]/7 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8a929d] sm:grid"><span>Offer</span><span>Terms</span><span>Guardrails</span><span>Performance</span></div>
          <div className="divide-y divide-[#152033]/7">
            {visible.map((service) => (
              <button key={service.id} type="button" onClick={() => setSelectedId(service.id)} className={cx("grid w-full gap-3 px-5 py-4 text-left transition-colors sm:grid-cols-[minmax(0,1.5fr)_110px_145px_100px] sm:items-center", selectedId === service.id ? "bg-[#edf2f8] shadow-[inset_3px_0_0_#24529a]" : "hover:bg-[#f2f0eb]") }>
                <div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-xs font-semibold">{service.name}</p><StatusBadge tone={service.status === "published" ? "green" : "neutral"}>{service.status === "published" ? "Live" : "Draft"}</StatusBadge></div><p className="mt-1 truncate text-[10px] text-[#78828f]">{service.descriptor}</p></div>
                <div><p className="font-mono text-[10px] font-semibold">{formatServicePrice(service.price)}</p><p className="mt-1 font-mono text-[9px] text-[#858e99]">{service.duration} min</p></div>
                <div><p className="text-[10px] font-semibold text-[#4c596b]">{service.payment}</p><p className="mt-1 text-[9px] text-[#858e99]">{service.qualification} intake</p></div>
                <div><p className="font-mono text-[10px] font-semibold">{service.bookings} requests</p><p className="mt-1 font-mono text-[9px] text-[#1d725b]">{formatServicePrice(service.revenue)}</p></div>
              </button>
            ))}
          </div>
          {visible.length === 0 && <div className="px-5 py-14 text-center"><Layers3 size={21} className="mx-auto text-[#9ba2ab]" /><p className="mt-3 text-xs font-semibold">No {filter} offers</p><p className="mt-1 text-[10px] text-[#818a96]">Change the filter or create a new service.</p></div>}
        </section>

        <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] xl:sticky xl:top-24">
          <div className="flex items-start justify-between border-b border-[#152033]/8 px-5 py-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8a929d]">Offer controls</p><h2 className="mt-1.5 text-sm font-semibold">Edit service</h2></div><button type="button" onClick={duplicateService} className="rounded-[7px] p-2 text-[#6f7a88] hover:bg-[#152033]/5 hover:text-[#24529a]" aria-label="Duplicate service"><Copy size={14} /></button></div>
          <div className="space-y-4 p-5">
            <ServiceField label="Service name" value={selected.name} onChange={(value) => updateSelected("name", value)} />
            <ServiceField label="Short promise" value={selected.descriptor} onChange={(value) => updateSelected("descriptor", value)} />
            <div className="grid grid-cols-2 gap-3"><ServiceField label="Duration · min" type="number" value={String(selected.duration)} onChange={(value) => updateSelected("duration", Math.max(15, Number(value) || 15))} /><ServiceField label="Price · USD" type="number" value={String(selected.price)} onChange={(value) => updateSelected("price", Math.max(0, Number(value) || 0))} /></div>
            <ServiceField label="Best for" value={selected.idealFor} onChange={(value) => updateSelected("idealFor", value)} multiline />
            <ServiceField label="Client outcome" value={selected.outcome} onChange={(value) => updateSelected("outcome", value)} multiline />
            <div className="grid grid-cols-2 gap-3 border-t border-[#152033]/8 pt-4">
              <button type="button" onClick={() => updateSelected("qualification", selected.qualification === "Required" ? "Light" : "Required")} className="rounded-[8px] border border-[#152033]/9 bg-white p-3 text-left hover:border-[#152033]/18"><p className="text-[9px] text-[#87909b]">Qualification</p><p className="mt-1.5 text-[10px] font-semibold">{selected.qualification}</p></button>
              <button type="button" onClick={() => updateSelected("payment", selected.payment === "Upfront" ? "Complimentary" : "Upfront")} className="rounded-[8px] border border-[#152033]/9 bg-white p-3 text-left hover:border-[#152033]/18"><p className="text-[9px] text-[#87909b]">Payment</p><p className="mt-1.5 text-[10px] font-semibold">{selected.payment}</p></button>
            </div>
            <div className={cx("rounded-[9px] border p-4", selected.status === "published" ? "border-[#1d725b]/15 bg-[#eaf2ed]" : "border-[#a47635]/15 bg-[#f4ede3]") }><div className="flex items-start justify-between gap-3"><div><p className={cx("text-[10px] font-semibold", selected.status === "published" ? "text-[#174f40]" : "text-[#72552b]")}>{selected.status === "published" ? "Visible to clients" : "Private draft"}</p><p className="mt-1 text-[9px] leading-4 text-[#6d7886]">{selected.status === "published" ? "Included on Sarah’s booking page." : "Only you can review this offer."}</p></div><span className={cx("mt-1 size-2 rounded-full", selected.status === "published" ? "bg-[#1d725b]" : "bg-[#a47635]")} /></div></div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#152033]/8 px-5 py-4">
            <a href="/sarah-strategy" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-[8px] px-2 text-[10px] font-semibold text-[#5c6878] hover:bg-[#152033]/5 hover:text-[#24529a]">Preview <ArrowUpRight size={13} /></a>
            <Button variant={selected.status === "published" ? "secondary" : "primary"} onClick={() => { const nextStatus = selected.status === "published" ? "draft" : "published"; updateSelected("status", nextStatus); notify(nextStatus === "published" ? "Service published in this local prototype." : "Service returned to a private draft."); }}>{selected.status === "published" ? "Unpublish" : "Publish service"}</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ServiceField({ label, value, onChange, type = "text", multiline = false }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "number"; multiline?: boolean }) {
  const controlClass = "w-full rounded-[8px] border border-[#152033]/11 bg-[#eeece7] px-3 text-xs text-[#253248] outline-none transition-colors placeholder:text-[#9aa1aa] focus:border-[#24529a]/55 focus:bg-white";
  return <label><span className="mb-2 block text-[10px] font-semibold text-[#536073]">{label}</span>{multiline ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={cx(controlClass, "resize-none py-2.5 leading-5")} /> : <input type={type} min={type === "number" ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className={cx(controlClass, "h-10")} />}</label>;
}

function EngagementsView({ openBrief, notify }: { openBrief: () => void; notify: (message: string) => void }) {
  const stages = [
    { label: "Qualified", count: 4, value: "$6.8k", color: "bg-[#8190a2]" },
    { label: "Proposal", count: 3, value: "$14.2k", color: "bg-[#5879a8]" },
    { label: "Secured", count: 6, value: "$18.9k", color: "bg-[#1d725b]" },
    { label: "In delivery", count: 5, value: "$22.4k", color: "bg-[#24529a]" },
    { label: "Paid", count: 12, value: "$31.8k", color: "bg-[#17263a]" },
  ];
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]"><div className="border-b border-[#152033]/8 px-5 py-4"><h2 className="text-sm font-semibold">Engagement lifecycle</h2><p className="mt-1 text-[10px] text-[#7b8490]">30 active and completed engagements · Q3</p></div><div className="grid divide-y divide-[#152033]/8 sm:grid-cols-5 sm:divide-x sm:divide-y-0">{stages.map((stage) => <button key={stage.label} type="button" onClick={() => notify(`${stage.label} engagements filtered.`)} className="p-5 text-left hover:bg-[#f3f1ec]"><span className={cx("mb-4 block h-1 w-8 rounded-full", stage.color)} /><p className="text-[10px] text-[#79828f]">{stage.label}</p><div className="mt-2 flex items-end justify-between"><p className="font-mono text-lg font-semibold">{stage.count}</p><p className="font-mono text-[10px] text-[#536074]">{stage.value}</p></div></button>)}</div></section>
      <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#152033]/8 px-5 py-4"><div><h2 className="text-sm font-semibold">Active work</h2><p className="mt-1 text-[10px] text-[#7b8490]">Sorted by next decision</p></div><div className="flex gap-2"><Button><Search size={13} /> Filter</Button><Button><ChevronDown size={13} /> All stages</Button></div></div><div className="divide-y divide-[#152033]/7">{engagementRows.concat([{ ...engagementRows[0], client: "Volt Systems", initials: "VS", service: "Market entry advisory", time: "JUL 16", meridiem: "NEXT", value: "$3,800", stage: "Secured", detail: "Proposal signed · Kickoff ready" }]).map((row, index) => <EngagementRow key={`${row.client}-${index}`} {...row} last={false} openBrief={openBrief} />)}</div></section>
    </div>
  );
}

function ClientsView({ openBrief }: { openBrief: () => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => clients.filter((client) => `${client.name} ${client.company}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <section className="overflow-hidden rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7]">
      <div className="flex flex-col gap-4 border-b border-[#152033]/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">Relationship book</h2><p className="mt-1 text-[10px] text-[#7b8490]">42 clients · $94,800 lifetime value</p></div><label className="flex h-9 items-center gap-2 rounded-[8px] border border-[#152033]/10 bg-[#ebe9e4] px-3"><Search size={14} className="text-[#7c8692]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a client" className="w-44 bg-transparent text-xs outline-none placeholder:text-[#9299a2]" /></label></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse"><thead><tr className="border-b border-[#152033]/8 text-left text-[9px] uppercase tracking-[0.09em] text-[#8a929d]"><th className="px-5 py-3 font-semibold">Client</th><th className="px-4 py-3 font-semibold">Active work</th><th className="px-4 py-3 font-semibold">Last touch</th><th className="px-4 py-3 font-semibold">Lifetime value</th><th className="px-4 py-3 font-semibold">Relationship</th><th className="w-12 px-4 py-3" /></tr></thead><tbody>{filtered.map((client) => <tr key={client.name} onClick={openBrief} className="cursor-pointer border-b border-[#152033]/6 last:border-0 hover:bg-[#f2f0eb]"><td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar initials={client.initials} /><div><p className="text-xs font-semibold">{client.name}</p><p className="mt-1 text-[10px] text-[#7d8793]">{client.company}</p></div></div></td><td className="px-4 py-4 text-[11px] text-[#596575]">{client.work}</td><td className="px-4 py-4 font-mono text-[10px] text-[#6d7784]">{client.last}</td><td className="px-4 py-4 font-mono text-[11px] font-semibold">{client.ltv}</td><td className="px-4 py-4"><StatusBadge tone={client.health === "Strong" ? "green" : client.health === "Watch" ? "amber" : "blue"}>{client.health}</StatusBadge></td><td className="px-4 py-4"><ChevronRight size={14} className="text-[#a0a7b0]" /></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="px-5 py-16 text-center"><Users size={22} className="mx-auto text-[#9ba2ab]" /><p className="mt-3 text-xs font-semibold">No relationship found</p><p className="mt-1 text-[10px] text-[#818a96]">Try a client or company name.</p></div>}
    </section>
  );
}

function RevenueView({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
      <section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-medium text-[#7a8491]">Net revenue secured · July</p><p className="mt-2 font-mono text-[30px] font-semibold tracking-[-0.05em]">$18,950</p><p className="mt-1 text-[10px] text-[#1d725b]">↑ 20.3% from the same period in June</p></div><Button onClick={() => notify("Revenue report exported as a board-ready PDF.")}><FileText size={13} /> Export report</Button></div><div className="mt-8 h-[250px] w-full"><RevenueChart /></div><div className="mt-5 grid grid-cols-3 border-t border-[#152033]/8 pt-5"><div><p className="text-[9px] text-[#818a96]">Collected</p><p className="mt-1 font-mono text-xs font-semibold">$14,350</p></div><div><p className="text-[9px] text-[#818a96]">Due</p><p className="mt-1 font-mono text-xs font-semibold">$4,600</p></div><div><p className="text-[9px] text-[#818a96]">At risk</p><p className="mt-1 font-mono text-xs font-semibold text-[#ad642d]">$1,200</p></div></div></section>
      <div className="space-y-5"><section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Protection coverage</h2><ShieldCheck size={17} className="text-[#1d725b]" /></div><div className="my-6 grid place-items-center"><div className="relative grid size-36 place-items-center rounded-full" style={{ background: "conic-gradient(#1d725b 0 92%, #e2dfd8 92% 100%)" }}><div className="grid size-[112px] place-items-center rounded-full bg-[#fbfaf7] text-center"><div><p className="font-mono text-2xl font-semibold">92%</p><p className="mt-1 text-[9px] text-[#7e8793]">protected</p></div></div></div></div><p className="text-center text-[10px] leading-5 text-[#6c7785]">$1,200 is exposed across one invoice. Everything else is paid, held, or covered by policy.</p></section><section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5"><h2 className="text-sm font-semibold">Collection rhythm</h2><div className="mt-4 space-y-3">{[["Upfront", "68%", "green"], ["Net 7", "24%", "blue"], ["Net 30", "8%", "amber"]].map(([label, value, tone]) => <div key={label} className="flex items-center justify-between border-b border-[#152033]/7 pb-3 last:border-0 last:pb-0"><span className="text-[10px] text-[#647080]">{label}</span><span className={cx("font-mono text-[10px] font-semibold", tone === "green" ? "text-[#1d725b]" : tone === "blue" ? "text-[#24529a]" : "text-[#ad642d]")}>{value}</span></div>)}</div></section></div>
    </div>
  );
}

function RevenueChart() {
  return <svg viewBox="0 0 700 250" className="h-full w-full" role="img" aria-label="Revenue grew from 4,200 dollars to 18,950 dollars in July"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#24529a" stopOpacity="0.18" /><stop offset="100%" stopColor="#24529a" stopOpacity="0" /></linearGradient></defs>{[40, 100, 160, 220].map((y) => <line key={y} x1="24" x2="680" y1={y} y2={y} stroke="#152033" strokeOpacity="0.07" />)}<path d="M24 211 C75 202 94 187 132 182 S203 174 244 151 S317 143 355 124 S420 117 462 92 S542 86 579 60 S637 52 680 32 L680 225 L24 225 Z" fill="url(#area)" /><path d="M24 211 C75 202 94 187 132 182 S203 174 244 151 S317 143 355 124 S420 117 462 92 S542 86 579 60 S637 52 680 32" fill="none" stroke="#24529a" strokeWidth="2.5" strokeLinecap="round" /><circle cx="680" cy="32" r="4" fill="#24529a" stroke="#fbfaf7" strokeWidth="3" />{[[24, "Jul 1"], [244, "Jul 5"], [462, "Jul 9"], [680, "Jul 14"]].map(([x, label]) => <text key={String(label)} x={Number(x)} y="245" textAnchor={Number(x) === 24 ? "start" : Number(x) === 680 ? "end" : "middle"} fontSize="9" fill="#89919c" fontFamily="monospace">{label}</text>)}</svg>;
}

function IntelligenceView({ notify }: { notify: (message: string) => void }) {
  const insights = [
    { label: "Pricing", title: "Your executive sessions are underpriced by 12–18%.", body: "Demand remained stable after your last increase, and 91% of qualified leads accept within 48 hours.", action: "Model a price change", impact: "+$2,100/mo", tone: "blue" },
    { label: "Capacity", title: "Thursday afternoons are eroding your follow-through.", body: "Action completion falls 23% when more than three sessions are booked after 1 PM.", action: "Protect Thursdays", impact: "3h recovered", tone: "amber" },
    { label: "Retention", title: "Three clients are ready for a quarterly advisory package.", body: "Their repeat cadence and project history match your highest-retaining accounts.", action: "Draft proposals", impact: "$12.6k potential", tone: "green" },
  ];
  return <div className="grid gap-5 xl:grid-cols-[1.4fr_0.7fr]"><section className="space-y-4">{insights.map((insight, index) => <article key={insight.title} className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5 sm:p-6"><div className="flex gap-4"><span className="font-mono text-[10px] text-[#a0a7b0]">0{index + 1}</span><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge tone={insight.tone as "blue" | "amber" | "green"}>{insight.label}</StatusBadge><span className="font-mono text-[10px] font-semibold text-[#1d725b]">{insight.impact}</span></div><h2 className="mt-4 text-lg font-semibold leading-7 tracking-[-0.025em]">{insight.title}</h2><p className="mt-2 max-w-2xl text-xs leading-6 text-[#6d7886]">{insight.body}</p><Button onClick={() => notify(`${insight.action} — recommendation accepted.`)} className="mt-4">{insight.action} <ArrowRight size={13} /></Button></div></div></article>)}</section><aside className="space-y-5"><section className="rounded-[12px] border border-[#152033]/10 bg-[#101b2a] p-5 text-white"><Sparkles size={18} className="text-[#8faed5]" /><h2 className="mt-4 text-base font-semibold">Ask your practice</h2><p className="mt-2 text-[10px] leading-5 text-white/48">ConsultFlow reasons across client history, delivery patterns, and cash flow.</p><div className="mt-5 space-y-2">{["Where am I losing margin?", "Who should I follow up with?", "Prepare me for Meridian Labs"].map((question) => <button type="button" key={question} onClick={() => notify(`Analyzing: ${question}`)} className="flex w-full items-center justify-between rounded-[8px] border border-white/8 bg-white/[0.04] px-3 py-2.5 text-left text-[10px] text-white/65 hover:bg-white/[0.08] hover:text-white">{question}<ArrowRight size={12} /></button>)}</div></section><section className="rounded-[12px] border border-[#152033]/10 bg-[#fbfaf7] p-5"><p className="text-xs font-semibold">Intelligence confidence</p><div className="mt-4 flex items-center gap-4"><div className="grid size-12 place-items-center rounded-full border-[5px] border-[#1d725b] font-mono text-[10px] font-semibold">89</div><p className="text-[10px] leading-5 text-[#6d7886]">High confidence<br /><span className="text-[#9aa1aa]">Based on 86 sessions</span></p></div></section></aside></div>;
}

function ModalShell({ children, close, title }: { children: React.ReactNode; close: () => void; title: string }) {
  return <div className="modal-backdrop fixed inset-0 z-50 grid place-items-center bg-[#0b1522]/58 p-4 backdrop-blur-[2px]" onMouseDown={close}><section role="dialog" aria-modal="true" aria-label={title} className="modal-panel max-h-[88vh] w-full max-w-[620px] overflow-y-auto rounded-[14px] border border-white/10 bg-[#fbfaf7] shadow-[0_30px_90px_rgba(9,18,30,0.34)]" onMouseDown={(event) => event.stopPropagation()}>{children}</section></div>;
}

function NewEngagementModal({ close, onCreated }: { close: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  return <ModalShell close={close} title="New engagement"><form onSubmit={(event) => { event.preventDefault(); onCreated(); }}><div className="flex items-start justify-between border-b border-[#152033]/8 px-6 py-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7e8793]">New client work</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Start an engagement</h2><p className="mt-1 text-[10px] text-[#747f8c]">Qualify the relationship before time reaches your calendar.</p></div><button type="button" onClick={close} aria-label="Close" className="rounded-md p-2 text-[#7a8490] hover:bg-[#152033]/5"><X size={17} /></button></div><div className="space-y-5 p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Client name" value={name} setValue={setName} placeholder="Jordan Lee" required /><Field label="Company" value={company} setValue={setCompany} placeholder="Acme, Inc." required /></div><div><label className="mb-2 block text-[10px] font-semibold text-[#536073]">Engagement type</label><button type="button" className="flex h-11 w-full items-center justify-between rounded-[8px] border border-[#152033]/11 bg-[#eeece7] px-3 text-left text-xs text-[#354258]"><span>Strategy intensive · 90 minutes</span><ChevronDown size={14} /></button></div><div className="grid gap-3 sm:grid-cols-3">{[["Qualification", "Required"], ["Payment", "Upfront"], ["Protection", "24h policy"]].map(([label, value]) => <div key={label} className="rounded-[8px] border border-[#152033]/9 bg-white p-3"><p className="text-[9px] text-[#87909b]">{label}</p><p className="mt-1.5 text-[10px] font-semibold">{value}</p></div>)}</div><div className="rounded-[9px] border border-[#24529a]/12 bg-[#e9eef6] p-4 text-[10px] leading-5 text-[#506784]"><Sparkles size={14} className="mb-2 text-[#24529a]" />ConsultFlow will draft a concise intake, payment request, and scheduling invitation after creation.</div></div><div className="flex justify-end gap-2 border-t border-[#152033]/8 px-6 py-4"><Button onClick={close}>Cancel</Button><Button type="submit" variant="primary" className={cx(!name || !company ? "pointer-events-none opacity-45" : "")}>Create engagement <ArrowRight size={13} /></Button></div></form></ModalShell>;
}

function Field({ label, value, setValue, placeholder, required }: { label: string; value: string; setValue: (value: string) => void; placeholder: string; required?: boolean }) {
  return <label><span className="mb-2 block text-[10px] font-semibold text-[#536073]">{label}</span><input required={required} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-[8px] border border-[#152033]/11 bg-[#eeece7] px-3 text-xs text-[#253248] outline-none transition-colors placeholder:text-[#9aa1aa] focus:border-[#24529a]/55 focus:bg-white" /></label>;
}

function ClientBriefModal({ close, notify }: { close: () => void; notify: (message: string) => void }) {
  return <ModalShell close={close} title="Client brief"><div className="bg-[#101b2a] px-6 py-5 text-white"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><Avatar initials="EP" size="lg" /><div><p className="text-base font-semibold">Elena Park</p><p className="mt-1 text-[10px] text-white/45">COO · Meridian Labs · Client since 2025</p></div></div><button type="button" onClick={close} aria-label="Close" className="rounded-md p-2 text-white/50 hover:bg-white/8 hover:text-white"><X size={17} /></button></div><div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border-y border-white/8 py-4 text-center"><div><p className="font-mono text-sm font-semibold">$18.7k</p><p className="mt-1 text-[8px] text-white/36">Lifetime value</p></div><div><p className="font-mono text-sm font-semibold">12</p><p className="mt-1 text-[8px] text-white/36">Sessions</p></div><div><p className="font-mono text-sm font-semibold">94</p><p className="mt-1 text-[8px] text-white/36">Fit score</p></div></div></div><div className="space-y-6 p-6"><div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8a929d]">Today’s mandate</p><h2 className="mt-2 text-lg font-semibold leading-7 tracking-[-0.025em]">Turn the Q3 growth thesis into three executable bets.</h2></div><div className="grid gap-3 sm:grid-cols-2"><BriefSection title="Context" items={["Board wants a focused Q3 plan by July 24", "Enterprise pipeline is up 31%", "Product team has one open leadership role"]} /><BriefSection title="Open decisions" items={["Enterprise vs. mid-market allocation", "August hiring sequence", "Single accountable growth owner"]} /></div><div><p className="mb-3 text-[10px] font-semibold text-[#526073]">Relationship timeline</p><div className="space-y-3 border-l border-[#152033]/10 pl-4"><TimelineItem date="JUL 11" title="Elena completed the strategy intake" detail="94 fit score · all documents received" /><TimelineItem date="JUN 28" title="Q2 operating review completed" detail="3 decisions · 5 actions closed" /><TimelineItem date="JUN 05" title="Advisory retainer renewed" detail="$7,500 secured" /></div></div></div><div className="flex flex-wrap justify-end gap-2 border-t border-[#152033]/8 px-6 py-4"><Button onClick={() => notify("A concise client reminder was sent to Elena.")}>Message client</Button><Button variant="primary" onClick={() => notify("Meeting room will open five minutes before the session.")}>Join at 9:55 AM <ArrowUpRight size={13} /></Button></div></ModalShell>;
}

function BriefSection({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-[9px] border border-[#152033]/9 bg-white p-4"><p className="mb-3 text-[10px] font-semibold">{title}</p><ul className="space-y-2.5">{items.map((item) => <li key={item} className="flex gap-2 text-[10px] leading-5 text-[#687483]"><Check size={12} className="mt-1 shrink-0 text-[#1d725b]" />{item}</li>)}</ul></div>;
}

function TimelineItem({ date, title, detail }: { date: string; title: string; detail: string }) {
  return <div className="relative"><span className="absolute -left-[19px] top-1.5 size-2 rounded-full border-2 border-[#fbfaf7] bg-[#8491a0]" /><p className="font-mono text-[8px] text-[#969da6]">{date}</p><p className="mt-1 text-[10px] font-semibold">{title}</p><p className="mt-0.5 text-[9px] text-[#7b8490]">{detail}</p></div>;
}

function SearchModal({ close, chooseView }: { close: () => void; chooseView: (view: ViewId) => void }) {
  const [query, setQuery] = useState("");
  const results = navigation.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  return <ModalShell close={close} title="Search"><div className="flex items-center gap-3 border-b border-[#152033]/8 px-5"><Search size={18} className="text-[#7b8490]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients, engagements, invoices…" className="h-16 flex-1 bg-transparent text-sm outline-none placeholder:text-[#979ea7]" /><button type="button" onClick={close} className="rounded border border-[#152033]/10 px-2 py-1 font-mono text-[9px] text-[#7b8490]">ESC</button></div><div className="p-3"><p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#999fa7]">Navigate</p>{results.map((item) => { const Icon = item.icon; return <button type="button" key={item.id} onClick={() => chooseView(item.id)} className="flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left text-xs hover:bg-[#eeece7]"><span className="grid size-8 place-items-center rounded-[7px] border border-[#152033]/9 bg-white text-[#536073]"><Icon size={15} /></span><span>{item.label}</span><span className="ml-auto font-mono text-[9px] text-[#9aa1aa]">Open</span></button>; })}{results.length === 0 && <div className="px-3 py-10 text-center text-xs text-[#818a96]">No matching practice area</div>}</div></ModalShell>;
}
