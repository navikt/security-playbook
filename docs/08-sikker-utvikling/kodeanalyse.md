---
title: Statisk kodeanalyse
description: 🤖 Du trenger ikke myse med statisk kodeanalyse.
---

Statisk analyse (<abbr title="Static Application Securiy Testing">SAST</abbr>) kan være nyttig for å oppdage feil i egen kode.
Slike verktøy kan oppdage en rekke sårbarheter som er lavthengende, men som likevel ofte er lett å introdusere. For eksempel:

- Injisering: ikke verifisert eller usanert input puttes rett inn i databasespørringer istedenfor at det benyttes parameteriserte spørringer
- Logiske feil
  - if-statements som alltid gir samme resultat
  - manglende autentiseringssjekk på et eksponert API-endepunkt

Slike statiske skanninger er raske i og med at de utføres rett på kildekoden, og trenger ikke tilgang til en instans av en kjørende app. De egner seg derfor for hyppig kjøring, f.eks. som en del av bygg-og-deploy pipelines på GitHub.

Ulempen med SAST-verktøy er at de kun kan identifisere et svært begrenset sett av feil, og siden de ikke har konteksten til en kjørende app (med bl.a. konfigurasjon) kan de produsere mange tilfeller av falsk positive resultater.

## Verktøy

Det finnes flere mulige verktøy, men Nav tilbyr [GitHub Advanced Security](/docs/verktoy/github-advanced-security) som blant annet har [CodeQL](/docs/verktoy/github-advanced-security#codeql-statisk-kodeanalyse), og [zizmor (Github Actions scanner)](/docs/verktoy/zizmor). I GitHub kan man integrere en rekke andre SAST-verktøy. Hos [OWASP](https://owasp.org/www-community/Source_Code_Analysis_Tools) finner man en liste med andre verktøy man kan teste.

:::tip AI-assistert kodeanalyse
[GitHub Copilot sikkerhetsverktøy](/docs/verktoy/github-copilot) gir deg `@security-champion`-agenten, som finner sikkerhetsproblemer mens du koder. OWASP Top 10-instruksjoner aktiveres automatisk for Kotlin- og Go-filer. Se [oppsett og bruk](/docs/verktoy/github-copilot#kom-i-gang).
:::

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
