---
title: Sikre utviklermaskinen
description: Sikre maskinen der koden blir til, så unngår du hackernes lumske spill
---

Utviklermaskinen er en del av leveransekjeden. Hvis maskinen eller kontoene dine kompromitteres, hjelper det lite at resten av pipeline-en er godt sikret.

Denne siden handler om utviklerworkflow: lokale hemmeligheter, pakkebehandlere, kontoer og enkle maskinvaner som reduserer risiko uten å gjøre hverdagen unødvendig tung.

## Start her

- Hold programvare og verktøy oppdatert, ikke bare operativsystem og nettleser.
- Bruk en passordmanager og skru på MFA eller passkeys der du kan.
- Ikke kjør med mer lokale rettigheter enn du trenger til vanlig.
- Hold hemmeligheter ute av lokale filer og shell-historikk.
- Herd pakkebehandlerne dine globalt, ikke bare per prosjekt.

## Lokale hemmeligheter

Lokale hemmeligheter skal ikke lagres ukryptert i filer på maskinen, men håndteres av egnede verktøy som feks. passordmanagere. Vanlige steder der hemmeligheter i klartekst kan forekomme er koderepoer, dotfiles, IDE-konfigurasjon og shell-historikk.

- Ikke kopier hemmeligheter fra produksjonsmiljøet til din lokale maskin.
- Bruk miljøvariabler eller verktøy som injiserer hemmeligheter ved oppstart, for eksempel fnox eller 1Password CLI.
- Ignorer filer som `.env` i Git, Docker og npm der det er relevant.
- Vær ekstra oppmerksom på filer som IntelliJ lagrer i `.idea/`.

Eksempel med 1Password CLI:

`op run --env-file="my.env" -- node myapp.js`

Generell håndtering av hemmeligheter på tvers av lokal utvikling, GitHub og runtime er beskrevet på siden om [hemmeligheter](/docs/sikker-utvikling/hemmeligheter).

## Herd pakkebehandlerne dine

Pakkebehandlere er en vanlig inngang for supply chain-angrep. Derfor bør du legge inn sikre standardvalg i hjemmekatalogen din, slik at de gjelder uansett hvilket prosjekt du jobber i.

Eksempel for npm i Nav-miljø:

```ini
@navikt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
ignore-scripts=true
min-release-age=3
```

Dette gir deg tre viktige ting:

- Tokenet ligger i en miljøvariabel i stedet for i fila.
- `ignore-scripts=true` stopper de fleste angrep som misbruker lifecycle scripts.
- `min-release-age=3` gjør at helt ferske pakker må modnes litt før de kan installeres.

Tilsvarende oppsett for pnpm, bun og uv finner du på [supply chain-sikkerhet](/docs/sikker-utvikling/supply-chain).

## Kontoer og credentials

- Ha sterke og unike passord på alle tjenester. I praksis betyr det å bruke en passordmanager som [1Password](https://1password.com/), [Bitwarden](https://bitwarden.com/) eller tilsvarende.
- Skru på MFA eller passkeys alle steder som støtter det. WebAuthn og sikkerhetsnøkler er bedre enn engangskoder, men engangskoder er mye bedre enn ingenting.
- Sett opp signering av commits til GitHub. Alle utviklere bør bruke signerte commits på kode som committes til Nav sine repoer. Les mer om [signering av commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification).
- Bruk minst mulig rettigheter, både lokalt og i eksterne tjenester. En kompromittert konto med admin-rettigheter gjør mye mer skade enn en konto med begrenset tilgang.

## Hold maskinen kjedelig

En sikker utviklermaskin er ofte en litt kjedelig maskin:

- Prøv å forstå hvilke policyer som gjelder for maskinen din før du skrur dem av eller går rundt dem.
- Sett deg inn i [Do's and Don'ts](https://naisdevice-approval.external.prod-gcp.nav.cloud.nais.io/) i Naisdevice.
- Ikke jobb til vanlig som root eller lokal admin. På Nav-oppsatte Mac-er kan [Privileges](https://github.com/SAP/macOS-enterprise-privileges) brukes ved behov.
- Installer bare verktøy, plugins og utvidelser du faktisk trenger.

## Verifiser

- Du finner ingen plaintext secrets i dotfiles, `.env`, `.idea/` eller andre lokale konfigurasjonsfiler.
- `~/.npmrc` bruker `${NPM_TOKEN}`, `ignore-scripts=true` og `min-release-age=3`.
- Du bruker passordmanager og MFA eller passkeys på kontoene dine.
- GitHub viser at commits du lager er signert.

Hvis du er i tvil, spør. Det er mye billigere å etablere gode og sikre rutiner enn å rydde opp etter en lekkasje.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
