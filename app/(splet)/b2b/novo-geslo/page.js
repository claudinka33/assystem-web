import NovoGeslo from "./NovoGeslo";

export const metadata = { title: "Novo geslo — B2B", robots: { index: false } };

export default async function Stran({ searchParams }) {
  const { nov } = await searchParams;
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 520 }}>
        <h1 className="izd-h1">{nov ? "Dobrodošli v B2B trgovini" : "Novo geslo"}</h1>
        {nov && <p style={{ marginTop: 8 }}>E-naslov je potrjen. Nastavite si geslo — z njim se boste prijavljali v B2B trgovino.</p>}
        <div className="b2b-skatla" style={{ marginTop: 20 }}>
          <NovoGeslo />
        </div>
      </div>
    </section>
  );
}
