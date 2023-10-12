---
title: Sikkerhet i og rundt containere
description: 🐮 Å sette i bås er ikke allltid vås
tags:
  - containere
---

## Generelt

Hvordan endrer trusselmodellen seg når man kjører appene sine i containere vs. på tradisjonelle servere? Den største forskjellen er kanskje at du nå også har ansvar for operativsystemet på "boksen" din i motsetning til at noen andre ™️ fikser det for deg. Imaget du baserer appen din på (`FROM`-linja i din Dockerfile) bør oppdateres jevnlig for å få med seg sikkerhetsoppdateringer. Den enkleste måten å oppnå dette på er å slenge på en `--pull` når du kjører `docker build`. Docker vil da hente nyeste utgave av den tagen du ber om.

Det er praktisk å få varsel når det oppdages alvorlige sårbarheter i images sånn at man kan oppdatere. Scan dine images regelmessig med verktøy som [Snyk](/docs/verktoy/snyk/) eller [Trivy](https://github.com/aquasecurity/trivy).

Man unngår mange potensielle sikkerhetsproblemer ved å bruke så minimale image som mulig. Du trenger sannsynligvis ikke et shell, en package manager og en masse utilities for å få kjørt appen din, men for en angriper er de veldig nyttige. Såkalte "distroless" images er spesialdesignet for å være så lette som mulig, se f.eks. disse fra [Google](https://github.com/GoogleContainerTools/distroless) og [Chainguard](https://github.com/chainguard-images).

![shell](/img/cantdont.jpg "shell")

Et annet billig sikkerhetstiltak er å ikke kjøre appen sin som root inni containeren. Mange images har i utgangspunktet root som eneste bruker, og vil derfor kjøre appen din som root med mindre du ber om noe annet. Fikses ved å legge noe sånn som dette inn i din `Dockerfile` (_før_ `ENTRYPOINT` og `CMD`-linjer):

```bash
RUN useradd --uid 10000 runner
USER 10000
```

Selve containeren bør også ha begrensede rettigheter. Docker kan kjøre containere i [privileged mode](https://www.docker.com/blog/docker-can-now-run-within-docker/), noe som gir containeren mer eller mindre full tilgang til hostens ressurser. Dette er IKKE en god idé da en kompromittert app i praksis betyr full kontroll på host-maskinen. Man kan også [justere](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) hvilke [capabilities](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/linux-capabilities) containeren skal ha. Grunnregelen her er å starte helt uten ekstra capabilities og så eksplisitt legge på de man ev. trenger.

I et orkestreringsmiljø som Kubernetes endres ting ofte, og systemet kan flytte pods rundt i clusteret uten forvarsel i tillegg til å skalere antall instanser opp og ned etter behov. En gratis og positiv bieffekt av dette er at det gjør jobben til en angriper vanskeligere. Det er mye vanskeligere å opprettholde persistens dersom miljøet du er i rives ned og gjenoppbygges ofte.

Se forøvrig [OWASP Docker top 10](https://owasp.org/www-pdf-archive//Dirk_Wetter_-_Docker_Top10-AMS.pdf) og [The Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) for mer info.

## nais

I nais har vi samlet alle disse praksisene i en [security context](https://doc.nais.io/nais-application/securitycontext/) som legges til appen din automatisk. Det finnes også flere såkalte "policy engines" som kan installeres i Kubernetes-clustre. Disse kan forhindre at risikable settinger konfigureres eller nekte å kjøre enkelte payloads basert på kriterier som administratoren setter. I nais bruker vi [Kyverno](https://kyverno.io/) til å bl.a. kun tillate kjøring av images som kommer fra package registries som vi stoler på.

Vi har valgt å begrense tilgangen til disk i containerne, den eneste pathen man i utgangspunktet kan skrive til er `/tmp`. Fordi containerne er flyktige av natur egner de seg ikke til å lagre ting i uansett, lagring bør skje i [eksterne systemer](https://doc.nais.io/persistence/responsibilities/) som databaser eller "block storage".

For å hindre at angripere kan bevege seg fritt rundt etter å ha kompromittert en app har vi tatt i bruk [access policies](https://doc.nais.io/nais-application/access-policy/). All kommunikasjon i eller ut av clustrene må derfor eksplisitt tillates.

## Dockerfile eksempler 

For å se hvordan andre i NAV bygger sine docker images bruk [github search](https://github.com/search) og søk etter f.eks. `org:navikt "FROM gcr.io/distroless/java"`
- [Google Distroless](https://github.com/GoogleContainerTools/distroless/tree/main/examples)
- [Chainguard Images](https://edu.chainguard.dev/chainguard/chainguard-images/reference/) - (støtter kun siste LTS)


```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
