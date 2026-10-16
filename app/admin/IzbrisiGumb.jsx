"use client";

// Gumb za brisanje z vprašanjem za potrditev — da se nič ne izbriše po pomoti.
export default function IzbrisiGumb({ action, id, ime, opozorilo }) {
  return (
    <form
      action={action}
      style={{ display: "inline" }}
      onSubmit={(e) => {
        const besedilo = `Res izbrišem »${ime}«?${opozorilo ? "\n\n" + opozorilo : ""}`;
        if (!window.confirm(besedilo)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="ikona-gumb nevaren" type="submit" title="Izbriši" aria-label={`Izbriši ${ime}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </svg>
      </button>
    </form>
  );
}
