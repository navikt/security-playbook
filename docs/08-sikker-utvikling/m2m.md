---
title: Maskin til maskin-kommunikasjon
description: 🤖 - 🤖.
---

## Rise of the machines

Hvordan sikrer man denne maskin til maskin-kommunikasjon på en god måte? I et typisk Kubernetes-cluster har man ofte en form for "service mesh" som på nettverkslaget sørger for mutual TLS og policies som begrenser hvilke apper/tjenester som kan kommunisere med hverandre. I tillegg til dette må man på applikasjonslaget ha en eller annen form for autentisering slik at en app kan vite hvem som er i den andre enden. Maskinene som skal kommunisere trenger da en identitet, disse kalles som ofte for "servicebrukere".

Servicebrukere har dessverre ofte vide tilganger, og deres passord og/eller nøkler roteres sjelden eller aldri. Dersom disse passordene skulle komme på avveie er derfor konsekvensene større enn de trenger å være. Vi anbefaler derfor å bruke `OAuth Client Credentials Flow` med hemmeligheter som hentes inn dynamisk fra miljøvariabler eller filer. Kjøretidsmiljøet kan da sørge for å automatisk rotasjon av disse, feks hver gang appen deployes.

:::info Hvordan behandle hemmeligheter?
Generell info om behandling av hemmeligheter finner du [her](./hemmeligheter)
:::

Det er god støtte for å bruke Client Credentials flow i vårt miljø (som består av NAIS og Entra ID), detaljer finner du i [NAIS-docen](https://doc.nais.io/auth/entra-id/).

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
