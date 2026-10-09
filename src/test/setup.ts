import { afterEach } from "vitest";

// Only component tests run in a DOM; skip the setup for the node-environment tests.
if (typeof document !== "undefined") {
  const { cleanup } = await import("@testing-library/react");
  await import("@testing-library/jest-dom/vitest");
  afterEach(() => cleanup());
}
