---
title: Livssyklushåndtering
description: Sikkerheten stopper ikke ved deploy — vedlikehold, oppdater og avvikle på en trygg måte.
tags:
  - livssyklus
  - dekommisjonering
  - vedlikehold
---

Sikkerhetsansvaret varer fra første kodelinje til tjenesten er avviklet. Mange Nav-tjenester har lang levetid, og uten bevisst livssyklushåndtering vil sikkerheten gradvis forringes over tid.

## Definer status for tjenesten din

Hvert team bør vite hvilken tilstand tjenestene deres er i:

| Status | Betydning | Forventning |
|--------|-----------|-------------|
| **Aktiv** | Under aktiv utvikling | Sikkerhetsfikser prioriteres, features utvikles |
| **Vedlikehold** | Ingen nye features | Kun sikkerhetsfikser og kritiske bugfikser |
| **Deprecated** | Skal fases ut | Migrering pågår, kun kritiske sikkerhetsfikser |
| **Avviklet** | Tatt ned | Alle ressurser slettet, ingen kjørende instanser |

:::tip Gjør dette synlig
Legg status i repoets README. Da vet alle (inkludert fremtidige utviklere) hva de har med å gjøre.
:::

## Patch-SLA: Hvor raskt skal du fikse?

Sett en forventning i teamet for hvor raskt sikkerhetsoppdateringer skal merges:

| Alvorlighetsgrad | Forventet responstid |
|-----------------|---------------------|
| **Kritisk** (CVSS 9.0+) | Samme dag — dropp det du holder på med |
| **Høy** (CVSS 7.0–8.9) | Innen 3 virkedager |
| **Middels** (CVSS 4.0–6.9) | Innen 1 uke |
| **Lav** (CVSS < 4.0) | Neste planlagte vedlikehold |

Dependabot og Dependency-Track gir deg varsler — men det hjelper ikke hvis ingen merger PRen.

## Sikker oppdatering og rollback

Nais gir deg en trygg oppdateringsmekanisme ut av boksen:

- **Immutable containers:** Hver deploy er et nytt image med kjent innhold
- **Rolling update:** Nye pods startes før gamle stoppes (ingen nedetid)
- **Rollback:** Redeploy forrige versjon via workflow dispatch eller:

```bash
# Rask rollback til forrige fungerende deploy
kubectl rollout undo deployment/min-app -n mitt-team
```

- **Health checks:** Nais stopper utrulling hvis liveness/readiness feiler (self-healing)

## Lær fra produksjon

Ikke bare deploy og glem:

- **Post-incident review:** Etter hendelser — oppdater trusselmodellen basert på det dere lærte
- **Dependabot-trender:** Hvis samme type sårbarhet dukker opp gjentatte ganger, vurder å bytte bibliotek
- **Bruksmønstre:** Sjekk om tjenesten brukes som forventet, eller om det er uventet trafikk (se [logging](/docs/sikker-utvikling/logging))

## Dekommisjonering av en Nais-app

Når en tjeneste skal avvikles, bruk denne sjekklisten:

### 1. Forbered avvikling

- [ ] Verifiser at ingen andre tjenester er avhengige av appen (sjekk inbound access policies hos andre team)
- [ ] Informer eventuelle konsumenter om avviklingsdato
- [ ] Sjekk om det er krav til datalagring (juridisk logg, arkivplikt)

### 2. Fjern tilganger og secrets

- [ ] Slett secrets fra Google Secret Manager
- [ ] Fjern Azure AD app-registrering (eller marker som disabled)
- [ ] Fjern TokenX-konfigurasjonen
- [ ] Slett API-nøkler og service accounts

### 3. Fjern data

- [ ] Slett eller arkiver databasen (Cloud SQL)
- [ ] Slett Kafka-topics hvis appen er eneste produsent/konsument
- [ ] Slett eventuelle BigQuery-datasett
- [ ] Slett GCS-buckets
- [ ] Verifiser at personopplysninger er slettet iht. GDPR

### 4. Fjern infrastruktur

- [ ] Slett Nais-applikasjonen: fjern `nais.yaml` og deploy-workflow, eller kjør `kubectl delete app min-app`
- [ ] Fjern DNS-oppføringer / ingress
- [ ] Fjern access policy-regler som refererer til appen (i andre teams nais.yaml)

### 5. Rydd opp i kode

- [ ] Arkiver GitHub-repoet (Settings → Archive)
- [ ] Fjern repoet fra Dependabot/Dependency-Track-overvåking
- [ ] Oppdater team-dokumentasjon og eventuelle arkitekturtegninger

:::warning Ikke slett for tidlig
Vær sikker på at ingen er avhengige av tjenesten før du sletter. Sjekk trafikk i Grafana de siste 30 dagene. En tjeneste uten trafikk er sannsynligvis trygg å avvikle.
:::

## Sjekkliste — løpende vedlikehold

- [ ] Tjenestens livssyklusstatus er dokumentert i README
- [ ] Teamet har en avtalt patch-SLA
- [ ] Dependabot/Dependency-Track-varsler følges opp innen SLA
- [ ] Trusselmodell oppdateres etter hendelser eller større endringer
- [ ] Avviklede tjenester har gjennomgått dekommisjoneringssjekklisten

## Les mer

- [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode)
- [Automatiske oppdateringer](/docs/sikker-utvikling/automatiske-oppdateringer)
- [Beredskap](/docs/sikker-utvikling/beredskap)
- [Nais app deletion](https://doc.nais.io/workloads/how-to/delete/)

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
