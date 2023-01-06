---
title: Auditlogging
description: Skal svare på: Hvem sett på borgers data og hva har en ansatt gjort i NAVs IT systemer?
---

## Hva er auditlogg?
En logg over brukere av NAV IT systemer (primært ansatte) sine handlinger på borgeres informasjon og annen viktige informasjon. Handlinger er primært å se på informasjon. Så all visning av informasjon skal logges, i tillegg til endringer av informasjon. 

Formålet er for borgere å få innsyn i hvem som har sett på egne data, samt for NAV å avdekke misbruk eller mistenkelig handlinger som går ut over tjenstlig behov.
Loggene vil også bli brukt til maskinell kontroll av mistenkelige handlinger.
En annet formål er å avdekke misbruk av informasjon som ikke er direkte tilknyttet en borger.

## Hva er loggverdig?
Det er primært handlingene som personen i GUI utfører som er loggverdig. Søk opp en person er loggverdig, ikke de titalls tjenestekallene som er nødvendig for å svare på handlingen.

## Teknisk implementasjon av auditlogg
I NAV implementeres auditlogg i ArcSight og transportmekanismen til ArcSight er Syslog med unntak for legacysystemer.
Hvordan Syslog settes opp for NAIS applikasjoner er beskrevet [her](https://github.com/navikt/naudit).

Det er [ArcSight Common Event Format (CEF)](https://www.microfocus.com/documentation/arcsight/arcsight-smartconnectors-8.3/pdfdoc/cef-implementation-standard/cef-implementation-standard.pdf) format i versjon 0.1 som er loggformatet som benyttes i NAV.  


## Riktig bruk av severity
Som hovedregel benyttes INFO.
Dersom oppslagene er utenom det vanlige kan WARN benyttes. Dette kan f.eks. være oppslag på streng fortrolig, fortrolig eller egne ansatte. Evnt andre hendelser som ansees som uvanlige eller mistenkelige.


## Beskrivelse av CEF
> CEF:Version|Device Vendor|Device Product|Device Version|Device Event Class ID|Name|Severity|[Extension]

| CEF header field      | ArcSight attribute   | Beskrivelse                                                                                    |
|-----------------------|----------------------|------------------------------------------------------------------------------------------------|
| Version               | CEF standard version | Sett til: 0 (null)                                                                             |
| Device Vendor         | Application name     | Applikasjonsnavnet\Delapplikasjonsnavn ala Arena, Bisys, fpsak, veilarbperson etc              |
| Device Product        | Log name             | Navnet til loggen meldinger kommer fra: Auditlog, ABAC-Audit, Sporingslogg                     |
| Device Version        | Version              | Versjonen av loggformatet: 1.0                                                                 |
| Device Event Class ID | type_id              | En tekst som representerer hendelsetypen: audit:create, audit:read, audit:update, audit:delete |
| Name                  | message              | En beskrivelse av hendelsen ala Sporingslogg                                                   |
| Severity              | severity_id          | Alvorlighetsgraden av hendelsen: INFO, WARN                                                    |

Extention attributter

| CEF Key Name   | Full Name              | Kommentar                                                                                                             | Primærverdi                     | Alternativ verdi                                                                                                                                                |
|----------------|------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| suid           | sourceUserId           | Hvem gjør oppslaget?                                                                                                  | NAV-ID på ansatt: A123456       | T-ID (abc1234), epost (fornavn.etternavn@nav.no), orgnummer, Fødselsnummer/DNR (for partnere som autentiserer med ID-porten, eller selvbetjening via ID-porten) |
| duid           | destinationUserId      | Hvilken borger gjelder hendelsen                                                                                      | Fødselsnummer på borgeren       | AktørID, Orgnummer                                                                                                                                              |
| end            | endTime                | Når hendelsen skjedde                                                                                                 | Epoch tid                       |                                                                                                                                                                 |
| msg            | message                | En menneskelesbar beskrivelse av hendelsen                                                                            |                                 |                                                                                                                                                                 |
| act            | deviceAction           | Duplikat av "Device Event Class ID", ikke nødvendig å bruke                                                           |                                 |                                                                                                                                                                 |
| request        | requestUrl             | Request URLen                                                                                                         | https://enapp.nav.no/entjeneste |                                                                                                                                                                 |
| requestContext | requestContext         |                                                                                                                       |                                 |                                                                                                                                                                 |
| requestMethod  | requestMethod          | HTTP verbet som ble brukt                                                                                             | GET                             | POST, PUT, PATCH, DELETE                                                                                                                                        |
| dproc          | destinationProcessName | Dersom hendelsen gjelder flere borgeres data, så logges flere logglinjer med en borger per linje, men med samme dproc |                                 |                                                                                                                                                                 |
| sproc          | sourceProcessName      | Dersom flere loggmeldinger må settes sammen for å beskrive samme hendelse, brukes samme Call-ID som sproc             |                                 |                                                                                                                                                                 |

Her er attributter reservert til intern bruk. ( Skal ikke benyttes av utviklere )

| Type          | Attributt | Label Attributt | Datatype |
|---------------|-----------|-----------------|----------|
| Custom String | Cs1       | Cs1Label        | String   |
| Custom String | Cs2       | Cs2Label        | String   |
| Custom String | Cs4       | Cs4Label        | String   |

Her er attributter ledige til bruk ( Fritt frem for loggverdig innhold, bruk label for å beskrive hva det er, og den andre for verdien )

| Type            | Attributt    | Label Attributt  | Datatype |
|-----------------|--------------|------------------|----------|
| Custom String   | Cs3          | Cs3Label         | String   |
| Custom String   | Cs5          | Cs5Label         | String   |
| Custom String   | Cs6          | Cs6Label         | String   |
| Custom Number   | Cn1          | Cn1Label         | Long     |
| Custom Number   | Cn2          | Cn2Label         | Long     |
| Custom Number   | Cn3          | Cn3Label         | Long     |
| Flexible String | 	flexString1 | flexString1Label | String   |
| Flexible String | flexString2  | flexString2Label | String   |

## Eksempler på bruk av Device Vendor og Device Product
I de tilfellene der forskjellige applikasjoner ligger under samme paraply, så kan Device Product benyttes til å skille de spesifikke delapplikasjonene.
Her er noen eksempler:

| Device Vendor       | Device Product        |
|---------------------|-----------------------|
| Psys                | PSAK                  |
| SAF                 | hentdokument_auditlog |
| Gosys               | ApneDokument          |
| Gosys               | HentDokument          |
| Gosys               | PersonSok             |
| Gosys               | Login                 |
| InfoTrygd           | Leselogg              |
| PDL                 | Sporinglogg           |
| PDL                 | ABAC                  |
| Fp                  | fpsak                 |
| Fp                  | fprisk                |
| Fp                  | fptilbake             |
| Fp                  | fpabakus              |
| Fp                  | fpfordel              |
| FAMILIE-BA-SAK      | AuditLogg             |
| FAMILIE-EF-SAK      | AuditLogg             |
| FAMILIE-KLAGE       | AuditLogg             |
| veilarbvedtaksinfo  | Sporingslogg          |
| veilarbregistrering | Sporingslogg          |
| veilarbveileder     | Sporingslogg          |

En mer komplett liste finnes [her](https://confluence.adeo.no/display/NIS/Device+Typer).

## Eksempler bruk av CEF formatet

Bruker fiktive FNR=17912099997 og NAVID=A123456 i eksemplene

Der hvor applikasjonen har behov for å sende både navID og Orgnummer som intern bruker er dette et eksempel på ting som må være med :
> CEF:0|tiltaksoppfølging|AuditLogger|1.0|audit:access|Sporingslogg|INFO|duid=\<Brukers Fnr> end=\<Tid i Epoch> suid=\<NAVID> cn1=\<OrgNummer> msg=\<Menneskelesbar context>

Dersom det ønskes logget mer kan dette legges inn i f.eks ‘cs’,’cn’, ‘flexString’ attributtene.

Eksempel på en logg hvor ansatt ser på bruker og sender med requesten.
> CEF:0|fp|fpsak|1.0|audit:access|ABAC Sporingslogg|INFO|act=read duid=17912099997 suid=A123456 end=1617855180866 flexString1=147362349 flexString1Label=Saksnummer request=/behandlinger/alle requestContext=no.nav.abac.attributter.foreldrepenger.fagsak

Eksempel på en logg hvor bruker er den som slår opp. I dette tilfelle en sak.
> CEF:0|veilarbarena|Sporingslogg|1.0|audit:access|ABAC Sporingslogg|INFO|suid=17912099997 duid=1000046021217 end=1617832255629 sproc=6698e7ce18094277a49fa9f951132a21 flexString1Label=Decision flexString1=Permit request=/veilarbarena/api/oppfolgingsbruker/17912099997 requestContext=no.nav.abac.attributter.resource.felles.person requestMethod=GET act=read dproc=veilarboppfolging

Eksempel på en logg hvor ansatt ser på en bruker og har fått lov av systemet.
> CEF:0|veilarbperson|Sporingslogg|1.0|audit:access|ABAC Sporingslogg|INFO|suid=A123456 duid=17912099997 end=1617843742663 sproc=5833d7af5d114a2d8ad572ee344ebe3d request=/veilarbperson/api/person/17912099997/tilgangTilBruker requestContext=no.nav.abac.attributter.resource.felles.person requestMethod=GET act=read flexString1=Permit flexString1Label=Decision dproc=veilarbpersonflatefs

Eksempel på en logg hvor ansatt ser på en bruker og loggen er en del av et større oppslag.
> CEF:0|arbeid-og-inntekt|Sporingslogg|1.0|audit:access|ABAC Sporingslogg|INFO|end=1582903443096 suid=A123456 duid=17912099997 sproc=a4e0c336-70fa-45ca-b599-fc25955d65b3 requestMethod=POST request=/api/v1/person/inntekter/FNR flexString1=Permit flexString1Label=Decision

Eksempel på logg hvor det benyttes CallId, og ansatt ikke får tilgang til oppslaget sitt.
> CEF:0|PDL|ABAC|1.0|audit:oppslag|Personopplysninger|WARN|end=1582899163115 suid=A123456 duid=17912099997 sproc=CallId_1582899163057_863604738 act=READ dproc=srvModiabrukerdialog request=http://pdl-api/graphql requestMethod=POST flexString1=Deny flexString1Label=Decision flexString2=fp3_behandle_egen_ansatt flexString2Label=deny_policy cs3=cause-0001-manglerrolle cs3Label=deny_cause

Eksempel på logg som har en message, som forklarer hva som har skjedd. Meldingen bør lesbar for borgere som ikke har noe fag eller systemforståelse.
> CEF:0|my-nice-app|auditLog|1.0|audit:access|my-nice-app audit log|INFO|end=1618308696856 suid=X123456 duid=01010199999 msg=Dette er en ganske lang tekst som forklarer hva som har skjedd som et menneske kan forstå flexString1Label=Decision flexString1=Permit 

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
