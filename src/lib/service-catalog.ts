export type ServiceCatalogItem = {
  id: string;
  name: string;
  descriptor: string;
  duration: number;
  price: number;
  idealFor: string;
  outcome: string;
};

export const serviceCatalog: readonly ServiceCatalogItem[] = [
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
