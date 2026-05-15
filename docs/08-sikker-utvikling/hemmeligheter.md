---
title: Hemmeligheter
description: En lekket nøkkel er skjemmelig, så hold den hemmelig 🔒.
---

Alle systemer har informasjon de trenger å holde hemmelig. Dette er ting som passord og nøkler, men også tokens, konfigurasjon og andre verdier som ikke skal på avveie.

Det viktigste er å håndtere hemmeligheter riktig i riktig kontekst. Rådene for lokal utvikling er ikke alltid de samme som for GitHub eller runtime i NAIS.

## Lokal utvikling

På utviklermaskinen er målet å holde hemmeligheter ute av kildekode, lokale filer og shell-historikk.

:::danger OBS!
Hemmeligheter for prod-systemer skal ikke under noen omstendigheter hentes ut og lagres på utsiden.
:::

- Ikke hardkod hemmeligheter i kode, testdata eller IDE-konfigurasjon.
- Ikke lagre tokens eller passord i `.env`, `.idea/` eller andre filer som lett havner i Git eller blir liggende ukryptert.
- Bruk miljøvariabler eller verktøy som injiserer hemmeligheter ved oppstart, for eksempel fnox eller 1Password CLI.
- Ignorer filer som typisk inneholder sensitiv konfigurasjon, som `.env`, i `.gitignore`, `.dockerignore` og `.npmignore` der det er relevant.

Eksempel med 1Password:

`MY_PW=$(op read op://vault/entry/field)`

`op run --env-file="my.env" -- node myapp.js`

Se dokumentasjonen til [1Password](https://developer.1password.com/docs/cli/) for detaljer.

:::tip Tips!
Dersom man ikke har tilgang til en passordmanager kan man lage seg enkle shellscript som henter hemmeligheter fra egnede lagringssteder og tilgjengeliggjør dem som miljøvariabler som kun lever så lenge en prosess kjører.

```
#!/usr/bin/env bash

export MY_PW_FROM_HASHICORP_VAULT=$(vault read path/to/my/thing)
export MY_PW_FROM_GCP=$(gcloud secrets versions access 1 --secret mysecret)
export MY_PW_FROM_K8S=$(kubectl get secret mysecret -o jsonpath='{.data.mykey}' | base64 -d)

npm run mytests
```

:::

For bredere råd om utviklermaskin og lokale arbeidsmønstre, se [Sikre utviklermaskinen](/docs/sikker-utvikling/klientsikkerhet).

## GitHub og build

Når hemmeligheter brukes i CI eller bygg, skal de holdes utenfor kildekoden og begrenses til det workflowen faktisk trenger.

- Dersom du trenger hemmeligheter i GitHub Actions, bruk [GitHubs opplegg](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
- Foretrekk kortlevde tokens og minst mulig tilgang fremfor langlivede tokens og brede PAT-er.
- Vær eksplisitt når du kopierer filer inn i Docker-images. `COPY enkonkretfil /enkatalog/` gir deg kontroll.

:::caution Kopier bare det du trenger
`COPY . .` i en Dockerfile fører til at alt i denne katalogen kopieres over, også filer man kanskje ikke hadde tenkt skulle være med.
:::

Detaljer om sikre GitHub-oppsett finner du på [Github best practices](/docs/sikker-utvikling/github).

## Runtime i NAIS

I runtime skal hemmeligheter leveres av plattformen, ikke av utvikleren manuelt.

Kode og hemmeligheter bør alltid holdes fra hverandre og håndteres separat. Hemmelighetene tilgjengeliggjøres for applikasjonene i kjøretidsmiljøet via mekanismer som plattformen tilbyr.

- Applikasjoner som bruker Postgres får automatisk en [Cloud SQL Proxy](https://doc.nais.io/persistence/postgres/#cloud-sql-proxy) som sørger for kryptert tilkobling og credentials som roteres automatisk.
- For [OAuth](https://doc.nais.io/security/auth/) får man også automatisk provisjonert og rotert nødvendige hemmeligheter som miljøvariabler, filer eller Kubernetes secrets i podene.
- Andre hemmeligheter som appene dine trenger administrerer du i [Console](https://doc.nais.io/how-to-guides/secrets/console/). Disse blir automatisk tilgjengelig som miljøvariabler i teamets namespace og eller som filer i podene.
- Deploy benytter kortlevde tokens fra GitHub.

## Når hemmeligheter havner i Git

Et av de vanligste stedene å lekke hemmeligheter er i kildekode. Hvis man ikke er oppmerksom er det fort gjort å committe hemmeligheter fordi man "bare kjapt skulle teste noe". For å oppdage dette så tidlig som mulig lønner det seg å bruke verktøy som [GitHub Secret Scanning](/docs/verktoy/github-advanced-security) aktivt.

Husk at Git aldri glemmer, og man har ikke kontroll på hvor mange som har sjekket ut eller forket et repository. Tjenester som [GH Archive](http://www.gharchive.org/) driver med mer eller mindre systematisk scraping av alle public repositories på GitHub.

Selv om man sletter en branch vil commitene den bestod av fortsatt eksistere, og disse kan enkelt [gjenopprettes](https://rewind.com/blog/how-to-restore-deleted-branch-commit-git-reflog/). Det er også flere [gotchas](https://trufflesecurity.com/blog/anyone-can-access-deleted-and-private-repo-data-github) knyttet til forking av repositories på GitHub.

Moralen er derfor: alle hemmeligheter som har funnet veien inn i Git er å anse som kompromitterte, uansett hvor kort tid de har vært der.

## Ved lekkasje

Uansett hvor mange forholdsregler man tar vil det fra tid til annen skje uhell som medfører at hemmeligheter lekker. I slike situasjoner er det viktig å være på ballen raskt.

- Roter de aktuelle hemmelighetene så raskt som mulig.
- Sjekk logging og overvåking for spor etter eventuell kompromittering.
- Ta kontakt med nærmeste leder eller ISOC på slack (#soc) for å få hjelp til å håndtere situasjonen.

Det er veldig lurt å øve på situasjoner som dette slik at man har rutiner og verktøy på plass den dagen det smeller.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
