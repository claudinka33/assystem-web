import PrijavaObrazec from "./PrijavaObrazec";

export default function Prijava() {
  return (
    <div className="prijava">
      <div className="box">
        <img className="prijava-logo" src="/logo-as-system.png" alt="AS system" />
        <h1>Administracija</h1>
        <p className="pod">Prijava za urejanje spletne strani assystem.si.</p>
        <PrijavaObrazec />
        <p className="prijava-noga">Dostop imajo samo pooblaščeni uredniki.</p>
      </div>
    </div>
  );
}
