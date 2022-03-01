---
title: Dynamisk analyse
description: 🕵️ Testing av dynamikk helt uten folkeskikk
---

![hacker](/img/haxor.webp)

Dynamisk analyse (<abbr title="Dynamic Application Security Testing">DAST</abbr>) betyr å analysere («scanne») en ferdig kjørende instans av en app. Dette er en «black box»-test, dvs. at man ikke nødvendigvis vet noe om hvordan appen er bygget opp. Man kommuniserer med appen via dens grensesnitt på samme måte som en sluttbruker (og en angriper) ville ha gjort. Testverktøyene sender (ugyldig) input som appen ikke ville ha fått under normal bruk for å se hvordan den reagerer. På denne måten kan man oppdage både kjente og ukjente svakheter. Hvis appen krever pålogging kan man velge om man vil kjøre scanning med eller uten gyldige credentials.

Fordelen med DAST er at det kan oppdage mange typer av sårbarheter som statisk analyse ikke kan: ulike typer av injection, denial of service, cross-site scripting, remote code execution, server-side request forgery, insecure direct object references, og mange andre. Siden de angriper «fra utsiden», kan de benyttes uansett hvilke språk og rammeverk appen er laget av.

Ulempen med DAST er at det er mer komplisert å sette opp: Man må ha et produksjonslikt miljø hvor appen og dens avhengighter er satt opp. Kapabilitetene varierer mellom ulike verktøy. Alle er f.eks. ikke like smarte når det gjelder å skjønne webapplikasjoner med mye JavaScript og kompliserte flyter med XSRF- og CSRF-tokens.

DAST-verktøy kommer i alle mulige varianter og prisklasser. Noen er mer eller mindre helautomatiske, mens andre kjøres manuelt. Noen installeres «on-prem», mens andre er «as a service» i skyen. Av de mer kjente kan [Netsparker](https://www.netsparker.com/), [Nessus](https://www.tenable.com/products/nessus), og [Detectify](https://detectify.com/) nevnes.

Man kan også finne sårbarheter ved å teste manuelt. Nettlesere med utviklerverktøy («developer tools») lar deg redigere og sende requests, og det samme gjør verktøy som [curl](https://curl.se/). Det kan også være nyttig å bruke en dedikert «attack proxy» som f.eks. [Burp Suite](https://portswigger.net/burp) eller [OWASP ZAP](https://www.zaproxy.org/). Hvis man ønsker å «fuzze» appen (dvs. sende random data til den) kan verktøy som [Wfuzz](https://github.com/xmendez/wfuzz) og [ffuf](https://github.com/ffuf/ffuf) være nyttige.

Man kan finne mye snacks bare ved å rote litt rundt i sine egne apper. «Hva skjer hvis jeg sender inn et negativt tall for fødselsår? Hva om jeg sender inn en streng på 4000 tegn istedenfor de forventede 12?». Vær nysgjerrig!

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
