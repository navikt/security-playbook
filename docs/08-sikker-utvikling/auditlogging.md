---
title: Auditlogging
description: Spor av alt som skjer, så du slipper å gjette mer 🔎.
---

## Hva er auditlogg?

Auditlogg eller innsynslogg er loggen over hvilke personopplysninger til en bruker som har blitt vist en Nav-ansatt i et fagsystem. Formålet er å kunne bevise, eller motbevise, om en ansatt har hatt sett opplysninger om en bruker. Auditloggene brukes blant annet til å lage innsynsrapporter til brukere og ledere, samt til proaktiv loggkontroll.

## Hvilke krav stilles til auditlogging?

Følgende avsnitt er en kopi av kravene slik de ligger i [Støtte til etterlevelse](https://etterlevelse.ansatt.nav.no/krav/253/1).

### 1. Når en brukers personopplysninger vises i vårt fagsystem, blir dette auditlogget

Visning av brukernes opplysninger i fagsystemene skal auditlogges.
Det finnes noen unntak fra kravet, se suksesskriterium 3.

### 2. Vi auditlogger kun når vi vet at personopplysninger er vist frem

Auditloggene skal dokumentere hvilke Nav-ansatte som har hatt tilgang til brukerdata. Derfor skal loggene kun inneholde hendelser som dokumenterer visning av informasjon. Det skal for eksempel ikke logges ved henting av data for tilgangskontroll eller maskinell behandling, eller når en Nav-ansatt får tilgang avvist.
Det kan oppstå tekniske feil som medfører at data i enkeltstående tilfeller ikke returneres fra backend til frontend. Det er ikke nødvendig å ta høyde for dette i loggingen.

### 3. Vi auditlogger ikke når en bruker "dukker opp" i et liste eller i en annen brukers sak

Når mengden personopplysninger som vises om en bruker er begrenset, og ikke stammer fra et direkte oppslag på brukeren, skal det ikke auditlogges. Eksempler på slike situasjoner er:

- Brukerens navn vises i en annen brukers sak, for eksempel som familiemedlem eller verge.
- Brukerens vises i en liste over deltakere på arbeidsmarkedstiltak.
- Brukerens fødselsnummer vises i en oppgave på oppgavebenken til den ansattes Nav-enhet.

Dersom disse situasjonene skrives til auditloggen, blir de oppfattet som ordinære oppslag og blir inkludert i brukerens innsynsrapporter. Dette gir et misvisende bilde av hva den ansatte har sett og gjort, og det er urimelig å forvente at den ansatte kan forklare dette i ettertid. Fagsystemene skal derfor kun auditlogge når den ansatte utfører en handling som tilgjengeliggjør ytterligere personopplysninger om brukeren, for eksempel ved å åpne brukerens sak

### 4. Vi auditlogger ikke mer enn nødvendig

For å redusere loggvolumet og minimere "støy" i auditloggen, skal én handling i et fagsystem resultere i én linje i auditloggen. Eksempler på handlinger er at en Nav-ansatt gjør oppslag på bruker eller navigerer til en ny fane eller skjermbilde i fagsystemet. Kun handlinger som gir den ansatte tilgang til nye personopplysninger om brukeren skal auditlogges.

### 5. Vi har avklart med Team Auditlogging hvorvidt fagsystemet skal inkluderes i innsynsrapportene til borgere og ledere

De fleste fagsystemer skal inkluderes i innsynsrapportene til borgere og ledere. Det må avklares med Team Auditlogging hvilke rapporter systemet skal inkluderes i, og hvordan systemet skal navngis og beskrives i rapporten.

### 6. Team Auditlogging har bekreftet at loggene er mottatt på rett format i produksjon

Les om loggformat i neste avsnitt. Format kan verifiseres i samarbeid med Team Auditlogging på teamets slack-kanal.

## Teknisk implementasjon av auditlogg

I Nav implementeres auditlogg i [ArcSight](#hva-er-arcsight-), og transportmekanismen til ArcSight er Syslog med unntak for legacysystemer.
Hvordan Syslog settes opp for NAIS applikasjoner er beskrevet [her](https://github.com/navikt/naudit). [Team Komet](https://teamkatalog.nav.no/team/5345bce7-e076-4b37-8bf4-49030901a4c3) har også utviklet en komponent for å hjelpe med oversendingen. Denne kan du finne på [github](https://github.com/navikt/common-java-modules/tree/main/audit-log)

Eksempler på implementasjon av auditlogg ( App'ene er strippet annet enn logging for å demonstrere hvordan dette fungerer ) :
| Type App | Github adresse |
|----------------------------------------|----------------------------------------|
| NodeJS app | https://github.com/navikt/testnodeapp |
| Java app | https://github.com/navikt/testjavaapp |
| Java app m/ Team Komet sin løsning | https://github.com/navikt/testjavaapp2 |

Det er [ArcSight Common Event Format (CEF)](https://www.microfocus.com/documentation/arcsight/arcsight-smartconnectors-8.3/pdfdoc/cef-implementation-standard/cef-implementation-standard.pdf) i versjon 0.1 som er loggformatet som benyttes i Nav.

Det mest vanlige i Nav er å benytte logback.xml gjennom logback rammeverket. Dette er gjerne i backend applikasjoner, og ofte java basert. Linken ovenfor er en måte å ordne dette på i Java. Dersom det logges i frontend, eksempelvis NodeJS relaterte applikasjoner kan f.eks Winston benyttes, eller [Winston-syslog](https://github.com/winstonjs/winston-syslog) da.

**MERK!** Etter Device Vendor \ Device Product er satt kan disse ikke endres uten at det tas opp med Team Auditlogg. Endringer i hva dere sender i Extension attributtene er helt opp til teamene selv, men disse to kan ikke røres ettersom de brekker filtrene vi benytter og loggene kan derfor falle ut av rapporter etc. Det er derfor svært viktig at Team Auditlogg informeres om endringer i disse som følge av valg teamene mener bør gjøres slik at vi kan løse problemene når de oppstår og ikke ende opp i en situasjon hvor bruker får ufullstendige logger uten at vi kan forklare dette.

## Hva er Arcsight ?

Arcsight er en SIEM pakke fra OpenText ( tidligere MicroFocus ). Dette er en løsning vi selv har installert og drifter på fysiske servere. Arcsight består av ulike komponenter som til slutt ( iallefall for vår del ) munner ut i innsynsrapporten og auditlogg arkiv for Nav. Tjenesten eies av Sikkerhetsavdelingen\Digital Sikkerhet og brukes av Team Auditlogg. Arcsight har vært i bruk i Nav siden rundt 2016. Ønsker du å vite mer ? Ta kontakt på Slack #auditlogging-arcsight

## Riktig bruk av severity

Som hovedregel benyttes INFO.
Dersom oppslagene er utenom det vanlige kan WARN benyttes. Dette kan f.eks. være oppslag på strengt fortrolig, fortrolig eller egne ansatte. Evnt andre hendelser som ansees som uvanlige eller mistenkelige. Per i dag logges kun eventer av typen "permit" hvor Nav-ansatte faktisk har fått innsyn til personopplysninger, men i framtiden kan WARN vurderes for eventer av typen "deny". Det er ikke unormalt i seg selv at en ansatt ikke har tilgang til data.

## Beskrivelse av CEF

> CEF:Version|Device Vendor|Device Product|Device Version|Device Event Class ID|Name|Severity|[Extension]

| CEF header field      | ArcSight attribute   | Beskrivelse                                                                                                                                          |
| --------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version               | CEF standard version | Sett til: 0 (null)                                                                                                                                   |
| Device Vendor         | Application name     | Fagsystemets navn, f.eks. Gosys eller Pesys. Navnet vil være synlig i loggrapoprtene og må være gjenkjennbart for de ansatte som bruker av systemet. |
| Device Product        | Log name             | Navn på applikasjon / undersystem f.eks. notat-administrasjon. Brukes for teknisk feilsøking og overvåkning, og vises ikke i loggrapportene.         |
| Device Version        | Version              | Versjonen av loggformatet: 1.0                                                                                                                       |
| Device Event Class ID | type_id              | En tekst som representerer hendelsetypen: audit:create, audit:read, audit:update, audit:delete                                                       |
| Name                  | message              | Navn på loggtype, for eksempel Auditlogg eller noe annet passende.                                                                                   |
| Severity              | severity_id          | Alvorlighetsgraden av hendelsen: INFO, WARN                                                                                                          |

Extention attributter

| CEF Key Name   | Full Name              | Kommentar                                                                                                             | Primærverdi                          | Alternativ verdi                                                                                                                                                |
| -------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| suid           | sourceUserId           | Hvem gjør oppslaget?                                                                                                  | Nav-ID på ansatt: A123456            | T-ID (abc1234), epost (fornavn.etternavn@nav.no), orgnummer, Fødselsnummer/DNR (for partnere som autentiserer med ID-porten, eller selvbetjening via ID-porten) |
| duid           | destinationUserId      | Hvilken borger gjelder hendelsen                                                                                      | Fødselsnummer på borgeren            | AktørID, Orgnummer                                                                                                                                              |
| end            | endTime                | Når hendelsen skjedde                                                                                                 | Epoch tid i millisekunder, 13 siffer |                                                                                                                                                                 |
| msg            | message                | En menneskelesbar beskrivelse av hendelsen, tanken er at "average joe" må kunne forstå hva som skjedde                |                                      |                                                                                                                                                                 |
| act            | deviceAction           | Duplikat av "Device Event Class ID", ikke nødvendig å bruke                                                           |                                      |                                                                                                                                                                 |
| request        | requestUrl             | Request URLen                                                                                                         | https://enapp.nav.no/entjeneste      |                                                                                                                                                                 |
| requestContext | requestContext         |                                                                                                                       |                                      |                                                                                                                                                                 |
| requestMethod  | requestMethod          | HTTP verbet som ble brukt                                                                                             | GET                                  | POST, PUT, PATCH, DELETE                                                                                                                                        |
| dproc          | destinationProcessName | Dersom hendelsen gjelder flere borgeres data, så logges flere logglinjer med en borger per linje, men med samme dproc |                                      |                                                                                                                                                                 |
| sproc          | sourceProcessName      | Dersom flere loggmeldinger må settes sammen for å beskrive samme hendelse, brukes samme Call-ID som sproc             |                                      |                                                                                                                                                                 |

- MERK! - Dersom dproc og sproc er like, trenger det selvsagt ikke logges til begge.

Her er attributter reservert til intern bruk. ( Skal ikke benyttes av utviklere )

| Type          | Attributt | Label Attributt | Datatype |
| ------------- | --------- | --------------- | -------- |
| Custom String | Cs1       | Cs1Label        | String   |
| Custom String | Cs2       | Cs2Label        | String   |
| Custom String | Cs4       | Cs4Label        | String   |

Her er attributter ledige til bruk ( Fritt frem for loggverdig innhold, bruk label for å beskrive hva det er, og den andre for verdien )

| Type            | Attributt   | Label Attributt  | Datatype |
| --------------- | ----------- | ---------------- | -------- |
| Custom String   | Cs3         | Cs3Label         | String   |
| Custom String   | Cs5         | Cs5Label         | String   |
| Custom String   | Cs6         | Cs6Label         | String   |
| Custom Number   | Cn1         | Cn1Label         | Long     |
| Custom Number   | Cn2         | Cn2Label         | Long     |
| Custom Number   | Cn3         | Cn3Label         | Long     |
| Flexible String | flexString1 | flexString1Label | String   |
| Flexible String | flexString2 | flexString2Label | String   |

## Eksempler på bruk av Device Vendor og Device Product

I dagens løsning skal som hovedregel "Auditlog, ABAC-Audit, Sporingslogg" benyttes i Device Product feltet som henvist i første del, men i de tilfellene der forskjellige applikasjoner ligger under samme paraply, så kan Device Product benyttes til å skille de spesifikke delapplikasjonene.
Her er noen eksempler:

| Device Vendor  | Device Product  |
| -------------- | --------------- |
| Gosys          | ApneDokument    |
| Gosys          | HentDokument    |
| Gosys          | PersonSok       |
| Gosys          | Login           |
| InfoTrygd      | Leselogg        |
| PDL            | Sporinglogg     |
| PDL            | ABAC            |
| Foreldrepenger | fpsak           |
| Foreldrepenger | fprisk          |
| Foreldrepenger | fptilbake       |
| Foreldrepenger | fpabakus        |
| Foreldrepenger | fpfordel        |
| Familie        | familie-ba-sak  |
| Familie        | familie-tilbake |
| Familie        | familie-klage   |

## Eksempler bruk av CEF formatet

Bruker fiktive FNR=17912099997 og NavID=A123456 i eksemplene

Der hvor applikasjonen har behov for å sende både navID og Orgnummer som intern bruker er dette et eksempel på ting som må være med :

```
CEF:0|tiltaksoppfølging|AuditLogger|1.0|audit:access|Sporingslogg|INFO|duid=\<Brukers Fnr> end=\<Tid i Epoch> suid=\<NavID> cn1=\<OrgNummer> msg=\<Menneskelesbar context>
```

Dersom det ønskes logget mer kan dette legges inn i f.eks ‘cs’,’cn’, ‘flexString’ attributtene.

Eksempel på en logg hvor ansatt ser på bruker og sender med requesten.

```
CEF:0|fp|fpsak|1.0|audit:access|ABAC Sporingslogg|INFO|act=read duid=17912099997 suid=A123456 end=1617855180866 flexString1=147362349 flexString1Label=Saksnummer request=/behandlinger/alle requestContext=no.nav.abac.attributter.foreldrepenger.fagsak
```

Eksempel på en logg hvor bruker er den som slår opp. I dette tilfelle en sak.

```
CEF:0|veilarbarena|Sporingslogg|1.0|audit:access|ABAC Sporingslogg|INFO|suid=17912099997 duid=1000046021217 end=1617832255629 sproc=6698e7ce18094277a49fa9f951132a21 flexString1Label=Decision flexString1=Permit request=/veilarbarena/api/oppfolgingsbruker/17912099997 requestContext=no.nav.abac.attributter.resource.felles.person requestMethod=GET act=read dproc=veilarboppfolging
```

Eksempel på en logg hvor ansatt ser på en bruker og har fått lov av systemet.

```
CEF:0|veilarbperson|Sporingslogg|1.0|audit:access|ABAC Sporingslogg|INFO|suid=A123456 duid=17912099997 end=1617843742663 sproc=5833d7af5d114a2d8ad572ee344ebe3d request=/veilarbperson/api/person/17912099997/tilgangTilBruker requestContext=no.nav.abac.attributter.resource.felles.person requestMethod=GET act=read flexString1=Permit flexString1Label=Decision dproc=veilarbpersonflatefs
```

Eksempel på en logg hvor ansatt ser på en bruker og loggen er en del av et større oppslag.

```
CEF:0|arbeid-og-inntekt|Sporingslogg|1.0|audit:access|ABAC Sporingslogg|INFO|end=1582903443096 suid=A123456 duid=17912099997 sproc=a4e0c336-70fa-45ca-b599-fc25955d65b3 requestMethod=POST request=/api/v1/person/inntekter/FNR flexString1=Permit flexString1Label=Decision
```

Eksempel på logg hvor det benyttes CallId, og ansatt ikke får tilgang til oppslaget sitt.

```
CEF:0|PDL|ABAC|1.0|audit:oppslag|Personopplysninger|WARN|end=1582899163115 suid=A123456 duid=17912099997 sproc=CallId_1582899163057_863604738 act=READ dproc=srvModiabrukerdialog request=http://pdl-api/graphql requestMethod=POST flexString1=Deny flexString1Label=Decision flexString2=fp3_behandle_egen_ansatt flexString2Label=deny_policy cs3=cause-0001-manglerrolle cs3Label=deny_cause
```

Eksempel på logg som har en message, som forklarer hva som har skjedd. Meldingen bør lesbar for borgere som ikke har noe fag eller systemforståelse.

```
CEF:0|my-nice-app|auditLog|1.0|audit:access|my-nice-app audit log|INFO|end=1618308696856 suid=X123456 duid=01010199999 msg=Dette er en ganske lang tekst som forklarer hva som har skjedd som et menneske kan forstå flexString1Label=Decision flexString1=Permit
```

## Overvåkning via Prometheus \ Grafana

Fra etter påsken 2024 blir det dyttet ut daglige og timentlige status oppdateringer på mottatte events fra de ulike appene i Nav. Dette sendes til følgende metrics på fss datasource. Disse kan benyttes til å lage egne alarmer for å passe på at auditloggingen ikke stanser ved en oppdatering eller annet. Skulle det være ønske om andre metrikker kan dette meldes inn til slack kanalen vår. Applikasjonen tagges med "source" og er $NAIS_APP_NAME.
| Navn på Metric | Beskrivelse | Oppdaterings intervall |
|---------------------------------|----------------------------------------------------------------------|------------------------|
| arcsight_logging_events_pr_hour | Beskriver antall loggevents for alle applikasjoner foregående time. | 5 min over hver time |
| arcsight_logging_events_total | Beskriver antall loggevents forrige døgn. | 30 min over midnatt |

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
