export default function RefinementOutput({ refinedText, isLoading, isCopied, onCopy }) {
  return (
    <section className="result-card" aria-live="polite">
      <div className="output-heading-row">
        <h2 className="field-label">Refined output</h2>
        <button
          type="button"
          className="copy-button"
          onClick={onCopy}
          disabled={!refinedText || isLoading}
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>

      {isLoading ? (
        <div className="loader-panel" role="status" aria-label="Refining text">
          <div className="spinner" />
          <div className="skeleton-group">
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-wide" />
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-short" />
          </div>
        </div>
      ) : refinedText ? (
        <article className="result-content">
          <p>{refinedText}</p>
        </article>
      ) : (
        <div className="result-empty">Your refined text will appear here.</div>
      )}
    </section>
  );
}
