"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { coursesForGrade, getUnitRef, loadGrade } from "@/content";
import { FRAMEWORKS, getFramework } from "@/content/frameworks";
import { GRADE_LABEL, GRADE_ORDER } from "@/content/subjects";
import type { FrameworkId, GradeId } from "@/content/types";
import { APP_NAME } from "@/lib/brand";
import { call, type ClassSummary, type StudentRow } from "@/lib/classroom";
import { levelInfo } from "@/lib/proficiency";

// The teacher area: create a class, share its code, assign BC units and see each linked student's
// practice results. Each class follows one province (BC or Ontario). It talks to the server only (no kids' store), so it stays light.

const pct = (v: number) => `${Math.round(v * 100)}%`;
const btn = "min-h-11 rounded-xl px-4 font-bold";

function AuthForm({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await call(mode === "in" ? "/api/auth/login/" : "/api/auth/signup/", "POST", { email, password });
      onDone();
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-8 flex max-w-sm flex-col gap-3 rounded-2xl border border-line bg-white p-5">
      <h1 className="text-2xl font-bold">{mode === "in" ? "Teacher sign in" : "Create a teacher account"}</h1>
      <label className="flex flex-col text-sm font-semibold">
        Email
        <input className="mt-1 min-h-11 rounded-xl border border-line px-3" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="flex flex-col text-sm font-semibold">
        Password
        <input className="mt-1 min-h-11 rounded-xl border border-line px-3" type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {err && (
        <p role="alert" className="text-nudge-dark">
          {err}
        </p>
      )}
      <button disabled={busy} className={`${btn} bg-[#4f8ef7] text-[#0f172a] disabled:opacity-50`}>
        {mode === "in" ? "Sign in" : "Create account"}
      </button>
      <button type="button" className="text-sm font-semibold underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
      </button>
    </form>
  );
}

