import { DEFAULT_FRAMEWORK } from "./frameworks";
import { GRADE_ORDER } from "./subjects";
import type { Course, FrameworkId, GradeId, SubjectId, Unit } from "./types";

// The content registry for the apps. Each grade's content is its own download,
// loaded on demand with `loadGrade`, so a Grade 2 child never downloads Grade 7.
// A grade's shared lessons (BC) are one download, and each other framework adds
// its own download on top, so a BC child never downloads Ontario lessons.
// Lookups only see grades that have loaded; the apps wait for the grades they need
// (see src/lib/useGradeContent.ts). Server pages and tests use ./all instead.

type Loader = () => Promise<{ courses: Course[] }>;

const LOADERS: Record<GradeId, Loader> = {
  k: () => import("./grades/k"),
  "1": () => import("./grades/g1"),
  "2": () => import("./grades/g2"),
  "3": () => import("./grades/g3"),
  "4": () => import("./grades/g4"),
  "5": () => import("./grades/g5"),
  "6": () => import("./grades/g6"),
  "7": () => import("./grades/g7"),
  "8": () => import("./grades/g8"),
  "9": () => import("./grades/g9"),
};

/** Extra lessons for frameworks other than the default. Each is its own download per grade. */
const EXTRA_LOADERS: Partial<Record<FrameworkId, Partial<Record<GradeId, Loader>>>> = {
  "ca-on": {
    k: () => import("./ontario/k"),
    "1": () => import("./ontario/g1"),
    "2": () => import("./ontario/g2"),
    "3": () => import("./ontario/g3"),
    "4": () => import("./ontario/g4"),
    "5": () => import("./ontario/g5"),
    "6": () => import("./ontario/g6"),
    "7": () => import("./ontario/g7"),
    "8": () => import("./ontario/g8"),
    "9": () => import("./ontario/g9"),
  },
  "ca-ab": {
    k: () => import("./alberta/k"),
    "1": () => import("./alberta/g1"),
    "2": () => import("./alberta/g2"),
    "3": () => import("./alberta/g3"),
    "4": () => import("./alberta/g4"),
    "5": () => import("./alberta/g5"),
    "6": () => import("./alberta/g6"),
    "7": () => import("./alberta/g7"),
    "8": () => import("./alberta/g8"),
    "9": () => import("./alberta/g9"),
  },
};

/**
 * Frameworks whose extra content another framework reuses. Alberta lists some Ontario-written units under
 * `shares`, so an Alberta child downloads Ontario's file for the grade too (those units stay hidden unless
 * they carry Alberta standards).
 */
const EXTRA_DEPENDS: Partial<Record<FrameworkId, FrameworkId[]>> = { "ca-ab": ["ca-on"] };

const withDepends = (framework: FrameworkId): FrameworkId[] => [framework, ...(EXTRA_DEPENDS[framework] ?? [])];

/** What a child needs downloaded: a grade in a framework. */
export interface ContentTarget {
  grade: GradeId;
  framework: FrameworkId;
}

/** Grades that have content. Every grade has a loader; tests check each one has units. */
export const AVAILABLE_GRADES: GradeId[] = GRADE_ORDER.filter((g) => g in LOADERS);

/** Progress is keyed by "grade/subject/unit", e.g. "2/math/tens-and-ones". */
export function unitKey(grade: GradeId, subject: SubjectId, unitId: string): string {
  return `${grade}/${subject}/${unitId}`;
}

/** Reads a unit key without needing its grade loaded, so scoring never depends on downloads. */
export function parseUnitKey(key: string): { grade: GradeId; subject: SubjectId; unitId: string } | undefined {
  const [grade, subject, unitId] = key.split("/");
  if (!unitId || !GRADE_ORDER.includes(grade as GradeId)) return undefined;
  return { grade: grade as GradeId, subject: subject as SubjectId, unitId };
}

export interface UnitRef {
  key: string;
  course: Course;
  unit: Unit;
}

/** Joins courses of the same subject, so a framework's own units sit beside the shared ones. */
export function mergeCourses(lists: Course[][]): Course[] {
  const out: Course[] = [];
  for (const course of lists.flat()) {
    const i = out.findIndex((c) => c.grade === course.grade && c.subject === course.subject);
    if (i < 0) {
      out.push(course);
      continue;
    }
    const base = out[i];
    out[i] = {
      ...base,
      bigIdeas: { ...base.bigIdeas, ...course.bigIdeas },
      units: [...base.units, ...course.units],
      shares: mergeShares(base.shares, course.shares),
      order: { ...base.order, ...course.order },
    };
  }
  return out.map(applyShares);
}

/** Joins two share lists. When two frameworks share the same unit, each keeps its own standards text. */
function mergeShares(a: Course["shares"], b: Course["shares"]): Course["shares"] {
  if (!a || !b) return a ?? b;
  const out = { ...a };
  for (const [id, share] of Object.entries(b)) out[id] = { standards: { ...out[id]?.standards, ...share.standards } };
  return out;
}

