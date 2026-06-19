---
title: KI/AI-sikkerhet
description: 🤔 Tenk selv, også når maskiner tenker for deg. 🤖
---

## Ansvar
Du er ansvarlig for det som gjøres, også når du bruker KI-verktøy.

## Risiko
Ingen modeller, agenter eller harnesser er noensinne _sikre_. Uansett hva slags sikkerhetstiltak som blir bakt inn i en modell eller rundt en agent så vil det alltid være mulig å angripe ved hjelp av prompt injections, long-term memory poisoning eller indirect context contamination. Alle disse angripsmetodene har til felles at de er komplisert å herde seg mot, og misbruker den tekniske implementasjonen som ligger i bunn av modeller.

## Isoler KI
Kjør KI-verktøy i egne miljøer, for eksempel med `cplt`, slik at de ikke får unødvendig tilgang til resten av 
utviklingsmiljøet. Se [cplt dokumentasjon](https://min-copilot.intern.nav.no/cplt)

## Prompt injection
Vær bevisst hvilke kilder KI-verktøy får tilgang til. Prompt injection er et angrep der en angriper manipulerer input for å få KI-en til å utføre uønskede handlinger eller lekke sensitiv informasjon.

KI skiller ikke alltid mellom instruksjoner og data. Hvis den får tilgang til data som inneholder ondsinnede instruksjoner, kan den bli lurt til å utføre dem. Begrens datatilgang, og valider/sanitér all input.

## Tilganger
Vær bevisst på hvilke tilganger du gir KI-verktøy.

Gi kun tilgang til det som er nødvendig for å løse oppgaven. Prinsippet om minste privilegium gjelder også her.

Unngå å gi KI-verktøy tilgang til sensitive data eller kritiske systemer. Feil bruk kan føre til datalekkasje eller skadelige handlinger.

Se også [Klientsikkerhet](/docs/sikker-utvikling/klientsikkerhet).

## Skills
Innføring av skills har vært et viktig bidrag for å holde kontekst og kostnad nede, men dette skaper også et problem hvor man ikke har oversikt over egen KI-flyt da skills blir lastet inn og hentet ved antatt behov av en agent. 

Vær derfor ekstra varsom og kritisk til verktøyene man tar inn i KI-flyten sin. Nettsider som [https://skills.sh](https://skills.sh) er en aggregator for brukerskapte skills, og man kan enklere vurdere sikkerhet ved å se hvordan sikkerhetsplatformer som Snyk eller Socket har scannet og vurdert disse skillene. Bruk helst kun skills som er utviklet in-house i Nav. Listen over disse finner man på [https://ki-utvikling.nav.no/verktoy?type=skill](https://ki-utvikling.nav.no).

**Anta at skills uten verifisering eller risikovurdering kan gjøre skade på maskin, kodebase eller dele hemmeligheter**.


:::tip Tips!
Hvis du er i tvil, spør. Det er mye billigere å etablere gode og sikre rutiner enn å rydde opp etter en lekkasje.
:::

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
