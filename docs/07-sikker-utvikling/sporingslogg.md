---
title: Sporingslogg
description: Formålet er støtte til å gi brukere innsyn i hvilke data Nav har utlevert om dem.
---

## Hva er Sporingslogg?

Dette kunne også vært kalt "innsynslogg" og formålet er støtte til å gi brukere innsyn i hvilke data Nav har utlevert om dem til eksterne organisasjoner. Så når en tjeneste i Nav utleverer Nav-data til en ekstern part, skal dette logges slik at bruker i ettertid kan få vite hva som er blitt utlevert.

## Hvordan logger man?

Man logger en utlevering ved å poste dette på Kafka-topic `aapen-sporingslogg-loggmeldingMottatt`. Det er kun systembrukere som er medlem i AD-gruppe `KP-aapen-sporingslogg-loggmeldingMottatt` som kan poste på topicet. Alle feltene er påkrevet, unntatt `uthentingsTidspunkt`, `samtykkeToken`, `dataForespørsel` og `leverandør`. Loggmeldingen er på følgende JSON-format:

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

Beskrivelsen som ligger her er mest for å gjøre deg obs på at det må logges dersom du sender data ut av huset. Nærmere beskrivelse kan du finne i [confluence](https://confluence.adeo.no/display/KES/Sporingslogg) (krever tilgang).
