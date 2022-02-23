import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Golden Path",
    Svg: require("../../static/img/road.svg").default,
    description: (
      <>
        Security Champions Playbook følger <i>"Golden Path"</i> prinsipet. Å
        følge playbooken er ikke et krav, men den representerer hvordan{" "}
        <b>Utvikling og Data</b> ønsker å bygge sikker software.
      </>
    ),
  },
  {
    title: "Tillit",
    Svg: require("../../static/img/honesty.svg").default,
    description: (
      <>
        Vi i NAV har tillit til hverandre og vi har forståelse for at ikke alle
        starter fra likt utgangspunkt.
      </>
    ),
  },
  {
    title: "Delingskultur",
    Svg: require("../../static/img/high-five.svg").default,
    description: (
      <>
        Denne playbooken er bare så god som bidragene til den er. Det forventes
        at alle som tar i bruk playbooken også er med og bidrar.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
