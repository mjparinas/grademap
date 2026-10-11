import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/brand";

export const alt = `${APP_NAME}: curriculum practice and learning games for Kindergarten to Grade 9`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

// Shapes and text only (no emoji), so the image builds without fetching anything.
export default function OpenGraphImage() {
  const dots = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636", "#ffc233"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#fffaf1", color: "#253047" }}>
        <div style={{ display: "flex", gap: 18, marginBottom: 40 }}>
          {dots.map((c) => (
            <div key={c} style={{ width: 54, height: 54, borderRadius: 27, background: c }} />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 700, letterSpacing: -2, color: "#4f8ef7" }}>
          {APP_NAME}
        </div>
        <div style={{ fontSize: 50, fontWeight: 700, marginTop: 12 }}>Practice that feels like play.</div>
        <div style={{ fontSize: 36, color: "#5b6680", marginTop: 18 }}>Math · Reading · Science · Social Studies · Kindergarten to Grade 9</div>
      </div>
    ),
    size,
  );
}
