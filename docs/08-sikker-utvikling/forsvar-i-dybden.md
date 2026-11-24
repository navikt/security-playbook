---
title: Forsvar i dybden
description: Ikke stol på én enkelt kontroll — lag flere uavhengige lag som beskytter tjenesten din.
tags:
  - arkitektur
  - defence-in-depth
---

Forsvar i dybden (defence in depth) betyr at du legger flere uavhengige sikkerhetskontroller rundt det som er viktig. Hvis én kontroll feiler eller blir omgått, skal det fortsatt finnes barrierer som stopper en angriper.

## Tenk i lag

For en typisk Nais-app bør du ha kontroller på flere nivåer:

| Lag | Eksempel på kontroll |
|-----|---------------------|
| **Nettverk** | Nais access policy (default deny ingress/egress) |
| **Autentisering** | TokenX / Azure AD — validert i appen |
| **Autorisering** | Sjekk at bruker har riktig rolle/tilgang til ressursen |
| **Applikasjon** | Inputvalidering, rate limiting |
| **Data** | Kryptert i transit (mTLS via service mesh) og i rest (GCP default) |
| **Deteksjon** | Strukturert logging + alarmer på anomalier |

Poenget er at hvert lag er **uavhengig** — de deler ikke samme tillitsforutsetning. Hvis TokenX-valideringen din har en bug, stopper nettverkspolicyen fortsatt trafikk fra uventede kilder, og logging fanger opp de mislykkede forsøkene.

## Praktisk: Nais access policy som første lag

Access policies i Nais er default deny. Du må eksplisitt åpne for hvem som får snakke med appen din:

```yaml
# nais.yaml
spec:
  accessPolicy:
    inbound:
      rules:
        - application: frontend-app
          namespace: mitt-team
    outbound:
      rules:
        - application: pdl-api
          namespace: pdl
          cluster: prod-fss
```

:::tip Gullregel
Åpne kun for det du faktisk trenger. Ikke bruk `"*"` som inbound-regel «for enkelhets skyld».
:::

## Praktisk: Rate limiting

Rate limiting bremser angripere og gir deg tid til å reagere. Noen alternativer:

**Spring Boot (Resilience4j):**

```kotlin
@RateLimiter(name = "default", fallbackMethod = "rateLimitFallback")
@GetMapping("/api/resource")
fun getResource(): ResponseEntity<Resource> { ... }
```

**Express/Node.js:**

```typescript
import rateLimit from "express-rate-limit";

app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
}));
```

**Nginx (ingress-nivå):**

Nais støtter [rate limiting via ingress-annotasjoner](https://doc.nais.io/workloads/reference/ingress/#rate-limiting):

```yaml
spec:
  ingress:
    - host: min-app.nav.no
      annotations:
        nginx.ingress.kubernetes.io/limit-rps: "10"
        nginx.ingress.kubernetes.io/limit-burst-multiplier: "3"
```

## Praktisk: Logging på flere lag

Du bør logge sikkerhetshendelser på flere punkter slik at du kan oppdage angrep selv om én kontroll omgås:

- **Nettverk:** Nais/Istio logger avviste kall (synlig i Grafana)
- **Auth:** Logg mislykkede tokenvalideringer med kilde-IP og tidspunkt
- **Applikasjon:** Logg autorisasjonsfeil (bruker X forsøkte tilgang til ressurs Y)
- **Data:** Logg databaseoppslag på sensitive data ([oppslagslogg](/docs/sikker-utvikling/oppslagslogg))

:::warning Ikke logg bare suksess
De fleste logger bare vellykkede operasjoner. For å oppdage angrep må du logge det som *feiler* — avviste kall, ugyldige tokens, manglende tilgang.
:::

## Praktisk: Containment — begrens skadeomfang

Selv om en angriper kommer inn, bør systemet begrense hva de kan gjøre:

- **Read-only filesystem:** Nais setter dette som default via security context
- **Kort-levde pods:** Kubernetes river ned og gjenoppbygger pods, noe som gjør persistens vanskelig for angripere
- **Smalt scopede tokens:** TokenX-tokens er gyldige mot kun én mottaker — et kompromittert token gir ikke tilgang til alt
- **Segmentering:** Hvert team har eget namespace med isolerte secrets og databaser

## Sjekkliste

- [ ] Appen har minst 2 uavhengige sikkerhetskontroller mellom internett og sensitive data
- [ ] Access policy er eksplisitt konfigurert (ikke åpen)
- [ ] Autentisering valideres i appen (ikke bare i en gateway foran)
- [ ] Mislykkede sikkerhetsoperasjoner logges med nok kontekst til å trigge alarmer
- [ ] Rate limiting er på plass for endepunkter eksponert mot internett
- [ ] Du kan svare på: «Hva skjer hvis lag X feiler?» for hvert lag

## Les mer

- [Nais access policy](https://doc.nais.io/workloads/how-to/access-policy/)
- [Nais observability](https://doc.nais.io/observability/)
- [Sikkerhet i og rundt containere](/docs/sikker-utvikling/containere)
- [Tilgangsstyring](/docs/sikker-utvikling/tilgangsstyring)
- [Applikasjonslogging](/docs/sikker-utvikling/logging)

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
