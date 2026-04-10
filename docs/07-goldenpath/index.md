---
title: Golden Path 📣
description: Beskrivelse av hva er navs golden path og hva er golden path.
hide_table_of_contents: true
---

Golden Path er en samling prioriterte tiltak et team kan implementere for å oppnå et trygt sikkerhetsgrunnlag.

<details>
<summary>Følg Nais-dokumentasjonen og bruk standardinnstillingene</summary>

[Nais-plattformen](https://doc.nais.io/) gir deg sikkerhetsfunksjoner gratis når du følger anbefalingene.
Autentisering og autorisering via plattformen er særlig viktig – ikke rull din egen løsning.

</details>

<details>
<summary>Bruk client credentials for maskin-til-maskin-kommunikasjon</summary>

[Entra ID client credentials](/docs/sikker-utvikling/m2m) er godt støttet i NAIS og lar plattformen håndtere token-utstedelse for deg – ingen hemmeligheter å rotere manuelt.
Unngå servicebrukere og den gamle STS-løsningen.

</details>

<details>
<summary>Ha kontroll på hemmelighetene dine</summary>

Bruk [NAIS sine Secret-ressurser eller Google Secret Manager](/docs/sikker-utvikling/hemmeligheter) – aldri kopier hemmeligheter fra produksjonsmiljøet til din lokale PC.
Roter hemmeligheter regelmessig og gi tilgang kun til de appene som faktisk trenger dem.

</details>

<details>
<summary>Bygg images med docker-build-push og deploy med nais/deploy</summary>

Bruk [docker-build-push](https://doc.nais.io/build/) for å bygge og publisere Docker-images til GAR, og deploy deretter med `nais/deploy`.
Actionen bruker federert identitet, og standardinnstillingene oppretter, attesterer og signerer en SBOM.

</details>

<details>
<summary>Sikre GitHub-repoet og GitHub Actions-workflowene dine</summary>

Et usikret repo kan gi angripere direkte tilgang til kodebasen eller CI/CD-pipelinen din.
Les [GitHub best practices](/docs/sikker-utvikling/github) for en gjennomgang av de viktigste tiltakene: rulesets, trygge triggere, token-håndtering og sikre workflows.

Kjør [zizmor](/docs/verktoy/zizmor) for å automatisk avdekke sikkerhetsproblemer i GitHub Actions-workflowene dine.

</details>

<details>
<summary>Sett opp automatisk scanning av avhengigheter, kode og images</summary>

Lavthengende frukt fanges opp automatisk med disse verktøyene:

- [Dependabot](/docs/verktoy/dependabot) – holder avhengighetene oppdatert og varsler om kjente sårbarheter.
- [Statisk kodeanalyse](/docs/sikker-utvikling/kodeanalyse) – finner sikkerhetsfeil direkte i koden din.
- [Docker image-scan](/docs/verktoy/trivy) – avdekker sårbarheter og hemmeligheter i containerimaget.

Legg også til en [scheduled trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) i GitHub Actions-workflowene dine, slik at scanning kjøres selv når det ikke skjer kodeendringer.

</details>

<details>
<summary>Bruk distroless baseimages (Chainguard eller Google Distroless)</summary>

Uten et operativsystem i containeren finnes det ingen shell å utnytte – selv om en sårbarhet finnes, er den langt vanskeligere å utnytte.
Bruk baseimages fra [Chainguard](https://github.com/chainguard-images) eller [Google Distroless](https://github.com/GoogleContainerTools/distroless), og se [Chainguard baseimages](/docs/verktoy/chainguard-dockerimages) for eksempler og komme-i-gang-guide.

</details>

<details>
<summary>Valider all input</summary>

Stol aldri på data som kommer inn i applikasjonen din, uansett kilde – API-kall, skjemaer, filer eller andre systemer.
Se [inputvalidering](/docs/sikker-utvikling/inputvalidering) for konkrete råd og eksempler.

</details>

<details>
<summary>Sett opp overvåking og alarmer</summary>

Med [overvåking og alarmer](https://doc.nais.io/observability/) oppdager du avvikende adferd før det blir et alvorlig problem.
Sett opp varsler på uvanlig trafikk, feilrater og responstider.

</details>

<details>
<summary>Ikke logg sensitiv informasjon</summary>

FNR, JWT-tokens og andre personopplysninger skal ikke forekomme i standardloggene.
Se [logging-siden](/docs/sikker-utvikling/logging) for hva du bør passe på og hvordan du strukturerer loggene dine.

</details>
