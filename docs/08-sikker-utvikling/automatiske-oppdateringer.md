---
title: Automatiske oppdateringer
description: Sikkerhetsoppdateringer som ligger og venter er sårbarheter du vet om men ikke fikser.
tags:
  - oppdateringer
  - dependabot
  - vedlikehold
---

De fleste kompromitteringer av kjente sårbarheter skjer mot systemer der patchen allerede finnes — men ikke er installert. Automatiserte oppdateringer reduserer vinduet der appen din er sårbar.

## Oppdateringsstrategi for Nav-team

### Avhengigheter (biblioteker)

Bruk [Dependabot](/docs/verktoy/dependabot) for automatiske PRer ved nye versjoner:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  - package-ecosystem: "gradle"
    directory: "/"
    schedule:
      interval: "weekly"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

:::tip Sikkerhetsoppdateringer kommer alltid
Dependabot lager PRer for kjente sårbarheter uavhengig av schedule. `interval: weekly` styrer kun versjonsoppdateringer.
:::

### Base images (Docker)

For Chainguard-images: bruk [digestabot](https://github.com/chainguard-images/digestabot) for automatiske PRer når nye image-digests publiseres. Se [Chainguard-verktøysiden](/docs/verktoy/chainguard-dockerimages) for oppsett.

For andre images: Dependabot sin `docker`-ecosystem fanger opp nye tags.

### GitHub Actions

Pin actions til SHA og la Dependabot oppdatere dem:

```yaml
# Eksempel — pinnet til SHA, oppdateres automatisk av Dependabot
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

## Skill sikkerhetsfikser fra feature-arbeid

Dependabot-PRer er rene sikkerhets-/vedlikeholdsoppdateringer. Behandle dem separat:

- **Ikke bundle** Dependabot-PRer med feature-branches
- **Merge raskt** — de er allerede testet av CI
- **Ikke ignorer** — en Dependabot-PR som ligger i ukevis er en akseptert sårbarhet

### Forventet responstid

| Type | Forventning |
|------|-------------|
| Dependabot security alert (kritisk/høy) | Merge innen 1–3 virkedager |
| Dependabot security alert (middels) | Merge innen 1 uke |
| Dependabot version update | Merge ved neste vedlikeholdsvindu |

## Trygg utrulling

Nais gir deg en trygg oppdateringsmekanisme:

- **Rolling update:** Nye pods starter før gamle stoppes — ingen nedetid ved deploy
- **Health checks:** Deployment stopper hvis nye pods ikke blir healthy
- **Rollback:** Redeploy forrige versjon (workflow dispatch) eller:

```bash
kubectl rollout undo deployment/min-app -n mitt-team
```

- **Canary / gradvis utrulling:** For større endringer kan du bruke [Unleash feature flags](https://docs.getunleash.io/) til å aktivere for en liten gruppe først

## Verifisering av oppdateringer

Nais verifiserer integriteten av det som deployes:

- **Image signing:** Images signeres med [cosign/Sigstore](https://docs.sigstore.dev/) og verifiseres ved deploy
- **Provenance attestations:** SLSA-attesteringer viser at imaget ble bygget av din CI-pipeline
- **Kyverno-policies:** Kun images fra godkjente registries tillates i clusteret

Du trenger ikke sette opp dette selv — det er en del av Nais-plattformen. Men vit at det er der.

## Varsling

Sett opp varsler slik at Dependabot-alerter ikke drukner i støy:

- **GitHub → Slack:** Bruk GitHub-appen i Slack for å få varsler i teamkanalen:
  ```
  /github subscribe navikt/mitt-repo vulnerabilities
  ```
- **Dependency-Track:** Nais Console viser sårbarheter per app — sjekk dashboardet ukentlig
- **Renovate (alternativ):** Noen team foretrekker [Renovate](https://docs.renovatebot.com/) for mer kontroll over gruppering og auto-merge

## Sjekkliste

- [ ] Dependabot er konfigurert for alle økosystemer (npm/gradle/docker/actions)
- [ ] Teamet har en avtalt SLA for å merge sikkerhets-PRer
- [ ] Base images oppdateres automatisk (digestabot eller Dependabot docker)
- [ ] GitHub Actions er pinnet til SHA (ikke `@v3` eller `@main`)
- [ ] Dependabot-alerter er synlige for teamet (Slack/dashboard)
- [ ] Teamet sjekker Dependency-Track i Nais Console minst ukentlig

## Les mer

- [Dependabot](/docs/verktoy/dependabot)
- [Chainguard base images](/docs/verktoy/chainguard-dockerimages)
- [Nais Console og Dependency-Track](/docs/verktoy/nais-console-dp-track)
- [Supply chain-sikkerhet](/docs/sikker-utvikling/supply-chain)
- [Livssyklushåndtering](/docs/sikker-utvikling/livssyklus)

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
