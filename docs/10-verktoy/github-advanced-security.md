---
title: GitHub Advanced Security
description: Sikkerhetsverktøy fra GitHub
tags:
  - tredjepartskode
  - statisk-kodeanalyse
  - hemmeligheter
---

**Relevante tema:**

- [Statisk kodeanalyse](../sikker-utvikling/kodeanalyse)
- [Tredjepartskode](../sikker-utvikling/tredjepartskode)
- [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter)

[GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) er tilgjengelig og aktivert alle repoer under organisasjonene [navikt](https://github.com/navikt) og [nais](https://github.com/nais) på GitHub, og du skal ikke trenge gjøre noe for å kommme i gang.

Alle repoer (med unntak av forks) får automatisk [secret scanning](#secret-scanning) og [Dependabot](./dependabot) aktivert, mens [statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse) med CodeQL må settes opp manuelt for hvert repo. For forks må alt aktiveres manuelt.

:::caution
Selv om Dependabot aktiveres automatisk, kan det hende den ikke plukker opp alle avhengigheter. Se [anbefalt oppskrift](./dependabot) for oppsett.
:::

## CodeQL (statisk kodeanalyse)

Statisk kodeanalyse med [CodeQL](https://github.com/github/codeql) kan aktiveres fra «Security»-fanen på GitHub, eller fra «Settings» -> «Code security and analysis».

![CodeQL setup](/img/codeql-setup.png "«Settings» -> «Code security and analysis» for å se aktivere CodeQL")

Oppsettet avhenger av bl.a. hvilke programmeringsspråk som benyttes i repoet, men en typisk workflow for jvm-applikasjoner vil se slik ut:

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

## Vanlige feil

Hvis du analyserer en større applikasjon er det ikke uvanlig att gradle går tom for minne, noe som kan økes ved å legge til `kotlin.daemon.jvmargs=-Xmx4096m` i `gradle.properties`.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
