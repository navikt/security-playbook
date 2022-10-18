---
title: Opplasting av filer
description: 🗂 Håndtering av filer når du først tviler
---

I selvbetjeningsløsningene er det ofte behov for å laste opp dokumentasjon i form av dokumenter. Hvordan skal man sørge for at disse dokumentene ikke inneholder noe skadelig?

## Virusscanning

I NAIS-clustrene har vi installert et produkt som heter [ClamAV](https://www.clamav.net/). Det har et enkelt HTTP-grensesnitt der man kan laste opp filer man ønsker å få scannet. Dokumentasjon og kodeeksempler finnes i [NAIS-doken](https://doc.nais.io/security/antivirus/#clamav).

![clamav](/img/clamav.webp "clamav")

Virusscanning er ikke feilfri, og selv om man har scannet et dokument betyr det ikke at man er 100% sikker. Vær varsom med hvor dere bruker informasjonen fra dokumentene, og sørg for å encode informasjonen for miljøet der den skal benyttes. For webapplikasjoner finnes det innebygget støtte i alle de store rammeverkene som React og Vue. Hvis du ikke bruker noen av disse er det [DOMPurify](https://www.npmjs.com/package/dompurify) som er "gullstandarden".

## Verifisering av filtype

Man kan ikke stole på at filnavn-extensions (doc, pdf osv.) forteller sannheten om hva slags type fil det er man mottar. En enkel og sikrere måte å verifisere hva slags type fil man har med å gjøre er å sjekke filens signatur (må ikke forveksles med en kryptografisk signatur), av og til omtalt som "magic numbers" eller "magic bytes". På kommandolinja kan man gjøre dette med kommandoen [file](https://linux.die.net/man/1/file), i kode må man gjøre det selv. En gyldig PNG-fil starter feks alltid med sekvensen `89 50 4E 47 0D 0A 1A 0A`. En liste med de vanligste signaturene finner man på [Wikipedia](https://en.wikipedia.org/wiki/List_of_file_signatures).

## Kryptering

Man bør også vurdere om de opplastede filene skal krypteres. Dette gjelder spesielt dersom man tilbyr mellomlagring av delvis utfylte søknader da denne informasjonen juridisk sett ikke er "innsendt" enda, og da har vi ikke hjemmel til å benytte den. Et eksempel på slik kryptering finner du [her](https://gist.github.com/joakibj/76bcfd21fa93746d661cbf0a6e59dbf6). Husk å beskytte nøkler og passphrases ved å lagre dem i [Google Secrets Manager](https://doc.nais.io/security/secrets/google-secrets-manager/) (eller [Vault](https://doc.nais.io/security/secrets/vault/) hvis man er on-prem).

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
