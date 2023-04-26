---
title: Hemmeligheter
description: 🤷‍♂️ Rim er vanskelig
---

Alle systemer har informasjon de trenger å holde hemmelig. Dette er ofte ting som passord og nøkler, men kan også være andre typer informasjon. Hvordan kan vi sørge for at hemmelighetene forblir hemmelige, og hva gjør vi hvis de mot formodning skulle lekke?

## Hvordan håndtere hemmeligheter?

Plattformen tilbyr mekanismer for de vanligste scenarioene. Applikasjoner som bruker Postgres får automatisk en [Cloud SQL Proxy](https://doc.nais.io/persistence/postgres/#cloud-sql-proxy) som sørger for at tilkobling skjer kryptert og med credentials som roteres automatisk. Hvis man skulle trenge å hente ut Postgres-credentials finnes det et [opplegg](https://doc.nais.io/persistence/postgres/#cloud-sql-credentials) for det også. For [OAuth](https://doc.nais.io/security/auth/) får man også automatisk provisjonert (og rotert) nødvendige hemmeligheter som tilgjengeliggjøres i podene som miljøvariabler, filer eller Kubernetes secrets.

:::caution
Hemmeligheter for prod-systemer skal ikke under noen omstendigheter hentes ut og lagres på utsiden!
:::

For andre typer hemmeligheter har man tilgang til [Google Secrets Manager](https://doc.nais.io/security/secrets/google-secrets-manager/) eller HashiCorp Vault for hhv GCP og on-prem. Disse gjør det mulig å oppbevare og dele hemmeligheter på en trygg måte.

Dersom man trenger å benytte hemmeligheter når man bygger på GitHub kan man bruke [GitHubs opplegg](https://docs.github.com/en/actions/security-guides/encrypted-secrets). Disse vil automatisk bli tilgjengelige i workflows. Et eksempel på en slik hemmelighet er API-keyen som trengs for å [deploye på nais](https://doc.nais.io/deployment/).

## Hemmeligheter i kildekode

Et av de vanligste stedene å lekke hemmeligheter er i kildekode. Hvis man ikke er oppmerksom er det fort gjort å hardkode og commit'e hemmeligheter fordi "man bare kjapt skulle teste noe", eller at man legger de i env-filer eller IDE-konfigurasjon som man glemmer å `.gitignore`. For å oppdage dette så tidlig som mulig lønner det seg å bruke verktøy som [git-secrets](https://github.com/awslabs/git-secrets) og scanne repoene sine med [GitHub Secret Scanning](/docs/verktoy/github-advanced-security).

:::tip Tips!
For å holde hemmeligheter unna lokale filer samt Git og kommandohistorikk kan man bruke kommandolinjeverktøyene `gcloud` eller `vault`.

Eksempler:

`MY_PW=$(gcloud secrets versions access 1 --secret="my-password")`

`MY_PW=$(vault read path/to/my/password)`
:::

## Hvordan håndtere lekkede hemmeligheter

Uansett hvor mange forholdsregler man tar vil det fra tid til annen skje feil eller uhell som medfører at hemmeligheter lekker. I slike situasjoner er det viktig å være "på ballen" kjapt.

- Roter de(n) aktuelle hemmeligheten(e) så raskt som mulig.
- Sjekk logging og overvåking for spor etter evt. kompromittering.
- Varsle aktuelle parter ihht [etatens beredskapsplaner](https://navno.sharepoint.com/sites/intranett-sikkerhet/SitePages/Beredskap-i-NAV.aspx) dersom man har konkrete mistanker om at systemer er kompromittert og/eller at informasjon er på avveie.

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
