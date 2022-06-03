---
title: Snyk
description: Scanning av avhengigheter og statisk kodeanalyse
tags:
  - tredjepartskode
  - statisk-kodeanalyse
---

# Snyk ([snyk.io](https://snyk.io))

**Relevante tema:**

- [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode)
- [Statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse)

![Snyk](/img/snyk.png "Snyk")

Snyk er en tjeneste som hjelper til med å oppdage og vurdere sårbarheter i både egen kode, og tredjepartskode fra avhengigheter.

Alle team har mulighet til å benytte seg av Snyk gjennom avtalen vi har i NAV. På [GitHub'en til Snyk](https://github.com/snyk/snyk#what-is-snyk) finner du en nærmere beskrivelse av tjenesten og de ulike verktøyene som tilbys.

Se også Snyks [«Training Portal»](https://training.snyk.io/catalog) for hjelp til bruk av verktøyet.

:::tip Hvorfor Snyk?
[Se opptaket](/docs/events/2021-11-22-stranger-danger) fra da vi hadde besøk av Simon Maple fra Snyk for en introduksjon til hvorfor Snyk er nyttig, og litt om hvordan bruke det effektivt.
:::

## Kom i gang

Start ved å logge inn i Snyk med NAV-brukeren din på [app.snyk.io/login/sso](https://app.snyk.io/login/sso). Dersom dette ikke fungerer, må du først legge til Snyk fra [My Apps](https://myapplications.microsoft.com/).

**Første gang** teamet ditt skal ta i bruk Snyk, må en «Snyk-organisasjon» opprettes.
Ta kontakt i [#snyk](https://nav-it.slack.com/archives/C02KF9C5XSM) for å få dette satt opp for teamet hvis dere ikke allerede har en. Tilgang til Snyk-organisasjonen styrer dere selv når den først er opprettet.

Videre er det bare å kjøre på og sette opp Snyk for repoene deres. Dette kan for eksempel gjøres fra [app.snyk.io](https://app.snyk.io/login/sso) ved å importere GitHub-repoene deres, eller fra repoene selv med CLIet via en GitHub-action:

### Importer fra GitHub

1. Velg «Add project» og så «GitHub» fra [Snyk-organisasjonen](https://app.snyk.io/) til teamet ditt
2. Velg repoene du ønsker å koble til
3. Velg «Add selected repositories» øverst

Snyk skal nå automatisk plukke opp og scanne `pom.xml`, `package.json`, `Dockerfile` og andre avhengigetsfiler, og i tillegg sette opp en webhook som plukker opp fremtidige endringer.

:::tip
Ved import av prosjekt via Snyk UI vil Snyk kunne identfisere baseimage fra `Dockerfile` som den kjenner til fra før.
Se [Identification methods](https://docs.snyk.io/products/snyk-container/getting-around-the-snyk-container-ui/base-image-detection#identification-methods) for mer info.
:::

:::caution
Hvis du bruker en baseimage som Snyk ikke kjenner vil den ikke ikke kunne oppdage sårbarheter. Man får heller ingen advarsel om det i Snyk UI. Dockerfile importeres inn uten sårbarheter, noe som er misvisende.
:::

### CLI via GitHub-action

Se [Snyks egen dokumentasjon](https://github.com/snyk/actions) på dette.
Merk at dette setter også opp [statisk kodeanalyse](#snyk-code) med Snyk Code.

1. Legg til et github-action-steg. Enten som en separat workflow, eller som en del av en eksisterende workflow.

Eksempel for **JVM**-prosjekter: https://github.com/navikt/dp-quiz/blob/main/.github/workflows/snyk.yml

Eksempel for **node**-prosjekter:

```yaml
jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: monitor
          args: --org=TEAMETS_ORG_HER
```

:::caution
Husk å sette `--org` i `args`-blokken til ditt teams «Snyk-organisasjon». Logg inn på [app.snyk.io](https://app.snyk.io/) for å finne riktig org-navn.

Hvis den **ikke** settes, så vil Snyk velge en tilfeldig organisasjon som allerede eksisterer. Dette skaper både støy og forvirring.
:::

## Snyk Code (statisk kodeanalyse) {#snyk-code}

For team som allerede bruker Snyk til scanning av tredjepartskode, kan [«Snyk code»](https://snyk.io/product/snyk-code/) enkelt skrus på for å tilby statisk kodeanalyse:

1. Gå til «Org Settings» (tannhjulet øverst til høyre) → «Snyk Code»
2. Aktiver Snyk Code for organisasjonen din (Snyk bruker ordet «Org» for det vi forstår som «Team»)
3. Re-importer alle prosjekter

Snyk Code vil nå analysere og rapportere om potensielle sårbarhetere i applikasjonskoden selv, og ikke bare fra tredjepartskode.

Les mer om [statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse).

## Tips og triks

### Slack-varsler fra Snyk

Det kan være vanskelig å følge med på feil som kommer inn i Snyk, og spesielt hvis bare enkelte personer i teamet går inn og sjekker oversikten av og til. Derfor anbefales det å sette opp [**Slack-varsler**](https://docs.snyk.io/features/integrations/notifications-ticketing-system-integrations/slack-integration) til hele teamet for å synliggjøre risikoen.

:::tip Ønsker du bedre Slack-varlser?
Ta en titt på vår interne [snyk-slack-notifier](https://github.com/navikt/snyk-slack-notifier) hvis du ønsker mer kontroll over Slack-varslene.
Snyk sin Slack-integrasjon gir deg alle varsler, uavhengig av type (sårbarhet/lisenskrøll) og alvorlighetsgrad (fra «lav» til «kritisk»).
:::

![Slack-integrasjon i Snyk](/img/snyk-slack.png "Slack-integrasjon i Snyk")

### Scanning av ikke-åpne maven-pakker med GitHub Action

Snyk får ikke automatisk tilgang til pakker som ligger i ikke-åpne maven-repositories, slik som [GitHub Maven registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry), og krever at autentisering settes opp.

For å få Snyk til å autentisere mot maven-repoet, må vi lage egen `settings.xml`-fil med credentials, og så fortelle Snyk at den skal brukes. Merk at GitHub-actionet `snyk/actions/maven` kjører gjennom en docker-container, og får kun tilgang til filer som ligger i kildekode-mappen. En typisk `~/.m2/settings.xml` vil derfor ikke bli plukket opp, og vi må i stedet legge settings-filen sammen med resten av kildekoden.

Dette kan for eksempel gjøres med en slik GitHub-workflow:

```yaml
jobs:
  snyk:
    name: Snyk test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Create settings.xml
        uses: whelk-io/maven-settings-xml-action@v20
        with:
          repositories: '[{ "id": "github", "name": "github", "url": "https://maven.pkg.github.com/navikt/...", "releases": { "enabled": "true" }, "snapshots": { "enabled": "false" } }]'
          servers: '[{ "id": "github", "username": "${{ github.actor }}", "password": "${{ secrets.READER_TOKEN }}" }]'
          # OBS: merk at default-plassering av output_file ikke plukkes opp av Snyk
          output_file: snyk-settings.xml

      - name: Run Snyk
        uses: snyk/actions/maven@master
        with:
          command: test
          # OBS: merk "--" mellom Snyk-options (--org) og Maven-options (--settings)
          args: --org=... -- --settings snyk-settings.xml
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Raskere snyk

Snyk bruker pakkesystemet til å finne avhengigheter. Det betyr at for å kunne gjøre `snyk test` eller `snyk monitor` så må alle avhengigheter løses først. Kjører du `snyk` som egne GitHub Actions workflows (eller jobber) så vil de starte med en tom checkout og måtte løse alle avhengigheter.

Ønsker du at snyk skal blokkere deployment betyr dette i praksis fort en dobling i bygg-tid. Kjører du heller `snyk` som et steg i en eksisterende jobb vil det bare ta noen sekunder ekstra.

Den raskeste måten å kjøre `snyk` er å bruke `snyk/actions/setup`. For et Gradle-prosjekt vil det se slik ut:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Installerer snyk i GitHub Action runneren
      - uses: snyk/actions/setup@master

      - uses: actions/setup-java@v2
        with:
          distribution: temurin
          java-version: 17

      - uses: gradle/gradle-build-action@v2
      - run: gradle test

      - run: snyk test --org=[PROJECT]
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

Snyk sine GitHub Actions som for eksempel `snyk/actions/gradle` kjører `snyk` i Docker så de vil være like trege, selv som et steg i en eksisterende jobb.
