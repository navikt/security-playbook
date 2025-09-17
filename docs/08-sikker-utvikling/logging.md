---
title: Logging
description: 🪵 God logging holder deg unna jogging.
---

Nais-plattformen tilbyr et [standard opplegg](https://doc.nais.io/observability/) for "observability" hvor logger er en av grunnpilarene. `stdout` fra alle pods skrapes og sendes til [Grafana Loki](https://grafana.nav.cloud.nais.io/) eller [Elasticsearch](https://logs.adeo.no). Det anbefales å logge i JSON-formatet som støttes av flere rammeverk, f.eks. [LogBack](https://github.com/logstash/logstash-logback-encoder) og [winston](https://www.npmjs.com/package/winston).

## Loggindekser og tilgang

Loggene er åpne for alle utviklerne, og egner seg derfor ikke for personopplysninger eller andre sensitive data. ~~For dette formålet kan man få opprettet egne indekser som får navnet `tjenestekall-*` i Elasticsearch. Disse indeksene omtales ofte som `secure log`, og er kun lesbare for teamet som eier dem. Innholdet skrapes automatisk fra filer på fast sted i podene. Prosessen for å få opprettet slike indekser finner man i [NAIS-docen](https://doc.nais.io/observability/logs/#secure-logs).~~

For logger som skal vare private bruker vi nå [Nais team logs](https://doc.nais.io/observability/logging/how-to/team-logs/).

## Auditlogging

Auditlogger skal skrives til et system som heter ArcSight, nærmere info om dette finnes [her](auditlogging).

## Logghygiene

- Det burde ikke logges mer personinformasjon enn det som er nødvendig for å feilsøke. Ikke lagre mer informasjon enn man har tjenstlig behov for.
- Rader som unikt identifiserer brukerne skal ikke i åpen logg. Eksempler:
  - Fødselsnummer, aktørId, husadresser, IP-adresser, organisasjonsnummer
- Alt det som ikke kan gå i åpen logg kan legges i secure logs, med begrenset tilgang til loggen (teamet må ha kontroll på hvem som har tilgang)
- ROS på teamets logging og eventuelt tilgang til secure logs (**husk å oppdatere ved behov!**)
- Er uhellet ute og det logges noe som ikke skal logges, bør man sørge for å slette loggene. Muligens må avvik også føres i [Avvikssystemet](https://navno.sharepoint.com/sites/intranett-avvik/SitePages/Avviksskjema.aspx)). Et eksempel på hvordan ting gikk galt og hvordan det ble rettet kan leses i [denne Slack-tråden](https://nav-it.slack.com/archives/C015FL6M3J5/p1597227300016200)

Et eksempel på en app som benytter alle disse loggemulighetene finner man [her](https://github.com/navikt/helse-spesialist/blob/main/spesialist-bootstrap/src/main/resources/logback.xml)

:::warning Pass på URL-ene
URLer og HTTP-headere blir ofte logget av ulike rammeverk eller "mellomtjenester" som lastbalanserere.
Fødselsnumre og evt annen sensitiv informasjon i URL-er som `/person/1234567890` eller `/person?fnr=1234567890` eller headere vil derfor ende opp i logger uten nødvendig beskyttelse.
Den eneste måten å unngå dette på (inntil [Query-metoden](https://www.ietf.org/archive/id/draft-ietf-httpbis-safe-method-w-body-02.html) evt blir en del av HTTP-specen) er å POSTe slike queries.
Det er ikke kjempebra bruk av semantikken i HTTP, men det er det eneste som løser dette problemet.
:::
:::warning Tredjepartsbiblioteker
Vær også obs på at selv om ikke du logger slike ting så kan tredjepartsbiblioteker gjøre det.
Test hva som er standard oppførsel for bibliotekene du bruker!
Sett opp alarmer / følg med på loggene for å fange opp slike ting.
:::

## Logging av sikkerhetsrelaterte hendelser

Logger kan brukes både i nær sanntid av såkalte [Intrusion Detection Systems](https://en.wikipedia.org/wiki/Intrusion_detection_system) og etter en sikkerhetshendelse for å finne spor av hva som foregår. Trusselaktører vil stort sett alltid legge igjen spor etter seg, og ved å pusle sammen disse kan man danne seg et bilde av hendelsesforløpet. For at mengden informasjon i loggene og signal/støyforholdet skal bli håndterbart er det imidlertid viktig at man gjør bevisste valg på hvilke hendelser man logger. Det er ingen fasit på dette, men unormale bruksmønster som gjentatte valideringsfeil og innlogginger på rare tidspunkt er ofte høyverdige signaler. OWASP har laget et "[cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)" med gode tips og råd. Hva man logger bør endre seg i takt med applikasjonen, ta en titt på loggene deres med jevne mellomrom og spør dere selv om dere ville ha vært i stand til å oppdage konkrete trusler vha informasjonen som finnes der.

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
