import { redirect } from "next/navigation";
import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";
import AdminMeni from "../AdminMeni";
import NeStej from "../NeStej";
import "../admin.css";

export const metadata = {
  title: "Administracija",
  robots: { index: false, follow: false },
};

async function prestej(tabela, stolpec, vrednost) {
  try {
    const { count } = await supabaseAdmin()
      .from(tabela)
      .select("id", { count: "exact", head: true })
      .eq(stolpec, vrednost);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminLayout({ children }) {
  const admin = await trenutniAdmin();
  if (!admin) redirect("/admin/prijava");

  // Števci ob meniju — kar čaka na odziv.
  const [narocila, b2b, povprasevanja] = await Promise.all([
    prestej("narocila", "status", "novo"),
    prestej("b2b_kupci", "status", "caka_odobritev"),
    prestej("povprasevanja", "status", "novo"),
  ]);

  return (
    <div className="adm">
      <NeStej />
      <AdminMeni ime={admin.ime} stevci={{ narocila, b2b, povprasevanja }} />
      <div className="adm-vsebina">{children}</div>
    </div>
  );
}
