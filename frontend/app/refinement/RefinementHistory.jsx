function formatPreset(value) {
  return value.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export default function RefinementHistory({ entries, errorMessage, onRemove, onClear, onClose }) {
  return (
    <div
      className="history-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-heading"
      >
        <div className="history-heading-row">
          <h2 id="history-heading" className="field-label">
            Recent history <span className="helper-text">· up to 20 on this browser</span>
          </h2>
          <div className="history-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClear}
              disabled={!entries.length && !errorMessage}
            >
              Clear all
            </button>
            <button
              type="button"
              className="secondary-button history-close-button"
              onClick={onClose}
              aria-label="Close recent history"
              autoFocus
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>

        <div className="history-modal-content">
          {errorMessage ? <p className="feedback feedback-error" role="alert">{errorMessage}</p> : null}
          {entries.length ? (
            <ul className="history-list">
              {entries.map((entry) => (
                <li className="history-item" key={entry.id}>
                  <div className="history-copy">
                    <p className="history-output">{entry.output}</p>
                    <details>
                      <summary>View original text</summary>
                      <p className="history-input">{entry.input}</p>
                    </details>
                    <small className="history-meta">
                      {formatPreset(entry.preset)} · {new Date(entry.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="secondary-button history-delete"
                    onClick={() => onRemove(entry.id)}
                    aria-label="Delete refinement from history"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="result-empty">Successful refinements will be saved here on this browser.</div>
          )}
        </div>
      </section>
    </div>
  );
}
