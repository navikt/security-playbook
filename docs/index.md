---
title: Introduksjon ⭐
description: Beskribelse av hvilket innhold playbooken inneholder.
hide_table_of_contents: false
sidebar_position: 1
---

Velkommen til Navs Security Playbook – inngangen til alt du trenger for å jobbe med sikkerhet i produktteam.

:::note
Vi forsøker hardt å holde denne playbooken så åpen som mulig, men av og til må noen ting begrenses av hensyn til sikkerhet eller copyright og lisenser. Noen av linkene her vil derfor føre til steder som krever at du [jobber i Nav](https://www.detsombetyrnoe.no/) og har en [skikkelig nais device](https://doc.nais.io/device/).
:::

## Hva finner du her?

### 1. Hjelp med konkrete sikkerhetsoppgaver ✅

Det du trenger i det daglige. For eksempel:

- [Hvordan sette opp sikkerhetsverktøy for å oppdage sårbarheter i tredjepartsbiblioteker](/docs/sikker-utvikling/tredjepartskode)
- [Finne ut hvem du kan kontakte for sikkerhetsspørsmål](/docs/lenker)
- [Tips til gjennomføring av trusselmodellering](/docs/sikker-utvikling/trusselmodellering)

### 2. Informasjon om det du kanskje ikke har hørt om 💭

På siden [«Sikker utvikling i Nav IT»](/docs/sikker-utvikling) finner du en oversikt over temaer som burde være interessante for alle produktteam. Det anbefales å titte innom alle sammen, og spesielt hvis det er noe du ikke har hørt om før!

### 3. Fellesskap 💖

Det arrangeres jevnlige [samlinger, kurs og foredrag](/docs/events/). Målet er å bli kjent for å lettere lære av hverandre og bygge Norges beste og hyggeligste sikkerhetsmiljø!

## Forslag, kommentarer, eller feil?

Hjelp til med å gjøre playbooken enda bedre for neste besøkende! 🥰

Innholdet i playbooken er drevet av deg! Vi oppfordrer sterkt til å komme med forbedringer selv i [GitHub-repoet](https://github.com/navikt/security-playbook), men det går ellers an å si ifra i [#security-champion-kanalen](https://nav-it.slack.com/archives/CN8N938K1), eller ta direkte kontakt med oss i [AppSec](https://teamkatalogen.nav.no/team/02ed767d-ce01-49b5-9350-ee4c984fd78f).

:::tip Tips!
Hver side har en lenke direkte til kildekoden på GitHub. Trykk på **«Rediger denne siden»** nederst.  
:::

---

![alt-text](../static/img/sec-small.webp)

## Hvor går grensen?

Det kan være vanskelig å trekke grensen mellom plattformen og min app. Hva har vi som produktteam ansvar for, og hva tar plattformen seg av?

### Plattformens ansvarsområde

I grove trekk kan ansvarsforholdet beskrives slik: [Plattformen (NAIS)](https://nais.io) tilbyr et [kjøretidsmiljø](https://kubernetes.io/) for applikasjonene i tillegg til noen støttetjenester som de fleste trenger. Eksempler på slike støttetjenester er innsamling og indeksering av logger og metrikker, samt provisjonering av databaser og Kafka-topics. Plattformen besørger også det som trengs av nettverksressurser (ruting, lastbalansering, brannmurer mm.) for å rute trafikk fram til din app. For «on-prem» betyr dette oppsett og drift av fysiske bokser i våre egne datasentre, mens i [skya](https://cloud.google.com/) betyr dette å konfigurere opp de samme typene ressurser hos leverandøren. Plattform-teamet har også laget noen tjenester som forenkler ting som deploy og autentisering og autorisering av brukere. Se [NAIS-dokumentasjonen](https://doc.nais.io) for en oversikt.

### Produktteamenes ansvarsområde

Produktteamenes ansvar starter i det en forespørsel når deres applikasjon. De må selv sørge for at sikkerheten i sine applikasjoner er i henhold til det som forventes av Nav, både fra myndighetene og våre brukere. Vi i Nav forvalter store mengder penger og sensitiv informasjon, og setter derfor ekstra høye krav til oss selv med tanke på sikkerhet. Alle applikasjoner skal bygges i henhold til prinsippene om [«zero trust»](https://en.wikipedia.org/wiki/Zero_trust_security_model).

Teamene bør søke å ha oversikt over og kontinuerlig fokus på å avverge de vanligste truslene mot sine applikasjoner. Den vanligste oversikten å støtte seg på er [OWASP Top 10](https://owasp.org/www-project-top-ten/). Når man releaser software hyppig er det ekstra viktig at man har kontinuerlig fokus på sikkerhet og ikke tenker det er «noe man kan legge til etterpå».

I de neste delene av denne playbooken vil vi gå gjennom noen teknikker og metoder som kan benyttes til dette.
