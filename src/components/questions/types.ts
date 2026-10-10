export type Status = "answering" | "retry" | "correct" | "revealed";

export interface QuestionProps<Q> {
  q: Q;
  status: Status;
  /** Report a finished attempt. `el` is where celebration effects start from. */
  onAttempt: (correct: boolean, el?: Element | null) => void;
  /** A small mistake that doesn't end the attempt (e.g. a wrong basket). */
  onSlip: (el?: Element | null) => void;
  /** Read a button's words aloud when it is tapped. Only given when the child has read-aloud on. */
  onSpeak?: (text: string) => void;
}

export const isLocked = (status: Status) => status === "correct" || status === "revealed";
