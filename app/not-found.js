import Link from "next/link";

export const metadata = { title: "Stran ne obstaja" };

export default function NiNajdeno() {
  return (
    <section className="sec">
      <div className="w">
        <div className="st">
          <span>Napaka 404</span>
          <h1>Te strani ni</h1>
          <p>Povezava je zastarela ali napačno vnesena.</p>
        </div>
        <Link className="b b-r" href="/">
          Nazaj na domačo stran
        </Link>
      </div>
    </section>
  );
}
