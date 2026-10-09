// Browser calls for classroom mode (teachers and parents). All need a connection and a signed-in account.

export interface ClassSummary {
  id: string;
  name: string;
  grade: string;
  joinCode: string;
  students: number;
}

export interface StudentRow {
  profileId: string;
  name: string;
  avatar: string;
  grade: string;
  lastActive: number | null;
  units: { key: string; level: number; attempts: number; accuracy: number }[];
}

export interface ClassLink {
  classId: string;
  profileId: string;
  className: string;
  grade: string;
}

export async function call<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("You’re offline. Connect to the internet and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Something went wrong (${res.status}).`);
  return data;
}
