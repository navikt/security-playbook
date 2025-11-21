---
title: NPM Sikkerhet
description: Ha kontroll på dine pakker, så blir det enklere å gjøre koden vakker.
---

# NPM Sikkerhet

NPM-økosystemet er sårbart for kompromittering, supply-chain angrep og skadelig programvare. Her er de viktigste sikkerhetstiltakene:

### Inkluder lockfiler

**Hvorfor:** Sikrer identiske avhengigheter på tvers av miljøer og forhindrer uventede oppdateringer, og supply-chain angrep.

**Lockfiler:**

- npm: `package-lock.json`
- pnpm: `pnpm-lock.yaml`
- yarn: `yarn.lock`
- bun: `bun.lock`
- deno: `deno.lock`

**Installering fra lockfil:**

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

yarn config set npmMinimalAgeGate 1440 # 1d i minutter

bun add @types/bun --minimum-release-age 259200 # seconds

deno install --minimum-dependency-age=P7D
```

### Reduser eksterne avhengigheter

**Hvorfor:** Færre avhengigheter = mindre angrepsflate og redusert risiko for kompromitterte pakker.

### Bruk begrensede tokens

**Hvorfor:** Begrenser skaden ved kompromitterte tokens og følger prinsippet om minimal tilgang.

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
