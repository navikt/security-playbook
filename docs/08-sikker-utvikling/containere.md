---
title: Sikkerhet i og rundt containere
description: Husk lokk på boksen som kjører koden, så angriperen ikke tar over noden 📦
tags:
  - containere
---

## Generelt

Hvordan endrer trusselmodellen seg når man kjører appene sine i containere vs. på tradisjonelle servere? Den største forskjellen er kanskje at du nå også har ansvar for operativsystemet på "boksen" din i motsetning til at noen andre ™️ fikser det for deg. Imaget du baserer appen din på (`FROM`-linja i din Dockerfile) bør oppdateres jevnlig for å få med seg sikkerhetsoppdateringer. Den enkleste måten å oppnå dette på er å slenge på en `--pull` når du kjører `docker build`. Docker vil da hente nyeste utgave av den tagen du ber om.

Det er praktisk å få varsel når det oppdages alvorlige sårbarheter i images sånn at man kan oppdatere. Scan dine images regelmessig med verktøy som [Trivy](https://github.com/aquasecurity/trivy).

Man unngår mange potensielle sikkerhetsproblemer ved å bruke så minimale image som mulig. Du trenger sannsynligvis ikke et shell, en package manager og en masse utilities for å få kjørt appen din, men for en angriper er de veldig nyttige. Såkalte "distroless" images er spesialdesignet for å være så lette som mulig, se f.eks. disse fra [Google](https://github.com/GoogleContainerTools/distroless) og [Chainguard](https://github.com/chainguard-images).

![shell](/img/cantdont.jpg "shell")

Et annet billig sikkerhetstiltak er å ikke kjøre appen sin som root inni containeren. Dette er default i nais nå.

<details>
<summary>Manuelt sette opp å ikke bruke root</summary>

Mange images har i utgangspunktet root som eneste bruker, og vil derfor kjøre appen din som root med mindre du ber om noe annet. Fikses ved å legge noe sånn som dette inn i din `Dockerfile` (_før_ `ENTRYPOINT` og `CMD`-linjer):

```bash
RUN useradd --uid 10000 runner
USER 10000
```

</details>

Selve containeren bør også ha begrensede rettigheter. Docker kan kjøre containere i [privileged mode](https://www.docker.com/blog/docker-can-now-run-within-docker/), noe som gir containeren mer eller mindre full tilgang til hostens ressurser. Dette er IKKE en god idé da en kompromittert app i praksis betyr full kontroll på host-maskinen. Man kan også [justere](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) hvilke [capabilities](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/linux-capabilities) containeren skal ha. Grunnregelen her er å starte helt uten ekstra capabilities og så eksplisitt legge på de man ev. trenger.

I et orkestreringsmiljø som Kubernetes endres ting ofte, og systemet kan flytte pods rundt i clusteret uten forvarsel i tillegg til å skalere antall instanser opp og ned etter behov. En gratis og positiv bieffekt av dette er at det gjør jobben til en angriper vanskeligere. Det er mye vanskeligere å opprettholde persistens dersom miljøet du er i rives ned og gjenoppbygges ofte.

Se forøvrig [OWASP Docker top 10](https://github.com/OWASP/Docker-Security/blob/main/dist/owasp-docker-security.pdf) og [The Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html) for mer info.

## Distroless

Vi anbefaler å kjøre i såkalte "distroless" docker-images uten shell. Disse er spesialdesignet for å være så lette som mulig, og inneholder kun det som trengs for å kjøre appen din. Dette gjør det vanskeligere for angripere å utnytte sårbarheter i systemet ditt. Se f.eks. disse fra [Chainguard](https://github.com/chainguard-images) eller [Google](https://github.com/GoogleContainerTools/distroless)

Man kan fortsatt debugge disse ved å bruke **Ephemeral containers** i Kubernetes. Dette er en midlertidig container som kjører i samme nettverk og med samme filsystem som poden du vil debugge. Se [nais docen](https://docs.nais.io/workloads/how-to/debugging/?h=ephemeral#kubectl-debug) for mer info.

## nais

I nais har vi samlet alle disse praksisene i en [security context](https://docs.nais.io/workloads/reference/container-security/index.html) som legges til appen din automatisk.
Det finnes også flere såkalte "policy engines" som kan installeres i Kubernetes-clustre.
Disse kan forhindre at risikable settinger konfigureres og at enkelte payloads kjøres, basert på kriterier som administratoren setter.
I nais bruker vi [Kyverno](https://kyverno.io/) til å bl.a. kun tillate kjøring av images som kommer fra package registries som vi stoler på.

Vi har valgt å begrense tilgangen til disk i containerne, den eneste pathen man i utgangspunktet kan skrive til er `/tmp`. Fordi containerne er flyktige av natur egner de seg ikke til å lagre ting i uansett, lagring bør skje i [eksterne systemer](https://doc.nais.io/persistence/responsibilities/) som databaser eller "block storage".

For å hindre at angripere kan bevege seg fritt rundt etter å ha kompromittert en app har vi tatt i bruk [access policies](https://doc.nais.io/nais-application/access-policy/). All kommunikasjon i eller ut av clustrene må derfor eksplisitt tillates. (Gjelder kun i GCP)

## Best practices

Les gjerne dockers egne [best practices](https://docs.docker.com/build/building/best-practices/).
Ett par highlights som er spesielt relevante:

### Docker Secrets

Husk at kommandoer og arguments du bruker i ett bygg lagres i imaget og kan leses ut. Sensitiv informasjon som tokens og passord bør mountes ved hjelp av docker secrets og passes inn som build-arg.
Eksempel fra Aksel:

```bash
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
    'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)'
RUN npm config set @navikt:registry=https://npm.pkg.github.com
```

### Hemmeligheter

Ikke bruk `COPY . .` for å kopiere filer, spesifiser heller hvilke filer du vil ha med. COPY funksjonen kopierer rekursivt og tar med alt, inkludert hemmeligheter som tokens i .git-mappen, .npmrc, .m2-settings.xml etc.

Vær eksplisitt i dine copy-besvergelser: `COPY mylocalfile myfileinimage`.

## Dockerfile eksempler

Se flere eksempler i [Chainguard docker images](/docs/verktoy/chainguard-dockerimages).

## Se også

- [Forsvar i dybden](/docs/sikker-utvikling/forsvar-i-dybden) — hvordan containersikkerhet er ett av flere lag
- [Minimale defaults](/docs/sikker-utvikling/minimale-defaults) — prinsippet om å starte lukket og kun åpne det du trenger

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
