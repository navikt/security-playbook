import React, { useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import kategorier from "./kategorier.json";
import styles from "./egenvurdering.module.css";

const EgenvurderingHeader = () => {
  return (
    <header className={styles.header}>
      <h1>Egenvurdering</h1>
      <p>
        Tagline som beskriver hva egenvurderingen skal hjelpe med.{" "}
        <b>
          Dette er en veldig tidlig versjon, og alt bør tas med en stor klype
          salt :)
        </b>
      </p>
    </header>
  );
};

export const Egenvurdering = ({ kategorier }) => {
  const [svar, setSvar] = useState({});

  function alternativValgt(e) {
    const { name, value } = e.target;
    const poeng = parseInt(value, 10);
    setSvar({ ...svar, [name]: poeng });
  }

  function beregnVurderingstekst(poeng) {
    if (poeng <= 0) return "helt elendig";
    if (poeng < 20) return "veldig dårlig";
    if (poeng < 40) return "dårlig";
    if (poeng < 80) return "helt passe";
    if (poeng < 120) return "bra";
    return "veldig bra";
  }

  function svarEmoji(poeng) {
    if (typeof poeng === "undefined") return "";

    if (poeng <= -20) return "😱";
    if (poeng <= -10) return "🙁";
    if (poeng === 0) return "🙂";
    if (poeng <= 10) return "😁";
    return "🤩";
  }

  const totaltAntallPoeng = Object.values(svar).reduce(
    (acc, val) => acc + val,
    0
  );
  const vurderingstekst = beregnVurderingstekst(totaltAntallPoeng);

  return (
    <main className={styles.egenvurdering}>
      <div className={styles.skjema}>
        {kategorier.map((kategori, katIndex) => (
          <section key={katIndex}>
            <h2>
              {kategori.tittel} {svarEmoji(svar["kategori_" + katIndex])}
            </h2>
            <ul
              style={{
                listStyle: "none",
              }}
            >
              {kategori.alternativer.map((alternativ, altIndex) => (
                <li key={altIndex}>
                  <label>
                    <input
                      type="radio"
                      name={"kategori_" + katIndex}
                      value={alternativ.poeng}
                      onChange={alternativValgt}
                    />{" "}
                    {alternativ.valg}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {Object.values(svar).length === 0 ? null : (
        <div className={styles.resultat}>
          <h2>Resultat</h2>
          <h3>
            Poeng: {Object.values(svar).map(svarEmoji).join(" + ")} ={" "}
            {totaltAntallPoeng}
          </h3>
          <p>Teamet ditt gjør det {vurderingstekst}!</p>
        </div>
      )}
    </main>
  );
};

export default function EgenvurderingPage() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Egenvurdering | ${siteConfig.title}`}
      description="Egenvurdering av teamets sikkerhetsmodenhet"
    >
      <div className={styles.page}>
        <EgenvurderingHeader />
        <Egenvurdering kategorier={kategorier} />
      </div>
    </Layout>
  );
}
