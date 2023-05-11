---
title: Snyk
description: Scanning av avhengigheter og statisk kodeanalyse
tags:
  - tredjepartskode
  - statisk-kodeanalyse
---

# Snyk ([snyk.io](https://snyk.io))

:::warning Vi bytter!
Vi har fom mai 2023 sagt opp avtalen vår med Snyk og gått all in på [GitHub Advanced Security](/docs/verktoy/github-advanced-security).
Tilgang til de Snyk-tjenestene som koster 💰 vil forsvinne.
:::

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

### Importer fra GitHub {#github}

Snyk lar deg importere GitHub-prosjekter rett fra [app.snyk.io](https://app.snyk.io/) etter du har logget inn i teamets «Snyk-organisasjon». Dette er en enkel måte å starte med Snyk, og gir deg veldig mye ut av boksen.

1. Velg «Add project» og så «GitHub» fra [Snyk-organisasjonen](https://app.snyk.io/) til teamet ditt
2. Velg repoene du ønsker å koble til
3. Velg «Add selected repositories» øverst

Merk at dette setter også opp [statisk kodeanalyse](#snyk-code) med Snyk Code, gitt at det er aktivert for Snyk-orgen til teamet ditt.

Snyk skal nå automatisk plukke opp og scanne `pom.xml`, `package.json`, `Dockerfile` og andre avhengigetsfiler, og i tillegg sette opp en webhook som plukker opp fremtidige endringer.

:::caution Importerer du `build.gradle.kts`?
Dette er foreløpig ikke støttet med GitHub-import, og må importeres fra [CLI](#cli)
:::

:::caution Importerer du `Dockerfile`?
Snyk har kun støtte for et utvalg av baseimages, og vil ikke nødvendigvis plukke opp sårbarheter. Du vil heller ikke få noen god advarsel på dette, noe som er misvisende.
Se [Identification methods](https://docs.snyk.io/products/snyk-container/getting-around-the-snyk-container-ui/base-image-detection#identification-methods) for mer info.
:::

:::caution Hentes avhengigheter fra `repo.adeo.no`, `npm.pkg.github.com`, eller andre ikke-offentlige brønner?
Snyks GitHub-import kan kun se offentlige avhengigheter, og vil derfor ikke kjøre en fullverdig sjekk av avhengighetene.

Bruk heller `snyk monitor` fra en [CLI](#cli)-GitHub-action, og autentiser som ellers i pipelinen.
:::

### CLI via GitHub-action {#cli}

Import via CLI krever at du selv sier ifra til Snyk når avhengighetene endres. Dette gjøres gjerne via en GitHub-action som kjører `snyk monitor` ved hver push. Snyk vil deretter varsle om nye sårbarheter som dukker opp i avhengighetene dine.

Se [Snyks egen dokumentasjon](https://github.com/snyk/actions) på dette.

#### Hvilken GitHub-action skal jeg bruke?

Snyk har to typer GitHub-actions:

1. **Språk-spesifikke** actions, f.eks. `snyk/actions/node`, `snyk/actions/maven`, `snyk/actions/golang`, …
   - Passer **bra** hvis du ikke har en eksisterende GitHub-pipeline
   - Passer **dårlig** hvis du har mange avhengigheter og vil bruke caching i GitHub (se [Raskere Snyk](#raskere-snyk))
   - Passer **dårlig** hvis du bruker ikke-offentlige pakkebrønner som `repo.adeo.no` eller `npm.pkg.github.com` (mye knot)
   - Passer **dårlig** hvis du har flere språk du vil teste i samme repo
   - Se [Snyks dokumentasjon](https://github.com/snyk/actions#snyk-github-actions)
2. **Generell** action: `snyk/actions/setup`
   - Passer **dårlig** hvis du ikke allerede har en GitHub-pipeline som bygger koden
   - Passer **bra** hvis du vil legger til caching av avhengigheter (se [Raskere Snyk](#raskere-snyk))
   - Passer **bra** hvis du bruker ikke-offentlige pakkebrønner som `repo.adeo.no` eller `npm.pkg.github.com` (du kan autentisere på samme måte som når du bygger koden)
   - Passer **bra** hvis du har flere språk du vil teste i samme repo
   - Se [Snyks dokumentasjon](https://github.com/snyk/actions#bring-your-own-development-environment)

Eksempel med bruk av **generell** action i et **gradle**-prosjekt:

```yaml
jobs:
  build:
    name: Monitor dependencies with Snyk
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: "17"
          distribution: "temurin"
          cache: "gradle"
      - name: Install Snyk CLI
        uses: snyk/actions/setup@master
      - name: Monitor dependencies with Snyk
        run: snyk monitor --org=TEAMETS_ORG_HER
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

Eksempel med bruk av en **språkspesifikk** action i et **maven**-prosjekt:

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/gradle-jdk11@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: monitor
          # OBS: bruk >- fremfor | for å få alt på samme linje
          args: >-
            --org=TEAMETS_ORG_HER
            --project-name=${{ github.repository }}
```

Eksempel med bruk av **språkspesifikk** action i et **node**-prosjekt:

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

### Stopp GitHub-workflow ved sårbarheter

Snyk vil ikke stoppe opp GitHub-workflowen din når den finner sårbarheter, med mindre du bruker `snyk test`-kommandoen, og/eller `snyk code test`.

Dette kan gjøres på samme måte som bruken av `snyk monitor`, men med andre kommandoer i CLIet:

- [Dokumentasjon av `snyk test`](https://docs.snyk.io/snyk-cli/commands/test) (scanning av nåværende avhengigheter)
- [Dokumentasjon av `snyk code test`](https://docs.snyk.io/products/snyk-code/cli-for-snyk-code) (statisk kodeanalyse)

:::caution Ikke glem monitor
`snyk test` vil kun sjekke **nåværende** status på avhengighetene dine, og vil ikke rapportere om nye sårbarheter som dukker opp. Du bør derfor bruke både `test` og `monitor` (enten fra CLI eller fra GitHub).
:::

Eksempel på workflow som stopper opp pipelinen ved feil:

```yaml
jobs:
  snyk:
    name: Check dependencies with Snyk
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: "17"
          distribution: "temurin"
          cache: "gradle"
      - name: Install Snyk CLI
        uses: snyk/actions/setup@master
      - name: Check dependencies with Snyk
        # severity kan være low, medium, high, eller critical
        run: snyk test --org=TEAMETS_ORG_HER --severity-threshold=high
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Slack-varsler fra Snyk

Det kan være vanskelig å følge med på feil som kommer inn i Snyk, og spesielt hvis bare enkelte personer i teamet går inn og sjekker oversikten av og til. Derfor anbefales det å sette opp [**Slack-varsler**](https://docs.snyk.io/features/integrations/notifications-ticketing-system-integrations/slack-integration) til hele teamet for å synliggjøre risikoen.

:::tip Ønsker du bedre Slack-varlser?
Ta en titt på vår interne [snyk-slack-notifier](https://github.com/navikt/snyk-slack-notifier) hvis du ønsker mer kontroll over Slack-varslene.
Snyk sin Slack-integrasjon gir deg alle varsler, uavhengig av type (sårbarhet/lisenskrøll) og alvorlighetsgrad (fra «lav» til «kritisk»).
:::

![Slack-integrasjon i Snyk](/img/snyk-slack.png "Slack-integrasjon i Snyk")

### Scanning av ikke-åpne maven-pakker med GitHub Action

**Merk**: Dette gjelder kun for **språkspesifikke** actions. Hvis du bygger med en **generell** action, vil du kunne gjenbruke autentiseringen fra den vanlige pipelinen din. [Les mer om de ulike actionene her](#hvilken-github-action-skal-jeg-bruke).

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
