import { useMemo, useState } from "react";

function matches(entry, query) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  if (entry.name.toLowerCase().includes(q)) return true;
  return (entry.aliases || []).some((a) => a.toLowerCase().includes(q));
}

export default function SearchScreen({ lang, foodIndex, onSelectFood, onBrowse }) {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return foodIndex.filter((entry) => matches(entry, query)).slice(0, 8);
  }, [query, foodIndex]);

  return (
    <div className="search-screen">
      <h2 className={"search-prompt " + (lang === "he" ? "rtl" : "")}>
        {lang === "he" ? "מה אתה אוכל?" : "What are you eating?"}
      </h2>

      <input
        type="text"
        className={"search-input " + (lang === "he" ? "rtl" : "")}
        placeholder={lang === "he" ? "התחל להקליד..." : "Start typing..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {query.trim() && (
        <div className="search-suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((entry) => (
              <button
                key={entry.name}
                type="button"
                className="suggestion-btn"
                onClick={() => onSelectFood(entry)}
              >
                <span className={lang === "he" ? "rtl" : ""}>{entry.name}</span>
                {entry.needs_followup_note && (
                  <span className="suggestion-hint">
                    {lang === "he" ? "יש שאלת המשך" : "needs a follow-up question"}
                  </span>
                )}
              </button>
            ))
          ) : (
            <p className={"no-results " + (lang === "he" ? "rtl" : "")}>
              {lang === "he"
                ? "לא נמצא — נסה לעיין בקטגוריות במקום."
                : "No matches — try browsing categories instead."}
            </p>
          )}
        </div>
      )}

      <button type="button" className="browse-link" onClick={onBrowse}>
        {lang === "he" ? "או עיין בקטגוריות" : "or browse categories"}
      </button>
    </div>
  );
}
