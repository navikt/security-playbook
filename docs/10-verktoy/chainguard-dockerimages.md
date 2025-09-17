---
title: Chainguard baseimages
description: Sikkre docker images for dine containere
tags:
  - containere
---

**Relevante tema:**

- [Valg av baseimage](/docs/sikker-utvikling/baseimages)
- [Sikkerhet i og rundt containere](/docs/sikker-utvikling/containere)

I Nav betaler vi for å bruke Chainguard sine container images som er minimale images med ekstra sikkerhetstiltak. Her får du images med minimalt antall sårbarheter både som distroless og alternativer med shell.

## Hvordan ta i bruk Chainguard

## Tilgjenglige images

Chainguard sine images er tilgjengelige i et privat container registry som alle utviklere i Nav har tilgang til. Alle image tags er tilgjengelige i [Google Artifact Registry](https://console.cloud.google.com/artifacts/docker/cgr-nav/europe-north1/pull-through).

Eksempel: `europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21`

For images som ikke er tilgjenglige kan man ofte finne tilsvarende gratis versjoner av en spesifikk image i [Chainguard sin egen registry](https://images.chainguard.dev/). For applikasjoner som er skrevet i Go eller kjører på nginx f.eks. finns det gode gratis alternativer.

Hvis du finner et image du ønsker å bruke som ikke er tilgjengelig i vårt registry kan du be om å få det lagt til ved å kontakte Team AppSec.

### Lokalt på din maskin

For å bruke Chainguard sine container images lokalt, må du først autentisere mot våres container registry. Dette kan gjøres ved å kjøre:

1. `gcloud auth configure-docker europe-north1-docker.pkg.dev` -- For å sette opp docker til å bruke gcloud som autentiseringsmetode
2. `gcloud auth login` -- For å logge inn med din nav.no-mail

Etter dette skal du ha tilgang til å laste ned Chainguard sine images lokalt.

### Github actions

For å laste ned og bruke Chainguard sine container images i Github workflows må du autentisere mot deres container registry. Dette kan gjøres på flere måter, det enkleste er å bruke nais/login-action.

:::note
Husk å legge til github repositoriet i Nais Console.
:::

#### nais/login

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

#### google-github-actions/auth

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

For å migrere en eksisterende dockerfile til Chainguard er det noen forskjeller beroende på hvilket image du bruker. Migrerer du fra google distroless er forskjellene minimale, mens migrering fra f.eks. navikt baseimages kan kreve litt mer arbeid.

Vi har laget en [FAQ for migrering av dockerfiles](/docs/sikker-utvikling/baseimages) som kan være til hjelp.

## Hjelp!

Hvis du fastner, ikke kan logge in eller har problemer med å migrere teamets dockerfiler er det bare å ta kontakt med en av oss i appsec direkte eller på #appsec i Slack.
