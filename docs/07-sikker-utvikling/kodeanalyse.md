---
title: Statisk kodeanalyse
description: 🤖 Du trenger ikke myse med statisk kodeanalyse
---

[‹ tilbake til temaoversikt](/docs/sikker-utvikling)

Statisk analyse (<abbr title="Static Application Securiy Testing">SAST</abbr>) kan være nyttig for å oppdage feil i egen kode.
Slike verktøy kan oppdage en rekke sårbarheter som er lavthengende, men som likevel ofte er lett å introdusere. For eksempel:

- Injisering: ikke verifisert eller usanert input puttes rett inn i databasespørringer istedenfor at det benyttes parameteriserte spørringer
- Logiske feil
  - if-statements som alltid gir samme resultat
  - manglende autentiseringssjekk på et eksponert API-endepunkt

Slike statiske skanninger er raske i og med at de utføres rett på kildekoden, og trenger ikke tilgang til en instans av en kjørende app. De egner seg derfor for hyppig kjøring, f.eks. som en del av bygg-og-deploy pipelines på GitHub.

Ulempen med SAST-verktøy er at de kun kan identifisere et svært begrenset sett av feil, og siden de ikke har konteksten til en kjørende app (med bl.a. konfigurasjon) kan de produsere mange tilfeller av falsk positive resultater.

[GitHub Security](https://github.com/features/security) gir deg tilgang til å integrere mot en rekke SAST-verktøy. Hos [OWASP](https://owasp.org/www-community/Source_Code_Analysis_Tools) finner man en liste med andre verktøy man kan teste.

![GitHub code scanning](/img/dependabot.png "GitHub Security")

## GitHub Advanced Security

GitHub tilbyr gratis bruk av [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) for alle åpne (public) repoer. Dette er nok en god grunn til å åpne opp kildekoden hvis dette ikke allerede er gjort.

Statisk kodeanalyse med [CodeQL](https://github.com/github/codeql) kan derfor aktiveres fra «Security»-fanen på GitHub.

## Snyk Code

For team som allerede bruker [Snyk](/docs/sikker-utvikling/tredjepartskode#snyk) til scanning av tredjepartskode, kan [«Snyk code»](https://snyk.io/product/snyk-code/) enkelt skrus på for å tilby statisk kodeanalyse:

1. Gå til «Org Settings» (tannhjulet øverst til høyre) → «Snyk Code»
2. Aktiver Snyk Code for organisasjonen din (Snyk bruker ordet "Org" for det vi forstår som "Team")
3. Re-importer alle prosjekter

Snyk Code vil nå analysere og rapportere om potensielle sårbarhetere i applikasjonskoden selv, og ikke bare fra tredjepartskode.

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
