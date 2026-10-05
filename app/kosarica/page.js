import Kosarica from "./Kosarica";

export const metadata = { title: "Košarica", robots: { index: false } };

export default function Stran() {
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 1000 }}>
        <h1 className="izd-h1" style={{ marginBottom: 20 }}>Košarica</h1>
        <Kosarica />
      </div>
    </section>
  );
}
