---
title: Ordliste
hide_table_of_contents: false
---

# Ordliste

## Sikkerhetsrelaterte ord og uttrykk

### B

#### Blue team

En gruppe som analyserer sikkerheten i IT-systemer og implementerer tiltak for å adressere svakheter de finner. Navnet stammer fra militære øvelser. Veldig forenklet kan man si at blue team er de som forsvarer mens [red team](#red-team) er de som angriper.

### C

#### Capture the flag (CTF)

Konkurranse hvor team eller enkeltpersoner skal finne, og av og til stjele (flere ulike varianter finnes), skjulte "flagg" ved å utnytte sårbarheter i software eller hardware. Hensikten er at deltakerne skal lære (eller vise at de behersker) ulike teknologier og angrepsteknikker. Dette kan være ting som reverse engineering, pakkesniffing, programmering, protokollanalyse og mye mer. Terminologien stammer fra sporten der et lag skal ta seg inn på det andre lagets område og stjele flagg som skal bringes trygt hjem.

#### CERT

Computer Emergency Response Team - team som koordinerer og hjelper til når det er en IT-sikkerhetshendelse (er egentlig et registrert varemerke, og noe man kan sertifiseres for, så noen organisasjoner bruker f eks CSIRT - Computer Security Incident Readiness Team)

#### Command & Control (C2)

Infrastruktur og rammeverk som benyttes av ["red teams"](#red-team) og trusselaktører for å angripe datamaskiner og opprettholde oversikt over og kontroll på maskiner de allerede har kompromittert. Uttrykket er (som mye av den andre terminologien i sikkerhetsbransjen) hentet fra det militære. Kontrollen opprettholdes ved å installere en eller form for "agent" på disse maskinene. Agentene søker å gi seg selv persistens, dvs at de kan overleve restarting av maskinen samtidig som de søker å gjøre seg selv så lite synlige som mulig. Kommunikasjonen mellom agentene og serverne kan skje over mange ulike protokoller alt etter hvilket miljø de er i. De ulike rammeverkene har ulik grad av funksjonalitet for å "kommandere" agentene til å utføre ønskede handlinger. Det finnes en rekke mer eller mindre avanserte C2-rammeverk, det mest kjente kommersielle produktet er "Cobaltstrike".

### D

#### Denial of Service-angrep

(Distributed) DoS er en type angrep der man søker å gjøre datamaskiner midlertidig eller permanent utilgjengelige. En vanlig måte å gjøre dette på er å overbelaste maskinene ved å sende de så mange forespørsler at de ikke klarer å håndtere dem. Hvis angrepet utføres distribuert fra flere steder blir det vanskeligere å stoppe.

#### Digital sikkerhet (NAV)

IT-område [digital sikkerhet](https://teamkatalog.intern.nav.no/area/adf0151b-83c2-43e7-91ec-bd078230f688). Les mer på [Navet](https://navno.sharepoint.com/sites/enhet-it-avdelingen/SitePages/IT-omr%C3%A5de%20digital%20sikkerhet.aspx).

### H

#### Hash

En hash-funksjon mapper data med tilfeldig størrelse til et tall med fast lengde. Dette tallet kalles en hash, hash code eller en digest. Hash-funksjoner returnerer alltid samme resultat for samme input. Lengden på hashen bestemmes av hvilken algoritme som benyttes, eksempler på slike er MD5 og SHA-256.

### I

#### Indicator of Compromise (IoC)

Filer, innslag i logger eller andre ting man finner som indikerer at uvedkommende er og/eller har vært på besøk på datamaskiner eller i nettverk. Det er mange måter å oppdage IoC'er på. Man kan f.eks. søke etter kjente ondsinnede filer vha [hasher](#hash), søke etter kjente signaturer (som er metoden de fleste antivirus-programmer benytter) eller se etter ukjente prosesser som kjører på maskinen. Nettverkstrafikk til og fra kjente ondsinnede ip-adresser er også typiske IoC'er.

### M

#### Malware

Fellesbetegnelse på programvare som er laget for å stjele informasjon, omgå sikkerhetsmekanismer, kræsje eller på annen måte forstyrre den tiltenkte virkemåten til datamaskiner og/eller nettverk.

### O

#### OWASP

The Open Web Application Security Project, en "nonprofit" organisasjon som jobber for å bedre sikkerheten i software. Har hundrevis av lokalavdelinger som arrangerer kurs og konferanser over hele verden i tillegg til å lage verktøy og publikasjoner. Er kanskje mest kjent for [OWASP Top Ten](https://owasp.org/www-project-top-ten/) som er en kultivert liste over de 10 mest utbredte truslene mot webapplikasjoner.

### P

#### Public-key kryptografi

Public-key kryptografi, eller asymmetrisk kryptografi, er et system som benytter nøkkelpar. Hvert par består av en privat nøkkel som holdes hemmelig og en offentlig nøkkel som deles med andre. Hvis A skal sende data til B så krypterer og/eller signerer hen med B's offentlige nøkkel. Den eneste som kan dekryptere og verifisere disse dataene er da B vha sin private nøkkel. Dette muliggjør at man kan kommunisere sikkert med noen uten å måtte utveksle hemmeligheter via andre kanaler på forhånd. Asymmetrisk kryptografi er grunnsteinen i en rekke protokoller og standarder for kommunikasjon og [tillit](#signatur) som f.eks. PGP, HTTPS/TLS og SSH.

### R

#### Ransomware

En type [malware](#malware) som tar filer som "gissel" ved å kryptere dem slik at eieren ikke lenger kan lese dem. Hensikten er å kreve eieren for penger eller tjenester for å få utlevert nøkkelen som kan dekryptere filene.

#### Red team

En gruppe som spiller rollen som trusselaktør og med eierens tillatelse tester sikkerheten i systemer ved å angripe dem på samme måte som det ville ha blitt gjort "på ordentlig". Red teams finnes ikke bare innenfor IT, men også f.eks. på steder der man trenger god fysisk sikkerhet som banker og flyplasser. Motsetningen til red teams er [blue teams](#blue-team)

### S

#### Security Champion (NAV)

Teamets sikkerhetssamvittighet. Ikke nødvendigvis en sikkerhetsekspert, men en person som har sikkerhet mer i bakhodet enn andre. Les mer på siden [«Hva er en Security Champion?»](/docs/security-champion-rolle).

#### Signatur

En digital signatur er en matematisk metode for å verifisere ektheten til digitale meldinger eller dokumenter. En gyldig signatur gir mottakeren tillit til at meldingen ble produsert av en kjent avsender og ikke har blitt endret underveis. Signering og verifikasjon gjøres ved hjelp av [asymmetrisk kryptografi](#public-key-kryptografi).

#### SOC

Security Operations Center - organisatorisk enhet som har som hovedoppgave å drive overvåkning med tanke på å oppdage og mitigere sikkerhetshendelser

#### Social engineering

Bruk av psykologisk manipulasjon for å få mennesker til å utføre handlinger (som å klikke på vedlegg eller starte applikasjoner) eller avsløre konfidensiell informasjon. Eksempler på teknikker kan være å lure deg til å tro at du er i kontakt med en venn eller kollega, eller at noe haster veldig sånn at du ikke har tid til å tenke deg om.

### T

#### Trojansk hest

Betegnelse på en type [malware](#malware) som lurer brukeren til å tro at den har gode hensikter. Terminologien stammer fra gammel gresk historie. Trojanere spres ofte vha [social engineering](#social-engineering). Mange [ransomware-angrep](#ransomware) starter med en trojaner.

### V

#### Virus

Betegnelse på en type [malware](#malware) som sprer seg selv ved å modifisere andre programmer og tilføre sin egen kode. De påvirkede programmene har da blitt "infisert", en metafor som stammer fra biologiske virus.
