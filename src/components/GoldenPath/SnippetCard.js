import React, { useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import styles from "./SnippetCard.module.css";

export default function SnippetCard({ snippet, tone = "good" }) {
  const toneClass = tone === "bad" ? styles.bad : styles.good;

  if (snippet.kind === "list") {
    return (
      <div className={`${styles.card} ${toneClass}`}>
        <div className={styles.header}>
          <span className={styles.toneIcon} aria-hidden="true">
            {tone === "bad" ? "✕" : "◆"}
          </span>
          <span className={styles.toneLabel}>
            {tone === "bad" ? "Ikke sånn" : "Gjør sånn"}
          </span>
        </div>
        <ul className={styles.checklist}>
          {snippet.items.map((item, index) => (
            <li key={`${item}-${index}`}>
              <span className={styles.tick} aria-hidden="true">
                {tone === "bad" ? "✕" : "✓"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (snippet.kind === "tabs") {
    return (
      <TabbedSnippet snippet={snippet} toneClass={toneClass} tone={tone} />
    );
  }

  return (
    <div className={`${styles.card} ${toneClass}`}>
      <div className={styles.header}>
        <span className={styles.toneIcon} aria-hidden="true">
          {tone === "bad" ? "✕" : "◆"}
        </span>
        <span className={styles.file}>{snippet.file}</span>
        <span className={styles.toneLabel}>
          {tone === "bad" ? "Ikke sånn" : "Gjør sånn"}
        </span>
      </div>
      <CodeBlock language={snippet.lang || "text"} className={styles.code}>
        {snippet.code}
      </CodeBlock>
    </div>
  );
}

function TabbedSnippet({ snippet, toneClass, tone }) {
  const [active, setActive] = useState(0);
  const tab = snippet.tabs[active];

  return (
    <div className={`${styles.card} ${toneClass}`}>
      <div className={styles.header}>
        <span className={styles.toneIcon} aria-hidden="true">
          {tone === "bad" ? "✕" : "◆"}
        </span>
        <div className={styles.tabs} role="tablist">
          {snippet.tabs.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={`${styles.tab} ${index === active ? styles.tabActive : ""}`}
              onClick={() => setActive(index)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <span className={styles.file}>{tab.file}</span>
      </div>
      <CodeBlock language={tab.lang || "text"} className={styles.code}>
        {tab.code}
      </CodeBlock>
    </div>
  );
}
