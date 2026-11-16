"use client";

export default function Natisni() {
  return (
    <div className="izp-orodja">
      <button type="button" onClick={() => window.print()}>Natisni / shrani kot PDF</button>
      <span>V oknu za tiskanje izberite »Shrani kot PDF«.</span>
    </div>
  );
}
