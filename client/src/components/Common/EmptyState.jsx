import "./EmptyState.css";

function EmptyState({
  title,
  subtitle,
  buttonText,
  onClick,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🍔</div>

      <h2>{title}</h2>

      <p>{subtitle}</p>

      {buttonText && (
        <button onClick={onClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;