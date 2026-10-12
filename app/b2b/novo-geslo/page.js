import NovoGeslo from "./NovoGeslo";

export const metadata = { title: "Novo geslo — B2B", robots: { index: false } };

export default function Stran() {
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 520 }}>
        <h1 className="izd-h1">Novo geslo</h1>
        <div className="b2b-skatla" style={{ marginTop: 20 }}>
          <NovoGeslo />
        </div>
      </div>
    </section>
  );
}
