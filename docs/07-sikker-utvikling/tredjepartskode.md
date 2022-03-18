---
title: Tredjepartskode
description: 📦 Andres kode trenger ikke gi deg vondt i hodet
---

Vi drar stadig flere tredjepartsavhengigheter inn i koden vår. Disse avhengighetene har gjerne selv avhengigheter, som igjen har avhengigheter, og så videre. Noen estimater sier at så mye som 85% av koden i en typisk applikasjon (i den grad det finnes typiske applikasjoner) er skrevet av andre enn oss selv. Denne koden har (som all annen kode) feil og sårbarheter. Ulike <abbr title="Open-source software">OSS</abbr>-prosjekter har ulike strukturer og arbeidsformer. Noen av dem forlates, andre overtas av mennesker som ikke har like gode hensikter som de forrige.

Hvordan kan vi sikre oss bedre mot dette? Det er en uoverkommelig oppgave å skulle holde oversikt over slike ting selv. Det har derfor dukket opp tjenester som kontinuerlig monitorerer og systematiserer info om kjente sårbarheter og hvilke produkter som er rammet av dem. I NAV har vi valgt å ta i bruk [GitHub Security](/docs/verktoy/dependabot) og [Snyk](/docs/verktoy/snyk). Disse kan scanne prosjektene dine jevnlig etter avhengigheter med kjente sårbarheter og varsle dere i form av meldinger på Slack/epost eller ved å lage pull requests som oppdaterer de sårbare versjonene.

## Verktøy

Det finnes mange verktøy som hjelper til med å passe på tredjeparts–avhengigheter/kode, men disse brukes mye i NAV og kan anbefales:

- [Snyk](/docs/verktoy/snyk)
- [Dependabot](/docs/verktoy/dependabot)

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
