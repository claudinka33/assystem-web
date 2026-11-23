// Dolžine, ki jih pokriva ETA (najmanjša dolžina po premeru). Krajše dolžine dobijo oznako »brez ETA«.
const ETA_MIN_DOLZINA = {
  "jekleno-sidro-txh7": { 8: 75, 10: 75, 12: 90 }, // ETA-21/0597, tabela A1
};

export function brezEta(izdelek, dimenzija) {
  const meje = ETA_MIN_DOLZINA[izdelek?.slug];
  const m = meje && String(dimenzija ?? "").match(/M\s*(\d+)\s*[x×]\s*(\d+)/i);
  if (!m) return false;
  const min = meje[Number(m[1])];
  return min ? Number(m[2]) < min : false;
}

