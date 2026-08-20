import { useState } from "react";
import flowchart from "./data/flowchart.json";
import foodIndexData from "./data/food_index.json";
import QuestionCard from "./components/QuestionCard";
import FinalAnswer from "./components/FinalAnswer";
import Breadcrumb from "./components/Breadcrumb";
import SearchScreen from "./components/SearchScreen";
import "./App.css";

const START_NODE = flowchart._meta.startNode;
const SEARCH_SENTINEL = "__search__";

function App() {
  const [mode, setMode] = useState("search"); // "search" | "flow"
  const [currentId, setCurrentId] = useState(null);
  const [trail, setTrail] = useState([]);
  const [lang, setLang] = useState("en");
  const [followupNote, setFollowupNote] = useState(null);

  const node = currentId ? flowchart.nodes[currentId] : null;

  function handleSelectFood(entry) {
    const target = flowchart.nodes[entry.resolves_to];
    setTrail([
      {
        fromNodeId: SEARCH_SENTINEL,
        optionLabel: entry.name,
        optionLabelHe: entry.name,
        next: entry.resolves_to,
      },
    ]);
    setCurrentId(entry.resolves_to);
    setFollowupNote(target.is_final ? null : entry.needs_followup_note || null);
    setMode("flow");
  }

  function handleBrowse() {
    setTrail([]);
    setCurrentId(START_NODE);
    setFollowupNote(null);
    setMode("flow");
  }

  function handleBackToSearch() {
    setMode("search");
    setCurrentId(null);
    setTrail([]);
    setFollowupNote(null);
  }

  function handleAnswer(option) {
    setTrail([
      ...trail,
      {
        fromNodeId: currentId,
        optionLabel: option.label,
        optionLabelHe: option.label_he,
        next: option.next,
      },
    ]);
    setCurrentId(option.next);
    setFollowupNote(null);
  }

  function handleJump(index) {
    const step = trail[index];
    if (step.fromNodeId === SEARCH_SENTINEL) {
      handleBackToSearch();
      return;
    }
    setTrail(trail.slice(0, index));
    setCurrentId(step.fromNodeId);
  }

  function handleBack() {
    if (trail.length === 0) return;
    handleJump(trail.length - 1);
  }

  return (
    <div className="app-shell" dir={lang === "he" ? "rtl" : "ltr"}>
      <header className="app-header">
        <h1 onClick={handleBackToSearch} className="app-title" role="button" tabIndex={0}>
          {lang === "he" ? "איזו ברכה?" : "Which Bracha?"}
        </h1>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === "he" ? "active" : ""}
            onClick={() => setLang("he")}
          >
            עברית
          </button>
        </div>
      </header>

      {mode === "search" ? (
        <main className="app-main">
          <SearchScreen
            lang={lang}
            foodIndex={foodIndexData.food_index}
            onSelectFood={handleSelectFood}
            onBrowse={handleBrowse}
          />
        </main>
      ) : (
        <>
          <Breadcrumb trail={trail} lang={lang} onJump={handleJump} />

          <main className="app-main">
            {node.is_final ? (
              <FinalAnswer
                node={node}
                lang={lang}
                onStartOver={handleBackToSearch}
                onBack={handleBack}
              />
            ) : (
              <>
                {followupNote && (
                  <p className={"followup-note " + (lang === "he" ? "rtl" : "")}>
                    {followupNote}
                  </p>
                )}
                <QuestionCard node={node} lang={lang} onAnswer={handleAnswer} />
                <button type="button" className="secondary-btn back-link" onClick={handleBack}>
                  {lang === "he" ? "‹ חזור" : "‹ Back"}
                </button>
              </>
            )}
          </main>
        </>
      )}

      <footer className="app-footer">
        <button type="button" className="text-btn" onClick={handleBackToSearch}>
          {lang === "he" ? "חפש שוב" : "Search again"}
        </button>
      </footer>
    </div>
  );
}

export default App;
