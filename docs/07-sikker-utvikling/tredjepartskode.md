---
title: Tredjepartskode
description: 📦 Andres kode trenger ikke gi deg vondt i hodet
---

Vi drar stadig flere tredjepartsavhengigheter inn i koden vår. Disse avhengighetene har gjerne selv avhengigheter, som igjen har avhengigheter, og så videre. Noen estimater sier at så mye som 85% av koden i en typisk applikasjon (i den grad det finnes typiske applikasjoner) er skrevet av andre enn oss selv. Denne koden har (som all annen kode) feil og sårbarheter. Ulike <abbr title="Open-source software">OSS</abbr>-prosjekter har ulike strukturer og arbeidsformer. Noen av dem forlates, andre overtas av mennesker som ikke har like gode hensikter som de forrige.

Hvordan kan vi sikre oss bedre mot dette? Det er en uoverkommelig oppgave å skulle holde oversikt over slike ting selv. Det har derfor dukket opp tjenester som kontinuerlig monitorerer og systematiserer info om kjente sårbarheter og hvilke produkter som er rammet av dem. I NAV har vi valgt å ta i bruk [GitHub Security](https://github.com/features/security) og [Snyk](https://snyk.io/). Disse kan scanne prosjektene dine jevnlig etter avhengigheter med kjente sårbarheter og varsle dere i form av meldinger på Slack/epost eller ved å lage pull requests som oppdaterer de sårbare versjonene.

[Dependabot](https://github.com/dependabot) er et annet verktøy som kan brukes på åpne GitHub-repos (i motsetning til Snyk som også kan brukes på private repos). Dersom man ønsker at Dependabot kun skal sjekke etter sårbarheter, kan dette settes opp i dit repo i GitHub, under _Security_. Ønsker man å også få forslag til oppgraderinger som ikke nødvendigvis er sårbarheter, kan man be om det via `dependabot.yml`. Les mer om den siste varianten [her](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/enabling-and-disabling-dependabot-version-updates).

Ta kontakt i [#snyk](https://nav-it.slack.com/archives/C02KF9C5XSM) dersom dere mangler tilgang.

## Snyk

![Snyk](/img/snyk.png "Snyk")

Snyk er en tjeneste som hjelper til med å oppdage og vurdere sårbarheter i både egen kode (se [«Statisk kodeanalyse»](kodeanalyse#snyk-code)), og tredjepartskode fra avhengigheter.

Alle team har mulighet til å benytte seg av Snyk gjennom avtalen vi har i NAV. På [GitHub'en til Snyk](https://github.com/snyk/snyk#what-is-snyk) finner du en nærmere beskrivelse av tjenesten og de ulike verktøyene som tilbys.

:::tip Hvorfor Snyk?
[Se opptaket](/docs/events/2021-11-22-stranger-danger) fra da vi hadde besøk av Simon Maple fra Snyk for en introduksjon til hvorfor Snyk er nyttig, og litt om hvordan bruke det effektivt.
:::

### Kom i gang

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
Merk at dette setter også opp [statisk kodeanalyse](kodeanalyse.md) med Snyk Code.

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

### Varsler fra Snyk

Det kan være vanskelig å følge med på feil som kommer inn i Snyk, og spesielt hvis bare enkelte personer i teamet går inn og sjekker oversikten av og til. Derfor anbefales det å sette opp [**Slack-varsler**](https://docs.snyk.io/features/integrations/notifications-ticketing-system-integrations/slack-integration) til hele teamet for å synliggjøre risikoen.

**Merk**: Snyk sin Slack-integrasjon gir deg alle varsler, uavhengig av type (sårbarhet/lisenskrøll) og alvorlighetsgrad (fra «lav» til «kritisk»). Ta en titt på vår interne [snyk-slack-notifier](https://github.com/navikt/snyk-slack-notifier) hvis du ønsker mer kontroll.

![Slack-integrasjon i Snyk](/img/snyk-slack.png "Slack-integrasjon i Snyk")

### Snyk Code og statisk kodeanalyse

Snyk kan også brukes til statisk analyse av egen kode (SAST), i tillegg til analyse av tredjepartskode. Les mer om hvordan dette aktiveres på siden om [statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse#snyk-code).

## GitHub Security

![GitHub Security](/img/dependabot.png "GitHub Security")

:::note
Mer informasjon om GitHub Security kommer her.
:::

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
