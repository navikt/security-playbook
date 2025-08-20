---
title: Utleveringslogg
description: Alt som blir delt, blir telt📝.
---

## Hva er Sporingslogg?

Formålet med applikasjonen Sporingslogg er å logge og vise til brukere utlevering av data fra Nav til forsikringsselskaper på bakgrunn av avgitt samtykke. Sporingslogg er en utleveringslogg som sikrer at bruker i ettertid kan få vite hva som er utlevert fra Nav til et forsikringsselskap. Data som deles fra Nav styres av det samtykket til datadeling som bruker har gitt i Altinn.

## Hvordan logger vi i Sporingslogg?

En utlevering logges ved å poste dette på Kafka-topic `aapen-sporingslogg-loggmeldingMottatt`. Det er kun systembrukere som er medlem i AD-gruppe `KP-aapen-sporingslogg-loggmeldingMottatt` som kan poste på topicet. Loggmeldingen er på følgende JSON-format:

```json
{
  "person": "12345678901", // Fnr/dnr for personen dataene gjelder
  "mottaker": "123456789", // Orgnr som dataene leveres ut til Skal være 9 sifre
  "tema": "ABC", // Type data, som definert i https://modapp.adeo.no/kodeverksklient/viskodeverk???, Tema 3 tegn
  "behandlingsGrunnlag": "hjemmelbeskrivelse", // Beskriver hjemmel/samtykke som er bakgrunn for at dataene utleveres TODO kodeverk e.l. Max 100 tegn
  "uthentingsTidspunkt": "2018-10-19T12:24:21.675", // Tidspunkt for utlevering, ISO-format uten tidssone
  "leverteData": "<Base64-encodet JSON-melding>", // Utleverte data, max 1.000.000 tegn (i praksis må hele loggmeldingen være under Kafkas grense på 1 MB)
  "samtykkeToken": "<JSON Web Token, encodet form>", // Samtykketoken produsert av Altinn, definert i https://altinn.github.io/docs/guides/samtykke/datakilde/bruk-av-token/ Max 1000 tegn
  "dataForespoersel": "<forespørselen som er brukt>", // Request/dok hvordan Nav hentet data, max 100.000 tegn
  "leverandoer": "123456789" // Orgnr til den som har utleveringsavtalen, benyttes ved delegering Skal være 9 sifre
}
```

## Les mer

Beskrivelsen som ligger her er for å gjøre deg oppmerksom på at det må logges dersom du sender data ut av Nav. Nærmere beskrivelse av applikasjonen Sporingslogg kan du finne i [confluence](https://confluence.adeo.no/display/KES/Sporingslogg) (krever tilgang).

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
