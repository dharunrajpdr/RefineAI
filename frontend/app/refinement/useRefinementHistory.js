import { useEffect, useState } from "react";

const storageKey = "refineai-history";
const historyLimit = 20;

export function useRefinementHistory() {
  const [entries, setEntries] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          throw new Error("Saved history has an invalid format.");
        }
        const validEntries = parsed.filter((entry) =>
          entry &&
          typeof entry.id === "string" &&
          typeof entry.input === "string" &&
          typeof entry.output === "string" &&
          typeof entry.preset === "string" &&
          typeof entry.createdAt === "string",
        );
        if (validEntries.length !== parsed.length) {
          setLoadError("Some saved history entries were invalid and could not be loaded.");
        }
        setEntries(validEntries.slice(0, historyLimit));
      }
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load saved history.",
      );
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(entries.slice(0, historyLimit)));
      setSaveError("");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save refinement history.",
      );
    }
  }, [entries, isReady]);

  const addEntry = (entry) => {
    setEntries((current) => [entry, ...current].slice(0, historyLimit));
  };

  const removeEntry = (id) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const clearHistory = () => {
    setEntries([]);
    setLoadError("");
    setSaveError("");
  };

  return {
    entries,
    isReady,
    errorMessage: loadError || saveError,
    addEntry,
    removeEntry,
    clearHistory,
  };
}
