---
title: Golden Path 📣
description: Beskrivelse av hva er navs golden path og hva er golden path.
hide_table_of_contents: true
---

Golden Path er en samling av oppgaver med nyttige tiltak et team kan implementere for å bedre sikkerheten sin.
De er satt opp i prioritert rekkefølge sånn at man kan komme raskt i gang.

- Bruk [Nais doc](https://doc.nais.io/) og anbefalingene som gis. Appen skal være mest mulig lik standardinnstillingene i Nais. Autentisering og autorisering er særlig viktig.
- Sett opp [overvåking og alarmer](https://doc.nais.io/observability/) for appene dine sånn at du oppdager oppførsel som avviker fra normalen.
- Pass på at du har kontroll på [hemmelighetene](/docs/sikker-utvikling/hemmeligheter) som appene dine benytter. ALDRI kopier ut hemmeligheter fra produksjonsmiljøet til egen PC.
- Sett opp scanningverktøy for å fange opp eksisterende og fremtidige lavthengende frukt
  - [Dependabot](/docs/verktoy/dependabot) for avhengigheter, patche regelmessig.
  - [Statisk analyse](/docs/sikker-utvikling/kodeanalyse) av koden din og fiks det den oppdager.
  - [Docker image scan](/docs/verktoy/trivy). Det kan ha sneket seg med andre sårbarheter eller hemmeligheter du ikke er klar over.
  - Det er lurt å legge til en [scheduled trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) i dine workflows. Det er fordi det kan dukke opp nye sårbarheter selv når dere ikke gjør kodeendringer.
- Bruk Docker baseimages fra [Chainguard](https://github.com/chainguard-images) eller [Google](https://github.com/GoogleContainerTools/distroless). Mer info og eksempler er det her: [Chainguard baseimages](/docs/verktoy/chainguard-dockerimages)
- Bygg imagene dine vha. [docker-build-push](https://doc.nais.io/build/), og ikke skru av generering og opplasting sv SBOM (parametrene `byosbom` og `salsa`).
- [Valider all input](/docs/sikker-utvikling/inputvalidering). Ikke stol på data som kommer inn uavhengig av hvor det kommer fra.
- Ha kontroll på [loggene](/docs/sikker-utvikling/logging). Pass på at dere ikke logger sensitiv informasjon (f.eks. FNR/Jwt tokens) til standardloggene.
- Sikre maskin til maskin-kommunikasjonen din med [OAuth](/docs/sikker-utvikling/m2m), ikke bruk servicebrukere og "STS'en"

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
<SavnerDuNoe />
```