function ClassList({ onOpen }: { onOpen: (id: string) => void }) {
  const [classes, setClasses] = useState<ClassSummary[] | null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<GradeId>("3");
  const [framework, setFramework] = useState<FrameworkId>("ca-bc");
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    call<{ classes: ClassSummary[] }>("/api/classes/")
      .then((r) => setClasses(r.classes))
      .catch((e: Error) => setErr(e.message));
  }, []);
  useEffect(load, [load]);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const { class: c } = await call<{ class: ClassSummary }>("/api/classes/", "POST", { name, grade, framework });
      setName("");
      onOpen(c.id);
    } catch (x) {
      setErr((x as Error).message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Your classes</h1>
      {classes?.length === 0 && <p className="mt-2 font-read text-ink-soft">No classes yet. Create one below, then give families the class code.</p>}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {classes?.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => onOpen(c.id)} className="w-full rounded-2xl border border-line bg-white p-4 text-left">
              <span className="block text-xl font-bold">{c.name}</span>
              <span className="block font-read text-ink-soft">
                {GRADE_LABEL[c.grade as GradeId]} · {getFramework(c.framework as FrameworkId).region} · {c.students} {c.students === 1 ? "student" : "students"} · code <b className="font-mono tracking-widest">{c.joinCode}</b>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={create} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="flex flex-col text-sm font-semibold">
          Class name
          <input className="mt-1 min-h-11 rounded-xl border border-line px-3" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="flex flex-col text-sm font-semibold">
          Grade
          <select className="mt-1 min-h-11 rounded-xl border border-line bg-white px-3" value={grade} onChange={(e) => setGrade(e.target.value as GradeId)}>
            {GRADE_ORDER.map((g) => (
              <option key={g} value={g}>
                {GRADE_LABEL[g]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm font-semibold">
          Province
          <select className="mt-1 min-h-11 rounded-xl border border-line bg-white px-3" value={framework} onChange={(e) => setFramework(e.target.value as FrameworkId)}>
            {FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.region}
              </option>
            ))}
          </select>
        </label>
        <button className={`${btn} bg-[#25b47e] text-[#0f172a]`}>Create class</button>
      </form>
      {err && (
        <p role="alert" className="mt-3 text-nudge-dark">
          {err}
        </p>
      )}
    </>
  );
}

interface ClassDetail {
  class: { id: string; name: string; grade: GradeId; framework: FrameworkId; joinCode: string };
  assignments: string[];
  students: StudentRow[];
}

function ClassPage({ id, onBack }: { id: string; onBack: () => void }) {
  const [data, setData] = useState<ClassDetail | null>(null);
  const [ready, setReady] = useState(false);
  const [pick, setPick] = useState("");
  const [err, setErr] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);

  const load = useCallback(
    () =>
      call<ClassDetail>(`/api/classes/?id=${encodeURIComponent(id)}`)
        .then((d) => loadGrade(d.class.grade, d.class.framework).then(() => d))
        .then((d) => {
          setData(d);
          setReady(true);
        })
        .catch((e: Error) => setErr(e.message)),
    [id],
  );
  useEffect(() => {
    void load();
  }, [load]);

  if (!data || !ready) return <p className="font-read">{err || "Loading…"}</p>;
  const { class: cls, assignments, students } = data;
  const label = (key: string) => getUnitRef(key)?.unit.title ?? key;
  const levelLabel = (level: number) => (level < 0 ? "Not started" : levelInfo(cls.framework, cls.grade, level)?.label ?? "");

  const change = async (url: string, method: string, body?: unknown) => {
    setErr("");
    try {
      await call(url, method, body);
      await load();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <>
      <button type="button" className="mb-3 font-semibold underline" onClick={onBack}>
        ← All classes
      </button>
      <h1 className="text-3xl font-bold">{cls.name}</h1>
      <p className="font-read text-ink-soft">
        {GRADE_LABEL[cls.grade]} · {getFramework(cls.framework).curriculumName}
      </p>

      <section className="mt-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-xl font-bold">Class code</h2>
        <p className="mt-1 font-mono text-4xl font-bold tracking-widest" aria-label={`Class code ${cls.joinCode.split("").join(" ")}`}>
          {cls.joinCode}
        </p>
        <p className="mt-1 font-read text-ink-soft">
          Share this with families. A parent enters it under Children in the parent area, so they choose what to share. You will only see first names, grade and practice results for the units you assign.
        </p>
        <button type="button" className="mt-3 rounded-xl border border-line px-4 py-2 font-semibold" onClick={() => change(`/api/classes/?id=${encodeURIComponent(id)}`, "PATCH")}>
          Get a new code
        </button>
        <p className="mt-1 text-sm text-ink-soft">If the code was shared too widely. Families already linked stay linked; the old code stops working.</p>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-xl font-bold">Assigned units</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {assignments.map((k) => (
            <li key={k} className="flex items-center gap-2 rounded-full bg-black/5 py-1 pl-3 pr-1 font-read">
              {getUnitRef(k)?.unit.emoji} {label(k)}
              <button type="button" aria-label={`Remove ${label(k)}`} className="min-h-9 min-w-9 rounded-full font-bold" onClick={() => change(`/api/classes/assignments/?classId=${id}&unitKey=${encodeURIComponent(k)}`, "DELETE")}>
                ✕
              </button>
            </li>
          ))}
          {assignments.length === 0 && <li className="font-read text-ink-soft">Nothing assigned yet.</li>}
        </ul>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm font-semibold">
            Add a unit
            <select className="mt-1 min-h-11 max-w-full rounded-xl border border-line bg-white px-3" value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Choose a unit…</option>
              {coursesForGrade(cls.grade, cls.framework).map((course) => (
                <optgroup key={course.subject} label={course.subject}>
                  {course.units.map((u) => {
                    const key = `${course.grade}/${course.subject}/${u.id}`;
                    return (
                      <option key={key} value={key} disabled={assignments.includes(key)}>
                        {u.emoji} {u.title}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!pick}
            className={`${btn} bg-[#4f8ef7] text-[#0f172a] disabled:opacity-50`}
            onClick={async () => {
              await change("/api/classes/assignments/", "POST", { classId: id, unitKey: pick });
              setPick("");
            }}
          >
            Assign
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-xl font-bold">Students ({students.length})</h2>
        {students.length === 0 ? (
          <p className="mt-2 font-read text-ink-soft">No one has joined yet.</p>
        ) : assignments.length === 0 ? (
          <p className="mt-2 font-read text-ink-soft">Assign a unit to see how each student is doing.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left font-read">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 pr-3">Student</th>
                  {assignments.map((k) => (
                    <th key={k} scope="col" className="py-2 pr-3">{label(k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.profileId} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="py-2 pr-3 font-bold">
                      {s.name}
                      <span className="block text-sm font-normal text-ink-soft">{s.lastActive ? `Active ${new Date(s.lastActive).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}` : "Not active yet"}</span>
                    </th>
                    {s.units.map((u) => (
                      <td key={u.key} className="py-2 pr-3">
                        <b>{levelLabel(u.level)}</b>
                        {u.attempts > 0 && (
                          <span className="block text-sm text-ink-soft">
                            {pct(u.accuracy)} · {u.attempts} {u.attempts === 1 ? "question" : "questions"}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-sm text-ink-soft">This reflects practice in {APP_NAME}, not a report-card mark. You decide proficiency.</p>
      </section>

      {err && (
        <p role="alert" className="mt-3 text-nudge-dark">
          {err}
        </p>
      )}

      <section className="mt-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-xl font-bold">Close this class</h2>
        <p className="mt-1 font-read text-ink-soft">Closing removes every link to students straight away, so you no longer see anyone’s progress. Families keep their own data.</p>
        {confirmClose ? (
          <button type="button" className={`${btn} mt-3 border border-[#e57a12] text-nudge-dark`} onClick={() => change(`/api/classes/?id=${id}`, "DELETE").then(onBack)}>
            Yes, close {cls.name}
          </button>
        ) : (
          <button type="button" className={`${btn} mt-3 border border-line`} onClick={() => setConfirmClose(true)}>
            Close class
          </button>
        )}
      </section>
    </>
  );
}

export function TeacherApp() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    call("/api/auth/me/")
      .then(() => setSignedIn(true))
      .catch(() => setSignedIn(false));
  }, []);

  return (
    <div className="min-h-dvh bg-[#f6f5f1]">
      <header className="border-b border-line bg-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
          <span className="text-lg font-bold">
            {APP_NAME} <span className="font-semibold text-ink-soft">for teachers</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold underline">Home</Link>
            {signedIn && (
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => call("/api/auth/logout/", "POST").finally(() => { setSignedIn(false); setClassId(null); })}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        {signedIn === null ? <p className="font-read">Loading…</p> : !signedIn ? <AuthForm onDone={() => setSignedIn(true)} /> : classId ? <ClassPage id={classId} onBack={() => setClassId(null)} /> : <ClassList onOpen={setClassId} />}
      </main>
    </div>
  );
}
