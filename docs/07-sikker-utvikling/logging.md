---
title: Logging
description: 🪵 God logging holder deg unna jogging
---

[‹ tilbake til temaoversikt](/docs/sikker-utvikling)

NAIS-plattformen tilbyr et [standard opplegg](https://doc.nais.io/observability/logs/) for logging. `stdout` fra alle pods skrapes, indekseres i LogStash/Elasticsearch og kan søkes i fra [Kibana (logs.adeo.no)](https://logs.adeo.no). For at dette skal funke bra er man avhengig av at det logges som JSON. Mange rammeverk har støtte for dette JSON-baserte formatet, f.eks. [LogBack](https://github.com/logstash/logstash-logback-encoder) og [winston](https://www.npmjs.com/package/winston).

## Loggindekser og tilgang

Standardindeksene (`logstash-apps-*`) er åpne for veldig mange mennesker (bl.a alle utviklere), og egner seg derfor ikke for personopplysninger eller andre sensitive data. For dette formålet kan man få opprettet egne indekser som får navnet `tjenestekall-*`. Disse indeksene omtales ofte som `secure log`, og er kun lesbare for teamet som eier dem. Innholdet skrapes automatisk fra filer på fast sted i podene. Prosessen for å få opprettet slike indekser finner man i [NAIS-docen](https://doc.nais.io/observability/logs/#secure-logs).

## Auditlogging

Auditlogger skal skrives til et system som heter ArcSight, nærmere info om dette finnes også i [NAIS-docen](https://doc.nais.io/observability/logs/#audit-logs). Loggene blir da søkbare for de som har behov for dette. ArcSight krever at man logger i [Common Event Format (CEF)](https://kc.mcafee.com/resources/sites/MCAFEE/content/live/CORP_KNOWLEDGEBASE/78000/KB78712/en_US/CEF_White_Paper_20100722.pdf) via [Syslog](https://en.wikipedia.org/wiki/Syslog). Det er ikke bred støtte for CEF i de mest brukte loggerammeverkene, så her må man fikse formatteringen selv. Ved behov for hjelp kan man henvende seg til [#tech-logg_analyse_og_datainnsikt](https://nav-it.slack.com/archives/C014576K5TQ) på Slack.

Et eksempel på en app som benytter alle disse loggemulighetene finner man [her](https://github.com/navikt/helse-spesialist/blob/master/spesialist-selve/src/main/resources/logback.xml).

## Logghygiene

- Det burde ikke logges mer personinformasjon enn det som er nødvendig for å feilsøke. Ikke lagre mer informasjon enn man har tjenstlig behov for.
- Rader som unikt identifiserer brukerne skal ikke i åpen logg. Eksempler:
  - Fødselsnummer, aktørId, husadresser, IP-adresser, organisasjonsnummer
- Pass spesielt på URL-stier, HTTP-headere og lignende som ofte blir logget av rammeverk eller mellomtjenester
  - F.eks. fødselsnummer i URLen, `/person/1234567890` eller `/person?fnr=1234567890`, vil fort feilaktig ende opp i tilgangslogger uten videre beskyttelse.
- Alt det som ikke kan gå i åpen logg kan legges i secure logs, med begrenset tilgang til loggen (teamet må ha kontroll på hvem som har tilgang)
- ROS på teamets logging og eventuelt tilgang til secure logs (**husk å oppdatere ved behov!**)
- Er uhellet ute og det logges noe som ikke skal logges, bør man sørge for å slette loggene. Muligens må avvik også føres i [Remedy](https://it-hjelpa.adeo.no/arsys/forms/remedy/Avvik/webViewSub/). Et eksempel på hvordan ting gikk galt og hvordan det ble rettet kan leses i [denne Slack-tråden](https://nav-it.slack.com/archives/C015FL6M3J5/p1597227300016200)

import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
