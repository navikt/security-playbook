---
title: Ordliste 📕
description: Beskrivelse av hva ulike ord betyr.
hide_table_of_contents: false
---

# Ordliste

## Sikkerhetsrelaterte ord og uttrykk

### A

#### Access Control List (ACL)

En ACL, eller tilgangskontroll er en liste med regler som sier hvem eller hva som får lov til å snakke med dingsen man tilgangsstyrer. NAIS har mulighet for å sette noen noe tilgangstyring for applikasjonen din i nais.yml gjennom accesPolicy variabelen.

#### Audit log

En audit log (eller audit trail) er en kronologisk logg av hendelser som dokumenterer aktivitetene som har påvirket tilstanden til et bestemt objekt. Et slikt objekt kan være alt fra databaser og filer til fysiske "dingser". Audit-logging benyttes gjerne der man har et ekstra behov for å kunne dokumentere hendelser i ettertid som finansielle transaksjoner, i helseregistre og ifm pålogging og autorisering.

#### Autentisering

Autentisering er handlingen som utføres for å bekrefte riktigheten av en påstått identitet.

#### Autorisering

Autorisering er handlingen som utføres for å godkjenne eller gi tillatelse for noen til å utføre noe.

### B

#### Blue team

En gruppe som analyserer sikkerheten i IT-systemer og implementerer tiltak for å adressere svakheter de finner. Navnet stammer fra militære øvelser. Veldig forenklet kan man si at blue team er de som forsvarer mens [red team](#red-team) er de som angriper.

#### Botnet

En gruppe av datamaskiner som er infisert av [malware](#malware) som kontrolleres av en enkelt aktør. Nettverket kan kommanderes til å utføre handlinger, feks. [DDoS-angrep](#denial-of-service-angrep), på vegne av denne aktøren.

#### Bastion Host

En "bastion host" er en spesiell form for server som er designet for å stå imot angrep. Den er eksponert for offentlig internett og er dermed et vanlig mål for uønsket handlinger. "Bastion host" brukes ofte i sikkerhetssammenhenger og kan bli sett på som den første linjen av forsvar i beskyttelse av interne datanettverk.

En bastion host er vanligvis fullstendig sikret i henhold til best practice standarder, og kjører så få applikasjoner som mulig for å minimere potensielle sikkerhetshull. Denne serveren er også regelmessig oppdatert og overvåket for å sikre at den fortsatt gir det nødvendige sikkerhetsnivået.

En vanlig bruk for en bastion host er som en server for en VPN-tjeneste, som tillater ekstern tilgang til et nettverk. I denne konteksten vil bastion hosten håndtere alle inngående nettverkstilkoblinger og vil autentisere brukere før de får tilgang til det interne nettverket.

### C

#### CA

Certification Authority

A sertifikatmyndighet (CA), også noen ganger referert til som en sertifiseringsmyndighet,
er et selskap eller organisasjon som opptrer for å validere identitetene til enheter
(for eksempel nettsteder, e-postadresser, selskaper eller enkeltpersoner) og binder dem til
kryptografiske nøkler gjennom utstedelse av elektroniske dokumenter kjent som digitale sertifikater.

#### Capture the flag (CTF)

Konkurranse hvor team eller enkeltpersoner skal finne, og av og til stjele (flere ulike varianter finnes), skjulte "flagg" ved å utnytte sårbarheter i software eller hardware. Hensikten er at deltakerne skal lære (eller vise at de behersker) ulike teknologier og angrepsteknikker. Dette kan være ting som reverse engineering, pakkesniffing, programmering, protokollanalyse og mye mer. Terminologien stammer fra sporten der et lag skal ta seg inn på det andre lagets område og stjele flagg som skal bringes trygt hjem.

#### CERT

Computer Emergency Response Team - team som koordinerer og hjelper til når det er en IT-sikkerhetshendelse (er egentlig et registrert varemerke, og noe man kan sertifiseres for, så noen organisasjoner bruker f eks CSIRT - Computer Security Incident Readiness Team)

#### Command & Control (C2)

Infrastruktur og rammeverk som benyttes av ["red teams"](#red-team) og trusselaktører for å angripe datamaskiner og opprettholde oversikt over og kontroll på maskiner de allerede har kompromittert. Uttrykket er (som mye av den andre terminologien i sikkerhetsbransjen) hentet fra det militære. Kontrollen opprettholdes ved å installere en eller form for "agent" på disse maskinene. Agentene søker å gi seg selv persistens, dvs at de kan overleve restarting av maskinen samtidig som de søker å gjøre seg selv så lite synlige som mulig. Kommunikasjonen mellom agentene og serverne kan skje over mange ulike protokoller alt etter hvilket miljø de er i. De ulike rammeverkene har ulik grad av funksjonalitet for å "kommandere" agentene til å utføre ønskede handlinger. Det finnes en rekke mer eller mindre avanserte C2-rammeverk, det mest kjente kommersielle produktet er "Cobaltstrike".

#### CRL

I kryptografi er en sertifikatopphevelsesliste (eller CRL)
"en liste over digitale sertifikater som har blitt tilbakekalt av den [utstedende sertifikatmyndigheten](#ca) før deres planlagte utløpsdato og som ikke lenger skal være klarert".
CRL-er kreves ikke lenger av CA/Browser-forumet, ettersom alternative teknologier for tilbakekalling av sertifikater (som OCSP) i økende grad brukes i stedet.
Likevel er CRL-er fortsatt mye brukt av CA-ene.

#### Cross Site Scripting (XSS)

[Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) er en angrepsmekanisme der angriper prøver å legge til ondsinnet skript til en webside. Angrepet skjer ved at en angriper klarer å sende kode med onde hensikter, ofte i form av browserskript (f.eks. javascript), til en intetanende bruker (ekstern eller intern bruker). Det finnes flere teknikker for å beskytte seg mot XSS, anbefaler å gå igjennom en sjekkliste fra [OWASP siden om ulike teknikker for beskyttelse](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

#### Cross-origin resource sharing (CORS)

Mekanisme som tillater at ["begrensede"](#same-origin-policy-sop) ressurser på en webside kan hentes fra et annet domene enn det som websiden stammer fra. Et vanlig bruksområde er å hente data fra API-er som er hostet av andre vha JavaScript `fetch`-kall. CORS er implementert vha en rekke [Access-Control HTTP-headere](https://portswigger.net/web-security/cors). CORS er et nyttig verktøy, men også en angrepsvektor dersom det brukes feil.

#### Cross-Site Request Forgery (CSRF)

CSRF handler om forfalskning av forespørsler sendt via nettlesere på vegne av andre brukere. Har man som bruker en aktiv sesjon på site A kan en angriper lure brukeren til å sende forespørsler til site A fra en ondsinnet site, som da blir sendt på vegne av offeret. Dersom de som har utviklet site A ikke har tatt aktive grep for å forhindre dette kan angripere utføre handlinger på site A på vegne av andre brukere. Det finnes en rekke løsninger på dette problemet, der bruken av et såkalt CSRF-token er en av de mest brukte. [Les mer om slike tokens og andre løsninger på Wikipedia](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Synchronizer_token_pattern).

#### Common Vulnerabilities and Exposures (CVE)

CVE står for Common Vulnerabilities and Exposures. CVE er en internasjonal, felleskapsdrevet innsats for å identifisere, definere og katogorisere kjente programvare/fastvare(firmware) sårbarheter. Det er en CVE-Record for hver sårbarhet identifisert i katalogen. Sårbarhetene blir oppdaget og deretter tildelt og publisert av organisasjoner fra hele verden som har inngått samarbeid med CVE-programmet. Fagfolk innen informasjonsteknologi og nettverkssikkerhet bruker CVE-Record for å forsikre seg at de diskuterer det samme problemet, og for å koordinere innsatsen for å prioritere og adressere sårbarhetene.
[Ler her for mer info om CVE](https://www.cve.org/About/Overview)

### D

#### Denial of Service-angrep

(Distributed) DoS er en type angrep der man søker å gjøre datamaskiner midlertidig eller permanent utilgjengelige. En vanlig måte å gjøre dette på er å overbelaste maskinene ved å sende de så mange forespørsler at de ikke klarer å håndtere dem. Hvis angrepet utføres distribuert fra flere steder blir det vanskeligere å stoppe.

#### Digital sikkerhet (Nav)

IT-område [digital sikkerhet](https://teamkatalog.nav.no/area/adf0151b-83c2-43e7-91ec-bd078230f688). Les mer på [Navet](https://navno.sharepoint.com/sites/enhet-it-avdelingen/SitePages/IT-omr%C3%A5de%20digital%20sikkerhet.aspx).

### F

#### Fuzzing

Metode for automatisk testing der man sender ugyldige data som input til et program eller nettverksendepunkt. Målet er å få programmet til å kræsje eller oppføre seg annerledes enn tiltenkt. Denne inputen kan være tilfeldig eller skreddersydd for å treffe på mulige "corner cases" i programmets logikk.

### H

#### Hash

En hash-funksjon mapper data med tilfeldig størrelse til et tall med fast lengde. Dette tallet kalles en hash, hash code eller en digest. Hash-funksjoner returnerer alltid samme resultat for samme input. Lengden på hashen bestemmes av hvilken algoritme som benyttes, eksempler på slike er MD5 og SHA-256.

### I

#### Indicator of Compromise (IoC)

Filer, innslag i logger eller andre ting man finner som indikerer at uvedkommende er og/eller har vært på besøk på datamaskiner eller i nettverk. Det er mange måter å oppdage IoC'er på. Man kan f.eks. søke etter kjente ondsinnede filer vha [hasher](#hash), søke etter kjente signaturer (som er metoden de fleste antivirus-programmer benytter) eller se etter ukjente prosesser som kjører på maskinen. Nettverkstrafikk til og fra kjente ondsinnede ip-adresser er også typiske IoC'er.

#### Informasjonssikkerhet

"InfoSec" som det ofte forkortes er prosessen og konkrete tiltak som utføres for å beskytte informasjon. Prosessen består typisk av en eller flere former for trusselmodellering der man søker å identifisere hvilke trusler man står ovenfor og hvilke konkrete risikoer de medfører. Siden det er umulig å beskytte seg mot alt og alle må man deretter prioritere hvilke risikoer man skal akseptere og hvilke man skal sette inn tiltak mot (og i hvilken form). InfoSec-arbeid består i stor grad av å balansere de tre grunnpillarene (konfidensialitet, integritet og tilgjengelighet) opp mot at organisasjonen skal kunne utføre jobben sin på best mulig måte.

### M

#### Malware

Fellesbetegnelse på programvare som er laget for å stjele informasjon, omgå sikkerhetsmekanismer, kræsje eller på annen måte forstyrre den tiltenkte virkemåten til datamaskiner og/eller nettverk.

#### Man in the middle-angrep

Når en angriper installerer seg selv som et mellomledd i kommunikasjon uten at deltakerne merker det. Hensikten med dette er oftest at man ønsker å lytte på det som blir sendt fram og tilbake, men i en slik posisjon kan man også endre på informasjonen.

### O

#### OAuth

Open Authorization

Standard for delegering av tilgang på weben. Gjør det mulig å la brukere dele informasjon på beskyttede websider uten å samtidig måtte dele sine brukernavn og passord. Er mye brukt av tilbydere som Google og Facebook for å muliggjøre deling av kontoinformasjon med tredjeparter.

#### OCSP

Online Certificate Status Protocol (OCSP) er en Internett-protokoll som brukes for å få
tilbakekallingsstatusen til et X.509 digitalt sertifikat. Den er beskrevet i RFC 6960.
Den ble opprettet som et alternativ til [sertifikattilbakekallingslister](#crl),
som spesifikt adresserer visse problemer knyttet til bruk av CRL-er i en [offentlig nøkkelinfrastruktur](#pki).
Meldinger som kommuniseres via OCSP er kodet i ASN.1 og kommuniseres vanligvis over HTTP.

#### OIDC (OpenID Connect)

Tynt lag oppå [OAuth](#oauth) som fokuserer på innlogging. Lar deg "outsource" verifisering av brukere til en tredjepart, i standarden benevnt som en "identity provider", som du stoler på. OIDC definerer også standardmekanismer for å hente enkel profilinformasjon (som navn og e-post) om brukeren.

#### OWASP

The Open Web Application Security Project, en "nonprofit" organisasjon som jobber for å bedre sikkerheten i software. Har hundrevis av lokalavdelinger som arrangerer kurs og konferanser over hele verden i tillegg til å lage verktøy og publikasjoner. Er kanskje mest kjent for [OWASP Top Ten](https://owasp.org/www-project-top-ten/) som er en kultivert liste over de 10 mest utbredte truslene mot webapplikasjoner.

### P

#### Phishing

En type [social engineering](#social-engineering) der en angriper sender målet en forfalsket melding i den hensikt å få målet til å oppgi sensitiv informasjon eller kunne installere [malware](#malware) på målets maskin. Man kan på denne måten feks stjele brukernavn og passord ved å få folk til å besøke en falsk påloggingsside.

#### PKCS

Public Key Cryptographic Standards. Inkluderer flere formater f.eks.

- PKCS#12 som brukes til å lagre X.509 privat nøkkel som følger med offentlige nøkkelsertifikater,
  beskyttet av symmetrisk passord
- PKCS#7 Se RFC 2315. Brukes til å signere og/eller kryptere meldinger under en PKI.
  Brukes også for sertifikatspredning (for eksempel som svar på en PKCS #10-melding).
  Dannet grunnlaget for S/MIME, som per 2010 er basert på RFC 5652, en oppdatert Cryptographic Message Syntax Standard (CMS).
- PKCS#10 Se RFC 2986. Format på meldinger sendt til en sertifiseringsinstans [CA](#ca) for å be om sertifisering av en offentlig nøkkel.

#### PKI

Public Key Infrastructure består av policyer, standarder, personer og systemer som støtter distribusjon av offentlige nøkler
og identitetsvalidering av enkeltpersoner eller enheter med digitale sertifikater og en [sertifiseringsinstans](#ca).

#### Prototype pollution

Prototype pollution er en angrepsmekanisme der angriper endrer prototype ("\_\_proto\_\_") egenskapen til et JavaScript objekt. JavaScript er prototype-basert; det vil si at alle objekter har denne egenskapen, som inneholder grunnleggende funksjonalitet slik som `toString`, `constructor`, og `hasOwnProperty`. Avhengig av logikken til applikasjonen din, kan prototype pollution føre til så og si alle populære web sårbarheter: Remote Code Execution (RCE), Cross Site Scripting (XSS), SQL Injection, Denial-of-Service (DoS), osv. Les mer om prototype pollution, se kode-eksempler, og lær hvordan du kan beskytte deg mot det [her på Snyk Learn](https://learn.snyk.io/lessons/prototype-pollution/javascript/).

#### Public-key kryptografi

Public-key kryptografi, eller asymmetrisk kryptografi, er et system som benytter nøkkelpar. Hvert par består av en privat nøkkel som holdes hemmelig og en offentlig nøkkel som deles med andre. Hvis A skal sende data til B så krypterer og/eller signerer hen med B's offentlige nøkkel. Den eneste som kan dekryptere og verifisere disse dataene er da B vha sin private nøkkel. Dette muliggjør at man kan kommunisere sikkert med noen uten å måtte utveksle hemmeligheter via andre kanaler på forhånd. Asymmetrisk kryptografi er grunnsteinen i en rekke protokoller og standarder for kommunikasjon og [tillit](#signatur) som f.eks. PGP, HTTPS/TLS og SSH.

### R

#### RA

Registration authority

En registreringsmyndighet (RA) er en autoritet i et nettverk som verifiserer brukerforespørsler om et
digitalt sertifikat og ber sertifikatmyndigheten (CA) om å utstede det.
RA er en del av en offentlig nøkkelinfrastruktur ([PKI](#public-key-kryptografi))), et nettverkssystem som gjør det
mulig for bedrifter og brukere å utveksle informasjon trygt og sikkert.
Det digitale sertifikatet inneholder en offentlig nøkkel som brukes til å kryptere meldinger
og validere digitale signaturer. Den prvate nøkkelen brukes til å dekryptere krypterte meldinger
og opprette digitale signaturer (signere meldinger).

Selv om RA ikke kan opprette eller utstede et sertifikat, da dette er CAs eneansvar,
fungerer den som en mellommann for CA for å samle inn nødvendig informasjon og behandle følgende oppgaver:

- motta bruker- eller enhetssertifikatforespørsler
- validere brukere eller enheter
- autentisere brukere eller enheter
- trekke tilbake credentials hvis sertifikatet ikke lenger er gyldig

Hovedformålet med en RA er å sikre at en bruker eller enhet har lov til å be om et digitalt sertifikat
fra en bestemt nettside eller applikasjon. Hvis forespørselen tillates,
videresender RA sertifikatforespørselen til CA, som fullfører den digitale sertifikatforespørselsprosessen.

#### Ransomware

En type [malware](#malware) som tar filer som "gissel" ved å kryptere dem slik at eieren ikke lenger kan lese dem. Hensikten er å kreve eieren for penger eller tjenester for å få utlevert nøkkelen som kan dekryptere filene.

#### Red team

En gruppe som spiller rollen som trusselaktør og med eierens tillatelse tester sikkerheten i systemer ved å angripe dem på samme måte som det ville ha blitt gjort "på ordentlig". Red teams finnes ikke bare innenfor IT, men også f.eks. på steder der man trenger god fysisk sikkerhet som banker og flyplasser. Motsetningen til red teams er [blue teams](#blue-team)

### S

#### Same-origin Policy (SOP)

En av grunnsteinene i sikkerhetsmodellen på weben. En `origin` er et sted der innhold er lastet fra og består av kombinasjonen protokoll, host og port. `http://www.nav.no` er ikke det samme som `http://pensjon.nav.no` fordi hosten er forskjellig, `http://nav.no` ikke er det samme som `https://nav.no` fordi protokollen er forskjellig mens `https://nav.no` ikke er det samme som `https://nav.no:8080` fordi porten er forskjellig. Ressurser som bilder og style sheets kan lastes fra andre origins, men JavaScript har kun tilgang til den delen av DOM-en som stammer fra samme origin. Cookies sendes (med mindre det er eksplisitt overstyrt) kun tilbake til samme origin. For de tilfellene der man har bruk for å dele mellom ulike origins finnes mekanismen [CORS](#cross-origin-resource-sharing-cors).

#### Security Champion (Nav)

Teamets sikkerhetssamvittighet. Ikke nødvendigvis en sikkerhetsekspert, men en person som har sikkerhet mer i bakhodet enn andre. Les mer på siden [«Hva er en Security Champion?»](/docs/security-champion-rolle).

#### Signatur

En digital signatur er en matematisk metode for å verifisere ektheten til digitale meldinger eller dokumenter. En gyldig signatur gir mottakeren tillit til at meldingen ble produsert av en kjent avsender og ikke har blitt endret underveis. Signering og verifikasjon gjøres ved hjelp av [asymmetrisk kryptografi](#public-key-kryptografi).
Eksempler på digitale signaturer er bl.a. XMLDSIG, XAdES, CAdES, PAdES, JAdES, ASiC-S/ASiC-E.

#### Sikkerhetshendelse

En sikkerhetshendelse er en bekreftet hendelse.
En sikkerhetshendelse kan føre til brudd på konfidensialitet, integritet og tilgjengelighet.
En sikkerhetshendelse kan bl.a. skyldes at

- systemer og/eller annen infrastruktur er truet av teknisk feil
- uvanlig mange forsøk på pålogging over et kort tidsrom
- data er kommet på avveie, eller data er blitt korrupt
- dataangrep fra eksterne eller interne trusselaktører

#### Sikkerhetssituasjon

En sikkerhetssituasjon er en mulig hendelse. Status er usikkert og uavklart, men kan utvikle seg til en Sikkerhetshendelse.

#### SOC

Security Operations Center - organisatorisk enhet som har som hovedoppgave å drive overvåkning med tanke på å oppdage og mitigere sikkerhetshendelser

#### Social engineering

Bruk av psykologisk manipulasjon for å få mennesker til å utføre handlinger (som å klikke på vedlegg eller starte applikasjoner) eller avsløre konfidensiell informasjon. Eksempler på teknikker kan være å lure deg til å tro at du er i kontakt med en venn eller kollega, eller at noe haster veldig sånn at du ikke har tid til å tenke deg om.

#### Supply chain attack

Et "supply chain attack" er et cyberangrep som søker å skade en organisasjon ved å rette seg mot mindre sikre elementer i forsyningskjeden. Et "supply chain attack" kan forekomme i alle bransjer, fra finanssektoren, oljeindustrien til en offentlig sektor. Nettkriminelle tukler vanligvis med produksjonsprosessen til et produkt ved å installere et rootkit eller maskinvarebaserte spioneringskomponenter.

[Wikipedia](https://en.wikipedia.org/wiki/Supply_chain_attack)

### T

#### Trojansk hest

Betegnelse på en type [malware](#malware) som lurer brukeren til å tro at den har gode hensikter. Terminologien stammer fra gammel gresk historie. Trojanere spres ofte vha [social engineering](#social-engineering). Mange [ransomware-angrep](#ransomware) starter med en trojaner.

### V

#### Virus

Betegnelse på en type [malware](#malware) som sprer seg selv ved å modifisere andre programmer og tilføre sin egen kode. De påvirkede programmene har da blitt "infisert", en metafor som stammer fra biologiske virus.
