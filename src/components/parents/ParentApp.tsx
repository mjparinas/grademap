"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { APP_NAME } from "@/lib/brand";
import { refreshAccount, type BillingInfo } from "@/lib/account";
import { isPremium, trialDaysLeft } from "@/lib/plan";
import { useRoute } from "@/lib/router";
import { useProfiles, useReady, useStore } from "@/lib/store";
import { startBackgroundSync, syncNow } from "@/lib/sync";
import { ContentGate } from "../ContentGate";
import { LoadingScreen } from "../ui";
import { AccountPage } from "./Account";
import { ChildrenPage } from "./Children";
import { Gate } from "./Gate";
import { Overview } from "./Overview";
import { PlacementPage } from "./Placement";
import { PrivacyPage } from "./Privacy";
import { ReportCardsPage } from "./ReportCards";
import { ReportsPage } from "./Reports";
import { SettingsPage } from "./Settings";
import { SubscriptionPage } from "./Subscription";

const NAV = [
  { path: "", label: "Overview", icon: "🏠" },
  { path: "reports", label: "Reports", icon: "📈" },
  { path: "placement", label: "Placement", icon: "🧭" },
  { path: "children", label: "Children", icon: "🧒" },
  { path: "settings", label: "Settings", icon: "⚙️" },
  { path: "subscription", label: "Subscription", icon: "⭐" },
  { path: "account", label: "Account & sync", icon: "☁️" },
  { path: "report-cards", label: "Report cards", icon: "📄" },
  { path: "privacy", label: "Privacy & data", icon: "🔐" },
];

function SyncBadge() {
  const sync = useStore((s) => s.sync);
  const account = useStore((s) => s.family.account);
  const text = !account
    ? "Saved on this device"
    : sync.status === "syncing"
      ? "Syncing…"
      : sync.status === "offline"
        ? "Offline · will sync later"
        : sync.status === "error"
          ? "Sync problem · retrying"
          : sync.lastSyncAt
            ? `Synced ${new Date(sync.lastSyncAt).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}`
            : "Ready to sync";
  return (
    <button type="button" onClick={() => void syncNow()} className="rounded-full bg-black/5 px-3 py-1 text-sm font-semibold text-ink-soft" title="Sync now">
      {account ? "☁️" : "💾"} {text}
    </button>
  );
}

function Shell({ children, active }: { children: ReactNode; active: string }) {
  const family = useStore((s) => s.family);
  const premium = isPremium(family);
  return (
    <div className="min-h-dvh bg-[#f6f5f1]">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/play/" className="rounded-xl bg-[#4f8ef7] px-3 py-2 text-sm font-bold text-[#0f172a]">
              ← Kids&apos; area
            </Link>
            <span className="text-lg font-bold">
              {APP_NAME} <span className="font-semibold text-ink-soft">for parents</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${premium ? "bg-good-soft text-good-dark" : "bg-nudge-soft text-nudge-dark"}`}>
              {family.plan === "premium" || family.subscription?.status === "active"
                ? "⭐ Premium"
                : premium
                  ? `Free trial · ${trialDaysLeft(family)} days left`
                  : "Free plan"}
            </span>
            <SyncBadge />
          </div>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-2" aria-label="Parent sections">
          <ul className="flex gap-1 pb-2">
            {NAV.map((n) => (
              <li key={n.path}>
                <a
                  href={`#/${n.path}`}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap ${
                    active === n.path ? "bg-[#253047] text-white" : "text-ink-soft hover:bg-black/5"
                  }`}
                >
                  <span aria-hidden="true">{n.icon}</span> {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
        {children}
      </main>
    </div>
  );
}

/** A class account has no parent area: the school manages it, and billing never applies. */
function ClassAccountNotice() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">This is a class account</h1>
      <p className="font-read text-lg text-ink-soft">
        Your teacher set this up, so there is no grown-ups area here. Ask your teacher for anything you need. A family can also make its own free account to see progress at home.
      </p>
      <a href="/play/" className="btn btn-good min-h-14 px-6 text-xl">
        Back to learning
      </a>
    </div>
  );
}

export function ParentApp() {
  const ready = useReady();
  const [unlocked, setUnlocked] = useState(false);
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const { path } = useRoute();
  const profiles = useProfiles();
  const isStudent = useStore((s) => Boolean(s.family.account?.student));

  useEffect(() => {
    if (ready) return;
    void useStore
      .getState()
      .init()
      .then(() => {
        startBackgroundSync();
        if (useStore.getState().family.account) void refreshAccount().then(setBilling);
      });
  }, [ready]);

  if (!ready) return <LoadingScreen />;
  if (isStudent) return <ClassAccountNotice />;
  if (!unlocked) return <Gate onPass={() => setUnlocked(true)} />;

  const section = path[0] ?? "";
  let page: ReactNode;
  switch (section) {
    case "reports":
      page = <ReportsPage childId={path[1]} />;
      break;
    case "placement":
      page = <PlacementPage childId={path[1]} />;
      break;
    case "children":
      page = <ChildrenPage />;
      break;
    case "settings":
      page = <SettingsPage childId={path[1]} />;
      break;
    case "subscription":
      page = <SubscriptionPage billing={billing} onBilling={setBilling} />;
      break;
    case "account":
      page = <AccountPage onBilling={setBilling} />;
      break;
    case "report-cards":
      page = <ReportCardsPage childId={path[1]} />;
      break;
    case "privacy":
      page = <PrivacyPage />;
      break;
    default:
      page = <Overview />;
  }
  // Reports need each child's lessons; settings and billing still work if a download fails.
  return (
    <ContentGate targets={profiles.map((p) => ({ grade: p.grade, framework: p.framework }))} optional>
      <Shell active={section}>{page}</Shell>
    </ContentGate>
  );
}
