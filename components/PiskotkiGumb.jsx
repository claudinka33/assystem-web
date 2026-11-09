"use client";

import { ODPRI_PISKOTKE } from "@/components/Merjenje";

// Povezava v nogi za spremembo odločitve o piškotkih.
export default function PiskotkiGumb({ className }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(ODPRI_PISKOTKE))}>
      Nastavitve piškotkov
    </button>
  );
}
