import Link from "next/link";

export default function VPripravi({ kaj }) {
  return (
    <section className="sec">
      <div className="w">
        <div className="priprava">
          <h2>Vsebina je v pripravi</h2>
          <p>{kaj} Do takrat vam informacije posreduje naša prodaja.</p>
          <Link className="more" href="/kontakt" style={{ display: "inline-block", marginTop: 16 }}>
            Pošljite povpraševanje →
          </Link>
        </div>
      </div>
    </section>
  );
}
