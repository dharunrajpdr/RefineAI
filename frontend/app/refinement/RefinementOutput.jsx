export default function RefinementOutput({ refinedText, isLoading, isCopied, onCopy, onDownload }) {
  return (
    <section className="result-card" aria-live="polite">
      <h2 className="field-label">Refined output</h2>

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
          <div className="output-actions">
            <button type="button" className="copy-button" onClick={onCopy}>
              {isCopied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="copy-button download-button" onClick={onDownload}>
              Download
            </button>
          </div>
          <p>{refinedText}</p>
        </article>
      ) : (
        <div className="result-empty">Your refined text will appear here.</div>
      )}
    </section>
  );
}
