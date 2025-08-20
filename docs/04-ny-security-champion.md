---
title: Ny Security Champion 🤗
description: Informasjon for nye Security Champions.
---

# Ny Security Champion 🤗

Har du akkurat blitt Security Champion? Gratulerer! 🎉

… Men du lurer kanskje på hva det betyr i praksis? Her finner du noen tips til hvor du kan begynne. 🚀

## Tips til aktiviteter for nye Security Champions

### Få en oversikt over sårbarheter i avhengigheter 👀

Noen estimater sier at så mye som 85 % av koden i en typisk applikasjon er skrevet av andre enn oss selv. Det er derfor minst like viktig å følge med på sikkerheten i tredjepartskoden, som sin egen kode. Les mer på siden [«Tredjepartskode»](/docs/sikker-utvikling/tredjepartskode).

:::success Praktisk oppgave – GitHub Security

1. Sjekk at [Dependabot](/docs/verktoy/dependabot), [Code Scanning](https://sikkerhet.nav.no/docs/verktoy/github-advanced-security) og Secret Scanning er aktivert for alt teamet ditt har ansvar for ([se oversikt på GitHub](https://github.com/orgs/navikt/security/coverage))
2. Gå gjennom [sikkerhetsvarsler flagget i GitHub](https://github.com/orgs/navikt/security/risk)
3. Rett opp sårbarheter i avhengigheter og egen kode 🥷

:::

### Les gjennom temaene i playbooken 📚

Playbooken forsøker å samle informasjon som er nyttig og relevant for det daglige arbeidet med sikkerhet i produktteam. Siden [«Sikker utvikling i Nav IT»](/docs/sikker-utvikling) inneholder en liste med tema som de fleste burde kjenne til, men som ikke er åpenbare nok til at vi kan ta for gitt.

:::success Praktisk oppgave – Les gjennom temaene under «Sikker utvikling i Nav IT»

1. Gå til [«Sikker utvikling i Nav IT»](/docs/sikker-utvikling)
2. Les gjennom temaene og se om du lærer noe nytt
3. Tenk gjennom om det er noe du savner 💭

:::

### Bidra til Security Playbook 🎖

Playbooken er drevet av Security Champions selv. Det er derfor viktig at alle føler de kan bidra, og at endringer ikke må gå gjennom en lang, tung, og byråkratisk prosess. Les mer på siden [«Introduksjon»](/docs/#forslag-kommentarer-eller-feil).

:::success Praktisk oppgave – Oppdater playbooken

1. Gå til [security-playbook](https://github.com/navikt/security-playbook)-koden på GitHub
2. Finn én ting du kan endre under [`docs`-mappen](https://github.com/navikt/security-playbook/tree/main/docs) (eller mer!)
3. Commit og push endringen til `main` 🥳

:::

### Ta en kaffe med en annen Security Champion! ☕️

En av de beste måtene å lære, er å sammen lære av hverandre. «Security Champion»-nettverket består av mange flinke folk, så hvorfor ikke finne noen å prate med og lære sammen?

:::success Praktisk oppgave – ta en kaffeprat

1. Finn en Security Champion i [Teamkatalogen](https://teamkatalog.nav.no/dashboard/members/role/SECURITY_CHAMPION) du ikke har snakket med før
2. Inviter personen til en kaffeprat
3. ☕️

:::

### Gå gjennom loggene til teamet 🪵

Logging er utrolig nyttig, men kan også være bli litt skummelt om man ikke tenker seg godt nok om. På siden [«Logging»](/docs/sikker-utvikling/logging) står det litt om hva som kan være greit å tenke på rundt logging.

:::success Praktisk oppgave – Finn ut hva som logges i teamet ditt

1. Finn ut hvordan applikasjonene til teamet logger
2. Let etter steder hvor det logges enten for lite eller for mye
3. Rett opp koden 🎖

:::

### Fjern gamle tjenester og systemer 🪦

Gamle tjenester er gjerne de som glemmes når det kommer til sikkerhet. Dersom teamet deres har tjenester som fremdeles kjører, men som ingen lenger passer på, kan det fort bli til en tikkende sikkerhetsbombe. 💣

:::success Praktisk oppgave – fjern gamle tjenester

1. Finn ut hva som kjører i de ulike miljøene (sbs, fss, gcp, …?)
2. Se om noe ikke brukes lenger og kan skrus av
3. Skru det av 🪦 (husk å feire med kake! 🍰)

:::

### Arkiver forlatte GitHub-repos

Det er lett å glemme GitHub-repoet når man pensjonerer applikasjoner eller kodeeksperimenter. Hvis man ikke arkiverer repoene vil Dependabot fortsette å scanne og rapportere dependencies med sårbarheter. Statistikkene blir dermed feil, og det ser ut som man ligger lenger bakpå enn hva som faktisk er tilfelle.

:::success Praktisk oppgave – arkiver gamle GitHub-repos

1. Se gjennom repoene til teamet ditt og finn de som ikke er deployet noen steder og/eller ikke har vært skrevet til på lenge. [Risiko-dashboardet](https://github.com/orgs/navikt/security/risk) kan være en grei plass å starte (sorter etter "Dependabot alerts").
2. Arkiver dem (gjøres under "settings"-taben). NB! arkivering er ikke det samme som sletting, arkiverte repo kan enkelt bringes tilbake på et sendre tidspunkt.
3. Profit! 💰

:::

### Lær mer om sikkerhet 📚

Ta et kurs, les en bok eller lytt på en podcast.

:::success Praktisk oppgave – Lær noe nytt

1. Besøk noen av [ressursene](/docs/lenker) som er listet her i playbooken
2. Prøv deg på noen CTF-oppgaver hos feks [Pico](https://picoctf.org/) eller [TryHackMe](https://tryhackme.com/)
3. Benytt noe av det som [O'Reilly](https://learning.oreilly.com/search/?q=security&type=playlist&playlist_type=expert&rows=10) tilbyr (krever abonnement, ansatte i Nav IT kan [selvbetjene](https://myapps.microsoft.com) tilgang)

:::

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
