---
title: Supply chain-sikkerhet
description: Ikke la avhengighetene dine bli en bakdør inn i applikasjonen din.
---

Et supply chain-angrep skjer når en angriper kompromitterer en avhengighet du allerede stoler på, enten ved å ta over et eksisterende pakkeprosjekt, publisere en ondsinnet pakke med et lignende navn, eller injisere kode i en legitim pakke.
Tiltakene nedenfor reduserer risikoen betraktelig og er i stor grad engangsoppsett.

Se også [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode) for generelle råd om due diligence og evaluering av nye avhengigheter.
For bredere råd om utviklermaskin og lokale arbeidsmønstre, se [Sikre utviklermaskinen](/docs/sikker-utvikling/klientsikkerhet).

## npm / Node.js

NPM-økosystemet er sårbart for kompromittering, supply chain-angrep og skadelig programvare. [npm sletter selv skadelige pakker](https://docs.npmjs.com/threats-and-mitigations#by-changing-an-existing-package-to-have-malicious-behavior), men det tar ofte noen dager fra de er lastet opp til de er identifisert.

:::tip Gullstandarden i Nav er pnpm
[pnpm](https://pnpm.io/) er anbefalt pakkebehandler for JavaScript/TypeScript-prosjekter i Nav. Den har lifecycle scripts deaktivert som standard, streng avhengighetsisolasjon som forhindrer tilgang til pakker som ikke er eksplisitt deklarert, og en innebygd lockfil. Det gjør den til et tryggere valg enn npm og yarn uten ekstra konfigurasjon.
:::

### Inkluder lockfiler

**Hvorfor:** Sikrer identiske avhengigheter på tvers av miljøer og forhindrer uventede oppdateringer og supply chain-angrep.

Commit lockfilen til repoet:

| Pakkebehandler | Lockfil             |
| -------------- | ------------------- |
| pnpm           | `pnpm-lock.yaml`    |
| npm            | `package-lock.json` |
| yarn           | `yarn.lock`         |
| bun            | `bun.lock`          |
| deno           | `deno.lock`         |

Installer alltid fra lockfil i CI/CD:

```bash
npm ci
bun install --frozen-lockfile
yarn install --frozen-lockfile
deno install --frozen
```

### Deaktiver lifecycle scripts

**Hvorfor:** Lifecycle scripts er en vanlig angrepsmåte for skadelig programvare som stjeler legitimasjon.

```bash
# npm og yarn
npm config set ignore-scripts true --global
yarn config set enableScripts false

# pnpm, bun og deno har dette deaktivert som standard
```

> **Merk:** Bun tillater de [500 mest populære npm-pakkene](https://github.com/oven-sh/bun/blob/main/src/install/default-trusted-dependencies.txt) med lifecycle scripts som standard.

### Sett minimum utgivelsesalder

**Hvorfor:** Unngår nylig publiserte pakker som kan inneholde skadelig kode før sikkerhetsvurdering.

```bash
pnpm config set minimumReleaseAge 4320  # minutter (3 dager)

npm install --before="$(date -v -3d)"

yarn config set npmMinimalAgeGate 4320  # 3d i minutter

bun add @types/bun --minimum-release-age 259200  # sekunder

deno install --minimum-dependency-age=P3D

npm install --min-release-age 3 # i dager - evt sette i .npmrc
```

Dependabot har lignende funksjonalitet. [Les mer om sikker konfigurering av Dependabot her](/docs/verktoy/dependabot).

### Vurder å forby lasting av avhengigheter rett fra "remote sources" eller Git

**Hvorfor:** Unngår pakker som ikke har blitt scannet for sikkerhetsproblemer på npmjs.com

```bash
npm config set allow-git "none"
npm config set allow-remote "none"

pnpm config set blockExoticSubdeps true
```

### Reduser eksterne avhengigheter

**Hvorfor:** Færre avhengigheter = mindre angrepsflate og redusert risiko for kompromitterte pakker. Vurder om du virkelig trenger et bibliotek, eller om funksjonaliteten enkelt kan implementeres selv.

### Bruk begrensede npm-tokens

**Hvorfor:** Begrenser skaden ved kompromitterte tokens og følger prinsippet om minimal tilgang. Generer tokens med kun de rettighetene som trengs, for eksempel read-only for CI, via [npmjs.com](https://www.npmjs.com/) under Account Settings -> Access Tokens.

## Herd pakkebehandlere på utviklermaskinen

Med noen enkle engangsoppsett i globale konfigurasjonsfiler kan du redusere risikoen for å installere ondsinnet kode, uavhengig av prosjektets konfigurasjon. npm, pnpm, bun og uv støtter alle minimum utgivelsesalder som global innstilling.

### **[`~/.npmrc`](https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age)** (alle plattformer)

```ini
@navikt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
min-release-age=3 # dager
ignore-scripts=true
```

### **[pnpm](https://pnpm.io/settings#minimumreleaseage)** - fil plassering varierer per OS:

| OS      | Sti                             |
| ------- | ------------------------------- |
| macOS   | `~/Library/Preferences/pnpm/rc` |
| Linux   | `~/.config/pnpm/rc`             |
| Windows | `%LOCALAPPDATA%\pnpm\config\rc` |

```ini
minimum-release-age=4320 # minutter
```

### **[`~/.bunfig.toml`](https://bun.sh/docs/runtime/bunfig#install-minimumreleaseage)** (alle plattformer)

```toml
[install]
minimumReleaseAge = 259200 # sekunder
```

### **[uv](https://docs.astral.sh/uv/reference/settings/#exclude-newer)** - filplassering varierer per OS:

| OS            | Sti                    |
| ------------- | ---------------------- |
| macOS / Linux | `~/.config/uv/uv.toml` |
| Windows       | `%APPDATA%\uv\uv.toml` |

```toml
exclude-newer = "3 days"
```

> **Tips:** [`ignore-scripts=true`](https://docs.npmjs.com/cli/v11/using-npm/config#ignore-scripts) i `~/.npmrc` er alene tilstrekkelig til å forhindre de fleste angrep som utnytter lifecycle scripts. pnpm og bun har dette deaktivert som standard.

Du kan verifisere npm-oppsettet ditt med:

```bash
npm config get ignore-scripts
npm config get min-release-age
```

## Generelle råd på tvers av økosystemer

- **Evaluer nye avhengigheter** før du legger dem til. Sjekk aktivitet i GitHub-repoet, hvem som vedlikeholder det, og søk etter kjente sårbarheter. Se [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode) for en sjekkliste.
- **Bruk [Dependabot](/docs/verktoy/dependabot)** for automatiserte varsler om avhengigheter med kjente sårbarheter. Bruk cooldowns for Dependabot version updates.

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
