---
title: GitHub Copilot-sikkerhetsverktøy
description: AI-assisterte agenter og skills for sikker utvikling
tags:
  - copilot
  - ai
  - trusselmodellering
  - kodeanalyse
  - autentisering
---

**Relevante tema:**

- [Trusselmodellering](/docs/sikker-utvikling/trusselmodellering)
- [Statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse)
- [Tilgangsstyring](/docs/sikker-utvikling/tilgangsstyring)
- [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter)
- [GitHub best practices](/docs/sikker-utvikling/github)

Nav har sikkerhetsverktøy for GitHub Copilot som hjelper deg med trusselmodellering, kodegjennomgang, autentisering og sikkerhetsskanning — rett i editoren.

Verktøyene er bygget som _agenter_, _skills_ og _instruksjoner_ som Copilot bruker for å gi Nav-spesifikke svar. De kjenner til Nais-plattformen, TokenX, Azure AD, og følger rådene i denne playbooken.

## Kom i gang

Installer [nav-pilot](https://github.com/navikt/copilot) og velg en samling som passer prosjektet ditt. Sikkerhetsverktøyene følger med automatisk.

```bash
brew install navikt/tap/nav-pilot

# Installer en samling (inkluderer sikkerhetsverktøy)
nav-pilot install kotlin-backend   # Kotlin/Ktor/Spring Boot
nav-pilot install fullstack        # Kotlin + Next.js
nav-pilot install platform         # Plattform og infrastruktur
```

Etter installasjon kan du bruke verktøyene i VS Code, JetBrains eller terminalen:

```
@security-champion Trusselmodeller denne tjenesten
@auth-agent Hvordan setter jeg opp TokenX for denne appen?
@nav-pilot Jeg trenger en ny tjeneste som håndterer søknader
```

## Sikkerhetsagenter

### @security-champion

En agent som hjelper med trusselmodellering, GDPR-vurderinger og sikkerhetsarkitektur. Agenten bruker STRIDE-A-metodikken tilpasset Nav og kjenner til:

- **Trusselmodellering**: Systematisk gjennomgang med dataflytdiagram og STRIDE-A-kategorier (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege, Abuse)
- **Nav-tillitsgrenser**: Internett → Ingress → App → Kafka → Database → Eksternt API
- **GDPR og personvern**: Dataminimering, formålsbegrensning, PII-klassifisering
- **Forsvar i dybden**: Lagdelte sikkerhetstiltak med konkrete anbefalinger for Nais

```
@security-champion Gjennomfør en trusselmodellering av dagpengetjenesten
@security-champion Hva er de viktigste sikkerhetstruslene for en Kafka-basert hendelsesstrøm?
```

### @auth-agent

En agent som kjenner alle autentiserings- og autorisasjonsmekanismer i Nav:

- **Azure AD**: Ansattinnlogging, JWT-validering, gruppebasert tilgangsstyring
- **TokenX**: Tjeneste-til-tjeneste med brukerkontekst, token exchange
- **ID-porten + Wonderwall**: Innbyggerinnlogging med OIDC
- **Maskinporten**: Maskin-til-maskin for eksterne parter
- **JWT-claims**: Validering av `iss`, `aud`, `exp`, `azp` og pre-authorized apps

```
@auth-agent Hvordan validerer jeg et TokenX-token i Ktor?
@auth-agent Hvilken auth-mekanisme trenger jeg for maskin-til-maskin mot et eksternt API?
```

## Sikkerhetsskills

Skills er kunnskapspakker som agentene bruker, men som du også kan referere til direkte.

| Skill | Beskrivelse |
|-------|-------------|
| `$security-review` | Skanner kode før commit: hemmelighetssøk, CVE-er, SQL-injeksjon, OWASP Top 10, PII i logger |
| `$threat-model` | STRIDE-A trusselmodellering med dataflytdiagram og Nav-spesifikke tillitsgrenser |
| `$workstation-security` | Sikkerhetssjekk av utviklermaskinen: FileVault, brannmur, SSH, Git-credentials, naisdevice |
| `$tokenx-auth` | Implementasjonsguide for TokenX token exchange med Ktor, caching og testing |

## Sikkerhetsinstruksjoner

Instruksjoner er regler som aktiveres automatisk når du redigerer bestemte filtyper. Du trenger ikke gjøre noe — Copilot bruker dem i bakgrunnen.

### OWASP Top 10:2025 (`security-owasp`)

Aktiveres automatisk for Kotlin- og Go-filer. Dekker mønstre på kodenivå for alle OWASP Top 10:2025-kategorier:

- **A01 Broken Access Control**: IDOR-sjekk, eiervalidering, `azp`-validering for M2M
- **A03 Injection**: Parameteriserte spørringer, kommandoinjeksjon, mal-injeksjon
- **A05 Security Misconfiguration**: CORS-restriksjon, TLS, HTTP-klient-timeouts
- **A09 Logging & Monitoring**: Ingen PII i logger, korrelasjons-ID-er, strukturert logging

## Bruk i utviklingsflyten

### Med @nav-pilot

`@nav-pilot` sjekker sikkerhet i alle fire fasene:

1. **Intervju**: Avdekker blindsoner for PII-klassifisering, tilgangskontroll og feilhåndtering
2. **Plan**: Velger riktig auth-mekanisme, setter opp `accessPolicy`, og delegerer til `@security-champion` ved behov
3. **Review**: Sjekker auth-korrekthet, PII-beskyttelse og GDPR-etterlevelse
4. **Lever**: Inkluderer sikkerhetssjekkliste og observabilitetsplan

### Før commit

Bruk `$security-review` for å skanne endringene dine før du committer:

```
@security-champion Bruk $security-review til å sjekke koden min før commit
```

Denne kjører:
- Hemmelighetssøk med trivy og gitleaks
- CVE-skanning av avhengigheter
- GitHub Actions-sikkerhet med zizmor
- Sjekk av OWASP Top 10-mønstre

### Trusselmodellering i editoren

I stedet for å starte fra bunnen av kan du bruke `@security-champion` til å generere et utgangspunkt:

```
@security-champion Lag et dataflytdiagram og STRIDE-A-analyse for denne tjenesten
```

Agenten lager et strukturert resultat med trusler, alvorlighetsgrad og konkrete tiltak — klart til gjennomgang med teamet.

## Samlinger og innhold

Alle samlinger inkluderer sikkerhetsverktøy. Her er hva som følger med:

| Samling | Agenter | Skills | Instruksjoner |
|---------|---------|--------|---------------|
| `kotlin-backend` | security-champion | security-review, threat-model | security-owasp |
| `fullstack` | security-champion | security-review, threat-model, tokenx-auth | security-owasp |
| `platform` | security-champion | security-review, threat-model, workstation-security | security-owasp |

## Lenker

- [nav-pilot dokumentasjon](https://min-copilot.ansatt.nav.no/nav-pilot/docs)
- [navikt/copilot på GitHub](https://github.com/navikt/copilot)
- [Alle tilgjengelige agenter og skills](https://min-copilot.ansatt.nav.no/verktoy)

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
