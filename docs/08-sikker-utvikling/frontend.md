---
title: Frontend Sikkerhet
description: Beste praksiser for sikker frontend-utvikling med NPM og venner
---

# Frontend Sikkerhet

NPM-økosystemet er sårbart for kompromittering, supply-chain angrep og skadelig programvare. Her er de viktigste sikkerhetstiltakene:

### Pin avhengighetsversjoner

**Hvorfor:** Forhindrer automatiske oppdateringer som kan introdusere skadelig kode eller sårbarheter.

**Installering med eksakt versjon:**

```bash
npm install --save-exact react
pnpm add --save-exact react
yarn add --save-exact react
bun add --exact react
deno add npm:react@19.1.1
```

**Konfigurering:**

```bash
# npm
npm config set save-exact=true

# pnpm
pnpm config set save-exact true

# yarn
yarn config set defaultSemverRangePrefix ""

# bun (i bunfig.toml)
[install]
exact = true
```

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
# pnpm (minutter)
pnpm config set minimumReleaseAge 1440  # 24 timer

# npm (installer bare pakker publisert før en bestemt dato)
npm install --before="$(date -v -1d)"

# yarn (minutter)
yarn config set npmMinimalAgeGate 1440

# bun og deno: Ikke støttet enda
```

### Reduser eksterne avhengigheter

**Hvorfor:** Færre avhengigheter = mindre angrepsflate og redusert risiko for kompromitterte pakker.

### Bruk begrensede tokens

**Hvorfor:** Begrenser skaden ved kompromitterte tokens og følger prinsippet om minimal tilgang.

:::info

Add stuff here.

:::

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
