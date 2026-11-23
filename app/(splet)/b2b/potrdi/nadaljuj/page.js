import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = { title: "Potrditev B2B dostopa", robots: { index: false } };

// Vmesna stran: kupec s klikom potrdi povezavo iz e-sporočila (žeton se porabi šele ob kliku).
async function Nadaljuj({ searchParams }) {
  const { token_hash = "", type = "", nov = "" } = await searchParams;
  const geslo = type === "invite" || type === "recovery";
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 560 }}>
        <div className="b2b-zaklep">
          <h1>{geslo ? "Nastavite geslo za B2B dostop" : "Potrdite e-naslov"}</h1>
          <p>{geslo ? "Kliknite gumb in si nastavite svoje geslo za prijavo v B2B portal." : "Kliknite gumb, da potrdite e-naslov in odprete svoj B2B račun."}</p>
          <form method="post" action="/b2b/potrdi">
            <input type="hidden" name="token_hash" value={token_hash} />
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="nov" value={nov} />
            <button className="b b-g" type="submit">{geslo ? "Nastavi geslo →" : "Potrdi e-naslov →"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default prevedenaStran(Nadaljuj);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
