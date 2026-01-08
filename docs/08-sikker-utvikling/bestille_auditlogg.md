# Hva forventes teknisk av et team når de bestiller auditlogging på en database?

Dette dokumentet beskriver, for hver av de ulike databaseteknologiene som benyttes i Nav:

- Hva som teknisk sett skal utføres når et team bestiller auditlogging på en database
- Avklaringspunkter som må sjekkes opp mot teamet
- **Definition of Done** for auditlogging på en database

Målet er å tydeliggjøre forventningene til miljøene som setter opp auditloggingen.

Vi fokuserer i dette dokumentet på auditlogging innenfor **eksisterende teknisk regime**.  
Det jobbes parallelt med å vurdere en felles løsning for auditlogging. Dokumentet vil bli oppdatert når ny løsning er på plass.

---

## PostgreSQL – GCP

*mulig denne er utdatert?*

| Tema | Beskrivelse |
|-----|------------|
| **Ansvarlig for oppsett** | Teamet som eier databasen må konfigurere auditlogging selv. |
| **Verifikasjon** | Teamet må gå inn i *Log Explorer* i GCP-konsollet og verifisere at minst én personlig endring er logget. Alternativt kan teamet be NAIS-teamet om å verifisere. |
| **Om oppsettet** | Oppskriften finnes her: https://doc.nais.io/persistence/cloudsql/how-to/enable-auditing/#enable-audit-logging  <br/> Konfigurasjonen i NAIS-dokumentasjonen er **minimumskrav** for applikasjoner som er omfattet av økonomireglementet. <br/> Etter korrekt oppsett lagres auditlogger i loggbøtter i **90 dager** og videresendes automatisk til Splunk. |
| **Vær oppmerksom på** | Standard lagringstid er 30 dager. Teamet må derfor utføre steget beskrevet i infoboksen i dokumentasjonen: *“Contact the nais team to set retention to 90 days if this is your teams first application with audit log requirements.”* |

---

## PostgreSQL – On-Prem

| Tema | Beskrivelse |
|-----|------------|
| **Ansvarlig for oppsett** | Auditlogging er aktivert som standard. Teamene trenger ikke å bestille dette. |
| **Verifikasjon** | Teamene må be DBA verifisere:  - at auditlogger skrives til PostgreSQL sine logger  - at filtrert logg havner på backupserver  Teamene må også be Splunk-teamet verifisere at loggene kommer inn i Splunk. |
| **Om oppsettet** | Auditlogging aktiveres ved installasjon av PostgreSQL på hver server for alle databaser og brukere, både for DDL og DML. Dette styres via templates brukt av Ansible playbooks.  All logging skrives til PostgreSQL sine loggfiler. Loggene leses av Splunk. I tillegg lagres logger der applikasjonsbruker er filtrert bort på backupserver. |
| **Vær oppmerksom på** | – |

---

## Oracle

| Tema | Beskrivelse |
|-----|------------|
| **Ansvarlig for oppsett** | Teamet som eier databasen må bestille auditlogging via Jira-sak, beskrevet i Confluence: **Bestilling av auditlogg i Oracle databaser**. |
| **Verifikasjon** | Logg inn som personlig bruker og utfør SQL som er omfattet av bestilt auditlogging (f.eks. `SELECT`).  Logg deretter inn med bruker som har lesetilgang til audit-logg-view og verifiser at SQL er logget.  Eksempler på spørringer finnes i Confluence-siden **Bestilling av auditlogg i Oracle databaser**.  Minst én person i teamet skal ha lesetilgang til auditloggene. |
| **Om oppsettet** | DBA-teamet etablerer auditlogging basert på følgende Confluence-dokumentasjon:  - *Konfigurasjon av Unified Auditing*  - *Oppsett av Unified Auditing policy for proxy-brukere*  Lagringstid er satt til **10 år**.  DDL- og DML-endringer utført av `SYS`, `SYSTEM`, personlige brukere og proxy-brukere logges. For applikasjonsbrukere logges innlogging, men ikke endringer. Det er mulig å se om andre enn applikasjonen har logget inn som applikasjonsbruker. |
| **Vær oppmerksom på** | – |

---

## DB2

| Tema | Beskrivelse |
|-----|------------|
| **Ansvarlig for oppsett** | Teamet må bestille logging til ArcSight og Splunk (avklaring på bestillingsløp gjenstår).  Logging i DB2 er aktivert som standard i alle databaser. |
| **Verifikasjon** | Teamene må selv verifisere at logging til ArcSight og Splunk fungerer.  (Det må avklares konkret hva som skal sjekkes.) |
| **Om oppsettet** | Det er opprettet egne tabeller i DB2 for auditlogging. Logging er aktivert for alle databaser. All SQL utført av personlige identer og DB2-systemidenter (SYSADM) logges.  Loggdata leses av ArcSight for de databasene der dette er bestilt.  Logging lagres lokalt i DB2 inntil ny løsning for varig lagring er på plass. |
| **Vær oppmerksom på** | Overføring til Splunk er først på plass **XX.11.2025**. |

---

## MS SQL – On-Prem

| Tema | Beskrivelse |
|-----|------------|
| **Ansvarlig for oppsett** | Teamene må bestille auditlogging fra *Team Database* via porten (Jira-sak).  Bestillingen må spesifisere hva som skal logges, gjerne med skille mellom applikasjonsbrukere og databasebrukere. |
| **Verifikasjon** | DBA kan verifisere at auditlogger skrives. Loggene lagres på SQL Server-disk og kan ved behov aksesseres av applikasjonsbruker. |
| **Om oppsettet** | Auditloggfiler lagres lokalt på disk og slettes ikke. Det tas i tillegg backup med **30 dagers retention**.  Dersom auditfilene blir store, kan logging skrives direkte til Windows Security Log og dermed videresendes til Splunk ved behov (testet i testmiljøer). |
| **Vær oppmerksom på** | – |
