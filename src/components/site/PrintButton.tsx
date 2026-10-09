"use client";

export function PrintButton({ label = "Print this sheet" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn min-h-12 px-5 text-lg print:hidden">
      🖨️ {label}
    </button>
  );
}