function applyShares(course: Course): Course {
  if (!course.shares) return course;
  const shares = course.shares;
  return {
    ...course,
    units: course.units.map((u) => (shares[u.id] ? { ...u, standards: { ...u.standards, ...shares[u.id].standards } } : u)),
  };
}

/** A framework's view of courses: only the units it has standards for. */
export function coursesInFramework(list: Course[], framework: FrameworkId): Course[] {
  return list
    .map((c) => {
      let units = c.units.every((u) => u.standards[framework]) ? c.units : c.units.filter((u) => u.standards[framework]);
      const order = c.order?.[framework];
      if (order) {
        const rank = (u: Unit) => (order.includes(u.id) ? order.indexOf(u.id) : order.length);
        units = [...units].sort((a, b) => rank(a) - rank(b));
      }
      return units === c.units ? c : { ...c, units };
    })
    .filter((c) => c.units.length > 0);
}

const base = new Map<GradeId, Course[]>();
const extras = new Map<string, Course[]>();
const merged = new Map<GradeId, Course[]>();
const views = new Map<string, Course[]>();
const refs = new Map<string, UnitRef>();
const pending = new Map<string, Promise<void>>();
const failed = new Set<string>();
const listeners = new Set<() => void>();

const targetId = (grade: GradeId, framework: FrameworkId) => `${framework}:${grade}`;

function rebuild(grade: GradeId) {
  const list = mergeCourses([
    base.get(grade) ?? [],
    ...[...extras.entries()].filter(([k]) => k.endsWith(`:${grade}`)).map(([, v]) => v),
  ]).filter((c) => c.units.length > 0);
  merged.set(grade, list);
  for (const key of [...views.keys()]) if (key.endsWith(`:${grade}`)) views.delete(key);
  for (const course of list) {
    for (const unit of course.units) {
      const key = unitKey(course.grade, course.subject, unit.id);
      refs.set(key, { key, course, unit });
    }
  }
}

function notify() {
  for (const l of listeners) l();
}

function loadPart(id: string, grade: GradeId, loader: Loader, store: () => void, register: (c: Course[]) => void): Promise<void> {
  let p = pending.get(id);
  if (!p) {
    failed.delete(id);
    p = loader()
      .then((m) => {
        register(m.courses);
        store();
      })
      .catch((err: unknown) => {
        // Usually offline before this grade was ever downloaded. Allow a retry.
        failed.add(id);
        throw err;
      })
      .finally(() => {
        pending.delete(id);
        notify();
      });
    pending.set(id, p);
    notify();
  }
  return p;
}

/** Downloads a grade's content once; later calls return the same promise. */
export function loadGrade(grade: GradeId, framework: FrameworkId = DEFAULT_FRAMEWORK): Promise<void> {
  const parts: Promise<void>[] = [];
  if (!base.has(grade)) {
    parts.push(
      loadPart(`base:${grade}`, grade, LOADERS[grade], () => rebuild(grade), (c) => base.set(grade, c)),
    );
  }
  for (const f of withDepends(framework)) {
    const extra = EXTRA_LOADERS[f]?.[grade];
    const id = targetId(grade, f);
    if (extra && !extras.has(id)) {
      parts.push(loadPart(id, grade, extra, () => rebuild(grade), (c) => extras.set(id, c)));
    }
  }
  return Promise.all(parts).then(() => undefined);
}

export function loadGrades(targets: Iterable<ContentTarget>): Promise<void> {
  const unique = new Map<string, ContentTarget>();
  for (const t of targets) unique.set(targetId(t.grade, t.framework), t);
  return Promise.all([...unique.values()].map((t) => loadGrade(t.grade, t.framework))).then(() => undefined);
}

export function isGradeLoaded(grade: GradeId, framework: FrameworkId = DEFAULT_FRAMEWORK): boolean {
  if (!base.has(grade)) return false;
  return withDepends(framework).every((f) => !EXTRA_LOADERS[f]?.[grade] || extras.has(targetId(grade, f)));
}

export function gradeLoadFailed(grade: GradeId, framework: FrameworkId = DEFAULT_FRAMEWORK): boolean {
  return failed.has(`base:${grade}`) || withDepends(framework).some((f) => failed.has(targetId(grade, f)));
}

/** For useSyncExternalStore: called whenever a grade starts, finishes or fails loading. */
export function subscribeToContent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A grade's courses in a framework (only its units), or [] if that grade hasn't loaded yet. */
export function coursesForGrade(grade: GradeId, framework: FrameworkId): Course[] {
  const id = targetId(grade, framework);
  let view = views.get(id);
  if (!view) {
    view = coursesInFramework(merged.get(grade) ?? [], framework);
    views.set(id, view);
  }
  return view;
}

export function getCourse(grade: GradeId, subject: SubjectId | string, framework: FrameworkId): Course | undefined {
  return coursesForGrade(grade, framework).find((c) => c.subject === subject);
}

export function getUnitRef(key: string): UnitRef | undefined {
  return refs.get(key);
}

export function allUnitRefs(grade: GradeId, framework: FrameworkId): UnitRef[] {
  return coursesForGrade(grade, framework).flatMap((course) =>
    course.units.map((unit) => refs.get(unitKey(course.grade, course.subject, unit.id))!),
  );
}
