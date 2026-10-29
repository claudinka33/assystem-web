import Link from "next/link";

// Zaklenjen blok za vsebino, ki je samo za B2B partnerje (police, planogrami).
export default function ZaklenjenoB2B({ naprej = "/za-trgovce", naslov = "Police so na voljo B2B partnerjem", besedilo, prijavljen = false }) {
  const nap = encodeURIComponent(naprej);
  return (
    <div className="b2b-zaklep">
      <div className="b2b-zaklep-ik" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
      </div>
      <div className="b2b-zaklep-tx">
        <span>Samo za B2B partnerje</span>
        <h3>{naslov}</h3>
        <p>
          {besedilo ??
            "Postavitve polic, planograme in embalažo za trgovine smo razvili sami, zato jih pokažemo samo trgovcem z B2B dostopom. Prijavite se ali registrirajte podjetje."}
        </p>
        {prijavljen ? (
          <p className="b2b-zaklep-op">Vaš B2B dostop še ni aktiven — ko ga odobrimo, bodo police vidne tukaj.</p>
        ) : (
          <div className="zn-gumbi">
            <Link className="b b-r" href={`/b2b?naprej=${nap}`}>B2B prijava</Link>
            <Link className="b b-o" href="/b2b/registracija">Registracija podjetja</Link>
          </div>
        )}
      </div>
    </div>
  );
}
