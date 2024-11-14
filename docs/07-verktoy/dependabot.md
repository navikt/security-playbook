---
slug: dependabot
title: Dependabot (GitHub Security)
description: Scanning av avhengigheter
tags:
  - tredjepartskode
---

**Relevante tema:**

- [Tredjepartskode](../sikker-utvikling/tredjepartskode)

[Dependabot](https://github.com/dependabot) er et verktøy som kan brukes på alle GitHub-repos. Dersom man ønsker at Dependabot kun skal sjekke etter sårbarheter, kan dette settes opp i dit repo i GitHub, under _Security_. Ønsker man å også få forslag til oppgraderinger som ikke nødvendigvis er sårbarheter, kan man be om det via `dependabot.yml`. Les mer om den siste varianten [her](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/enabling-and-disabling-dependabot-version-updates).

Versjonsoppdateringer anbefales på det sterkeste, ikke alle sårbarheter får et sikkerhetsvarsel og noen patcher tar veldig lang tid å rulle ut. Ved å holde avhengigheter oppdatert, reduserer du risikoen for at ditt system blir utsatt for kjente sårbarheter.

## Oppsett av Dependabot

Avhengighetsscanning i seg selv skal være automatisk aktivert for alle nye repo på GitHub i `navikt`, men det kan hende den ikke klarer å få oversikt over avhengighetene ut av boksen.

### Sjekk om Dependabot finner avhengigheter (og versjoner) automatisk

Oversikten over hva Dependabot følger med på finner du under «Insights», og så «Dependency graph».

![GitHub Security](/img/dependabot-dependencies.png "«Insights» -> «Dependency Graph» for å se hva Dependabot har oppdaget")

:::caution
**OBS**: Selv om Dependabot finner avhengigheten, er det ikke sikkert at versjonsnummeret blir plukket opp. Versjonsnummeret må også være med for å få varsler om sårbarheter.
:::

Dersom Dependabot ikke finner avhengighetene av seg selv, eller ikke ser versjoner, se under.

### Oppsett Maven (pom.xml)

Maven-avhengigheter plukkes stort sett opp automatisk, men bruk av variabler og parent-poms (f.eks. med spring-boot) kan skape utfordringer.
Det anbefales å sette opp en GitHub workflow som scanner dependencies eksplisitt med [maven-dependency-submission-action](https://github.com/marketplace/actions/maven-dependency-tree-dependency-submission) fra en github workflow. Eksempel:

```yaml
name: Submit dependency graph
on:
  push:
    branches:
      - main
    paths:
      - "pom.xml"
jobs:
  dependencies:
    runs-on: ubuntu-latest
    permissions: # The Dependency Submission API requires write permission
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Submit Dependency Snapshot
        uses: advanced-security/maven-dependency-submission-action@v4
```

### Oppsett Gradle (build.gradle.kts / build.gradle)

Gradle-avhengigheter må eksplisitt legges inn gjennom GitHubs [Dependency Submission API](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/using-the-dependency-submission-api). Dette kan gjøres med en github-actionen [dependency-submission](https://github.com/marketplace/actions/build-with-gradle), slik:

```yaml
name: Submit dependency graph
on:
  push:
    branches:
      - main
    paths:
      - "**.gradle.kts"
      - "gradle.properties"
jobs:
  dependencies:
    runs-on: ubuntu-latest
    permissions: # The Dependency Submission API requires write permission
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Generate and submit dependency graph
        uses: gradle/actions/dependency-submission@v4
```

```mdx-code-block
import UnderArbeid from '../07-sikker-utvikling/\_under-arbeid.mdx'

<UnderArbeid />
```
