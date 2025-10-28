---
title: Denial of Service
description: 🚌🚌🚌🚌, kø, men ingen kommer frem.
---

Alle applikasjoner som eksponeres på internett er i større eller mindre grad sårbare for "Denial of Service"-angrep, ofte oversatt til "tjenestenekt". Målet med slike angrep er å ta ned de aktuelle tjenestene sånn at ingen kan bruke dem, heller ikke de tiltenkte brukerne. Måten dette gjøres på er ved å sende så mange forespørsler til tjenestene at de ikke klarer å ta unna og blir utilgjengelige. Slike angrep er som oftest distribuerte og utføres vha "botnet" som angriperen kontrollerer. Dette gjør at de blir vanskeligere å beskytte seg mot.

For å begrense bruteforcing av logins og ressurser (som jo er en form for DoS-angrep) i enkeltapplikasjoner kan man implementere en eller annen form for "rate limiting". For store og distribuerte DoS-angrep er det imidlertid kun mere omfattende tiltak i kjøretidsmiljøet som duger. Det er en rekke tiltak som kan iverksettes på ulike lag i stacken. Man kan skalere opp ressurser, avvise trafikk basert på ulike mønstre eller egenskaper samt ha utstrakt bruk av caching.

Den beste måten å understøtte plattformen i dette som applikasjonsutvikler er å lage produktene sine på en måte som gjør dem enkle å [skalere](https://doc.nais.io/nais-application/automatic-scaling/). Det koker i all hovedsak ned til:

1. Design applikasjonene sånn at de tåler restarting.
2. Ha gode metrikker og kjenn applikasjonen din sånn at du vet når og hvorfor det gir mening å skalere opp. CPU-bruk er feks ikke alltid en god metrikk å basere seg på, kanskje det i ditt tilfelle er bedre å bruke antall connections eller responstid?
3. Vær så stateless som mulig.

Når plattformen jobber med å fordele last rundt på nodene sine vil containere måtte startes, stoppes og flyttes. Hvis applikasjonene kjører flere instanser og tåler restarting kan plattformen (opp til en grense) sørge for at det alltid er noen som svarer på forespørsler.

Forutsetningen for slik "elastisitet" er at applikasjonen ikke holder på state (som feks. HTTP-sesjoner) i minnet eller på disk i app-containerne. Hvis man trenger å lagre sesjoner eller filer kan man benytte hhv eksterne "key/value stores" som [Valkey](https://doc.nais.io/persistence/valkey/) eller "object storage" som [Google Cloud Storage](https://doc.nais.io/persistence/buckets/).

For å ta i bruk rate limiting i applikasjonene er det ulik støtte i de ulike rammeverkene. Det finnes mange ressurser som forklarer ulike framgangsmåter, feks. disse for hhv. [Spring](https://www.baeldung.com/spring-bucket4j), [Node/Express](https://www.section.io/engineering-education/nodejs-rate-limiting/) og [Resilience4j](https://resilience4j.readme.io/docs/examples-4) som kan benyttes i flere kontekster på JVM-en.

Det er også viktig at man gjør seg noen litt mere generelle betraktninger om hvordan man designer appene sine. Kan vi redusere mengden kostbart arbeid som må gjøres for hver request uten at det går utover funksjonaliteten? Bør vi sette en maksgrense for størrelsen på POST og PUTs? Forkaster vi ugyldig input så tidlig som mulig? Vil det lønne seg å cache enkelte typer responser? Summen av alt dette bidrar til å gjøre applikasjonen mere robust.

<br />
```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
