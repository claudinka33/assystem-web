// Takojšen odziv ob kliku na povezavo: tanek trak na vrhu, dokler se stran ne naloži.
export default function Nalaganje() {
  return (
    <div className="nal-stran" aria-busy="true" aria-live="polite">
      <span className="nal-trak" />
    </div>
  );
}
