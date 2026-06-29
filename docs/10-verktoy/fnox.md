---
title: fnox
description: Hemmeligheter i OS-nøkkelringen, ikke i miljøet
tags:
  - hemmeligheter
---

**Relevante tema:**

- [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter)

[fnox](https://github.com/jdx/fnox) er et kommandolinjeverktøy som lar deg lagre hemmeligheter i operativsystemets innebygde nøkkelring (macOS Keychain, Windows Credential Manager, Linux Secret Service) og injisere dem som miljøvariabler kun mens en spesifikk kommando kjører.

Det betyr at hemmeligheter aldri ligger i `.env`-filer, shell-historikk eller eksponeres globalt for alle prosesser på maskinen.

## Installasjon

Installer med [mise](https://mise.jdx.dev) (anbefalt):

```bash
mise use -g fnox
```

**Linux** krever i tillegg `libsecret`:

```bash
# Ubuntu/Debian
sudo apt-get install libsecret-1-0

# Fedora/RHEL
sudo dnf install libsecret

# Arch
sudo pacman -S libsecret
```

macOS og Windows har innebygd støtte — ingen ekstra pakker nødvendig.

## Oppsett

Initialiser fnox i prosjektkatalogen og legg til keychain-provider:

```bash
fnox init
```

Legg til følgende i den genererte `fnox.toml`:

```toml
[providers]
keychain = { type = "keychain", service = "mitt-prosjekt" }

[secrets]
DATABASE_URL = { provider = "keychain", value = "database-url" }
API_KEY      = { provider = "keychain", value = "api-key" }
```

Lagre hemmelighetene i nøkkelringen én gang:

```bash
fnox set DATABASE_URL "postgresql://localhost/mydb"
fnox set API_KEY "hemmelig-nøkkel"
```

Verdiene lagres kryptert av operativsystemet. `fnox.toml` inneholder bare navnene — trygt å committe.

## Bruk

Kjør kommandoer med hemmelighetene tilgjengelig **kun for den prosessen**:

```bash
fnox exec -- npm run dev
fnox exec -- ./gradlew test
fnox exec -- mvn spring-boot:run
```

:::tip Unngå global eksponering
`fnox exec` injiserer hemmeligheter som miljøvariabler kun i underprosessen. De er ikke synlige for andre prosesser på maskinen, dukker ikke opp i `env` globalt og forsvinner når kommandoen er ferdig.

Sammenliknet med `export MY_SECRET=...` i terminalen — som eksponerer hemmeligheten for alle prosesser i hele shell-sesjonen — er `fnox exec` et langt tryggere alternativ.
:::

## Globale hemmeligheter

Noen hemmeligheter brukes på tvers av alle prosjekter — for eksempel GitHub-tokenet som gir tilgang til å laste ned pakker fra GitHub Packages. Det er upraktisk å legge dette inn i hvert enkelt repo.

Initialiser en global konfigurasjon én gang:

```bash
fnox init --global
fnox set GITHUB_TOKEN "ghp_..." --global
```

Dette lagrer tokenet i `~/.config/fnox/config.toml` (aldri i noe repo) og gjør det automatisk tilgjengelig i alle `fnox exec`-kjøringer uansett hvilken katalog du er i.

:::note Avveid risiko
Et globalt secret injiseres i **alle** `fnox exec`-kjøringer, også i prosjekter der det ikke er nødvendig. For et read-only pakkeregister-token som `GITHUB_TOKEN` er dette et akseptabelt kompromiss mellom bekvemmelighet og eksponering. For hemmeligheter med skrivetilgang eller prod-scope bør du holde deg til per-prosjekt-oppsett.
:::

<br />

```mdx-code-block
import SavnerDuNoe from '/common/_savner_du_noe.mdx';

<SavnerDuNoe />
```
