"use client";

import { useState } from "react";
import { AVAILABLE_GRADES } from "@/content";
import { FRAMEWORKS, getFramework, type Framework } from "@/content/frameworks";
import { getSubjectMeta, GRADE_LABEL, gradeForAge } from "@/content/subjects";
import type { FrameworkId, GradeId } from "@/content/types";
import type { Profile } from "@/lib/model";
import { MAX_CHILDREN } from "@/lib/plan";
import { useProfiles, useStore } from "@/lib/store";
import { CritterSvg, CRITTERS } from "../Critter";
import { AVATAR_COLOURS } from "../play/Start";
import { Dialog } from "../ui";
import { Avatar, PageTitle, Panel } from "./common";

interface Draft {
  name: string;
  grade: GradeId;
  framework: FrameworkId;
  birthYear?: number;
  avatar: string;
  colour: string;
}

const thisYear = new Date().getFullYear();

function listSubjects(f: Framework): string {
  const names = f.subjects.map((s) => getSubjectMeta(s).title.big.toLowerCase());
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
}

function ChildForm({ draft, onChange }: { draft: Draft; onChange: (d: Draft) => void }) {
  const chosen = getFramework(draft.framework);
  const age = draft.birthYear ? thisYear - draft.birthYear : undefined;
  return (
    <div className="flex flex-col gap-4 text-left">
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input value={draft.name} maxLength={20} onChange={(e) => onChange({ ...draft, name: e.target.value })} className="rounded-xl border-2 border-line px-3 py-2 text-lg" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Birth year</span>
          <select
            value={draft.birthYear ?? ""}
            onChange={(e) => {
              const birthYear = e.target.value ? Number(e.target.value) : undefined;
              // Suggest a grade from age (a September birthday can shift it by one).
              onChange({ ...draft, birthYear, grade: birthYear && !draft.name ? gradeForAge(thisYear - birthYear) : draft.grade });
            }}
            className="rounded-xl border-2 border-line px-3 py-2 text-lg"
          >
            <option value="">Not set</option>
            {Array.from({ length: 11 }, (_, i) => thisYear - 4 - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {age !== undefined && <span className="text-sm text-ink-soft">About {age} years old (suggested: {GRADE_LABEL[gradeForAge(age)]})</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Grade</span>
          <select value={draft.grade} onChange={(e) => onChange({ ...draft, grade: e.target.value as GradeId })} className="rounded-xl border-2 border-line px-3 py-2 text-lg">
            {AVAILABLE_GRADES.map((g) => (
              <option key={g} value={g}>
                {GRADE_LABEL[g]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Province or state</span>
        <select value={draft.framework} onChange={(e) => onChange({ ...draft, framework: e.target.value as FrameworkId })} className="rounded-xl border-2 border-line px-3 py-2 text-lg">
          {FRAMEWORKS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.curriculumName})
            </option>
          ))}
        </select>
        <span className="text-sm text-ink-soft">
          Lessons and reports follow the {chosen.curriculumName}
          {chosen.subjects.length < 4 ? `, which has ${listSubjects(chosen)} so far` : ""}. Progress in the other curriculum is kept if you switch back. More provinces and states are coming.
        </span>
      </label>
      <div>
        <p className="mb-2 font-semibold">Avatar</p>
        <div className="grid grid-cols-6 gap-2">
          {CRITTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={c.name}
              aria-pressed={draft.avatar === c.id}
              onClick={() => onChange({ ...draft, avatar: c.id, colour: AVATAR_COLOURS[i % AVATAR_COLOURS.length] })}
              className={`aspect-square rounded-xl border-2 p-0.5 ${draft.avatar === c.id ? "border-[#253047]" : "border-transparent"}`}
              style={{ background: draft.avatar === c.id ? draft.colour : "#f1efe9" }}
            >
              <CritterSvg id={c.id} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChildrenPage() {
  const profiles = useProfiles();
  const addProfile = useStore((s) => s.addProfile);
  const updateProfile = useStore((s) => s.updateProfile);
  const removeProfile = useStore((s) => s.removeProfile);
  const resetProgress = useStore((s) => s.resetProgress);
  const activeId = useStore((s) => s.activeId);
  const setActive = useStore((s) => s.setActive);
  const [editing, setEditing] = useState<Profile | "new" | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirm, setConfirm] = useState<{ kind: "remove" | "reset"; p: Profile } | null>(null);

  const startEdit = (p: Profile | "new") => {
    setEditing(p);
    setDraft(
      p === "new"
        ? { name: "", grade: "2", framework: "ca-bc", avatar: "ollie", colour: AVATAR_COLOURS[0] }
        : { name: p.name, grade: p.grade, framework: p.framework, birthYear: p.birthYear, avatar: p.avatar, colour: p.colour },
    );
  };

  const save = () => {
    if (!draft || !draft.name.trim()) return;
    if (editing === "new") {
      const prev = activeId;
      addProfile(draft);
      setActive(prev);
    } else if (editing) updateProfile(editing.id, { ...draft, name: draft.name.trim() });
    setEditing(null);
  };

  return (
    <>
      <PageTitle
        title="Children"
        sub={`Up to ${MAX_CHILDREN} children per family.`}
        action={
          profiles.length < MAX_CHILDREN && (
            <button type="button" className="rounded-xl bg-[#25b47e] px-4 py-2 font-bold text-[#0f172a]" onClick={() => startEdit("new")}>
              + Add a child
            </button>
          )
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {profiles.map((p) => (
          <Panel key={p.id}>
            <div className="flex items-center gap-3">
              <Avatar p={p} size={56} />
              <div className="flex-1">
                <p className="text-xl font-bold">{p.name}</p>
                <p className="text-sm text-ink-soft">
                  {GRADE_LABEL[p.grade]} · {getFramework(p.framework).name}
                  {p.birthYear ? ` · about ${thisYear - p.birthYear} years old` : ""}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="rounded-xl border border-line px-3 py-2 text-sm font-semibold" onClick={() => startEdit(p)}>
                ✏️ Edit
              </button>
              <a className="rounded-xl border border-line px-3 py-2 text-sm font-semibold" href={`#/settings/${p.id}`}>
                ⚙️ Settings
              </a>
              <button type="button" className="rounded-xl border border-line px-3 py-2 text-sm font-semibold" onClick={() => setConfirm({ kind: "reset", p })}>
                ↺ Reset progress
              </button>
              <button type="button" className="rounded-xl border border-[#e57a12] px-3 py-2 text-sm font-semibold text-nudge-dark" onClick={() => setConfirm({ kind: "remove", p })}>
                Remove
              </button>
            </div>
          </Panel>
        ))}
      </div>

      <Dialog open={!!editing && !!draft} title={editing === "new" ? "Add a child" : "Edit child"} onClose={() => setEditing(null)}>
        {draft && (
          <div className="flex flex-col gap-4">
            <ChildForm draft={draft} onChange={setDraft} />
            <button type="button" disabled={!draft.name.trim()} className="btn btn-good min-h-14 text-xl" onClick={save}>
              Save
            </button>
          </div>
        )}
      </Dialog>

      <Dialog open={!!confirm} title={confirm?.kind === "reset" ? `Reset ${confirm.p.name}'s progress?` : `Remove ${confirm?.p.name}?`} onClose={() => setConfirm(null)}>
        <p className="mb-5 font-read text-ink-soft">
          {confirm?.kind === "reset"
            ? "Levels, stars, trophies, coins and streaks start over. Their name and settings stay. This also applies on your other devices when they sync."
            : "This deletes the child and all their progress, here and (after syncing) on our servers."}
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-nudge min-h-14 text-xl"
            onClick={() => {
              if (!confirm) return;
              if (confirm.kind === "reset") resetProgress(confirm.p.id);
              else removeProfile(confirm.p.id);
              setConfirm(null);
            }}
          >
            Yes, {confirm?.kind === "reset" ? "reset" : "remove"}
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={() => setConfirm(null)}>
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
}
