---
title: Github best practices
description: Orden i repo gir ro i sjela ✨.
---

I Nav har vi satt opp to repositories som skall gi ett hint om vad "best practice" er for att bruke Github.
Her finner du eksempel på en applikasjon som bygges, scannes og deployes til Nais.

Du finner dem her: [Backend](https://github.com/navikt/backend-golden-path) og [Frontend](https://github.com/navikt/frontend-golden-path).

Github har selv skrevet en guide med best practices for github actions, du finner [den her](https://docs.github.com/en/actions/reference/security/secure-use).
Nedenfor finner du en kort oppsummering av de viktigste punktene.

## Tokens

Best practice er å bruke Githubs innebygde tokens fremfor å lage egne personal access tokens (PATs). Når du trenger PAT er det lurt lage en github app og ikke gi appen mer rettigheter enn nødvendig.

1. Registrere en ny GitHub App under instillinger til din bruker. https://github.com/settings/apps/new
   1. Gi appen et navn og en url (denne kan være et til repo/teamkatalogen etc).
   2. Skru av "Webhook" om du ikke trenger det. Er du usikker, skru det av.
   3. Under "Permissions & events", gi appen kun de rettighetene den trenger. Skal du hente pakker fra andre repos trenger du f.eks. kun "Contents: Read-only".
   4. Under "Where can this GitHub App be installed?" velg "Only on this account".
2. Klikke på "Create GitHub App".
3. Kopier App ID, dette er ikke sensitive informasjon.
4. Under "General", scrolle ned til Private keys og lag en ny nøkkel.
   1. Åpne filen som blir nedlastet å kopier den nøkkelen til et sikkert sted. For eksempel i en hemmelighet i Nais Console. Alternativt bare slette den etter att den er lagt til i alle repos.
   2. Slette nøkkelen fra din harddisk for å unngå att den blir lekket.
5. Under "Advanced"
   1. Klikke på "Transfer ownership"
   2. Fyll i navnet på appen å skriv inn "navikt" som ny owner.
6. Transfer this GitHub App.
7. App managers
   1. Scrolle lengst ned, finn ditt team å Grant access
8. Gå til Install App og installer appen til navikt-organisasjonen.
9. Velg kun de repos appen skal ha tilgang til.

Nå har du en applikasjon som kan lage kortlevde tokens med kun de rettighetene den trenger. App ID og den private nøkkelen du lagde tidligere trengs for å lage tokens. Disse må legges in i hvert repo som skal bruke appen.

1. Gå til repoet som skal bruke appen.
2. Gå til Settings > Secrets and variables > Actions > New repository
   1. Lage en secret med navn APP_ID og lim inn private keyen du lagret ett sikkert sted som verdi.
3. Klikke på Variables lengst opp > New repository variable
   1. Lage en variable med navn PRIVATE_KEY og lim inn App ID som verdi.
4. Nå kan du bruke appen i dine workflows for å lage tokens med kun de rettighetene du trenger.

### Hente token for samme repo

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-github-app-token@v2
        id: app-token
        with:
          app-id: ${{ vars.APP_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}

      - uses: ./actions/staging-tests
        with:
          token: ${{ steps.app-token.outputs.token }}
```

### Hente token for andre repos

```yaml
- uses: actions/create-github-app-token@v2
  id: app-token
  with:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    owner: ${{ github.repository_owner }}
    repositories: |
      repo1
      repo2
```

### Hente token for alle repos appen har tilgang til

```yaml
- uses: actions/create-github-app-token@v2
  id: app-token
  with:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    owner: ${{ github.repository_owner }}
```

## Repository settings

### Eierskap

I Nav anbefaler vi att et nais-team står som admin for ett repository. Fordi når folk slutter eller bytter team blir det mye jobb å gå igjennom alle repositories.

### Branch protection

Sett opp branch protection for default branch for å unngå att noen sletter kode.

- Settings > Rules > Rulesets > New Ruleset > New branch ruleset
  - Add target -> Include default branch
  - Bruke anbefalte defaults:
    - Restrict deletion
    - Block force push

## Github Actions

GitHub Actions er en kraftig CI/CD-plattform, som hjelper oss til å teste og bygge kode raskere og enklere. Dette betyr også at den er veldig viktig for oss, og at feil her kan få store konsekvenser. Under følger en liste over ting man bør huske på for å sikre sine pipelines. Vi også verktøyene [CodeQL](/docs/verktoy/github-advanced-security#codeql-statisk-kodeanalyse) og [zizmor](/docs/verktoy/zizmor) som kan hjelpe deg med å sørge for at workflowene dine er trygt konfigurert.

### Workflows

- Bruk intermediate variables for alle variabler. [Github docs ref](https://docs.github.com/en/actions/reference/security/secure-use#use-an-intermediate-environment-variable)
  - Sett dine variabler i `env:` å sikre at du har input validering. Bruker du f.eks. `${{ github.event.pull_request.title }}` direkte i en bash run kan du være sårbar for command injection.
- Pin 3rd party actions to commit sha. [Github docs ref](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions)
  - Github tags er mutable, noe som betyr at hvis du bruker v1.0 av en action kan den endres uten at du merker noe. Vi anbefaler at man pinner actions á la `nais/docker-build-push@aed4d69de423d70d995a9fac4bb00dedb7b00f91`. [Ratchet](https://github.com/sethvargo/ratchet) er et verktøy som kan hjelpe med dette.
  - Githubs egne actions er nå immutable og kan bruke tags.
- Use minimum permissions
  - Ting skjer, plutselig lekker man en github token på internet og en ondsinnet aktør får tak i den. Men hvis det eneste du kan gjøre med tokenet er å hente kildekoden stopper du attacken der.
  - Bruk minst mulig permissions i dine workflows, sett permissions for hvert eneste steg i workflowen. Skal du bygge og teste applikasjonen uten å pushe docker-image trenger du f.eks. ikke id-token.

## Secret scanning

Skrudd på by default, og vil kunne fange opp hemmeligheter og blokkere deg fra å pushe koden din, hvis du har hemmeligheter i koden du forsøker å pushe.
Secret scanning scanner også repoet for å finne eksisterende hemmeligheter.

Husk at dette kun scanner kildekoden din! Ting som skjer i workflows, for eksempel når du bygger docker images scannes ikke av github.

## Andre verktøy

- Dependency graph
  - Dependency graph er en liste over avhengigheter som er brukt i prosjektet.
  - Brukes av github security for å opprette security alerts når de finner en sårbar avhengighet i repoet.
  - Derfor er det viktig at man sikrer at informasjonen her stemmer, mer info om dette på [dependabot-siden](../verktoy/dependabot).
- [CodeQL](../verktoy/github-advanced-security#codeql-statisk-kodeanalyse)
  - CodeQL har støtte for scanning av applikasjoner og github workflows.
- [Trivy](../verktoy/trivy)
  - Trivy bruker vi for å sikre at vi ikke lekker hemmeligheter når vi bygger docker images.
- [Dependabot](../verktoy/dependabot)
  - Versjonshåndtering av avhengigheter. Jevnlig patching gjør livet enklere og applikasjonene sikrere.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
