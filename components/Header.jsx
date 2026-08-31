"use client";

import Link from "next/link";
import { useState } from "react";
import { navigacija, site } from "@/lib/site";

export default function Header() {
  const [odprt, setOdprt] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-red bg-ink text-paper">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 py-4">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold uppercase tracking-tight"
          onClick={() => setOdprt(false)}
        >
          AS system
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigacija.map((el) => (
            <Link
              key={el.pot}
              href={el.pot}
              className="text-[0.9375rem] font-medium text-paper/85 transition-colors hover:text-paper"
            >
              {el.naziv}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${site.telefonRaw}`}
            className="text-[0.9375rem] font-semibold text-paper/85 hover:text-paper"
          >
            {site.telefon}
          </a>
          <Link
            href="/kontakt"
            className="bg-red px-5 py-2.5 text-[0.875rem] font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-red-dark"
          >
            Povpraševanje
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOdprt(!odprt)}
          aria-expanded={odprt}
          aria-label={odprt ? "Zapri meni" : "Odpri meni"}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span className="h-[2px] w-6 bg-paper" />
          <span className="h-[2px] w-6 bg-paper" />
          <span className="h-[2px] w-6 bg-paper" />
        </button>
      </div>

      {odprt && (
        <nav className="border-t border-ink-line bg-ink-soft lg:hidden">
          <div className="mx-auto max-w-[1240px] px-5 py-3">
            {navigacija.map((el) => (
              <Link
                key={el.pot}
                href={el.pot}
                onClick={() => setOdprt(false)}
                className="block border-b border-ink-line py-3 font-medium text-paper/90"
              >
                {el.naziv}
              </Link>
            ))}
            <a
              href={`tel:${site.telefonRaw}`}
              className="block py-3 font-semibold text-red"
            >
              {site.telefon}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
