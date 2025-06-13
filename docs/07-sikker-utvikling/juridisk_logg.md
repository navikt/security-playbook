---
title: Juridisk logg
description:
  Formålet er å lagre meldinger/dokumenter på en måte som garanterer at de ikke senere kan endres,
  slik at man f.eks. ved en juridisk tvist kan bevise innholdet i et dokument som Nav har mottatt/sendt.
---

## Hva er Juridisk logg?

Et mer konsist navn på tjenesten er "Ikke-benekt Logg" (non-repudiation).

Formålet er å lagre meldinger/dokumenter på en måte som garanterer at de ikke senere kan endres,
slik at man f.eks. ved en juridisk tvist kan bevise innholdet i et dokument som Nav har mottatt/sendt.

- Ved lagring angis "låsetiden" for dokumentet - opptil 10 år.
- Uthenting av lagrede dokumenter skal audit-logges (hvem, når, hvorfor).

## Hvordan bruke juridisk logg?

Det skal avklares med produkteier for Juridisk Logg at man har et reelt behov for å lagre for ikke-benektformål.
Tidligere versjoner av "juridisk logg" har blitt brukt til å logge/lagre andre typer data, som har gitt unødvendig stor datamengde og behov for lagringsplass.
Dagens versjon bruker lagringsenheter anskaffet spesielt for formålet, og disse er plassert on-premise, fordelt på begge datahallene.
Tjenesten bør dermed bare brukes til reelle ikke-benektformål.

Logging kan gjøres på 3 måter:

- REST-tjeneste, gir synkron bekreftelse med en generert, unik meldings-ID. Tjenestebruker må ha rollen 0000-GA-Juridisklogg.
- Web-service (SOAP), gir synkron bekreftelse med en generert, unik meldings-ID. Tjenestebruker må ha rollen 0000-GA-Juridisklogg.
- Publisering til IBM MQ, med mulighet for å lytte på svar-kø.

## Les mer

Beskrivelsen som ligger her er mest for å gjøre deg obs på at det finnes en juridisk logg. Nærmere beskrivelse kan du finne i [confluence](https://confluence.adeo.no/display/KES/Juridisk+Logg+-+Designdokument) (krever tilgang).
