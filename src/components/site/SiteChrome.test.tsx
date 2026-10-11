// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { APP_NAME, WORDMARK_COLOURS } from "@/lib/brand";
import { SiteHeader } from "./SiteChrome";

function cssColour(hex: string) {
  const n = hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

describe("SiteHeader", () => {
  it("colours each letter of the name the same way as the play screen", () => {
    render(<SiteHeader />);
    const link = screen.getByRole("link", { name: APP_NAME });
    const letters = [...link.querySelectorAll("span")];
    expect(letters.map((el) => el.textContent).join("")).toBe(APP_NAME);
    expect(letters.map((el) => el.style.color)).toEqual(
      [...APP_NAME].map((_, i) => cssColour(WORDMARK_COLOURS[i % WORDMARK_COLOURS.length])),
    );
  });
});
