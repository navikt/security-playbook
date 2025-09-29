---
title: Chainguard baseimages
description: Sikre docker images for dine containere
tags:
  - containere
---

**Relevante tema:**

- [Valg av baseimage](/docs/sikker-utvikling/baseimages)
- [Sikkerhet i og rundt containere](/docs/sikker-utvikling/containere)

I Nav betaler vi for å bruke Chainguard sine container images som er minimale images med ekstra sikkerhetstiltak. Her får du images med minimalt antall sårbarheter både som distroless og alternativer med shell.

En av flere grunner til at vi betaler for Chainguard er at vi skal få tilgang til flere tags av de mest brukte image-typene. Dette gjør vi for at det ofte er breaking changes i nyere versjoner, noe som gjør det vanskelig for teamene å alltid bruke latest.

## Hvordan ta i bruk Chainguard

### Lokalt på din maskin

For å bruke Chainguard sine container images lokalt, må du først autentisere mot våres container registry. Dette kan gjøres ved å kjøre:

1. `gcloud auth configure-docker europe-north1-docker.pkg.dev` -- For å sette opp docker til å bruke gcloud som autentiseringsmetode
2. `gcloud auth login` -- For å logge inn med din nav.no-mail

Etter dette skal du ha tilgang til å laste ned Chainguard sine images lokalt.

### Github actions

For å laste ned og bruke Chainguard sine container images i Github workflows må du autentisere mot deres container registry. Dette kan gjøres på flere måter, det enkleste er å bruke nais/docker-build-push for å bygge. Da håndterer Nais autentiseringen for deg.

:::note
Husk å legge til github repositoriet i Nais Console.
:::

<details>
<summary>nais/docker-build-push</summary>

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: nais/docker-build-push@v0
        id: docker-push
        with:
          team: myteam # required
```

</details>

<details>
<summary>nais/login</summary>

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - uses: nais/login@v0
        with:
          team: <ditt team>
```

</details>

<details>
<summary>google-github-actions/auth</summary>

