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

:::note Trusselmodelleringens fire spørsmål

- Hva er det vi jobber med?
- Hva kan gå galt?
- Hva skal vi gjøre med det?
- Gjorde vi en god nok jobb?

<p style={{fontSize:"small"}}><i>"Hva er det vi jobber med" kan være et helt system, en applikasjon eller en liten feature. Trusselmodellering kan 
brukes med fordel i alle tilfeller.</i></p>
:::

## Hvordan gjennomfører man en trusselmodellering?

<p style={{fontSize:"x-small"}}><i>Det er mange teknikker og modeller for å gjennomføre trusselmodellering, det som 
presenteres her er den subjektivt beste. Diskusjon rundt trusselmodellerng tas i <a href="https://nav-it.slack.com/archives/CN8N938K1">#security-champion</a></i></p>

### 1. Hva vi jobber med?

Den første oppgaven er å beskrive det som skal trusselmodelleres på en hensiktsmessig måte slik at alle som deltar har
en konkret forståelse av hva som er relevant og hva som er irrelevant i denne konteksten. Et godt utgangspunkt er en
enkel tegning av systemet/applikasjonen/featuren i stilen
av _[Data Flow Diagram](https://en.wikipedia.org/wiki/Data-flow_diagram)_.

**Data Flow Diagram**

:::caution Nøyaktighet
Ikke tenk så mye på å være pinlig nøyaktig! Diagrammet skal ikke være dokumentasjon, det skal være et verktøy for å
hjelpe til å oppdage sikkerhetsproblemer. Husk at alle modeller er feil, men mange kan være nyttige
:::

1. Tegn opp systemet man skal trusselmodellere.

   I dette tilfellet så er systemet en visningsløsning for brukere. Vi starter enkelt og tar i begynnelsen bare med det vi
   mener er de viktigste prosessene, personene og data.

2. Ta med dataflyt og tillitgrenser.

<img alt="Eksempel på DFD tegning" src="/img/DFD_eksempel.png"/>

<details>
<summary>DFD symboler</summary>

<img alt="DFD symbolene vi bruker" src="/img/DFD_symboler.png"/>

</details>
### 2. Hva kan gå galt?

Systematisk gjennomgang av komponentene med mål om å finne sårbarheter. Her kan man velge flere metoder som:

#### 2.1. STRIPED

Huskeordet **STRIPED** (som er basert [STRIDE](<https://en.wikipedia.org/wiki/STRIDE_(security)>)) oppsummerer viktige trusler

- **S**poofing - aktør utgir seg for å være en annen for å få uautorisert tilgang
- **T**ampering - aktør forsøker å endre på data, f.eks. gjennom [_SQL-injeksjon_](https://en.wikipedia.org/wiki/SQL_injection)
- **R**epudiation - aktør benekter at man har utført en handling, som at man har mottatt noe, eller godtatt noe
- **I**nformation disclosure - aktør kan lese data de ikke skal ha tilgang til å lese, gjennom f.eks. [_man-in-the-middle_ (MITM)](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) eller SQL-injeksjon
- **P**rivacy - uautorisert innsamling, bruk, visning eller lagring av personopplysninger.
- **E**levation of privilege - aktør forsøker å skaffe seg mer tilgang enn man skal ha
- **D**enial of service - aktør forsøker å gjøre systemet utilgjengelig for brukerne

<details>
<summary>STRIPED detaljer</summary>

| Trussel                                             | Bruddtype        | Definisjon                                                                 | Eksempel                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------- | ---------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S**poofing                                        | Autentisering    | Å utgi seg for noen eller noe                                              | Forfalske e-post, forfalske ip-adresse, forfalske et nettsted, forfalske bruker, forfalske en Python-modul, forfalske en npm-pakke                                                                                                                                                                                                              |
| **T**ampering                                       | Integritet       | Endre data eller kode                                                      | Endre en fil, endre kode i en NPM-repo, endre en pakke når den går gjennom nettverket, endre en binær, tukle med en fysisk enhet, endre en loggoppføring                                                                                                                                                                                        |
| **R**epudiation                                     | Ikkenektbarhet   | Påstå å ha eller å ikke ha utført en handling                                         | "Jeg sendte ikke den e-posten", "Jeg gjorde ikke den endringen", "Jeg har ikke brukt det systemet", "Jeg godtok ikke denne kontrakten", "Jeg har ikke lagt ut dette", "Jeg har jo sendt den søknaden"                                                                                                                                 |
| **I**nformation disclosure                          | Konfidensialitet | Å vise informasjon til noen som ikke er autorisert til å se den            | Publiser en liste over kunder til et nettsted, avlytte nettverkstrafikk, stjålet/tapt ukryptert mobilenhet, usikker skylagring, lagring av en hemmelighet i koden din                                                                                                                                                                           |
| **P**rivacy                                         | Personvern       | Uautorisert innsamling, bruk, visning eller lagring av personopplysninger. | Vi har ingen anelse om hvilke personopplysninger vi har, vi samler inn mer enn vi trenger, vi behandler i en skytjeneste - uten databehandleravtale, lagres på ubestemt tid uten åpenbar grunn, vi deler ingen informasjon om hvilken informasjon vi samler inn, sporing av informasjonskapsler, spyware, offentlige kameraopptak, stedssporing |
| **E**levation of privilege (Utvidelse av myndighet) | Autorisasjon     | Få muligheter uten riktig autorisasjon                                     | Tillate en ekstern internettbruker å kjøre kommandoer, XSS, SQL Injection, RCE, gå fra begrenset til admin-bruker, bruke standardpassord, sosial manipulering, phishing-angrep, feilkonfigurasjon, null-dagers sårbarheter                                                                                                                      |
| **D**enial of service                               | Tilgjengelighet  | Nekte eller forringe tjenesten til brukerne                                | Nettverksoverflodsangrep - bruk alle ressurser, spis alt minne for et program, rute pakker til void, DDos                                                                                                                                                                                                                                       |

</details>

#### 2.2. Sårbarhetstrær

Her er et sett med sårbarhetstrær som kan brukes:

```mdx-code-block
import Saarbarhetstraer from './\_saarbarhetstraer.mdx'

<Saarbarhetstraer />
```

#### 2.3. Lister med spørsmål

- Hva mener dere er de største angrepsvektorene / sårbarhetene i systemet?

<details>
<summary>Autentisering/autorisering</summary>
- Hvordan gjøres autentisering for sluttbrukere/administaratorer? EntraID, Idporten, noe annet?
- Hvordan sikres det at rollene i systemet er tydelig adskilt?
- Hvordan gir man tilgang til systemet/funksjoner?
- Hvordan sørger man for at dere ikke lagrer påloggingings info i klartekst?
- Hvordan unngår dere at det lagres tokens/passord lokalt hos dere?
- Hvordan unngår dere at tokens/passord sjekkes inn i kildekoden?
</details>

<details>
<summary>Sesjonshåndtering</summary>
- Har dere implementert en egen mekanisme for å håndtere sesjoner?
- Hva er den maksimale levetiden for en sesjon?
- Hvordan deaktiveres en sesjon ved utlogging eller inaktivitet?
- Er den unik for hver bruker og ikke gjettbar?
</details>

<details>
<summary>Inputvalidering</summary>
- Hvordan valideres input?
- Er det implementert filtrering av input for å forhindre skadelig kode?
- Hvordan beskytter dere visning av eksterne data? Fra f.eks. brukere som legger inn script eller kode.
- Hvilke typer inputvalidering brukes for de forskjellige typene av data (f.eks. tekst, tall, datoer)?
</details>

<details>
<summary>Kryptografi</summary>
- Er det implementert kryptografi i systemet?
- Hvilke deler av systemet bruker kryptografi?
- Hvordan beskyttes data i transit (f.eks. overføring av data via nettverket)?
- Hvordan lagres sensitive data (f.eks. passord / persondata) i systemet?
</details>

<details>
<summary>Feil og logging</summary>
- Hvordan gjøres logging av aktivitet og feil?
- Er det noe overvåkning på plass?
- Hvordan håndteres feil i systemet?
- Hvor blir feil logget?
- Er det en mekanisme for å varsle administratorer om alvorlige feil eller sikkerhetsbrudd?
- Hvordan overvåkes systemet for unormal aktivitet?
</details>

#### 2.4. Elevation of Privilege kortspill

<img alt="Elevation of Privilege card game" src="/img/EoP.webp" width="15%"/>

AppSecteamet har noen EoP-kortstokker som dere kan bruke for å utforske trussler i systemet.
Ta kontakt med AppSecteamet for å få låne i en kortstokk. [#appsec](https://nav-it.slack.com/archives/C06P91VN27M)

### 3. Hva skal vi gjøre med det?

Man må velge en strategi for å håndtere truslene. Det er flere muligheter:

- **Redusere** - legg til kontroller, retningslinjer, prosedyrer eller koder for å redusere sårbarheten
- **Eliminere** - fjerne funksjonalitet, kode eller komponent
- **Godta** - erkjenne, forstå og dokumentere aksept
- **Overføre** - kjøpe forsikring, dele med andre, dokumentere eller spore

**Sjekk og verifiser** forutsetninger og problemer

### 4. Gjorde vi en god nok jobb?

**Gjør retrospektiver av trusselmodellering jevnlig!**
Der kan integrere dem i de vanlige teamretroene, eller ha dedikerte økter for det. (Hvor evaluerer du vanligvis emner som kvalitet, standarder, sikkerhetskode, etc?)

**Mulige spørsmål til refleksjon:**

- Fant vi noen trusler?
- Bør vi ha mål som «2 STRIPED» trusler per komponent?
- Hvor mange av de identifiserte truslene har vi klart å håndtere? (lukket vs åpent)
- Fungerte tiltakene våre?
- Har vi hendelser som er forårsaket av feil i tiltakene våre?
- Er vi (teamet) fornøyd med vår måte å drive trusselmodellering på?
- Setter vi av nok tid til trusselmodellering?
- Fungerer vår mekanisme for å prioritere arbeid?
- Er det noen eksperimenter vi bør prøve, som f.eks. andre metoder?

### 5. Husk SDLC

:::note SDLC
SDLC = Software/System Development Life Cycle

:::

Det meste av sikkerhetsarbeidet vårt fokuserer på å beskytte systemene våre og egenutviklede apper.
Vi bruker mindre tid på trusselmodellering av våre egne utviklingsprosesser.
Angrep i forsyningskjeden er reell fare.
Vår SDLC er eksponert for ulike angrepsvektorer.
Programvareutviklere har ofte et bredt sett med tillatelser og er "mål med høy verdi"

## God kultur er det viktigste målet

- En kultur for å finne og fikse problemer
  - Ikke bare sjekkboks etterlevelse
- Fokus på folk og samarbeid
  - Ikke bare prosesser, metoder eller verktøy
- Felles forståelse og læring
  - Ikke bare sikkerhet og personvern
- Utføre trusselmodellering
  - Ikke bare snakke om det
- Kontinuerlig finjustering
  - Ikke bare en leveranse

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
