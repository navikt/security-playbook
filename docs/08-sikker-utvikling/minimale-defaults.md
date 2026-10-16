---
title: Minimale defaults
description: Start lukket, åpne kun det du trenger — angrepsflaten din er summen av alt som er aktivert.
tags:
  - angrepsflate
  - defaults
  - hardening
---

Jo mindre som er eksponert, jo mindre kan angripes. Prinsippet er enkelt: start med alt lukket/deaktivert, og aktiver kun det du faktisk trenger for at tjenesten skal fungere.

## Nais access policy — default deny

Nais har allerede default deny på nettverksnivå. Uten eksplisitt access policy kan ingen nå appen din, og appen din kan ikke nå noe annet:

```yaml
# nais.yaml — åpne KUN det som trengs
spec:
  accessPolicy:
    inbound:
      rules:
        - application: min-frontend  # Ikke bruk "*"
    outbound:
      rules:
        - application: pdl-api
          namespace: pdl
```

:::danger Vanlig feil
Å åpne for all utgående trafikk med `external: [{host: "*"}]` «fordi noe ikke fungerte» er det samme som å fjerne brannmuren. Finn ut hvilken host du trenger og spesifiser den.
:::

## Endepunkter — ikke eksponer mer enn nødvendig

### Spring Boot Actuator

Actuator eksponerer mye informasjon som kan være nyttig for angripere. I Nais er `/internal/*`-stiene skjermet fra ekstern trafikk, men sjekk at du ikke eksponerer for mye:

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health, metrics, prometheus
      base-path: /internal
  endpoint:
    env:
      enabled: false    # Ikke eksponer miljøvariabler
    beans:
      enabled: false    # Ikke eksponer bean-oversikt
    mappings:
      enabled: false    # Ikke eksponer URL-mappinger
```

### Swagger / OpenAPI UI

Swagger UI er nyttig i utvikling, men bør ikke være tilgjengelig i produksjon:

```kotlin
// Spring Boot — deaktiver Swagger i prod
@Profile("!prod")
@Configuration
class SwaggerConfig { ... }
```

```typescript
// Express — kun i dev
if (process.env.NODE_ENV !== "production") {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(spec));
}
```

### GraphQL Playground / Introspection

```kotlin
// Deaktiver introspection i prod
graphql {
    introspection = environment.activeProfiles.contains("dev")
}
```

## Debug-funksjonalitet

- **Fjern debug-endepunkter** fra produksjonskode — ikke stol på at de «ikke er dokumentert»
- **Deaktiver verbose feilmeldinger** i prod (stack traces, interne detaljer)
- **Fjern test-brukere og seed-data** fra produksjonsdatabaser

## Feature flags — nye features av som default

Bruk [Unleash](https://docs.getunleash.io/) (tilgjengelig via Nais) for å rulle ut ny funksjonalitet gradvis:

```kotlin
if (unleash.isEnabled("ny-sensitiv-feature")) {
    // Ny funksjonalitet — aktiveres eksplisitt per miljø
}
```

Fordeler:
- Ny kode er deaktivert i prod til den er eksplisitt aktivert
- Kan skrus av umiddelbart hvis noe er galt (uten ny deploy)
- Gir deg kontroll over hvem som får tilgang først

## Containere — minst mulig innhold

Se [Sikkerhet i og rundt containere](/docs/sikker-utvikling/containere) for detaljer, men kort oppsummert:

- Bruk distroless/Chainguard-images (ingen shell, ingen package manager)
- Kjør som non-root (Nais default)
- Dropp alle capabilities du ikke trenger (Nais default)
- Read-only filesystem (Nais default)

## GitHub Actions — minimal permissions

```yaml
# Begrens token-tilganger per workflow
permissions:
  contents: read
  # Legg kun til det jobben faktisk trenger
```

Se [GitHub best practices](/docs/sikker-utvikling/github) for mer.

## Sjekkliste ved ny release

- [ ] Ingen nye endepunkter er eksponert uten bevisst valg
- [ ] Debug-funksjonalitet er deaktivert i prod
- [ ] Access policy er fortsatt minimal (ikke utvidet «for sikkerhets skyld»)
- [ ] Nye features bak feature flag til de er validert
- [ ] Swagger/playground/introspection er av i prod

## Les mer

- [Sikkerhet i og rundt containere](/docs/sikker-utvikling/containere)
- [GitHub best practices](/docs/sikker-utvikling/github)
- [Forsvar i dybden](/docs/sikker-utvikling/forsvar-i-dybden)
- [Attack surface minimisation (ENISA)](https://github.com/enisaeu/enisa-sbd-playbook/blob/main/playbooks/04-attack-surface-minimisation.md)

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
