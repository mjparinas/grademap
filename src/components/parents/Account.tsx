"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { changePassword, deleteAccount, forgotPassword, listDevices, signOutDevices, type DeviceSession, refreshAccount, resendVerification, signIn, signOut, signUp, type BillingInfo } from "@/lib/account";
import * as localdb from "@/lib/localdb";
import { useStore } from "@/lib/store";
import { syncNow } from "@/lib/sync";
import { Dialog } from "../ui";
import { FamilyMembersPanel } from "./FamilyMembers";
import { PageTitle, Panel } from "./common";

function AuthForm({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"signup" | "signin" | "forgot">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "forgot") {
        setNotice(await forgotPassword(email));
        return;
      }
      if (mode === "signup") await signUp(email, password);
      else await signIn(email, password);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-3">
      <div className="flex gap-2">
        {(["signup", "signin"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${mode === m ? "bg-[#253047] text-white" : "bg-paper"}`}>
            {m === "signup" ? "Create account" : "Sign in"}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Email</span>
        <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border-2 border-line px-3 py-2 text-lg" />
      </label>
      {mode !== "forgot" && (
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Password</span>
        <input
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-2 border-line px-3 py-2 text-lg"
        />
        {mode === "signup" && <span className="text-sm text-ink-soft">At least 8 characters.</span>}
      </label>
      )}
      {notice && <p className="rounded-xl bg-[#e8f7f0] p-3 font-semibold">{notice}</p>}
      {error && <p className="font-semibold text-nudge-dark">{error}</p>}
      {mode === "signup" && (
        <p className="text-sm text-ink-soft">
          By creating an account you confirm you are a parent or guardian and agree to the{" "}
          <a href="/terms/" target="_blank" rel="noreferrer" className="underline">
            terms
          </a>{" "}
          and{" "}
          <a href="/privacy/" target="_blank" rel="noreferrer" className="underline">
            privacy policy
          </a>
          .
        </p>
      )}
      <button type="submit" disabled={busy} className="rounded-xl bg-[#25b47e] px-4 py-3 text-lg font-bold text-[#0f172a] disabled:opacity-60">
        {busy ? "One moment…" : mode === "signup" ? "Create account & sync" : mode === "forgot" ? "Email me a reset link" : "Sign in & sync"}
      </button>
      {mode === "signin" && (
        <button type="button" className="self-start text-sm font-semibold underline" onClick={() => setMode("forgot")}>
          Forgot your password?
        </button>
      )}
      {mode === "forgot" && (
        <button type="button" className="self-start text-sm font-semibold underline" onClick={() => setMode("signin")}>
          Back to sign in
        </button>
      )}
      <p className="text-sm text-ink-soft">Your children&apos;s progress from this device is uploaded and merged with anything already in your account.</p>
    </form>
  );
}

type EmailPref = "weeklyReport" | "practiceReminders";

function EmailToggle({ pref, title, hint, verified }: { pref: EmailPref; title: string; hint: string; verified: boolean }) {
  const [on, setOn] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void fetch("/api/account/prefs/", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Partial<Record<EmailPref, boolean>> | null) => setOn(d?.[pref] ?? null))
      .catch(() => setOn(null));
  }, [pref]);
  if (on === null) return null;
  async function toggle() {
    setError("");
    const res = await fetch("/api/account/prefs/", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ [pref]: !on }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as (Partial<Record<EmailPref, boolean>> & { error?: string }) | undefined;
    if (res?.ok) setOn(Boolean(data?.[pref]));
    else setError(data?.error ?? "You’re offline. Try again when connected.");
  }
  return (
    <div className="mt-3">
      <button type="button" role="switch" aria-checked={on} onClick={() => void toggle()} className="flex w-full items-center justify-between gap-4 rounded-xl bg-paper px-4 py-3 text-left">
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="block text-sm text-ink-soft">{verified ? hint : "Confirm your email first to turn this on."}</span>
        </span>
        <span className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${on ? "bg-good" : "bg-ink/20"}`} aria-hidden="true">
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
        </span>
      </button>
      {error && <p className="mt-1 text-sm text-nudge-dark">{error}</p>}
    </div>
  );
}

function SecurityPanel() {
  const [devices, setDevices] = useState<DeviceSession[] | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = () => void listDevices().then(setDevices, () => setDevices(null));
  useEffect(load, []);
  const run = async (fn: () => Promise<void>, done: string) => {
    setError("");
    setMessage("");
    try {
      await fn();
      setMessage(done);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <Panel title="🔒 Security">
      <form
        className="flex max-w-md flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            await changePassword(current, next);
            setCurrent("");
            setNext("");
          }, "Password changed. Other devices were signed out.");
        }}
      >
        <h3 className="font-semibold">Change password</h3>
        <input type="password" autoComplete="current-password" required placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} className="rounded-xl border-2 border-line px-3 py-2" aria-label="Current password" />
        <input type="password" autoComplete="new-password" required minLength={8} placeholder="New password (8+ characters)" value={next} onChange={(e) => setNext(e.target.value)} className="rounded-xl border-2 border-line px-3 py-2" aria-label="New password" />
        <button type="submit" className="self-start rounded-xl border border-line px-4 py-2 font-semibold">
          Change password
        </button>
      </form>
      <h3 className="mt-4 font-semibold">Devices signed in</h3>
      {devices && (
        <ul className="mt-1 flex flex-col gap-1.5 text-sm">
          {devices.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2">
              <span>
                {d.device}
                {d.current && <b> (this device)</b>} · since {new Date(d.createdAt).toLocaleDateString("en-CA")}
              </span>
              {!d.current && (
                <button type="button" className="font-semibold underline" onClick={() => void run(() => signOutDevices(d.id), "Signed out.")}>
                  Sign out
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {devices && devices.length > 1 && (
        <button type="button" className="mt-2 rounded-xl border border-line px-4 py-2 font-semibold" onClick={() => void run(() => signOutDevices(), "Every other device was signed out.")}>
          Sign out everywhere else
        </button>
      )}
      {message && <p className="mt-2 font-semibold">{message}</p>}
      {error && <p className="mt-2 font-semibold text-nudge-dark">{error}</p>}
    </Panel>
  );
}

function VerifyNotice() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  return (
    <div className="mt-3 rounded-xl bg-[#fff6e5] p-3 text-sm">
      <p className="font-semibold">Please confirm your email.</p>
      <p className="text-ink-soft">We sent a link when you signed up. Confirming lets you subscribe and get account emails.</p>
      <button
        type="button"
        disabled={state === "sending" || state === "sent"}
        className="mt-2 rounded-xl border border-line bg-white px-3 py-1.5 font-semibold disabled:opacity-60"
        onClick={() => {
          setState("sending");
          void resendVerification().then(
            () => setState("sent"),
            (e: Error) => {
              setMessage(e.message);
              setState("error");
            },
          );
        }}
      >
        {state === "sent" ? "Sent. Check your inbox" : "Send the link again"}
      </button>
      {state === "error" && <p className="mt-1 text-nudge-dark">{message}</p>}
    </div>
  );
}

export function AccountPage({ onBilling }: { onBilling: (b: BillingInfo | null) => void }) {
  const account = useStore((s) => s.family.account);
  const sync = useStore((s) => s.sync);
  const [pending, setPending] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    void localdb.unsyncedEvents(5000).then((e) => setPending(e.length));
  }, [sync.lastSyncAt, sync.status]);

  return (
    <>
      <PageTitle title="Account & sync" sub="Back up progress and keep every device in step." />
      <div className="grid gap-5 lg:grid-cols-2">
        {account ? (
          <Panel title="☁️ Signed in">
            <p className="text-lg">
              <b>{account.email}</b>
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <dt className="text-ink-soft">Status</dt>
              <dd className="font-semibold capitalize">{sync.status}</dd>
              <dt className="text-ink-soft">Last synced</dt>
              <dd className="font-semibold">{sync.lastSyncAt ? new Date(sync.lastSyncAt).toLocaleString("en-CA") : "Not yet"}</dd>
              <dt className="text-ink-soft">Waiting to upload</dt>
              <dd className="font-semibold">{pending ?? "…"} events</dd>
            </dl>
            {account.verified === false && <VerifyNotice />}
            <EmailToggle pref="weeklyReport" title="Weekly progress email" hint="A short summary every Sunday. Unsubscribe any time." verified={account.verified !== false} />
            <EmailToggle
              pref="practiceReminders"
              title="Practice reminders"
              hint="A friendly note to you, never to your child, after a few quiet days. At most once a week."
              verified={account.verified !== false}
            />
            {sync.error && <p className="mt-2 text-sm text-nudge-dark">{sync.error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="rounded-xl bg-[#4f8ef7] px-4 py-2 font-bold text-[#0f172a]" onClick={() => void syncNow()}>
                Sync now
              </button>
              <button type="button" className="rounded-xl border border-line px-4 py-2 font-semibold" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          </Panel>
        ) : (
          <Panel title="Create a free account">
            <AuthForm onDone={() => void refreshAccount().then(onBilling)} />
          </Panel>
        )}
        <Panel title="How offline sync works">
          <ul className="flex list-disc flex-col gap-2 pl-5 font-read text-ink-soft">
            <li>Everything your children do is saved on the device first, so the app works with no internet at all.</li>
            <li>When the device is online and you&apos;re signed in, new progress uploads automatically, and progress from your other devices downloads.</li>
            <li>Progress merges answer by answer, so nothing is lost even if two devices were used offline at the same time.</li>
            <li>Changes to names, grades and settings sync too. The most recent change wins.</li>
          </ul>
        </Panel>
        {account && <SecurityPanel />}
        {account && <FamilyMembersPanel verified={account.verified !== false} onLeft={() => router.push("/play/")} />}
        {account && !account.coParent && (
          <Panel title="Delete account">
            <p className="mb-3 font-read text-ink-soft">Permanently deletes your account and all progress stored on our servers, and clears this device.</p>
            <button type="button" className="rounded-xl border border-[#e57a12] px-4 py-2 font-semibold text-nudge-dark" onClick={() => setConfirmDelete(true)}>
              Delete my account…
            </button>
          </Panel>
        )}
      </div>
      <Dialog open={confirmDelete} title="Delete everything?" onClose={() => setConfirmDelete(false)}>
        <p className="mb-3 font-read text-ink-soft">This can&apos;t be undone. Type your password to confirm.</p>
        <input type="password" autoComplete="current-password" aria-label="Password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="mb-4 w-full rounded-xl border-2 border-line px-3 py-2 text-lg" />
        {error && <p className="mb-2 text-nudge-dark">{error}</p>}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-nudge min-h-14 text-xl"
            onClick={() =>
              void deleteAccount(deletePassword)
                .then(() => router.push("/play/"))
                .catch((e: Error) => setError(e.message))
            }
          >
            Yes, delete my account
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
}
