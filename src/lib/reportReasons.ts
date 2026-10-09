// "Report a problem" uses fixed reasons, so children never type free text (see Privacy in AGENTS.md).
export const REPORT_REASONS = [
  { id: "wrong-answer", label: "The answer looks wrong" },
  { id: "unclear", label: "I don’t understand the question" },
  { id: "too-hard", label: "It’s too hard for this grade" },
  { id: "too-easy", label: "It’s too easy" },
  { id: "other", label: "Something else is off" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["id"];
