---
title: Webapps på internett
description: 🌐 Sikre webapps på internett er ikke lett
---

Når man skal lage en app som skal være tilgjengelig på internett så kan det fort bli overveldende å tenke på hva man bør implementere i appen sin og hva som evt. håndteres av plattformen mtp sikkerhet.

Som tommelfinger regel bør du anta at plattformen håndterer så lite som mulig - vi har derfor linket inn en sjekkliste over nyttige steg for å sjekke at appen din er beskyttet best mulig. Dette er en slags golden path og er ikke en uttømmende liste, i tillegg er det nok ikke alt som er relevant for din app.

I tillegg til sjekklisten så bør det implementeres [tilgangsstyring](tilgangsstyring.md) i henhold til hva som passer med din app.

## Webapp Security Checklist

- https://www.appsecmonkey.com/blog/web-application-security-checklist

## Eksponering av applikasjoner i "fagsystemsonen" (FSS)

:::note
"Fagsystemsonen" er en Nav-greie, men mønsteret som beskrives her er overførbart til andre miljøer
:::

Ideelt sett bør alle applikasjoner være laget ihht beskrivelsen ovenfor slik at de lettere kan kjøres i utrivelige miljøer, alltid "assume compromise". Av og til har man likevel behov for å eksponere legacy-apps som ikke nødvendigvis har alle disse forutsetningene på plass. Dette _kan_ gjøres, men forutsetningen er at appen er sikret med OAuth2.

Mønsteret som skal benyttes er at man lager en en dedikert proxy-app som kjører i GCP. Man ligger da bak alle tjenestene som er en del av [Google Cloud Armor](https://cloud.google.com/security/products/armor?hl=en), bl.a. WAF og DDOS-beskyttelse. Denne proxy-appen validerer tokens (fra ID-porten eller Entra ID) som sluttbrukeren presenterer og veksler disse inn i nye tokens vha. [OAuth2 Token Exchange](https://doc.nais.io/security/auth/tokenx/) for videre bruk.

Kommunikasjonen mellom proxyen og appen i FSS er begrenset av access policies slik at man ikke kan nå andre apper. Proxyen kan også gjøre andre vurderinger på om kallet kan videresendes, feks. kan man velge å kun tillate kall til spesifikke paths. Her kan man også legge til andre begrensninger som man evt har, dette vil variere i ulike scenarier. For å minske angrepsflaten er det lurt å tenke "deny all" som default, og så eksplisitt allow-liste de tingene man faktisk behøver.

Husk også å ha tilstrekkelig med [innsyn](https://doc.nais.io/explanation/observability/) (metrikker, traces og alarmer) i appene slik at man kan følge med på tilstanden. Et raskt økende antall feil kan være en indikasjon på at noen tester grensene i appen, og som kan være smart å ha alarmer på. Og husk: for å oppdage unormal aktivitet må man ha etablert en baseline for hva som er normalt. Bruk derfor litt tid på å bli kjent med appen og bruksmønstret.

Detaljer om hvordan alt dette gjennomføres er beskrevet i [nais-docen](https://doc.nais.io/explanation/migrating-to-gcp/#how-do-i-reach-an-application-found-on-premises-from-my-application-in-gcp).

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
