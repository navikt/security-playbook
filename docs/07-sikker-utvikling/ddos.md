---
title: Denial of Service
description: ⚖️ Last men ikke brast
---

Alle applikasjoner som eksponeres på internett er i større eller mindre grad sårbare for "Denial of Service"-angrep, ofte oversatt til "tjenestenekt". Målet med slike angrep er å ta ned de aktuelle tjenestene sånn at ingen kan bruke dem, heller ikke de tiltenkte brukerne. Måten dette gjøres på er ved å sende så mange forespørsler til tjenestene at de ikke klarer å ta unna og blir utilgjengelige. Slike angrep er som oftest distribuerte og utføres vha av "botnet" sm angriperen kontrollerer. Dette gjør at de blir vanskeligere å beskytte seg mot.

Begrensning av trafikk kan i veldig beskjeden grad utføres vha "rate limiting" i applikasjonen, men i praksis er det kun mere omfattende tiltak i kjøretidsmiljøet som duger. Det er en rekke tiltak som kan iverksettes på ulike lag i stacken. Man kan skalere opp ressursene sine, avvise trafikk basert på ulike mønstre eller egenskaper samt ha utstrakt bruk av caching.

Den beste måten å understøtte plattformen i dette som applikasjonsutvikler er å lage produktene sine på en måte som gjør dem enkle å [skalere](https://doc.nais.io/nais-application/automatic-scaling/). Det koker i all hovedsak ned til:

1. Design applikasjonene sånn at de tåler restarting.
2. Ha gode metrikker og kjenn applikasjonen din sånn at du vet når og hvorfor det gir mening å skalere opp.
3. Vær så stateless som mulig.

Når plattformen jobber med å fordele last rundt på nodene sine vil containere måtte startes, stoppes og flyttes. Hvis applikasjonene kjører flere instanser og tåler restarting kan plattformen (opp til en grense) sørge for at det alltid er noen som svarer på forespørsler.

Forutsetningen for slik "elastisitet" er at applikasjonen ikke holder på state (som feks. HTTP-sesjoner) i minnet eller på disk i app-containerne. Hvis man trenger å lagre sesjoner eller filer kan man benytte hhv eksterne "key/value stores" som [Redis](https://doc.nais.io/persistence/redis/) eller "object storage" som [S3](https://doc.nais.io/persistence/objectstore/).

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
