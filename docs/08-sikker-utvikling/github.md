---
title: Github best practices
description: Orden i repo gir ro i sjela ✨.
---

I Nav har vi satt opp to repositories som viser en god standard for GitHub-oppsett. Her finner du eksempler på applikasjoner som bygges, scannes og deployes til NAIS.

Du finner dem her: [Backend](https://github.com/navikt/backend-golden-path) og [Frontend](https://github.com/navikt/frontend-golden-path).

GitHub har også skrevet en guide med best practices for GitHub Actions, du finner [den her](https://docs.github.com/en/actions/reference/security/secure-use).

## Start her

Hvis du bare skal gjøre noen få ting først, gjør disse:

- Sett opp branch protection for default branch.
- Bruk GitHubs innebygde token eller GitHub App-tokens, ikke brede PAT-er.
- Pin tredjeparts-actions til commit SHA.
- Sett minimum permissions i workflowene dine.
- Kjør [zizmor](/docs/verktoy/zizmor) mot `.github/workflows`.
- Bruk [Dependabot](/docs/verktoy/dependabot) med cooldown og sørg for at dependency graph er korrekt.

## Repository settings

### Eierskap

I Nav anbefaler vi at et nais-team står som admin for et repository. Når folk slutter eller bytter team blir det mye mindre manuelt arbeid hvis repoet eies av teamet, ikke enkeltpersoner.

### Branch protection

Sett opp branch protection for default branch for å unngå at noen sletter kode eller pusher forbi review og checks.

- Settings > Rules > Rulesets > New Ruleset > New branch ruleset
- Add target -> Include default branch
- Bruk anbefalte defaults:
  - Restrict deletion
  - Block force push
  - Require pull request before merging
  - Require status checks to pass

## Github Actions

GitHub Actions er en kraftig CI/CD-plattform. Det betyr også at feil i workflowene dine kan gi store konsekvenser. Under følger de viktigste tiltakene for å sikre pipeline-en din.

Vi har også verktøyene [CodeQL](/docs/verktoy/github-advanced-security#codeql-statisk-kodeanalyse) og [zizmor](/docs/verktoy/zizmor) som kan hjelpe deg med å sørge for at workflowene dine er trygt konfigurert.

### Bruk intermediate variables

Bruk intermediate variables for alle variabler som senere brukes i shell eller scripts. Sett variablene i `env:` og sørg for inputvalidering. Hvis du bruker for eksempel `${{ github.event.pull_request.title }}` direkte i en `run:`-kommando kan du bli sårbar for command injection.

Les mer i [GitHubs docs](https://docs.github.com/en/actions/reference/security/secure-use#use-an-intermediate-environment-variable).

### Pin tredjeparts-actions

Pin tredjeparts-actions til commit SHA.

- GitHub-tags er mutable. Hvis du bruker `v1` kan den peke til noe annet i morgen enn i dag.
- Vi anbefaler at man pinner actions slik: `nais/docker-build-push@aed4d69de423d70d995a9fac4bb00dedb7b00f91`.
- Hvis du bruker Dependabot kan du legge til en kommentar med versjonen som oppdateres, for eksempel `action@hash # v1.2.3`.
- [Ratchet](https://github.com/sethvargo/ratchet) kan hjelpe med dette.
- GitHubs egne actions er nå immutable og kan bruke tags.

Les mer i [GitHubs docs](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions).

### Use minimum permissions

Bruk minst mulige permissions i workflowene dine. Lekker en GitHub-token, er skaden begrenset hvis tokenet bare kan lese kildekode.

- Sett `permissions` eksplisitt i workflowene dine.
- Gi bare rettighetene jobben faktisk trenger.
- Trenger du bare å bygge og teste, trenger du for eksempel ikke `id-token`.

### Kjør zizmor

[zizmor](/docs/verktoy/zizmor) finner mange vanlige sikkerhetsproblemer i GitHub Actions-konfigurasjon. Det er et raskt og nyttig verifiseringssteg når du herder et repo.

```bash
zizmor .github/workflows
```

## Secret scanning og dependency graph

### Secret scanning

Secret scanning er skrudd på som standard og kan blokkere pushes hvis du prøver å sjekke inn hemmeligheter. Secret scanning scanner også repoet for å finne eksisterende hemmeligheter.

Husk at dette kun scanner kildekoden i repoet ditt, ikke det du bygger inn i Docker-images.

Les mer om hemmeligheter på siden [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter).

### Dependency graph

Dependency graph er listen over avhengigheter som brukes i prosjektet. Den brukes av GitHub Security for å opprette varsler når de finner en sårbar avhengighet i repoet.

Det er derfor viktig at dependency graph faktisk stemmer. Mer om dette finner du på [Dependabot-siden](../verktoy/dependabot).

## Tokens

Best practice er å bruke GitHubs innebygde tokens fremfor å lage egne personal access tokens (PATs). Hvis du trenger et token for å hente andre interne repoer kan du bruke et installation token fra en GitHub App. Da kan du scope tokenet til presis det du trenger med tilgang til kun et fåtall repoer.

Bruk denne prioriteringen:

1. `GITHUB_TOKEN` for samme repository
2. GitHub App installation token når du trenger tilgang på tvers av repoer
3. PAT bare hvis du har en helt konkret grunn og ikke har bedre alternativer

4. Registrer en ny GitHub App under innstillinger til brukeren din: https://github.com/settings/apps/new
5. Gi appen et navn og en URL.
6. Skru av `Webhook` hvis du ikke trenger det.
7. Under `Permissions & events`, gi appen kun rettighetene den trenger.
8. Under `Where can this GitHub App be installed?`, velg `Only on this account`.
9. Klikk på `Create GitHub App`.
10. Kopier App ID. Dette er ikke sensitiv informasjon.
11. Under `General`, scroll ned til `Private keys` og lag en ny nøkkel.
12. Lagre nøkkelen på et sikkert sted, og slett den fra harddisken når den er lagt inn der den skal brukes.
13. Under `Advanced`, bruk `Transfer ownership` og overfør appen til `navikt`.
14. Be en GitHub-admin i `#github-support` godkjenne overføringen.
15. Installer appen i `navikt`-organisasjonen og velg kun repoene den skal ha tilgang til.

Nå har du en app som kan lage kortlevde tokens med kun de rettighetene den trenger. App ID og den private nøkkelen må legges inn i hvert repo som skal bruke appen.

1. Gå til repoet som skal bruke appen.
2. Gå til `Settings > Secrets and variables > Actions > Variables > New repository variable` og lag en variabel med navn `APP_ID`.
3. Gå til `Secrets > New repository secret` og lag en secret med navn `PRIVATE_KEY`.
4. Nå kan du bruke appen i workflowene dine for å lage tokens med kun de rettighetene du trenger.

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

## Andre verktøy

- [CodeQL](../verktoy/github-advanced-security#codeql-statisk-kodeanalyse)
  - CodeQL har støtte for scanning av applikasjoner og GitHub workflows.
- [Trivy](../verktoy/trivy)
  - Trivy bruker vi for å sikre at vi ikke lekker hemmeligheter når vi bygger Docker-images.
- [Dependabot](../verktoy/dependabot)
  - Versjonshåndtering av avhengigheter. Jevnlig patching gjør livet enklere og applikasjonene sikrere.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
