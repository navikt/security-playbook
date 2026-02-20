---
title: Supply chain-sikkerhet
description: Ikke la avhengighetene dine bli en bakdør inn i applikasjonen din.
---

Et supply chain-angrep skjer når en angriper kompromitterer en avhengighet du allerede stoler på – enten ved å ta over et eksisterende pakkeprosjekt, publisere en ondsinnet pakke med et lignende navn, eller injisere kode i en legitim pakke.
Tiltakene nedenfor reduserer risikoen betraktelig og er i stor grad engangsoppsett.

Se også [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode) for generelle råd om due diligence og evaluering av nye avhengigheter.

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
pnpm config set minimumReleaseAge 1440  # minutter

npm install --before="$(date -v -1d)"

yarn config set npmMinimalAgeGate 1440  # 1d i minutter

bun add @types/bun --minimum-release-age 259200  # sekunder

deno install --minimum-dependency-age=P7D
```

Dependabot har lignende funksjonalitet. [Les mer om sikker konfigurering av Dependabot her](/docs/verktoy/dependabot).

### Reduser eksterne avhengigheter

**Hvorfor:** Færre avhengigheter = mindre angrepsflate og redusert risiko for kompromitterte pakker. Vurder om du virkelig trenger et bibliotek, eller om funksjonaliteten enkelt kan implementeres selv.

### Bruk begrensede npm-tokens

**Hvorfor:** Begrenser skaden ved kompromitterte tokens og følger prinsippet om minimal tilgang. Generer tokens med kun de rettighetene som trengs (f.eks. read-only for CI) via [npmjs.com](https://www.npmjs.com/) under Account Settings → Access Tokens.

## Generelle råd på tvers av økosystemer

- **Evaluer nye avhengigheter** før du legger dem til – sjekk aktivitet i GitHub-repoet, hvem som vedlikeholder det, og søk etter kjente sårbarheter. Se [Tredjepartskode](/docs/sikker-utvikling/tredjepartskode) for en sjekkliste.
- **Bruk [Dependabot](/docs/verktoy/dependabot)** for automatiserte varsler om avhengigheter med kjente sårbarheter – det tar seg av den løpende overvåkingen. Bruk cooldowns for dependabot version updates.

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
