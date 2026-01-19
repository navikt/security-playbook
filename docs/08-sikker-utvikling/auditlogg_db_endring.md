---
title: Auditlogging av databaseendringer
description: Endringer er bra, så lenge vi vet hvem som har gjort hva 🔎.
---

## Hvorfor auditlogge databaseendringer ?

Auditlogging av økonomisystemer er et krav i [statens økonomireglement](https://www.regjeringen.no/globalassets/upload/fin/vedlegg/okstyring/reglement_for_okonomistyring_i_staten.pdf) (§ 4.3.6). 
Endringer i databaser som inngår i økonomisystem skal auditlogges med personlig identifikasjon, dato og klokkeslett for handlingen, som beskrevet i [Støtte til etterlevelse](https://etterlevelse.ansatt.nav.no/krav/125/2). 
Loggene skal kunne brukes til revisjon.

## Hvem skal auditlogge databaseendringer ?

I økonomisystemer skal databaseendringer som er utført av personer, utenom applikasjonens normale brukergrensesnitt, auditlogges. 
Databasebrukere som benyttes for å gjøre endringer direkte i databaser skal være personlige eller mulig å knytte til person.

## Skal alle databaseendringer auditlogges ?

Endringer som gjøres via vanlige brukergrensesnitt i fagsystemener skal ikke skrives til auditlogg, men heller lagres som sporingsinformasjon i det enkelte fagsystemet. 
For eksempel skal vedtak inneholde informasjonen om hvem som har fattet vedtaket og når. Auditloggene skal inkludere parametrene i SQL-kommandoen.

## Hvordan skru på/bestille auditlogging ?

Her beskriver vi hva vi forventer av team som skal skru på eller bestille auditlogging for de ulike databaseteknologiene vi bruker i Nav:
- Hva som teknisk sett skal utføres når et team bestiller auditlogging på en database
- Avklaringspunkter som må sjekkes opp av teamet
- **Definition of Done** for auditlogging på en database

Det jobbes med å overføre auditloggene fra on-premises databaseteknologier til Nais-løsningen i GCP. 
Når denne er klar vil det komme informasjon om hvor man skal oppgi at auditloggene skal overføres.

---

<details><summary>
### PostgreSQL – GCP
</summary>

| Tema | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                |
|-----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ansvarlig for oppsett** | Teamet som eier databasen må selv skru på auditlogging ved å følge framgangsmetoden beskrevet i [Enable auditlogging på nais.io](https://doc.nais.io/persistence/cloudsql/how-to/enable-auditing/#enable-audit-logging).                                                                                                                                                                   |
| **Verifikasjon** | Teamet må gå inn på [Gjennomgang av auditlogger (GAAL)](https://audit-approval.iap.nav.cloud.nais.io/) og verifisere at minst én personlig endring er logget. Vi anbefaler å kjøre [verify-audit](https://doc.nais.io/operate/cli/reference/postgres/index.html#verify-audit) for å bekrefte at konfigurasjonen er riktig.                                                                 |
| **Om oppsettet** | Loggene blir automatisk sendt til nais-teamets Cloud Logging bøtte i nais audit project, hvor de blir lagret i 2 år. Månedlig blir teamets logger lagret som en .zip-fil og sendt til en 11 års arkivbøtte. Kontaktkanal er [#nais-database-auditlogging på Slack](https://nav-it.slack.com/archives/C0A29KP884T). Loggene sendes også automatisk til team ISOC for sikkerhetsovervåkning. |
| **Vær oppmerksom på** | Husk også å kjøre [siste steget i oppsettet med nais cli](https://doc.nais.io/persistence/cloudsql/how-to/enable-auditing/#use-the-nais-cli-to-configure-database-internals). Kjøringen med cli installerer pgaudit extension i basen, og skrur av auditlogging for appbrukeren.                                                                                                           |

</details>

---

### PostgreSQL – On-Prem

| Tema | Beskrivelse                                                                                                                                                                                                                                                                                                    |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ansvarlig for oppsett** | Auditlogging er aktivert som standard. Teamene trenger ikke å bestille dette.                                                                                                                                                                                                                                  |
| **Verifikasjon** | Teamene må be DBA verifisere: <br/> - at auditlogger skrives til PostgreSQL sine logger <br/> - at filtrert logg havner på backupserver  <br/> Teamene kan også be team ISOC om verifisere at loggene kommer inn i Splunk for sikkerhetsovervåkning.                                                           |
| **Om oppsettet** | Auditlogging aktiveres ved installasjon av PostgreSQL på hver server for alle databaser og brukere, både for DDL og DML. Dette styres via templates brukt av Ansible playbooks.  All logging skrives til PostgreSQL sine loggfiler, og auditlogger lagres på backupserver med applikasjonsbruker filtert bort. |
| **Vær oppmerksom på** | Inntil loggene overføres til Nais-loggløsningen, må teamene sende inn en Jira-sak til DBAene for å få utlevert loggene for gjennomgang. Husk å oppgi i Jira-saken hvor dere ønsker å motta loggene.                                                                                                            |

---

### Oracle

| Tema | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ansvarlig for oppsett** | Teamet som eier databasen må bestille auditlogging via Jira-sak, beskrevet [Bestilling av auditlogg i Oracle databaser på Confluence](https://confluence.adeo.no/spaces/IDD/pages/752096186/Bestilling+av+auditlogg+i+Oracle+databaser).                                                                                                                                                                                                                                                       |
| **Verifikasjon** | Logg inn som personlig bruker og utfør SQL som er omfattet av bestilt auditlogging (f.eks. `SELECT`).  <br/> Logg deretter inn med bruker som har lesetilgang til audit-logg-view og verifiser at SQL er logget. <br/> Eksempler på spørringer finnes i Confluence-siden [Bestilling av auditlogg i Oracle databaser](). <br/> Minst én person i teamet skal ha lesetilgang til auditloggene.                                                                                                  |
| **Om oppsettet** | DBA-teamet etablerer auditlogging basert på følgende Confluence-dokumentasjon: <br/> - *Konfigurasjon av Unified Auditing* <br/> - *Oppsett av Unified Auditing policy for proxy-brukere* <br/> Lagringstid er satt til **10 år**. <br/> DDL- og DML-endringer utført av `SYS`, `SYSTEM`, personlige brukere og proxy-brukere logges. <br/> For applikasjonsbrukere logges innlogging, men ikke endringer. Det er mulig å se om andre enn applikasjonen har logget inn som applikasjonsbruker. |
| **Vær oppmerksom på** | Husk å spesifisere hvem som skal ha lesetilgang til loggtabellen, slik at dere får gjennomgått loggene.                                                                                                                                                                                                                                                                                                                                                                                        |

---

### DB2

| Tema | Beskrivelse                                                                                                                                                                                                                                                                                                                                 |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ansvarlig for oppsett** | Teamet må bestille logging til ArcSight og be DB2-DBA bekrefte at loggene lagres i DB2 i minst 10 år.  Logging i DB2 med Query Monitor er aktivert som standard i alle databaser.                                                                                                                                                           |
| **Verifikasjon** | Teamene må selv verifisere logging til ArcSight ved å kontakte #auditlogging-arcsight på Slack.                                                                                                                                                                                                                                             |
| **Om oppsettet** | Det er opprettet egne tabeller i DB2 for auditlogging. Logging er aktivert for alle databaser. All SQL utført av personlige identer og DB2-systemidenter (SYSADM) logges.  Loggdata leses av ArcSight for de databasene der dette er bestilt.  Logging lagres også lokalt i DB2 fra 15.08.2025 inntil transport til fellesløsningen er på plass. |
| **Vær oppmerksom på** | For å gjennomgå loggene, be DB2-DBA om uttrekk eller om lesetilgang til SYSTOOLS.                                                                                                                                                                                                                                                           |

---

### MS SQL – On-Prem

| Tema | Beskrivelse                                                                                                                                                                                                                                                          |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ansvarlig for oppsett** | Teamene må bestille auditlogging fra *Team Database* via porten (Jira-sak).  Bestillingen må spesifisere at kun databasebrukere (inkludert DBA) skal auditlogges.                                                                                                    |
| **Verifikasjon** | DBA kan verifisere at auditlogger skrives. Loggene lagres på SQL Server-disk og kan ved behov aksesseres av applikasjonsbruker.                                                                                                                                      |
| **Om oppsettet** | Auditloggfiler lagres lokalt på disk og slettes ikke. Det tas i tillegg backup med **30 dagers retention**.  Dersom auditfilene blir store, kan logging skrives direkte til Windows Security Log og dermed videresendes til Splunk ved behov (testet i testmiljøer). |
| **Vær oppmerksom på** | –                                                                                                                                                                                                                                                                    |

## Teknisk fellesløsning

Nais har utviklet en teknisk løsning for lagring og gjennomgang av auditlogger (GAAL). Digital Sikkerhet jobber med å få logger fra on-premises databaseteknologier inn i denne løsningen. Løsningen bruker Google Cloud Logging i 2 år hvor teamene har lesetilgang til egne logger, og sender loggene månedlig som .zip-fil til Google Cloud Storage for arkiv i 11 år.

Fram til den nye løsningen er klar for on-prem teknologier, må logging og gjennomgang av loggene utføres i henhold til eksisterende regime som er beskrevet ovenfor.

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```