Hvis dere bruker google-github-actions/auth unngå å bruke service account key. Bruk heller Workload Identity Federation. Dette krever at du har satt opp en Workload Identity Pool i GCP. Mer info [repoet til workflow-actionet](https://github.com/google-github-actions/auth?tab=readme-ov-file#indirect-wif)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - uses: google-github-actions/auth@v0
        with:
          credentials_json: ${{ secrets.GCP_CREDENTIALS }}
```

</details>

## Tilgjenglige images

Chainguard sine images er tilgjengelige i et privat container registry som alle utviklere i Nav har tilgang til. Alle image tags er tilgjengelige i [Google Artifact Registry](https://console.cloud.google.com/artifacts/docker/cgr-nav/europe-north1/pull-through).<br />
Per nå er <b>følgende images tilgjengelige</b>: jdk, jre, node, python, airflow-core.<br />
Eksempel: `europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21`

<b>For images som ikke er tilgjenglig</b> kan man ofte finne tilsvarende gratis versjoner av et spesifikt image i [Chainguard sin egen registry](https://images.chainguard.dev/). For applikasjoner som er skrevet i Go eller kjører på nginx f.eks. finnes det gode gratis alternativer.

Eksempel: `cgr.dev/chainguard/go:latest`

Hvis du finner et image du ønsker å bruke som ikke er tilgjengelig i vårt registry, kan du be om å få det lagt til ved å kontakte Team AppSec.

## Tilgjenglige tags for de forskjellige alternativene

Du finner alle tags for et spesifikk image i [Chainguards image directory](https://images.chainguard.dev/). Her kan du søke opp imaget du ønsker å bruke, f.eks. `jre` og se alle tilgjengelige tags. Disse taggene bruker du deretter med imaget i vårt private registry. `europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/<image>:<tag>`

:::info

Husk at Chainguard ikke backporter oppdateringer til patch og minor versjoner. Så når f.eks. 21.0.8 blir releaset er alle versjoner før det EOL (for samme major). Derfor er det lurt å bruke en major, pinne den til SHA256 digest og bruke digestabot eller bygge appen på nytt jevnlig for å holde den oppdatert.

:::

## Automagisk oppdatering av tags på Github

Chainguard sine images oppdateres ofte med nye bygg, som betyr at det er lurt å hente og bygge siste versjoner raskere enn andre images. Men siden chainguard ikke bruker semver for sine images støtter ikke dependabot dette.

I Nav har vi en versjon av digestabot som implementerer autentisering mot vårt private registry og åpner en pullrequest i ditt repo når det finnes en nyere versjon av samme tag.

```yaml
name: "Check for newer image versions"

on:
  workflow_dispatch:
  schedule:
    # At the end of every day
    - cron: "0 0 * * *"

jobs:
  digest-update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v5
      - uses: navikt/digestabot@3233d68167c867ef8227c5dfde7a30f2a0e10af0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          team: appsec
```

[Liste med tilgjenglige inputs til digestabot finnes her](https://github.com/navikt/digestabot?tab=readme-ov-file#inputs).

Har du da en dockerfile som ser slik ut:

```Dockerfile
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21@sha256:6534a2dd81db8998c70b6b7851a0b665b815372a1444184b2e704edfbd4ee27c
```

Så åpner workflowen en ny pullrequest i ditt repo når det finnes en nyere versjon for samme tag.

## Eksempler på dockerfiles

<details>
<summary>Java (bygg utenfor dockerfile)</summary>

```Dockerfile
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21
COPY target/app.jar app.jar
CMD ["-jar","app.jar"]
```

</details>

<details>
<summary>Node</summary>

```Dockerfile
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22

ENV NODE_ENV production
ENV NPM_CONFIG_CACHE /tmp

WORKDIR /app

COPY dist dist/
COPY server server/

EXPOSE 8080
CMD ["server/dist/index.js"]
```

</details>

<details>
<summary>Node med bygg i Dockerfile</summary>

```Dockerfile
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-dev AS builder
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22
WORKDIR /app
COPY --from=builder /app /app
CMD ["build/server.js"]
```

</details>

<details>
<summary>Python med bygg i Dockerfile</summary>

```Dockerfile
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/python:3.12-dev AS builder

WORKDIR /app

RUN python3 -m venv venv
ENV PATH=/app/venv/bin:$PATH
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/python:3.12 AS runner

WORKDIR /app

COPY src/ .
COPY --from=builder /app/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

ENTRYPOINT ["python", "main.py"]
```

</details>

<details>
<summary>Golang</summary>

```Dockerfile
FROM cgr.dev/chainguard/go:latest AS builder
ENV GOOS=linux
ENV CGO_ENABLED=0
ENV GO111MODULE=on
COPY . /src
WORKDIR /src
RUN go mod download
RUN go build -a -installsuffix cgo -o /bin/myapp ./cmd/myapp

FROM cgr.dev/chainguard/static:latest
WORKDIR /app
COPY --from=builder /bin/myapp /app/myapp
ENTRYPOINT ["/app/myapp"]
```

</details>

<details>
<summary>Nginx</summary>

```Dockerfile
FROM cgr.dev/chainguard/node:latest-dev AS build
USER root
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM cgr.dev/chainguard/nginx AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
```

</details>

## Migrering av eksisterende dockerfiles til Chainguard

For å migrere en eksisterende dockerfile til Chainguard er det noen forskjeller avhengig av hvilket image du bruker. Migrerer du fra google distroless er forskjellene minimale, mens migrering fra f.eks. navikt baseimages kan kreve litt mer arbeid.

Vi har laget en [FAQ for migrering av dockerfiles](/docs/sikker-utvikling/baseimages) som kan være til hjelp.

## Hjelp!

Hvis du står fast, ikke kan logge inn, eller har problemer med å migrere teamets dockerfiler er det bare å ta kontakt med en av oss i appsec direkte eller på #appsec i Slack.

## Dokumentasjon fra Chainguard

Du finner [dokumentasjonen her](https://edu.chainguard.dev/).

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
