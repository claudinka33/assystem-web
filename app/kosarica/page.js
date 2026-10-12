import Kosarica from "./Kosarica";

export const metadata = { title: "Košarica", robots: { index: false } };

export default function Stran() {
  return (
    <section className="trg">
      <div className="w">
        <Kosarica />
      </div>
    </section>
  );
}
