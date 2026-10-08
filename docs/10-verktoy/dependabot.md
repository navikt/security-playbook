---
slug: dependabot
title: Dependabot (GitHub Security)
description: Scanning av avhengigheter
tags:
  - tredjepartskode
---

**Relevante tema:**

- [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode)

[Dependabot](https://github.com/dependabot) er et verktøy som kan brukes på alle GitHub-repos. Dersom man ønsker at Dependabot kun skal sjekke etter sårbarheter, kan dette settes opp i dit repo i GitHub, under _Security_. Ønsker man å også få forslag til oppgraderinger som ikke nødvendigvis er sårbarheter, kan man be om det via `dependabot.yml`. Les mer om den siste varianten [her](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/enabling-and-disabling-dependabot-version-updates).

Versjonsoppdateringer anbefales på det sterkeste, ikke alle sårbarheter får et sikkerhetsvarsel og noen patcher tar veldig lang tid å rulle ut. Ved å holde avhengigheter oppdatert, reduserer du risikoen for at ditt system blir utsatt for kjente sårbarheter.

## Oppsett av Dependabot

Avhengighetsscanning i seg selv skal være automatisk aktivert for alle nye repo på GitHub i `navikt`, men det kan hende den ikke klarer å få oversikt over avhengighetene ut av boksen.

For å få versjonsoppdateringer trenger man en `dependabot.yaml`. For å unngå supply chain-angrep er det lurt å bruke `cooldown`: Dependabot venter da konfigurert antall dager før den oppretter PR for en ny versjon, slik at en eventuell ondsinnet release rekker å bli oppdaget og trukket fra registry før vi installerer den. Dette påvirker **ikke** sikkerhetsoppdateringer — kjente sårbarheter får PR umiddelbart uavhengig av cooldown.

*.github/dependabot.yaml*
```yaml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: daily
    cooldown:
      default-days: 3

  - package-ecosystem: gradle
    directory: "/"
    schedule:
      interval: daily
    cooldown:
      default-days: 3
```

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

GitHub plukker ikke opp Gradle-avhengigheter automatisk. Uten et eget oppsett vil Dependency Graph være tom eller ufullstendig, og du går glipp av Dependabot-varsler. Bruk [`gradle/actions/dependency-submission`](https://github.com/gradle/actions/blob/main/docs/dependency-submission.md) til å sende inn avhengighetene via GitHubs [Dependency Submission API](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/using-the-dependency-submission-api).

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
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6.0.3
      - name: Generate and submit dependency graph
        uses: gradle/actions/dependency-submission@v6
```

:::tip Feilsøking
Får du Dependabot-alerts for avhengigheter du ikke kjenner igjen? Det er nesten alltid transitive avhengigheter eller plugin-avhengigheter som faktisk blir resolvet under bygget. Slå på debug-logging på workflow-kjøringen, eller publiser en gratis [Develocity Build Scan](https://scans.gradle.com/) for å se hvor de kommer fra. Se [Gradle sin FAQ for dependency-submission](https://github.com/gradle/actions/blob/main/docs/dependency-submission-faq.md) for detaljer.
:::

## Automatisk merge av Dependabot-PR-er

Bruk Navs åpne GitHub Action [`navikt/automerge-dependabot`](https://github.com/navikt/automerge-dependabot) til å merge Dependabot-PR-er automatisk. Vi anbefaler et installation token fra en egen GitHub App, slik at merge også kan utløse workflowene som bygger og deployer applikasjonen.

Hvis actionen merger med det innebygde `GITHUB_TOKEN`, starter ikke GitHub nye workflow-kjøringer for `push`-hendelsen fra merge. Med et GitHub App-token kan en eksisterende deploy-workflow med `on: push` kjøre som ved en vanlig merge. Workflowens branch- og path-filtre gjelder fortsatt. Se [GitHubs forklaring av hvilke hendelser `GITHUB_TOKEN` utløser](https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs).

### Sett opp GitHub App og tilgang

1. Følg [guiden for å opprette og installere en GitHub App](/docs/sikker-utvikling/github#hvordan-opprette-github-app). Installer appen bare i repoene som skal bruke automatisk merge.
2. Gi appen repository-rettighetene **Contents: Read and write** og **Pull requests: Read and write**.
3. Legg Client ID i Actions-variabelen `CLIENT_ID` og den private nøkkelen i Actions-secreten `PRIVATE_KEY`, som beskrevet i [guiden for å ta i bruk appen](/docs/sikker-utvikling/github#hvordan-ta-i-bruk-din-nye-github-app). Ikke legg nøkkelen i kildekoden.
4. Sett opp [branch protection eller rulesets](/docs/sikker-utvikling/github#branch-protection) med påkrevde tester og status checks. Ikke gi appen bypass-rettigheter. Automatisk merge er ikke en erstatning for tester eller teamets krav til review.

Hvis appen også skal merge PR-er som endrer `.github/workflows`, for eksempel Dependabot-oppdateringer av GitHub Actions, trenger den **Workflows: Read and write**. Legg da også til `permission-workflows: write` i token-steget nedenfor. Se [GitHubs veiledning om app-rettigheter](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app).

### Legg til en workflow

Opprett `.github/workflows/dependabot-automerge.yml` på repoets default branch:

```yaml
name: Automerge Dependabot PRs

on:
  schedule:
    - cron: "0 9 * * 1-5"
  workflow_dispatch:

permissions: {}

jobs:
  automerge:
    runs-on: ubuntu-latest
    steps:
      - name: Create GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v3
        with:
          client-id: ${{ vars.CLIENT_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
          permission-contents: write
          permission-pull-requests: write

      - name: Automerge Dependabot PRs
        uses: navikt/automerge-dependabot@70455df4433fac78f20d5a248f9ebf07ccac11fe # v1.5
        with:
          token: ${{ steps.app-token.outputs.token }}
          semver-filter: "patch,minor"
          merge-method: "merge"
```

Workflowen kjører kl. 09:00 UTC mandag til fredag og kan også startes manuelt under Actions. Den trenger ikke å sjekke ut eller kjøre kode fra PR-en. Actionen kjører bare fra default branch og vurderer åpne PR-er fra Dependabot.

`permissions: {}` fjerner rettighetene til workflowens innebygde `GITHUB_TOKEN`. App-tokenets rettigheter styres separat av appens installasjon og `permission-*`-feltene. Uten `owner` og `repositories` lager `actions/create-github-app-token` et token bare for repoet workflowen kjører i. Tokenet utløper etter én time og blir normalt tilbakekalt når jobben er ferdig.

Eksempelet tillater patch- og minor-oppdateringer, ikke major-oppdateringer eller versjoner actionen ikke kan tolke. `merge-method: "merge"` må være tillatt i repoets innstillinger. Actionen sjekker blant annet merge-status, status checks og blokkerende reviews, og GitHubs regler avgjør om merge er tillatt.

:::caution Review og oppdateringsregler
`auto-approve` er av som standard. Hvis repoet krever godkjenning, må PR-en få den før actionen kan merge. Actionen støtter `auto-approve: "true"`, men da godkjenner appen selv PR-en. Avklar dette med teamet før dere tar det i bruk.

Behold Dependabots `cooldown` for versjonsoppdateringer. Actionens `minimum-age-of-pr` utsetter bare merge, ikke bygg og kjøring av ny kode i PR-en.
:::

Etter første kjøring kan du se hvilke PR-er actionen merget eller hoppet over i workflowens oppsummering. Kontroller også at merge utløser den forventede deploy-workflowen, og at eventuelle filtre på aktør, branch eller paths ikke stopper den.

Se [actionens dokumentasjon](https://github.com/navikt/automerge-dependabot#readme) for flere valg, blant annet `ignored-dependencies`, `blackout-periods` og `update-branch-before-merge`. Hvis du aktiverer oppdatering av PR-brancher, trenger appen og tokenet også **Checks: Read** og **Commit statuses: Read** (`permission-checks: read` og `permission-statuses: read`).

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
