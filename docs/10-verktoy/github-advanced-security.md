---
title: GitHub Advanced Security
description: Sikkerhetsverktøy fra GitHub
tags:
  - tredjepartskode
  - statisk-kodeanalyse
  - hemmeligheter
---

**Relevante tema:**

- [Statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse)
- [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode)
- [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter)

[GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) er tilgjengelig og aktivert alle repoer under organisasjonene [navikt](https://github.com/navikt) og [nais](https://github.com/nais) på GitHub, og du skal ikke trenge gjøre noe for å kommme i gang.

Alle repoer (med unntak av forks) får automatisk [secret scanning](#secret-scanning) og [Dependabot](./dependabot) aktivert, mens [statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse) med CodeQL må settes opp manuelt for hvert repo. For forks må alt aktiveres manuelt.

:::caution
Selv om Dependabot aktiveres automatisk, kan det hende den ikke plukker opp alle avhengigheter. Se [anbefalt oppskrift](./dependabot) for oppsett.
:::

## CodeQL (statisk kodeanalyse)

Statisk kodeanalyse med [CodeQL](https://github.com/github/codeql) kan aktiveres fra «Security»-fanen på GitHub, eller fra «Settings» -> «Code security and analysis».

![CodeQL setup](/img/codeql-setup.png "«Settings» -> «Code security and analysis» for å se aktivere CodeQL")

Det finnes to typer oppsett av CodeQL: "Default setup" og "Advanced setup".
Vi anbefaler å prøve default setup, siden det er enklest å ta i bruk. Det kan hende at default setup ikke funker for ditt repo - isåfall trenger man advanced setup. Hvis det er noe som ikke funker, så stiller AppSec gladelig opp for å hjelpe!

For advanced setup må man lage en workflow. Her vil oppsettet avhenge av bl.a. hvilke programmeringsspråk som benyttes i repoet, men en typisk workflow for jvm-applikasjoner vil se slik ut:

```yaml
name: "CodeQL"

on:
  push:
    branches: ["main"]
  pull_request:
    # The branches below must be a subset of the branches above
    branches: ["main"]
  schedule:
    - cron: "25 13 * * 1"

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Initializes the CodeQL tools for scanning.
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: java-kotlin
          queries: security-and-quality

      # Autobuild attempts to build any compiled languages  (C/C++, C#, or Java).
      # If this step fails, then you should remove it and run the build manually (see below)
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      #- name: Gradle build
      #  run: ./gradlew build

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:java-kotlin"
```

### Filtrere bort støy

Ett godt tiltak kan vare att filtrere ut severities som skaper veldigt mange forslag om ting som kanskje ikke er direkt knyttet til sikkerhet.
Løses ved å sette opp query-filter i en config-fil. Eks. `codeql-config.yml`

```yaml
name: "CodeQl Config"
query-filters:
  - exclude:
      problem.severity:
        - note
```

Og legg til config-filen i workflowen:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    config-file: codeql-config.yml
```

## Secret Scanning

GitHub vil automatisk plukke opp secrets som committes som en del av koden. Secrets skal holdes utenfor koden, så dette vil stoppes ved push. Les mer om hvordan håndtere hemmeligheter på siden [«Hemmeligheter»](/docs/sikker-utvikling/hemmeligheter).

[Les mer om Secret Scanning hos GitHub.](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

## Dependency review

Dependency review viser hvordan en pull request endrer avhengighetene i prosjektet. Åpne den rike diffen for en manifest- eller lockfil under «Files changed», så ser du:

- hvilke avhengigheter som er lagt til, fjernet eller oppdatert, med datoen for hver release
- hvor mange prosjekter som bruker dem
- kjente sårbarheter i dem

Dette virker uten ekstra oppsett så lenge [dependency graph](/docs/sikker-utvikling/github#dependency-graph) er riktig. [Les mer om dependency review hos GitHub.](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)

Med [dependency-review-action](https://github.com/actions/dependency-review-action) kan du stoppe pull requests som legger til avhengigheter med kjente sårbarheter. Actionen viser også [OpenSSF Scorecard](https://scorecard.dev/)-resultater for de nye avhengighetene. Den trenger ikke å sjekke ut koden.

```yaml
name: Dependency review

on:
  pull_request:

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - name: Dependency review
        uses: actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294 # v5.0.0
        with:
          fail-on-severity: high
```

Legg jobben inn som påkrevd status check i [branch protection eller rulesets](/docs/sikker-utvikling/github#branch-protection), ellers kan pull requesten merges selv om sjekken feiler.

Bruker du [dependency submission for Gradle eller Maven](./dependabot#oppsett-gradle-buildgradlekts--buildgradle), må submission-workflowen også kjøre på `pull_request`. Sett da `retry-on-snapshot-warnings: true` i dependency-review-action, så venter den på at avhengighetene er sendt inn.

## Vanlige feil

Hvis du analyserer en større applikasjon er det ikke uvanlig att gradle går tom for minne, noe som kan økes ved å legge til `kotlin.daemon.jvmargs=-Xmx4096m` i `gradle.properties`.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
