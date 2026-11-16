"use client";

import { ODPRI_PISKOTKE } from "@/components/Merjenje";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Povezava v nogi za spremembo odločitve o piškotkih.
function PiskotkiGumb({ className }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(ODPRI_PISKOTKE))}>
      Nastavitve piškotkov
    </button>
  );
}

export default prevedeno(PiskotkiGumb);
