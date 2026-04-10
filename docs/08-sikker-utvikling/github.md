---
title: GitHub best practices
description: Orden i repo gir ro i sjela ✨.
---

I Nav har vi satt opp to repositories som skall gi ett hint om vad "best practice" er for att bruke Github.
Her finner du eksempel på en applikasjon som bygges, scannes og deployes til Nais.

Du finner dem her: [Backend](https://github.com/navikt/backend-golden-path) og [Frontend](https://github.com/navikt/frontend-golden-path).

Github har selv skrevet en guide med best practices for github actions, du finner [den her](https://docs.github.com/en/actions/reference/security/secure-use).
Nedenfor finner du en kort oppsummering av de viktigste punktene.

## Tokens

Best practice er å bruke Githubs innebygde tokens fremfor å lage egne personal access tokens (PATs). Hvis du trenger et token for å, for eksempel, hente andre interne repos kan du bruke ett installation token fra en Github App. Da kan du scopea tokenet til presis det du trenger med tilgang til kun ett fåtal repos.

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
6. Transfer this GitHub App. (Be en github admin i #github-support godkjenne dette)
   1. Be om tilgang for deres team under `https://github.com/organizations/navikt/settings/permissions/integrations/<GITHUB APPEN>/managers`
7. Gå til Install App og installer appen til navikt-organisasjonen.
8. Velg kun de repos appen skal ha tilgang til.

Nå har du en applikasjon som kan lage kortlevde tokens med kun de rettighetene den trenger. App ID og den private nøkkelen du lagde tidligere trengs for å lage tokens. Disse må legges in i hvert repo som skal bruke appen.

1. Gå til repoet som skal bruke appen.
2. Gå til Settings > Secrets and variables > Actions > Variables > New repository variable
   1. Lag en variabel med navn APP_ID og lim inn App ID som verdi.
3. Klikk på Secrets lengst opp > New repository secret
   1. Lag en secret med navn PRIVATE_KEY og lim inn private keyen du lagret et sikkert sted som verdi.
4. Nå kan du bruke appen i dine workflows for å lage tokens med kun de rettighetene du trenger.

### Hente token for samme repo

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-github-app-token@fee1f7d63c2ff003460e3d139729b119787bc349 # v2
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
- uses: actions/create-github-app-token@fee1f7d63c2ff003460e3d139729b119787bc349 # v2
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
- uses: actions/create-github-app-token@fee1f7d63c2ff003460e3d139729b119787bc349 # v2
  id: app-token
  with:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    owner: ${{ github.repository_owner }}
```

## Repository settings

### Eierskap

I Nav anbefaler vi at et NAIS-team står som admin for et repository. Det gjør eierskap og vedlikehold enklere når folk slutter eller bytter team.
I dagens modell får teammedlemmer admin-tilgang via teamet. Derfor er det viktigste at repoet ligger under riktig team, og at beskyttelsen ligger i rulesets og workflows.

### Rulesets

Bruk rulesets fremfor klassisk branch protection når det er mulig.

- Beskytt standardbranchen.
- Blokker force push og sletting.
- Krev pull requests og nødvendige status checks.

## Github Actions

GitHub Actions er en kraftig CI/CD-plattform som hjelper oss med å teste, bygge og deploye raskt. Samtidig kan feil konfigurasjon få store konsekvenser. Under følger en kort oppsummering av det viktigste du bør passe på. Verktøy som [CodeQL](/docs/verktoy/github-advanced-security#codeql-statisk-kodeanalyse) og [zizmor](/docs/verktoy/zizmor) kan hjelpe deg med å kontrollere at workflowene dine er trygt satt opp.

### Velg trygge triggere

Bruk `pull_request` for kode du ikke fullt ut stoler på.
Unngå `pull_request_target` og `workflow_run` for bygg og test av PR-kode. De er lette å konfigurere feil og gir ofte mer privilegier enn nødvendig.

### Workflows

- Start med `permissions: {}` og gi kun nødvendige rettigheter per jobb.

```yaml
permissions: {}

jobs:
  test:
    permissions:
      contents: read
```

- Bruk mellomvariabler for data fra GitHub-konteksten. [GitHub docs ref](https://docs.github.com/en/actions/reference/security/secure-use#use-an-intermediate-environment-variable)
  - Legg verdiene i `env:` og valider input. Bruker du for eksempel `${{ github.event.pull_request.title }}` direkte i en `run`-kommando, kan du bli sårbar for command injection.
- Pin actions til full commit-SHA. [GitHub docs ref](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions)
  - GitHub-tags er mutable. Bruk derfor full SHA, for eksempel `nais/docker-build-push@45d352fb62fb52ccb5ff6cba22c047fa02b35321 # v0`.
  - Bruker du Dependabot, kan du legge til versjonskommentar: `action@hash # v1.2.3`.
- Gi workflowene minst mulig rettigheter.
  - Hvis et token lekker, bør det kunne gjøre minst mulig skade.
  - Skal du bare bygge og teste applikasjonen, trenger du for eksempel ikke `id-token`.
- Sett `persist-credentials: false` på `actions/checkout` med mindre workflowen faktisk skal pushe tilbake til repoet.
- Foretrekk federert identitet fremfor `secrets`. Hvis du må bruke `secrets`, legg dem på lavest mulig nivå.

### Bygg, push og deploy på NAIS

Vanlig flyt i Nav er å bygge et Docker-image fra Dockerfile, pushe imaget til GAR med `nais/docker-build-push`, og deploye med `nais/deploy`.

- `nais/docker-build-push` bruker federert identitet mot GAR og NAIS.
- Med standardinnstillingene oppretter, attesterer og signerer actionen en SBOM.
- Hvis du trenger autentisering i egne steg, for eksempel for å teste eller scanne selv, bruk `nais/login`.

```yaml
permissions:
  contents: read
  id-token: write

steps:
  - uses: nais/docker-build-push@078e460885ed0424b60d45ce9220b4be1748be9d # v0
    id: docker-push
    with:
      team: my-team
      push_image: true

  - uses: nais/deploy/actions/deploy@fa754451577294aae42872a69b888b3470478ec1 # v2
    env:
      CLUSTER: prod-gcp
      RESOURCE: nais.yaml
      IMAGE: ${{ steps.docker-push.outputs.image }}
```

### Når en GitHub App er et bedre valg enn en workflow

Hvis automasjonen må kommentere på issues eller pull requests, oppdatere andre repoer eller bruke mer privilegerte tokens, er en GitHub App ofte et tryggere valg enn en vanlig workflow.
Kjør aldri PR-kode du ikke stoler på i samme jobb som privilegerte tokens eller `secrets`.

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
