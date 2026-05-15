import React from "react";
import { PRACTICES } from "@site/src/data/golden-path";
import RecipeRow from "./RecipeRow";
import styles from "./RecipeList.module.css";

export default function RecipeList() {
  return (
    <ol className={styles.list}>
      {PRACTICES.map((practice, index) => (
        <RecipeRow key={practice.id} practice={practice} index={index} />
      ))}
    </ol>
  );
}
