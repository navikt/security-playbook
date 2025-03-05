---
title: Github best practices
description: Veiledning for sikker bruk av Github
---

I Nav har vi satt opp to repositories som skall ge ett hint om vad "best practice" er for att bruke Github.
Her finner du eksempel på en applikasjon som bygges, scannes og deployes til Nais.

Du finner dem her: [Backend](https://github.com/navikt/backend-golden-path) og [Frontend](https://github.com/navikt/frontend-golden-path).

Github har selv skrevet en guide med best practices for github actions, du finner [den her](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).
Men nedenfor finner du en kort oppsummering av de viktigste punktene.

## Repository settings

### Branch protection

Sett opp branch protection for default branch for å unngå att noen sletter kode.

- Settings > Rules > Rulesets > New Ruleset > New branch ruleset
  - Add target -> Include default branch
  - Bruke anbefalte defaults:
    - Restrict deletion
    - Block force push

## Github Actions

### Workflows

- Bruk intermediate variables for alle variabler. ([Github docs ref](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-an-intermediate-environment-variable))
  - Sett dine variabler i `env:` å sikre att du har input validering. Bruker du f.eks. `${{ github.event.pull_request.title }}` direkte i en bash run kan du vara sårbar for command injection.
- Pin 3rd party actions to commit sha ([Github docs ref](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions))
  - Github tags er mutable, noe som betyr att hvis du bruker v1.0 av en action kan den endres uten att du merker noe. Anbefales att man pinner actions á la `nais/docker-build-push@aed4d69de423d70d995a9fac4bb00dedb7b00f91`
  - Githubs egne actions er nå immutable og kan bruke tags.
- Use minimum permissions
  - Ting skjer, plutselig lekker man en github token på internet og en ondsint aktør får tak i den. Men hvis det eneste du kan gjøre med tokenet er å hente kildekoden stopper du attacken der.
  - Bruk minst mulig permissions i dine workflows, sett permissions for hvert eneste steg i workflowen. Skall du bygge og teste applikasjonen uten å pushe docker-image trenger du f.eks. ikke id-token.

## Secret scanning

Skrudd på by default, fanger opp hemmeligheter før de blir committet.
Og scanner repoet for å finne eksisterende hemmeligheter.

Husk att det kun er kildekoden som er påvirket, ting som skjer i workflows som for eksempel når du bygger docker images scannes ikke av github.

## Andre verktøy

- Dependency graph
  - Dependency graph er en liste over avhengigheter som er brukt i prosjektet.
  - Brukes av github security for å opprette security alerts når de finner en sårbar avhengighet i repoet.
  - Derfor er det viktig att man sikkrer att informasjonen her stemmer, mer info om dette på [dependabot-siden](../verktoy/dependabot).
- [CodeQL](../verktoy/github-advanced-security)
  - CodeQL har støtte for scanning av applikasjoner og github workflows.
- [Trivy](../verktoy/trivy)
  - Trivy bruker vi for å sikkre att vi ikke lekker hemmeligheter når vi bygger docker images.
- [Dependabot](../verktoy/dependabot)
  - Versjonshåndtering av avhengigheter. Jevnlig patching gjør livet enklere och applikasjonene sikkrere.

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
