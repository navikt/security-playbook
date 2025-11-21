---
title: Hemmeligheter
description: En lekket nøkkel er skjemmelig, så hold den hemmelig 🔒.
---

Alle systemer har informasjon de trenger å holde hemmelig. Dette er ting som passord og nøkler, men kan også være andre typer informasjon. Hvordan kan vi sørge for at hemmelighetene forblir hemmelige, og hva gjør vi hvis de mot formodning skulle lekke?

## Hvordan håndtere hemmeligheter?

Kode og hemmeligheter bør alltid holdes fra hverandre og håndteres separat. Hemmelighetene tilgjengeliggjøres for applikasjonene i kjøretidsmiljøet vha mekanismer som plattformen tilbyr. Applikasjoner som bruker Postgres får automatisk en [Cloud SQL Proxy](https://doc.nais.io/persistence/postgres/#cloud-sql-proxy) som sørger for at tilkobling skjer kryptert og med credentials som roteres automatisk. Hvis man skulle trenge å hente ut Postgres-credentials finnes det et [opplegg](https://doc.nais.io/persistence/postgres/#cloud-sql-credentials) for det også. For [OAuth](https://doc.nais.io/security/auth/) får man også automatisk provisjonert (og rotert) nødvendige hemmeligheter som tilgjengeliggjøres i podene som miljøvariabler, filer eller Kubernetes secrets. Deploy benytter kortlevde tokens fra GitHub.

:::danger OBS!
Hemmeligheter for prod-systemer skal ikke under noen omstendigheter hentes ut og lagres på utsiden!
:::

Andre hemmeligheter som appene dine måtte trenge administrerer du i [Console](https://doc.nais.io/how-to-guides/secrets/console/). Disse blir automatisk tilgjengelig som miljøvariabler i ditt team sitt namespace og/eller som filer i de aktuelle podene.

Dersom man trenger å benytte hemmeligheter når man bygger på GitHub kan man bruke [GitHubs opplegg](https://docs.github.com/en/actions/security-guides/encrypted-secrets). Disse vil automatisk bli tilgjengelige i workflows.

## Hemmeligheter i kildekode

Et av de vanligste stedene å lekke hemmeligheter er i kildekode. Hvis man ikke er oppmerksom er det fort gjort å hardkode og committe hemmeligheter fordi "man bare kjapt skulle teste noe", eller at man legger de i env-filer eller IDE-konfigurasjon som den IntelliJ lagrer i klartekst i `.idea/`. For å oppdage dette så tidlig som mulig lønner det seg å bruke verktøy som [git-secrets](https://github.com/awslabs/git-secrets) og [GitHub Secret Scanning](/docs/verktoy/github-advanced-security) aktivt.

Et billig og effektivt tiltak man kan gjøre er å alltid ignorere filer som typisk inneholder potensielt sensitiv konfigurasjon, feks `.env`. Git, Docker og npm har alle ignore-mekanismer (hhv `.gitignore`, `.dockerignore` og `.npmignore`) der slike filer kan utelukkes.

Når man skal kopiere filer over til et Docker-image er det også lurt å være eksplisitt. `COPY enkonkretfil /enkatalog/` gir deg full kontroll.

:::caution Kopier bare det du trenger
`COPY . .` i en Dockerfile fører til at alt i denne katalogen kopieres over, også filer man kanskje ikke hadde tenkt skulle være med.
:::

:::tip Tips!
For å holde hemmeligheter unna lokale filer samt Git og kommandohistorikk kan man bruke kommandolinjeverktøyene som tilbys av passordmanagere.

Eksempel med 1Password:

`MY_PW=$(op read op://vault/entry/field)`

`op run --env-file="my.env" -- node myapp.js`

Se dokumentasjonen til [1Password](https://developer.1password.com/docs/cli/) for detaljer
:::

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

## Hemmeligheter i Git

Husk at Git aldri glemmer, og man har ikke kontroll på hvor mange som har sjekket ut eller forket et repository. Tjenester som [GH Archive](http://www.gharchive.org/) driver med mer eller mindre systematisk scraping av alle public repositories på GitHub.

Selv om man feks sletter en branch vil commitene den bestod av fortsatt eksistere, og disse kan enkelt [gjenopprettes](https://rewind.com/blog/how-to-restore-deleted-branch-commit-git-reflog/). Det er også flere [gotchas](https://trufflesecurity.com/blog/anyone-can-access-deleted-and-private-repo-data-github) ifm forking av repositories på GitHub. Koblinger mellom forks og originalene representeres i tre-strukturer, og sletting av forks betyr bare at pekere til commit-noder skyfles rundt.

Moralen er derfor: alle hemmeligheter som har funnet veien inn i Git er å anse som kompromitterte, uansett hvor kort tid de har vært der.

## Hvordan håndtere lekkede hemmeligheter

Uansett hvor mange forholdsregler man tar vil det fra tid til annen skje uhell som medfører at hemmeligheter lekker. I slike situasjoner er det viktig å være "på ballen" kjapt.

- Roter de(n) aktuelle hemmeligheten(e) så raskt som mulig.
- Sjekk logging og overvåking for spor etter evt. kompromittering.
- Varsle aktuelle parter ihht [etatens beredskapsplaner](https://navno.sharepoint.com/sites/intranett-sikkerhet/SitePages/Beredskap-i-Nav.aspx) dersom man har konkrete mistanker om at systemer er kompromittert og/eller at informasjon er på avveie.

Det er _veldig_ lurt å øve på situasjoner som dette slik at man har rutiner og verktøy på plass den dagen det smeller.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
