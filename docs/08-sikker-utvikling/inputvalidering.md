---
title: Input / output validering
description: 🧾 Sjekker vi nøye hva som går ut og inn, ender vi opp med en vinn vinn 🏆
---

Alle systemer må håndtere input og output på en sikker måte. Dette gjelder både for data som kommer inn i systemet, og data som sendes ut. Validering av input og output er en viktig del av sikkerhetsarbeidet, og kan bidra til å forhindre en rekke typer angrep.

:::tip Tips!
Dette gir ikke bare sikkerhet, men også et mer robust system.
:::

## Hvorfor validere input?

Input-validering er viktig for å sikre at data som kommer inn i systemet er gyldige og ikke inneholder skadelig kode. Dette kan bidra til å forhindre angrep som SQL-injeksjon, XSS (Cross-Site Scripting) og andre typer injeksjonsangrep.

:::caution Valider også input fra apper og tjenester som du stoler på!
Selv om du stoler på kilden, kan det hende at de har gjort andre vurderinger enn dere, eller at noe skadelig slipper gjennom. Det er derfor viktig å validere all input, uansett hvor den kommer fra.
:::

## Hvorfor validere output?

Det kan hende at andre systemer forutsetter at dataene fra dere er gyldige og ikke inneholder skadelig kode. Output-validering hindrer at skadelig kode blir sendt ut av systemet, og kan bidra til å forhindre angrep i andres systemer.

Output-validering sikrer også at dataene presentert til brukerne er gyldige og ikke inneholder skadelig kode som XSS (Cross-Site Scripting).

## Hvordan validere input?

- For enkle typer som tall, datoer, enum og e-postadresser: bruk innebygde typer i programmeringsspråket og valider.
- Når det kommer til tekst:
  - Vurder hvilke tegn som er gyldige.
  - Sett opp en liste av gyldige tegn, og bruk regex for å validere at inputen kun inneholder disse tegnene.
  - For eksempel, fjerne alle ugyldige tegn: `input.replace(/[^a-zA-ZÀ-Ÿ0-9, -_.]/g, "")`.
  - Trenger man rik tekst eller HTML, vurder hvilke tags og attributter som er gyldige, og bruk et bibliotek for å sanitere.
- Filopplasting er spessielt skummelt:
  - [Egen side om filopplasting](/docs/sikker-utvikling/filopplasting)

:::danger OBS!
Vi bør validere både i frontend og backend. Frontend-validering gir rask tilbakemelding til bruker, mens backend-validering sikrer at dataene er gyldige før de lagres eller behandles videre. Vi kan ikke stole på at frontend-validering er tilstrekkelig, da brukere kan omgå den ved å sende direkte forespørsler til backend.
:::

## Hvordan validere output?

Vær obs på at output kan være sammensatt av flere kilder og at kombinasjonen av disse kan gi uventede resultater.

Når man presenterer data til brukere, sørg for at de enkodes riktig. Bruk rammeverkets innebygde funksjoner for å enkode data som skal vises i HTML, JSON eller andre formater. Dette kan bidra til å forhindre XSS-angrep.

**For eksempel, ikke bruk `dangerouslySetInnerHTML` i React!**

### CSP (Content Security Policy)

CSP vil også hjelpe til å trygge output ved å begrense hva vi tilater på sidene våre. Se [OWASP CSP jukse ark](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
