---
title: Auditlogging av databaseendringer
description: Endringer er bra, så lenge man vet hvem som gjorde hva 🔎.
---

## Hvorfor auditlogge databaseendringer ?

Auditlogging av økonomisystemer er et krav i [statens økonomireglement](https://www.regjeringen.no/globalassets/upload/fin/vedlegg/okstyring/reglement_for_okonomistyring_i_staten.pdf) (§ 4.3.6). Endringer i databaser som inngår i økonomisystem skal auditlogges med personlig identifikasjon, dato og klokkeslett for handlingen, som beskrevet i [Støtte til etterlevelse](https://etterlevelse.ansatt.nav.no/krav/125/2). Loggene skal kunne brukes til revisjon.

## Hvem skal auditlogge databaseendringer ?

I økonomisystemer skal databaseendringer som er utført av personer, utenom applikasjonens normale brukergrensesnitt, auditlogges. Databasebrukere som benyttes for å gjøre endringer direkte i databaser skal være personlige eller mulig å knytte til person. Tilkoblingslogger, som pålogginger i databasene, skal ikke skrives til akkurat denne auditloggløsningen.

## Skal alle databaseendringer auditlogges ?

Endringer som gjøres via vanlige brukergrensesnitt i fagsystemener skal ikke skrives til auditlogg, men heller lagres som sporingsinformasjon i det enkelte fagsystemet. For eksempel skal vedtak inneholde informasjonen om hvem som har fattet vedtaket og når.


## Teknisk løsning

Digital Sikkerhet og Nais jobber med å sette opp en ny teknisk løsning for innsamling og lagring av logger. Denne skal kunne brukes for de ulike databaseteknologiene vi har i Nav. Løsningen bruker Google Cloud Logging for logger teamene trenger rask og enkel tilgang til, og Google Cloud Storage for arkiv. For å sette opp auditlogging av databaseendringer for PostgreSQL GCP, se [Nais dokumentasjon om auditlogging](https://doc.nais.io/persistence/cloudsql/how-to/enable-auditing/). Husk at parametre skal logges.

Frem til den nye løsningen er klar for on-prem teknologier, må logging utføres i henhold til eksisterende regime. Dette beskrives på teknologiavdelingen sine sider på Navet.

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
