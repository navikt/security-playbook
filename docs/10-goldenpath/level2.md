---
title: Ekstra tiltak
description: Ekstra tiltak for de som vil øke sikkerheten ytterligere
---

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```

# Ekstra tiltak

- Utfør [trusselmodellering](/docs/sikker-utvikling/trusselmodellering) av appene dine. Ta kontakt med [appsec-teamet](https://nav-it.slack.com/archives/C06P91VN27M) hvis du trenger hjelp til å komme i gang.
- Vurder appene dine opp mot [OWASP ASVS](https://github.com/OWASP/ASVS/tree/v4.0.3/4.0www-project-application-security-verification-standard/). Har du kontroll på tiltakene som listes der?
- Vær kritisk med hvilke biblioteker og rammeverk du tar inn i kodebasen din. Er det nødvendig å dra inn et svært bibliotek hvis du kun trenger en liten del av det? Ta en titt på GitHub'en deres og kjør et raskt Google-søk for å sjekke status på prosjektet. Vedlikeholdes det av noen du stoler på? Har det kjente sikkerhetshull?
- For å bedre kunne ivareta personvern og etterlevelse er det viktig å ha kontroll på hvem som leser og/eller endrer på personinformasjon i systemet. Dette gjøres ved å logge slike operasjoner til NAVs opplegg for [auditlogg](/docs/sikker-utvikling/auditlogging).
