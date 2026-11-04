const presetDefaults = {
  GENERAL: { tone: "PROFESSIONAL", length: "SAME_LENGTH" },
  PROFESSIONAL_MESSAGE: { tone: "PROFESSIONAL", length: "SAME_LENGTH" },
  ACADEMIC_WRITING: { tone: "PROFESSIONAL", length: "SAME_LENGTH" },
};

const presets = [
  ["GENERAL", "General refinement"],
  ["PROFESSIONAL_MESSAGE", "Professional message"],
  ["ACADEMIC_WRITING", "Academic writing"],
];

export default function RefinementForm({
  inputText,
  setInputText,
  preset,
  setPreset,
  tone,
  setTone,
  length,
  setLength,
  isLoading,
  isHistoryReady,
  errorMessage,
  onClear,
  onSubmit,
}) {
  const onPresetChange = (event) => {
    const nextPreset = event.target.value;
    setPreset(nextPreset);
    setTone(presetDefaults[nextPreset].tone);
    setLength(presetDefaults[nextPreset].length);
  };

  return (
    <form className="refine-card" onSubmit={onSubmit}>
      <label htmlFor="rawText" className="field-label">Your text</label>

      <div className="refinement-options">
        <div>
          <label htmlFor="preset" className="control-label">Writing preset</label>
          <select id="preset" className="refine-select" value={preset} onChange={onPresetChange} disabled={isLoading}>
            {presets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="control-label">Tone</label>
          <select id="tone" className="refine-select" value={tone} onChange={(event) => setTone(event.target.value)} disabled={isLoading}>
            <option value="PROFESSIONAL">Professional</option>
            <option value="FRIENDLY">Friendly</option>
          </select>
        </div>
        <div>
          <label htmlFor="length" className="control-label">Length</label>
          <select id="length" className="refine-select" value={length} onChange={(event) => setLength(event.target.value)} disabled={isLoading}>
            <option value="SAME_LENGTH">Same length</option>
            <option value="SHORTEN">Shorten</option>
          </select>
        </div>
      </div>

      <textarea
        id="rawText"
        className="refine-textarea"
        placeholder="Paste or type your text here..."
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        disabled={isLoading}
        rows={4}
      />

      <div className="action-row">
        <button type="button" className="secondary-button" onClick={onClear} disabled={isLoading || !inputText}>
          Clear input
        </button>
        <button type="submit" className="refine-button" disabled={isLoading || !isHistoryReady}>
          {isLoading ? "Refining..." : "Refine"}
        </button>
      </div>

      {errorMessage ? <p className="feedback feedback-error" role="alert">{errorMessage}</p> : null}
    </form>
  );
}
