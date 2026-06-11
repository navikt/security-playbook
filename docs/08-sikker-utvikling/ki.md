---
title: KI/AI-sikkerhet
description: 🤔 Tenk selv, også når maskiner tenker for deg. 🤖
---

## Ansvar
Du er ansvarlig for det som gjøres, også når du bruker KI-verktøy.

## Isoler KI
Kjør KI-verktøy i egne miljøer, for eksempel med `cplt`, slik at de ikke får unødvendig tilgang til resten av utviklingsmiljøet.

## Prompt injection
Vær bevisst hvilke kilder KI-verktøy får tilgang til. Prompt injection er et angrep der en angriper manipulerer input for å få KI-en til å utføre uønskede handlinger eller lekke sensitiv informasjon.

KI skiller ikke alltid mellom instruksjoner og data. Hvis den får tilgang til data som inneholder ondsinnede instruksjoner, kan den bli lurt til å utføre dem. Begrens datatilgang, og valider/sanitér all input.

## Tilganger
Vær bevisst på hvilke tilganger du gir KI-verktøy.

Gi kun tilgang til det som er nødvendig for å løse oppgaven. Prinsippet om minste privilegium gjelder også her.

Unngå å gi KI-verktøy tilgang til sensitive data eller kritiske systemer. Feil bruk kan føre til datalekkasje eller skadelige handlinger.

Se også [Klientsikkerhet](/docs/sikker-utvikling/klientsikkerhet).

:::tip Tips!
Hvis du er i tvil, spør. Det er mye billigere å etablere gode og sikre rutiner enn å rydde opp etter en lekkasje.
:::

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
