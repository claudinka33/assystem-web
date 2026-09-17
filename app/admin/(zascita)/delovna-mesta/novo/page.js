import DelovnoMestoObrazec from "../DelovnoMestoObrazec";

export default function NovoDelovnoMesto() {
  return (
    <>
      <div className="adm-glava">
        <h1>Novo delovno mesto</h1>
      </div>
      <div className="adm-telo">
        <DelovnoMestoObrazec />
      </div>
    </>
  );
}
