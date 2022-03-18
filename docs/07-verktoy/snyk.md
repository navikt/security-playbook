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

Snyk er en tjeneste som hjelper til med å oppdage og vurdere sårbarheter i både egen kode (se [«Statisk kodeanalyse»](/docs/sikker-utvikling/kodeanalyse#snyk-code)), og tredjepartskode fra avhengigheter.

Alle team har mulighet til å benytte seg av Snyk gjennom avtalen vi har i NAV. På [GitHub'en til Snyk](https://github.com/snyk/snyk#what-is-snyk) finner du en nærmere beskrivelse av tjenesten og de ulike verktøyene som tilbys.

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
