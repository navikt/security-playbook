import React from "react";
import Link from "@docusaurus/Link";
import CategoryChip from "./CategoryChip";
import SnippetCard from "./SnippetCard";
import styles from "./RecipeRow.module.css";

export default function RecipeRow({ practice, index }) {
  const { short, why, cat, href, action, antiPattern } = practice;

  return (
    <li className={styles.row}>
      <span className={styles.num} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className={styles.body}>
        <h3 className={styles.short}>{short}</h3>
        <p className={styles.why}>{why}</p>
        <CategoryChip cat={cat} />
      </div>

      <div className={styles.snippets}>
        <SnippetCard snippet={action} tone="good" />
        {antiPattern ? <SnippetCard snippet={antiPattern} tone="bad" /> : null}
      </div>

      <Link
        to={href}
        className={styles.arrow}
        aria-label={`Les mer om ${short}`}
      >
        <span className={styles.arrowLabel}>Les mer</span>
        <span className={styles.arrowIcon} aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  );
}
