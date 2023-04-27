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

Oppsettet avhenger av bl.a. hvilke programmeringsspråk som benyttes i repoet, men en typisk workflow for java-applikasjoner vil se slik ut:

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

    strategy:
      fail-fast: false
      matrix:
        language: ["java"]
        # CodeQL supports [ 'cpp', 'csharp', 'go', 'java', 'javascript', 'python', 'ruby' ]
        # Learn more about CodeQL language support at https://aka.ms/codeql-docs/language-support

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      # Initializes the CodeQL tools for scanning.
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
          # If you wish to specify custom queries, you can do so here or in a config file.
          # By default, queries listed here will override any specified in a config file.
          # Prefix the list here with "+" to use these queries and those in the config file.

          # Details on CodeQL's query packs refer to : https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning#using-queries-in-ql-packs
          # queries: security-extended,security-and-quality

      # Autobuild attempts to build any compiled languages  (C/C++, C#, or Java).
      # If this step fails, then you should remove it and run the build manually (see below)
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      # ℹ️ Command-line programs to run using the OS shell.
      # 📚 See https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun

      #   If the Autobuild fails above, remove it and uncomment the following three lines.
      #   modify them (or add more) to build your code if your project, please refer to the EXAMPLE below for guidance.

      # - run: |
      #   echo "Run, Build Application using script"
      #   ./location_of_script_within_repo/buildscript.sh

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          category: "/language:${{matrix.language}}"
```

## Secret Scanning

GitHub vil automatisk plukke opp secrets som committes som en del av koden. Secrets skal holdes utenfor koden, så dette vil stoppes ved push. Les mer om hvordan håndtere hemmeligheter på siden [«Hemmeligheter»](./docs/sikker-utvikling/hemmeligheter).

[Les mer om Secret Scanning hos GitHub.](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
