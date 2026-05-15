import React from "react";
import styles from "./IntroNotice.module.css";

export default function IntroNotice() {
  return (
    <div className={styles.notice}>
      <strong className={styles.title}>Slik leser du siden</strong>
      <p className={styles.text}>
        Hver rad viser <strong>gjør sånn</strong>, og der det hjelper{" "}
        <strong>ikke sånn</strong>. Bruk <strong>Les mer</strong>-lenken for
        bakgrunn, begrunnelser og varianter.
      </p>
    </div>
  );
}
