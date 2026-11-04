import { useEffect, useRef, useState } from "react";
import RefinementForm from "./refinement/RefinementForm";
import RefinementHistory from "./refinement/RefinementHistory";
import RefinementOutput from "./refinement/RefinementOutput";
import { useRefinementHistory } from "./refinement/useRefinementHistory";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(
  /\/+$/,
  "",
);

export function meta() {
  return [
    { title: "RefineAI | AI Text Refinement" },
    {
      name: "description",
      content: "RefineAI helps you transform rough text into polished, professional writing.",
    },
  ];
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [refinedText, setRefinedText] = useState("");
  const [preset, setPreset] = useState("GENERAL");
  const [tone, setTone] = useState("PROFESSIONAL");
  const [length, setLength] = useState("SAME_LENGTH");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const historyButtonRef = useRef(null);
  const history = useRefinementHistory();

  useEffect(() => {
    if (!isHistoryOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsHistoryOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      historyButtonRef.current?.focus();
    };
  }, [isHistoryOpen]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const prompt = inputText.trim();
    setErrorMessage("");
    setIsCopied(false);

    if (!prompt) {
      setErrorMessage("Enter some text before refining.");
      return;
    }

    setIsLoading(true);
    setRefinedText("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/groq/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          preset,
          tone,
          length,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.errorMessage || `Server responded with status ${response.status}`);
      }

      if (typeof payload.refinedText !== "string" || !payload.refinedText.trim()) {
        throw new Error("The AI returned an empty result. Please try again.");
      }

      setRefinedText(payload.refinedText);
      history.addEntry({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        input: prompt,
        output: payload.refinedText,
        preset,
        tone,
        length,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onCopyResult = async () => {
    if (!refinedText) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(refinedText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = refinedText;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setErrorMessage("");
    } catch {
      setErrorMessage("Unable to copy right now. Please try again.");
    }
  };

  return (
    <main className="refine-shell">
      <section className="refine-wrap">
        <header className="refine-header">
          <div className="header-top-row">
            <span aria-hidden="true" />
            <div className="badge-glow">
              <span className="status-dot" />
              AI-Powered Text Refinement
            </div>
            <button
              ref={historyButtonRef}
              type="button"
              className="secondary-button history-open-button"
              onClick={() => setIsHistoryOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isHistoryOpen}
            >
              Recent history
              {history.entries.length ? <span className="history-count">{history.entries.length}</span> : null}
            </button>
          </div>
          <h1 className="refine-title">RefineAI</h1>
          <p className="refine-subtitle">
            Turn rough drafts into clear, professional writing with a single click.
          </p>
        </header>

        <RefinementForm
          inputText={inputText}
          setInputText={setInputText}
          preset={preset}
          setPreset={setPreset}
          tone={tone}
          setTone={setTone}
          length={length}
          setLength={setLength}
          isLoading={isLoading}
          isHistoryReady={history.isReady}
          errorMessage={errorMessage}
          onClear={() => setInputText("")}
          onSubmit={onSubmit}
        />

        <RefinementOutput
          refinedText={refinedText}
          isLoading={isLoading}
          isCopied={isCopied}
          onCopy={onCopyResult}
        />
      </section>
      {isHistoryOpen ? (
        <RefinementHistory
          entries={history.entries}
          errorMessage={history.errorMessage}
          onRemove={history.removeEntry}
          onClear={history.clearHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      ) : null}
    </main>
  );
}
