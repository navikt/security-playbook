---
title: Valg av baseimage
description: Gode baser > tomme fraser
tags:
  - containere
---

## Generelt

Man kan redusere angrepsflaten sin betydelig ved å basere appen sin på et minimalt baseimage. Jo færre verktøy du har i containeren din, jo mindre spillerom har en angriper til å få fotfeste og eskalere sine rettigheter.

De gamle [navikt-imagene](https://github.com/navikt/baseimages/) er avviklet og vedlikeholdes ikke lenger. Hvis du fortsatt bruker disse imagene er det på høy tid å bytte over til bedre og moderne alternativer som "[distroless](./containere#distroless)".

Mange tror at det er vanskelig og/eller veldig tidkrevende å migrere over til nye og skinnende "distroless" images, men det er det faktisk ikke. Vi har derfor satt sammen en liste over de største forskjellene, og hvordan man bytter over fra gammelt til nytt.

<details>
<summary>Hemmeligheter fra Vault</summary>
<p>
  [Nais](https://doc.nais.io/workloads/application/reference/application-spec/?h=vault#vault) injecter hemmeligheter fra Vault som filer. `navikt` base-images har et shellscript som leser disse filene og lager miljøvariabler av innholdet. Her har man to muligheter:
  - Endre i appen sånn at hemmeligheter leses fra filer istedenfor miljøvariabler. 
  - Flytt hemmelighetene over til [Console](https://console.nav.cloud.nais.io/). De vil da automatisk injiseres som miljøvariabler i poden. Dette er den anbefalte løsningen.
  - Hemmeligheter for on-prem Postgres funker som før, ingen endringer kreves.
</p>
</details>

<details>
<summary>Sertifikater til FSS web proxy m/venner</summary>
<p>
  Disse sertifikatene injiseres automatisk fra plattformen inn i poden din, du trenger ikke å gjøre noe som helst 😎
</p>
</details>

<details>
<summary>Andre miljøvariabler</summary>
<p>
  Alle "ikke-hemmelige" miljøvariabler, feks `JAVA_OPTS` e.l., kan spesifiseres i [app-manifestet](https://doc.nais.io/workloads/application/reference/application-spec/?h=env#env). Her er det også muligheter for [templating](https://doc.nais.io/operate/cli/reference/validate/?h=templating#templating) sånn at de kan få forskjellig innhold for dev og prod.
</p>
</details>

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
