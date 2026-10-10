"use client";

import { useCallback, useEffect, useState } from "react";
import { call, type ClassLink } from "@/lib/classroom";
import { useProfiles, useStore } from "@/lib/store";
import { syncNow } from "@/lib/sync";
import { Panel } from "./common";

// A parent links a child to a teacher's class with its join code. That is the parent's consent:
// the teacher then sees the child's first name, grade and practice results on the units they assign.

export function JoinClass() {
  const profiles = useProfiles();
  const signedIn = !!useStore((s) => s.family.account);
  const [code, setCode] = useState("");
  const [profileId, setProfileId] = useState("");
  const [links, setLinks] = useState<ClassLink[]>([]);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const child = profileId || profiles[0]?.id || "";

  const load = useCallback(() => {
    if (!signedIn) return Promise.resolve();
    // Offline or signed out: the list stays as it was.
    return call<{ links: ClassLink[] }>("/api/classes/join/").then((r) => setLinks(r.links), () => {});
  }, [signedIn]);
  useEffect(() => {
    void load();
  }, [load]);

  const join = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await syncNow().catch(() => {}); // The child has to exist on the server first.
      const { link } = await call<{ link: ClassLink }>("/api/classes/join/", "POST", { code, profileId: child });
      setMessage({ ok: true, text: `Joined ${link.className}. The teacher can now see first name, grade and practice results for the units they assign.` });
      setCode("");
      void load();
      void syncNow().catch(() => {}); // Brings the assigned units to the child’s devices.
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const leave = async (l: ClassLink) => {
    try {
      await call(`/api/classes/join/?classId=${encodeURIComponent(l.classId)}&profileId=${encodeURIComponent(l.profileId)}`, "DELETE");
      void load();
      void syncNow().catch(() => {});
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    }
  };

  return (
    <Panel title="🏫 Join a class" className="mt-4">
      <p className="font-read text-ink-soft">
        Got a class code from your child’s teacher? Linking shares only your child’s first name, grade and practice results on the units the teacher assigns. Your child will also see those units on their home screen. You can leave the class at any time.
      </p>
      {!signedIn ? (
        <p className="mt-3 font-read">Sign in under “Account &amp; sync” first so the teacher can see progress.</p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="flex flex-col text-sm font-semibold">
              Child
              <select className="mt-1 min-h-11 rounded-xl border border-line bg-white px-3" value={child} onChange={(e) => setProfileId(e.target.value)}>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm font-semibold">
              Class code
              <input
                className="mt-1 min-h-11 w-36 rounded-xl border border-line px-3 font-mono text-lg uppercase tracking-widest"
                value={code}
                maxLength={6}
                autoCapitalize="characters"
                autoComplete="off"
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </label>
            <button type="button" disabled={busy || code.length < 6 || !child} className="min-h-11 rounded-xl bg-[#25b47e] px-4 font-bold text-[#0f172a] disabled:opacity-50" onClick={join}>
              Join class
            </button>
          </div>
          {message && (
            <p role="status" className={`mt-3 font-read ${message.ok ? "text-good-dark" : "text-nudge-dark"}`}>
              {message.text}
            </p>
          )}
          {links.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.classId + l.profileId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-3 py-2">
                  <span className="font-read">
                    <b>{profiles.find((p) => p.id === l.profileId)?.name ?? "Child"}</b> is in <b>{l.className}</b>
                  </span>
                  <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm font-semibold" onClick={() => leave(l)}>
                    Leave class
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Panel>
  );
}
