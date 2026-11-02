// Kdo je administrator — skupno za proxy.js in strežnik.
// sb = odjemalec s tajnim ključem, user = prijavljeni Supabase uporabnik.

function izMicrosofta(user) {
  return (
    (user?.identities ?? []).some((i) => i.provider === "azure") ||
    (user?.app_metadata?.providers ?? []).includes("azure") ||
    user?.app_metadata?.provider === "azure"
  );
}

export async function poisciAdmina(sb, user) {
  if (!user) return null;
  const stolpci = "id, email, ime, vloga";

  // 1) polni admin, prijavljen z geslom (kot doslej)
  const { data: poId } = await sb.from("admin_uporabniki").select(stolpci).eq("id", user.id).maybeSingle();
  if (poId) return { ...poId, dovoljenja: null };

  // Po e-naslovu ujemamo SAMO Microsoft prijave (tenant as-system.si) —
  // nihče si ne more z registracijo v trgovini "izposoditi" e-naslova admina.
  if (!izMicrosofta(user)) return null;
  const email = String(user.email || "").toLowerCase();
  if (!email) return null;

  // 2) polni admin, prijavljen z Microsoftom
  const { data: polni } = await sb.from("admin_uporabniki").select(stolpci).ilike("email", email).limit(1).maybeSingle();
  if (polni) return { ...polni, id: user.id, dovoljenja: null };

  // 3) zaposleni z omejenim dostopom
  const { data: d } = await sb
    .from("admin_dostopi")
    .select("email, ime, dovoljenja, aktiven")
    .eq("email", email)
    .maybeSingle();
  if (!d || !d.aktiven) return null;

  return {
    id: user.id,
    email,
    ime: d.ime || user.user_metadata?.full_name || user.user_metadata?.name || email,
    vloga: "urednik",
    dovoljenja: Array.isArray(d.dovoljenja) ? d.dovoljenja : [],
  };
}
