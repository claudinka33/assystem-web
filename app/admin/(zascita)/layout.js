import Link from "next/link";
import { redirect } from "next/navigation";
import { trenutniAdmin } from "@/lib/supabase-server";
import Odjava from "../Odjava";
import "../admin.css";

export const metadata = {
  title: "Administracija",
  robots: { index: false, follow: false },
};

const meni = [
  { skupina: "Katalog", povezave: [
    { naziv: "Kategorije", pot: "/admin/kategorije" },
    { naziv: "Izdelki", pot: "/admin/izdelki" },
  ]},
  { skupina: "Vsebina", povezave: [
    { naziv: "Besedila na strani", pot: "/admin/vsebine" },
    { naziv: "Novice", pot: "/admin/novice" },
  ]},
  { skupina: "Stiki", povezave: [
    { naziv: "Povpraševanja", pot: "/admin/povprasevanja" },
    { naziv: "Prijave za delo", pot: "/admin/prijave" },
  ]},
  { skupina: "Sistem", povezave: [
    { naziv: "Nastavitve", pot: "/admin/nastavitve" },
  ]},
];

export default async function AdminLayout({ children }) {
  const admin = await trenutniAdmin();
  if (!admin) redirect("/admin/prijava");

  return (
    <div className="adm">
      <aside className="adm-bok">
        <Link className="logo" href="/admin">
          AS<i>system</i> admin
        </Link>
        <nav>
          <Link href="/admin">Nadzorna plošča</Link>
          {meni.map((s) => (
            <div key={s.skupina}>
              <div className="skupina">{s.skupina}</div>
              {s.povezave.map((p) => (
                <Link key={p.pot} href={p.pot}>
                  {p.naziv}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="noga">
          {admin.ime}
          <br />
          <Link href="/" style={{ color: "#c8102e" }}>
            ↗ Poglej stran
          </Link>
          <br />
          <Odjava />
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
