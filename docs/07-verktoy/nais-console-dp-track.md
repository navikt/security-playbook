---
title: NAIS Console & Dependency-Track
description: 🔍 Analyseverktøy for å identifisere og redusere risikoer i programvaren din.
tags:
  - tredjepartskode
  - containere
  - sårbarheter
---

**Relevante tema:**

- [Sikkerhet i og rundt containere](../sikker-utvikling/containere)
- [Tredjepartskode](../sikker-utvikling/tredjepartskode)
- [Trivy](./trivy)

## NAIS Console

🌐 [NAIS Console](https://doc.nais.io/operate/console/index.html) er et webbasert grensesnitt som lar brukere administrere og overvåke ressurser på NAIS. Her kan team enkelt finne informasjon om sine applikasjoner, ressursbruk, tilstand og sårbarheter. Dette gir en effektiv måte å holde oversikt over sårbarheter og sikre at teamet tar nødvendige tiltak for å beskytte applikasjonene.

📊 Teamene har også en indikator som viser hvor godt de dekker sårbarheter for alle sine applikasjoner.

🛠️ NAIS Console henter sårbarhetsdata fra [Dependency-Track](#dependency-track), en avansert analyseplattform som hjelper organisasjoner med å identifisere og redusere risikoer i både programvaren de bruker og utvikler.

🖋️ Signering, attestering og skanning av Docker-images er en del av [SLSA-rammeverket](#slsa---supply-chain-levels-for-software-artifacts), og Dependency-Track er et kraftig verktøy som hjelper team med å oppfylle disse kravene. 🚀

Skjermbildet nedenfor er et eksempel på hvordan NAIS Console viser sårbarheter, der _rødt indikerer sårbarheter som må håndteres_, samt en total _risikoscore_ basert på antallet sårbarheter. _Coverage_ viser hvor godt teamet dekker sårbarheter for alle sine applikasjoner.

![shell](/img/console.png "console")

## Dependency-Track

[Dependency-Track fra OWASP](https://dependencytrack.org/)
er en avansert analyseplattform som hjelper organisasjoner med å identifisere og redusere risikoer i både programvaren de bruker og utvikler. Plattformen strukturerer og håndterer en Software Bill of Materials (SBOM), som gir en detaljert oversikt over alle komponentene i programvaren. Dette åpner for muligheter som tradisjonelle analyseverktøy for programvare ofte ikke kan tilby.

![shell](/img/dependencytrack.png "dependencytrack")

### Hva er en Software Bill of Materials (SBOM)?

En [Software Bill of Materials (SBOM)](https://security.cms.gov/learn/software-bill-materials-sbom#what-is-an-sbom) er en liste over alle komponentene i et program. Denne listen gjør det enklere å holde oversikt over hva programmet er bygget av, slik at feil og sikkerhetsproblemer raskere kan identifiseres og rettes opp.

### Hvordan komme igang

For å komme i gang med identifisering av sårbarheter i NAIS Console og Dependency-Track, kan du bruke [nais-docker-build-push](https://github.com/nais/docker-build-push) action for å bygge og signere, eller [nais-attest-sign](https://github.com/nais/docker-build-push) for kun å signere ditt image. Du finner mer informasjon om hvordan du setter dette opp i din workflow i [nais-dokumentasjonen](https://docs.nais.io/services/vulnerabilities/).

## SLSA - Supply Chain Levels for Software Artifacts

[SLSA](https://slsa.dev/) står for Supply Chain Levels for Software Artifacts, og uttales "salsa".
Det er et sikkerhetsrammeverk, i hovedsak en sjekkliste som består av standarder og kontroller med mål om å forhindre manipulasjon, forbedre integriteten, og sikre både pakker og infrastruktur.
Når man arbeider med SLSA og bruker Dependency-Track, kan man få hjelpe med følgende:

🧩 **Identifisere Komponenter og Avhengigheter**

NAIS console i sammarbeid med Dependency-Track gir en detaljert oversikt over alle komponentene og avhengighetene i programvaren til team ved hjelp av Software Bill of Materials (SBOM). Dette hjelper team med å forstå hva programvaren er bygget av, noe som er viktig for å oppfylle SLSA-kravene om å ha oversikt over alle programvarekomponenter.

🛡️ **Forbedre Integritet**

Ved å signere og attestere Docker-images, kan team forbedre integriteten til programvaren. Dependency-Track hjelper team med å oppdage endringer eller potensielle sikkerhetstrusler som kan påvirke integriteten til programvaren.

🏗️ **Sikre Forsyningskjeden**

Dependency-Track bidrar til å sikre forsyningskjeden ved å gi verktøy for å spore og evaluere risikoer knyttet til tredjeparts komponenter, i tråd med SLSA-kravene.
