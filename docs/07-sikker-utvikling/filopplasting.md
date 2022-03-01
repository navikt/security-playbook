---
title: Opplasting av filer
description: 🗂 Håndtering av filer når du først tviler
---

I selvbetjeningsløsningene er det ofte behov for å laste opp dokumentasjon i form av dokumenter. Hvordan skal man sørge for at disse dokumentene ikke inneholder noe skadelig?

## Virusscanning

I NAIS-clustrene har vi installert et produkt som heter [ClamAV](https://www.clamav.net/). Det har et enkelt HTTP-grensesnitt der man kan laste opp filer man ønsker å få scannet. Dokumentasjon og kodeeksempler finnes i [NAIS-doken](https://doc.nais.io/security/antivirus/#clamav).

![clamav](/img/clamav.webp "clamav")

Virusscanning er ikke feilfri, og selv om man har scannet et dokument betyr det ikke at man er 100% sikker. Vær varsom med hvor dere bruker informasjonen fra dokumentene, og sørg for å encode informasjonen for miljøet der den skal benyttes. For webapplikasjoner finnes det innebygget støtte i alle de store rammeverkene som React og Vue. Hvis du ikke bruker noen av disse er det [DOMPurify](https://www.npmjs.com/package/dompurify) som er "gullstandarden".

## Kryptering

Man bør også vurdere om de opplastede filene skal krypteres. Dette gjelder spesielt dersom man tilbyr mellomlagring av delvis utfylte søknader da denne informasjonen juridisk sett ikke er "innsendt" enda, og da har vi ikke hjemmel til å benytte den. Et eksempel på slik kryptering finner du [her](https://github.com/navikt/foreldrepengesoknad-api/blob/master/src/main/java/no/nav/foreldrepenger/selvbetjening/mellomlagring/MellomlagringKrypto.java). Husk å beskytte nøkler og passphrases ved å lagre dem i [Google Secrets Manager](https://doc.nais.io/security/secrets/google-secrets-manager/) (eller [Vault](https://doc.nais.io/security/secrets/vault/) hvis man er on-prem).

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
