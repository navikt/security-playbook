---
title: Github best practices
description: Orden i repo gir ro i sjela ✨.
---
import CollapsibleSection from '@site/src/components/CollapsibleSection';

I Nav har vi satt opp to repositories som viser en god standard for GitHub-oppsett. Her finner du eksempler på applikasjoner som bygges, scannes og deployes til NAIS.

Du finner dem her: [Backend](https://github.com/navikt/backend-golden-path) og [Frontend](https://github.com/navikt/frontend-golden-path).

GitHub har også skrevet en guide med best practices for GitHub Actions, du finner [den her](https://docs.github.com/en/actions/reference/security/secure-use).

## Start her

Hvis du bare skal gjøre noen få ting først, gjør disse:

- [Sett opp branch protection for default branch.](#branch-protection)
- [Bruk GitHubs innebygde token eller GitHub App-tokens, ikke PAT-er med vide tilganger.](#tokens)
- [Fjern privileged triggers.](#workflow-triggers)
- [Bruk intermediate variables.](#bruk-intermediate-variables)
- [Pin tredjeparts-actions til commit SHA.](#pin-tredjeparts-actions)
- [Sett minimum permissions i workflowene dine.](#use-minimum-permissions)
- Kjør [zizmor](/docs/verktoy/zizmor) mot `.github/workflows`.
- Bruk [Dependabot](/docs/verktoy/dependabot) med cooldown og sørg for at dependency graph er korrekt.

<CollapsibleSection>

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
</CollapsibleSection>

<CollapsibleSection>
## Github Actions

GitHub Actions er en kraftig CI/CD-plattform. Det betyr også at feil i workflowene dine kan gi store konsekvenser. Under følger de viktigste tiltakene for å sikre pipeline-en din.

Vi har også verktøyene [CodeQL](/docs/verktoy/github-advanced-security#codeql-statisk-kodeanalyse) og [zizmor](/docs/verktoy/zizmor) som kan hjelpe deg med å sørge for at workflowene dine er trygt konfigurert.

### Workflow triggers

**Unngå `pull_request_target` og `workflow_run`**

Begge triggerne kjører med tilgang til secrets og utvidede rettigheter, men kan utløses av uautoriserte aktører, hvem som helst kan åpne en PR eller pushe til en fork. Hvis workflowen sjekker ut og kjører kode fra PR-en (tester, bygg, installasjon), kjører angriperens kode med reposets rettigheter, og eksponerer secrets og skrivetilgang.

**Bruk i stedet:**
- `pull_request` (ikke `_target`) for alt som kjører kode fra andre, den får ingen secrets og kun lesetilgang.
- Hvis du trenger både kjøring av kode *og* privilegerte handlinger (f.eks. poste testresultater som kommentar på PR-en), del det opp: kjør tester under upriviligert `pull_request`, last opp resultater som artifact, og bruk deretter en separat `workflow_run`-jobb som kun leser artifact-dataen (aldri kjører den) for å utføre den privilegerte handlingen.
- Sjekk aldri ut PR-ens head-kode under `pull_request_target`.


### Bruk intermediate variables

Bruk intermediate variables for alle variabler som senere brukes i shell eller scripts. Sett variablene i `env:` og sørg for inputvalidering. Hvis du bruker for eksempel `${{ github.event.pull_request.title }}` direkte i en `run:`-kommando kan du bli sårbar for command injection.

Eksempel:

```yaml
name: Check PR title
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: |
    echo "PR title is $TITLE"
```

Les mer i [GitHubs docs](https://docs.github.com/en/actions/reference/security/secure-use#use-an-intermediate-environment-variable).

### Pin tredjeparts-actions

Pin tredjeparts-actions til commit SHA.

- GitHub-tags er mutable. Hvis du bruker `v1` kan den peke til noe annet i morgen enn i dag.
- Vi anbefaler at man pinner actions slik: `nais/docker-build-push@aed4d69de423d70d995a9fac4bb00dedb7b00f91`.
- Hvis du bruker Dependabot kan du legge til en kommentar med versjonen som oppdateres, for eksempel `action@hash # v1.2.3`.
- [Ratchet](https://github.com/sethvargo/ratchet) kan hjelpe med dette.
- GitHubs egne actions er nå immutable og kan bruke tags.

Det finnes også en GitHub CLI-utvidelse som kan pinne og oppdatere workflow-actions for deg. `navikt/gh-act` er en fork av `wayneashleyberry/gh-act`:

```bash
gh extension install navikt/gh-act
gh act pin
git add .
git commit -m "pinned workflow actions to commit sha"
git push
```

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
</CollapsibleSection>

<CollapsibleSection>
## Secret scanning og dependency graph

### Secret scanning

Secret scanning er skrudd på som standard og kan blokkere pushes hvis du prøver å sjekke inn hemmeligheter. Secret scanning scanner også repoet for å finne eksisterende hemmeligheter.

Husk at dette kun scanner kildekoden i repoet ditt, ikke det du bygger inn i Docker-images.

Les mer om hemmeligheter på siden [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter).

### Dependency graph

Dependency graph er listen over avhengigheter som brukes i prosjektet. Den brukes av GitHub Security for å opprette varsler når de finner en sårbar avhengighet i repoet.

Det er derfor viktig at dependency graph faktisk stemmer. Mer om dette finner du på [Dependabot-siden](../verktoy/dependabot).
</CollapsibleSection>

<CollapsibleSection>
## Tokens

Best practice er å bruke GitHubs innebygde tokens fremfor å lage egne personal access tokens (PATs). Hvis du trenger et token for å hente andre interne repoer kan du bruke et installation token fra en GitHub App. Da kan du scope tokenet til presis det du trenger med tilgang til kun et fåtall repoer.

Bruk av token fra GitHub App har flere fordeler sammenlignet med PAT. Tokenet har kort levetid (1 time), du gir kun de tilgangene du trenger for jobben du skal gjøre, og hvis du slutter i Nav, bytter team, eller av en eller annen grunn får deaktivert kontoen din, slutter ikke alle workflows som bruker tokenet å virke.

Bruk denne prioriteringen:

1. `GITHUB_TOKEN` for samme repository.
2. GitHub App installation token når du trenger tilgang på tvers av repoer.
3. PAT (Personal Access Token) bare hvis du har en helt konkret grunn og ikke har bedre alternativer.

<CollapsibleSection>
### Hvordan opprette GitHub App

1. Registrer en ny GitHub App under innstillinger til brukeren din: https://github.com/settings/apps/new.
2. Gi appen et navn og en URL.
3. Skru av `Webhook` hvis du ikke trenger det.
4. Under `Permissions & events`, gi appen kun rettighetene den trenger.
5. Under `Where can this GitHub App be installed?`, velg `Only on this account`.
6. Klikk på `Create GitHub App`.
7. Kopier Client ID. Dette er ikke sensitiv informasjon.
8. Under `General`, scroll ned til `Private keys` og lag en ny nøkkel.
9. Lagre nøkkelen på et sikkert sted, og slett den fra harddisken når den er lagt inn der den skal brukes.
10. Under `Advanced`, bruk `Transfer ownership` og overfør appen til `navikt`.
11. Be en GitHub-admin i `#github-support` godkjenne overføringen.
12. Installer appen i `navikt`-organisasjonen og velg kun repoene den skal ha tilgang til.

### Hvordan ta i bruk din nye GitHub App

Nå har du en app som kan lage kortlevde tokens med kun de rettighetene den trenger. Client ID og den private nøkkelen må legges inn i hvert repo som skal bruke appen.

1. Gå til repoet som skal bruke appen.
2. Gå til `Settings > Secrets and variables > Actions > Variables > New repository variable` og lag en variabel med navn `CLIENT_ID`.
3. Gå til `Secrets > New repository secret` og lag en secret med navn `PRIVATE_KEY`.
4. Nå kan du bruke appen i workflowene dine for å lage tokens med kun de rettighetene du trenger.

### Hente token for samme repo

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-github-app-token@v3
        id: app-token
        with:
          client-id: ${{ vars.CLIENT_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}

      - uses: ./actions/staging-tests
        with:
          token: ${{ steps.app-token.outputs.token }}
```

### Hente token for andre repos

```yaml
- uses: actions/create-github-app-token@v3
  id: app-token
  with:
    client-id: ${{ vars.CLIENT_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    owner: ${{ github.repository_owner }}
    repositories: |
      repo1
      repo2
```

### Hente token for alle repos appen har tilgang til

```yaml
- uses: actions/create-github-app-token@v3
  id: app-token
  with:
    client-id: ${{ vars.CLIENT_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    owner: ${{ github.repository_owner }}
```
</CollapsibleSection>
</CollapsibleSection>

<CollapsibleSection>
## Andre verktøy

- [CodeQL](../verktoy/github-advanced-security#codeql-statisk-kodeanalyse)
  - CodeQL har støtte for scanning av applikasjoner og GitHub workflows.
- [Trivy](../verktoy/trivy)
  - Trivy bruker vi for å sikre at vi ikke lekker hemmeligheter når vi bygger Docker-images.
- [Dependabot](../verktoy/dependabot)
  - Versjonshåndtering av avhengigheter. Jevnlig patching gjør livet enklere og applikasjonene sikrere.
</CollapsibleSection>

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
