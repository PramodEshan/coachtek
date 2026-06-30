export function ProgramAddCard({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="ct-program-card ct-program-card-add ct-press" onClick={onClick}>
      <div className="ct-program-card-media ct-program-card-add-media">
        <span className="ct-program-card-add-icon" aria-hidden>
          +
        </span>
      </div>
      <div className="ct-program-card-body ct-program-card-add-body">
        <span className="ct-program-card-add-title">New program</span>
        <span className="ct-program-card-add-sub">Create a template</span>
      </div>
    </button>
  );
}
