"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteAccount, refreshAccount, signIn, signOut, signUp, type BillingInfo } from "@/lib/account";
import * as localdb from "@/lib/localdb";
import { useStore } from "@/lib/store";
import { syncNow } from "@/lib/sync";
import { Dialog } from "../ui";
import { PageTitle, Panel } from "./common";

function AuthForm({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
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
      <button type="submit" disabled={busy} className="rounded-xl bg-[#25b47e] px-4 py-3 text-lg font-bold text-white disabled:opacity-60">
        {busy ? "One moment…" : mode === "signup" ? "Create account & sync" : "Sign in & sync"}
      </button>
      <p className="text-sm text-ink-soft">Your children&apos;s progress from this device is uploaded and merged with anything already in your account.</p>
    </form>
  );
}

export function AccountPage({ onBilling }: { onBilling: (b: BillingInfo | null) => void }) {
  const account = useStore((s) => s.family.account);
  const sync = useStore((s) => s.sync);
  const [pending, setPending] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
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
            {sync.error && <p className="mt-2 text-sm text-nudge-dark">{sync.error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="rounded-xl bg-[#4f8ef7] px-4 py-2 font-bold text-white" onClick={() => void syncNow()}>
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
        {account && (
          <Panel title="Delete account">
            <p className="mb-3 font-read text-ink-soft">Permanently deletes your account and all progress stored on our servers, and clears this device.</p>
            <button type="button" className="rounded-xl border border-[#e57a12] px-4 py-2 font-semibold text-nudge-dark" onClick={() => setConfirmDelete(true)}>
              Delete my account…
            </button>
          </Panel>
        )}
      </div>
      <Dialog open={confirmDelete} title="Delete everything?" onClose={() => setConfirmDelete(false)}>
        <p className="mb-4 font-read text-ink-soft">This can&apos;t be undone.</p>
        {error && <p className="mb-2 text-nudge-dark">{error}</p>}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-nudge min-h-14 text-xl"
            onClick={() =>
              void deleteAccount()
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
