"use client";

import { useEffect, useState } from "react";
import { inviteCoParent, leaveFamily, listFamilyMembers, removeFamilyMember, type FamilyMembers as Members } from "@/lib/account";
import { Panel } from "./common";

/** Other adults in the family: a partner, grandparent or tutor who can see the same reports. */
export function FamilyMembersPanel({ verified, onLeft }: { verified: boolean; onLeft: () => void }) {
  const [data, setData] = useState<Members | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => void listFamilyMembers().then(setData, () => setData(null));
  useEffect(load, []);
  const act = async (fn: () => Promise<void>, done: string) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
      setMessage(done);
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  if (!data) return null;
  const me = data.members.find((m) => m.you);
  const full = data.members.filter((m) => m.role === "coparent").length + data.invites.length >= 2;
  return (
    <Panel title="👪 Other adults">
      <p className="mb-3 text-sm text-ink-soft">
        {data.owner
          ? "Invite a partner, grandparent or tutor to see the same reports and weekly emails with their own login. They can't change billing or delete the account."
          : "You can see this family's reports. Billing and account deletion stay with the person who invited you."}
      </p>
      <ul className="flex flex-col gap-2">
        {data.members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper px-3 py-2">
            <span>
              <b>{m.email}</b> <span className="text-sm text-ink-soft">{m.role === "owner" ? "Owner" : "Can view"}{m.you ? " · you" : ""}</span>
            </span>
            {data.owner && m.role === "coparent" && (
              <button type="button" disabled={busy} className="min-h-11 rounded-xl border border-line px-3 text-sm font-semibold" onClick={() => void act(() => removeFamilyMember({ id: m.id }), `Removed ${m.email}.`)}>
                Remove
              </button>
            )}
          </li>
        ))}
        {data.invites.map((i) => (
          <li key={i.email} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper px-3 py-2">
            <span>
              <b>{i.email}</b> <span className="text-sm text-ink-soft">Invitation sent</span>
            </span>
            {data.owner && (
              <button type="button" disabled={busy} className="min-h-11 rounded-xl border border-line px-3 text-sm font-semibold" onClick={() => void act(() => removeFamilyMember({ inviteEmail: i.email }), "Invitation cancelled.")}>
                Cancel
              </button>
            )}
          </li>
        ))}
      </ul>
      {data.owner && !full && (
        <form
          className="mt-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void act(() => inviteCoParent(email).then(() => setEmail("")), "Invitation sent. The link works for 7 days.");
          }}
        >
          <label className="flex flex-1 flex-col gap-1">
            <span className="font-semibold">Their email</span>
            <input type="email" required autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border-2 border-line px-3 py-2 text-lg" />
          </label>
          <button type="submit" disabled={busy || !verified} className="min-h-12 rounded-xl bg-[#253047] px-4 font-bold text-white disabled:opacity-40">
            Send invitation
          </button>
        </form>
      )}
      {data.owner && !verified && <p className="mt-2 text-sm text-ink-soft">Confirm your own email first, then you can invite someone.</p>}
      {!data.owner && me && (
        <button type="button" disabled={busy} className="mt-3 min-h-11 rounded-xl border border-[#e57a12] px-4 font-semibold text-nudge-dark" onClick={() => void leaveFamily(me.id).then(onLeft, (e: Error) => setError(e.message))}>
          Leave this family
        </button>
      )}
      {message && <p role="status" className="mt-2 font-semibold text-good-dark">{message}</p>}
      {error && <p role="alert" className="mt-2 font-semibold text-nudge-dark">{error}</p>}
    </Panel>
  );
}
