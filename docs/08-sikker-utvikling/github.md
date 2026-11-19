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
- [Bruk GitHubs innebygde token eller octo-sts, ikke PAT-er med vide tilganger.](#tokens)
- [Fjern privileged triggers.](#workflow-triggers)
- [Bruk intermediate variables.](#bruk-intermediate-variables)
- [Lås tredjeparts-actions med lockfil eller commit SHA.](#pin-tredjeparts-actions)
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

Tags i GitHub er mutable. Bruker du `v1`, kan den peke på annen kode i morgen enn i dag. Blir kontoen til en maintainer kompromittert, kan angriperen flytte taggen til ondsinnet kode, og workflowen din kjører den neste gang. Lås derfor actions til en bestemt commit. Vi anbefaler å gjøre det med en lockfil. Alternativet er å pinne commit SHA i workflow-filene.

#### Lockfil for actions

En [workflow dependency lockfile](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles) låser alle actions workflowene bruker til en commit SHA. Det gjelder også transitive avhengigheter, altså actions som actionene dine bruker. Lockfilen ligger i `.github/workflows/actions.lock` og lagrer også ID-en til repoet og eieren av hver action. Da oppdager GitHub det hvis noen andre har tatt over navnet. Workflow-filene kan beholde lesbare versjonstagger.

Lag lockfilen med GitHub CLI fra rota av repoet:

```bash
gh extension install github/gh-actions-lock
gh actions-lock
```

Kommandoen skriver lockfilen og endrer `uses:`-linjene til full versjon, for eksempel fra `@v3` til `@v3.1.0`. Se gjennom hele diffen før du committer. Vil du ta én workflow om gangen, kjør `gh actions-lock .github/workflows/ci.yml`. Se [GitHubs guide](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies) for flere valg og feilsøking.

Hold lockfilen oppdatert:

- La [Dependabot](/docs/verktoy/dependabot) oppdatere actions. For workflows som er med i lockfilen, oppdaterer Dependabot lockfilen i samme pull request.
- Kjør `gh actions-lock` på nytt når du legger til en workflow eller endrer hvilke actions en workflow bruker.
- Kjør `gh actions-lock --verify` som påkrevd status check på pull requests. Sjekken feiler hvis lockfilen er utdatert. GitHub har en [eksempel-workflow](https://github.com/github/gh-actions-lock/blob/main/.github/workflows/verify-lockfile.yml).
- Ikke rediger lockfilen for hånd.

Gå gjennom endringer i lockfilen slik du gjør med andre avhengigheter. En ny `commit` betyr at workflowene kjører ny kode. Endres `owner_id` eller `repo_id`, er repoet bak navnet et annet enn det du låste, og du bør undersøke hvorfor før du merger. Legg gjerne `.github/workflows/actions.lock` inn i `CODEOWNERS`.

Lockfilen låser ikke disse, så de må du fortsatt pinne selv:

- Kall til reusable workflows (`jobs.<job_id>.uses`). Pin dem til commit SHA. En reusable workflow i et annet repo dekkes av lockfilen i det repoet.
- Docker-images i workflows og actions. Pin dem til digest.
- Actions som brukes inne i composite actions du lager selv (`action.yml`). De låses bare når en workflow bruker den composite actionen.
- Lokale actions med `uses: ./…`. Kjør `gh actions-lock --migrate-local-actions` for å bytte til `uses: $/…`, som alltid kjører koden fra samme commit som workflowen.

[zizmor](/docs/verktoy/zizmor) forstår lockfiler fra versjon 1.32.0, men støtten er foreløpig eksperimentell.

#### Commit SHA i workflow-filen

Bruker du ikke lockfil, pin tredjeparts-actions til commit SHA i workflow-filen.

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

Best practice er å bruke GitHubs innebygde tokens fremfor å lage egne personal access tokens (PATs). Hvis du trenger et token for å hente andre interne repoer, eller for at en merge skal utløse andre workflows, bruker du [octo-sts](https://github.com/octo-sts/app).

octo-sts er en GitHub App fra Chainguard som er installert i alle repoer i `navikt`. Workflowen bytter sitt eget OIDC-token mot et kortlevd installation token. Hva tokenet får lov til, styres av en trust policy som ligger i repoet tokenet skal gi tilgang til.

Sammenlignet med PAT og egne GitHub Apper:

- Du har ingen hemmelighet å lagre, rotere eller lekke. Det finnes ingen privat nøkkel eller PAT i repoet.
- Tokenet lever i maks én time, og `octo-sts/action` tilbakekaller det når jobben er ferdig.
- Tokenet gjelder bare ett repo og har bare rettighetene som står i trust policyen.
- Tilgangen er ikke knyttet til en person. Workflows slutter ikke å virke når noen slutter i Nav eller bytter team.
- Teamet som eier repoet, bestemmer hvem som får tilgang, fordi trust policyen sjekkes inn og reviewes som annen kode.

Bruk denne prioriteringen:

1. `GITHUB_TOKEN` for samme repository.
2. octo-sts når du trenger tilgang på tvers av repoer, eller når handlingen skal utløse andre workflows, også i samme repo.
3. PAT (Personal Access Token) bare hvis du har en helt konkret grunn og ikke har bedre alternativer.

For automatisk merge som også skal utløse deploy, følg [oppsettet for `navikt/automerge-dependabot`](/docs/verktoy/dependabot#automatisk-merge-av-dependabot-pr-er).

<CollapsibleSection>
### Slik virker octo-sts

1. Workflowen kaller `octo-sts/action` med `scope` (repoet tokenet skal gi tilgang til) og `identity` (navnet på trust policyen).
2. octo-sts leser `.github/chainguard/<identity>.sts.yaml` fra default branch i repoet som står i `scope`.
3. octo-sts sjekker at workflowens OIDC-token matcher `issuer`, `subject` og eventuelle `claim_pattern` i policyen.
4. Hvis alt matcher, får workflowen et token med rettighetene i `permissions`. Ellers feiler steget.

Trust policyen ligger altså alltid i repoet det skal lages token **for**, ikke i repoet workflowen kjører i. Skal repo A hente kode fra repo B, er det teamet som eier repo B som sjekker inn policyen.

### Skriv en trust policy

Lag filen `.github/chainguard/<navn>.sts.yaml` i repoet tokenet skal gi tilgang til. Gi den et navn som forteller hva den brukes til, for eksempel `automerge-dependabot.sts.yaml`. Navnet uten `.sts.yaml` er verdien du bruker i `identity`.

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/octo-sts/app/refs/heads/main/pkg/octosts/octosts.TrustPolicy.json

issuer: https://token.actions.githubusercontent.com
subject: repo:navikt@11848947/min-app@123456789:ref:refs/heads/main
claim_pattern:
  job_workflow_ref: navikt/min-app/\.github/workflows/dependabot-automerge\.yml@refs/heads/main

permissions:
  contents: write
  pull_requests: write
```

- `issuer` er alltid `https://token.actions.githubusercontent.com` for GitHub Actions.
- `subject` sier hvilket repo og hvilken branch workflowen må kjøre fra. Alle repoer i `navikt` bruker [immutable subject claims](https://docs.github.com/en/actions/reference/security/oidc#immutable-subject-claims), så subject inneholder både navn og ID: `repo:navikt@<owner-id>/<repo>@<repo-id>:ref:refs/heads/<branch>`.
- `job_workflow_ref` låser policyen til én bestemt workflow-fil. Uten den kan alle workflows på `main` i repoet hente tokenet. Verdien er et regulært uttrykk som må matche hele verdien, så escape punktum med `\.`.
- `permissions` bruker samme navn som [GitHub App-rettigheter](https://docs.github.com/en/rest/apps/apps#create-an-installation-access-token-for-an-app), for eksempel `contents`, `pull_requests`, `workflows`, `checks` og `statuses`. Gi bare det jobben trenger.

:::tip Finn subject for repoet ditt
Hent prefikset med GitHub CLI og legg til `:ref:refs/heads/main`:

```bash
gh api repos/navikt/<repo>/actions/oidc/customization/sub --jq .sub_claim_prefix
```

Du finner det samme under **Default subject claim prefix** på `https://github.com/navikt/<repo>/settings/actions/oidc-configuration`. ID-en til `navikt` er alltid `11848947`.

Fordi subject inneholder ID-er, kan ikke et annet repo som senere tar over navnet hente tokenet. Renamer du repoet, endres navnet i subject, men ikke ID-ene. Oppdater da `subject` og `job_workflow_ref` i policyen.
:::

Regler for trust policies:

- Lås `subject` til default branch. Ikke bruk `subject_pattern` som matcher alle brancher, `pull_request` eller tags. Da kan alle som kan pushe en branch, hente tokenet.
- Lås policyen til én workflow med `job_workflow_ref`.
- Lag én policy per bruksområde, ikke én stor policy med alle rettigheter.
- Legg `.github/chainguard/` inn i `CODEOWNERS`, slik at teamet må godkjenne endringer i hvem som får tilgang.
- Policyen må ligge på default branch før den virker.

### Hente token for samme repo

Bruk dette når handlingen skal utløse andre workflows, for eksempel at en merge skal starte deploy. Policyen ligger i samme repo som workflowen.

```yaml
permissions: {}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Trengs for å hente token fra octo-sts
    steps:
      - uses: octo-sts/action@f603d3be9d8dd9871a265776e625a27b00effe05 # v1.1.1
        id: octo-sts
        with:
          scope: ${{ github.repository }}
          identity: min-policy

      - run: gh pr list
        env:
          GH_TOKEN: ${{ steps.octo-sts.outputs.token }}
```

`id-token: write` lar jobben hente et OIDC-token. Det gir ikke tilgang til repoet i seg selv. Tokenets rettigheter kommer bare fra trust policyen.

### Hente token for andre repos

Skal `navikt/app-a` lese det interne repoet `navikt/app-b`, sjekker teamet som eier `app-b` inn denne policyen i `navikt/app-b`, for eksempel som `.github/chainguard/app-a-les.sts.yaml`. `subject` er subject for `app-a`, altså repoet workflowen kjører i:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/octo-sts/app/refs/heads/main/pkg/octosts/octosts.TrustPolicy.json

issuer: https://token.actions.githubusercontent.com
subject: repo:navikt@11848947/app-a@123456789:ref:refs/heads/main
claim_pattern:
  job_workflow_ref: navikt/app-a/\.github/workflows/build\.yml@refs/heads/main

permissions:
  contents: read
```

Workflowen i `navikt/app-a`:

```yaml
- uses: octo-sts/action@f603d3be9d8dd9871a265776e625a27b00effe05 # v1.1.1
  id: octo-sts
  with:
    scope: navikt/app-b
    identity: app-a-les

- uses: actions/checkout@v6
  with:
    repository: navikt/app-b
    token: ${{ steps.octo-sts.outputs.token }}
    persist-credentials: false
```

Ett token gir tilgang til ett repo. Trenger du flere repoer, legger du en policy i hvert av dem og kaller `octo-sts/action` én gang per repo.

### Migrer fra egen GitHub App

Har teamet en egen GitHub App og bruker `actions/create-github-app-token`, bytt til octo-sts:

1. Sjekk inn en trust policy med de samme rettighetene som `permission-*`-feltene i dag, i hvert repo appen lager token for. Merge den til default branch.
2. Bytt `actions/create-github-app-token`-steget med `octo-sts/action`. Sett `scope` til repoet du tidligere ga i `repositories`, eller `${{ github.repository }}` for samme repo.
3. Gi jobben `id-token: write`.
4. Erstatt `steps.app-token.outputs.token` med `steps.octo-sts.outputs.token`.
5. Sjekk om andre workflows filtrerer på aktør, for eksempel `github.actor == 'min-app[bot]'`. Aktøren er nå `octo-sts[bot]`.
6. Kjør workflowen og sjekk at den virker, også at deploy starter hvis det er poenget.
7. Slett Actions-variabelen `CLIENT_ID` og secreten `PRIVATE_KEY` fra repoet.
8. Når ingen workflows bruker appen lenger, be om at den avinstalleres og slettes i `#github-support`.

### Feilsøking

Feiler `octo-sts/action`, er det nesten alltid et av disse:

- Jobben mangler `id-token: write`.
- `subject` mangler ID-ene eller har feil repo-ID. Hent riktig prefiks som beskrevet i [Skriv en trust policy](#skriv-en-trust-policy).
- Workflowen kjørte fra en annen branch enn den policyen tillater, for eksempel fra en PR.
- `job_workflow_ref` matcher ikke, for eksempel fordi filen heter `.yaml` og ikke `.yml`, eller punktum ikke er escapet.
- Policyen ligger ikke på default branch i repoet i `scope`, eller `identity` matcher ikke filnavnet.

Se [octo-sts-dokumentasjonen](https://github.com/octo-sts/app#the-trust-policy) for flere valg.
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
