import Kosarica from "./Kosarica";

export const metadata = { title: "Košarica", robots: { index: false } };

export default function Stran() {
  return (
    <section className="trg ksb">
      <div className="ksb-w">
        <Kosarica />
      </div>
    </section>
  );
}
