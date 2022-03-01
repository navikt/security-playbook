---
title: Trusselmodellering
description: 🪖 Det meste går bra, så lenge du først har sagt ja
---

_Trusselmodellering_ er prosessen med å systematisk identifisere, forstå og finne tiltak mot sikkerhetstrusler i
systemene vi utvikler. Ordet trusselmodellering kan virke teoretisk og avskrekkende, men trusselmodellering er noe vi
alle gjør i vårt daglige liv - hver gang du skal krysse veien og ser deg for etter biler gjør du en liten kort
trusselmodellering!

I denne artikkelen har vi prøvd å summere opp erfaringer og tips med trusselmodellering slik at det skal bli lettere å
forstå følgende:

- hvorfor trusselmodellering er nyttig
- hvordan man kan gjennomføre trusselmodellering
- hva man kan forvente å få ut av en trusselmodelleringssesjon (puh!) 💪

:::note trusselmodelleringens fire spørsmål

- Hva er det vi jobber med?
- Hva kan gå galt?
- Hva skal vi gjøre med det?
- Gjorde vi en god nok jobb?

<p style={{fontSize: "small"}}><i>"Hva er det vi jobber med" kan være et helt system, en applikasjon eller en liten feature. Trusselmodellering kan 
brukes med fordel i alle tilfeller.</i></p>
:::

## Hvordan gjennomfører man en trusselmodellering?

<p style={{fontSize: "x-small"}}><i>Det er mange teknikker og modeller for å gjennomføre trusselmodellering, det som 
presenteres her er den subjektivt beste. Diskusjon rundt trusselmodellerng tas i <a href="https://nav-it.slack.com/archives/CN8N938K1">#security-champion</a></i></p>

### 1. Hva vi jobber med?

Den første oppgaven er å beskrive det som skal trusselmodelleres på en hensiktsmessig måte slik at alle som deltar har
en konkret forståelse av hva som er relevant og hva som er irrelevant i denne konteksten. Et godt utgangspunkt er en
enkel tegning av systemet/applikasjonen/featuren i stilen
av _[Data Flow Diagram](https://en.wikipedia.org/wiki/Data-flow_diagram)_.

**Data Flow Diagram**

:::caution
Ikke tenk så mye på å være pinlig nøyaktig! Diagrammet skal ikke være dokumentasjon, det skal være et verktøy for å
hjelpe til å oppdage sikkerhetsproblemer.
:::

import DFDstepOne from '/img/dfd-step-1.svg';
import DFDstepTwo from '/img/dfd-step-2.svg';

1. Tegn ressursene som er i spill

   I dette tilfellet så er systemet en visningsløsning for brukere. Vi starter enkelt og tar i begynnelsen bare med det vi
   mener er de viktigste prosessene, personene og data.

   <DFDstepOne width="70%" height="70%" />

2. Legg på dataflyten mellom elementene

<DFDstepTwo width="70%" height="70%" />

### 2. Hva kan gå galt?

Systematisk gjennomgang av komponentene med mål om å finne sårbarheter.

Huskeordet [STRIDE](<https://en.wikipedia.org/wiki/STRIDE_(security)>) oppsummerer viktige trusler:

- **S**poofing - aktør utgir seg for å være en annen for å få uautorisert tilgang
- **T**ampering - aktør forsøker å endre på data, f.eks. gjennom [_SQL-injeksjon_](https://en.wikipedia.org/wiki/SQL_injection)
- **R**epudiation - aktør benekter at man har utført en handling, som at man har mottatt noe, eller godtatt noe
- **I**nformation disclosure - aktør kan lese data de ikke skal ha tilgang til å lese, gjennom f.eks. [_man-in-the-middle_ (MITM)](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) eller SQL-injeksjon
- **D**enial of service - aktør forsøker å gjøre systemet utilgjengelig for brukerne
- **E**levation of privilege - aktør forsøker å skaffe seg mer tilgang enn man skal ha

### 3. Hva skal vi gjøre med det?

### 4. Gjorde vi en god nok jobb?

![data flow diagram](/img/dfd_with_labels.jpg)

## Gode ressurser

- Threat Modeling: Designing for Security _(Boken til Adam Shostack som utviklet trusselmodellering praksisen hos Microsoft)_ [Oreilly](https://learning.oreilly.com/library/view/threat-modeling-designing/9781118810057/)
- Software Security: Building Security In _(Boken til Gary McGraw, beskriver et "software security" rammeverk som også inkluderer threat modeling)_ [Oreilly](https://learning.oreilly.com/library/view/software-security-building/0321356705/)
- The Treat Modeling Manifesto _(En kollektivt oppsummering av trusselmodellering skrevet i sammarbeid av flere "tanke ledere" innen trusselmodellering)_ [link](https://www.threatmodelingmanifesto.org/)

- Eksempler på rammeverk for trusselmodellering er [PASTA](https://owasp.org/www-pdf-archive/AppSecEU2012_PASTA.pdf).

Verktøy som kan være nyttige:

- [Threagile](https://threagile.io/)

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
