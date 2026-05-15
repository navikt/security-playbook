import React from "react";
import styles from "./CategoryChip.module.css";

export default function CategoryChip({ cat }) {
  const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <span className={`${styles.chip} gp-chip gp-chip--${slug}`}>{cat}</span>
  );
}
