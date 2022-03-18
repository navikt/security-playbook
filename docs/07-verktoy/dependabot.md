---
slug: dependabot
title: Dependabot (GitHub Security)
description: Scanning av avhengigheter
tags:
  - tredjepartskode
---

**Relevante tema:**

- [Tredjepartskode](../sikker-utvikling/tredjepartskode)

[Dependabot](https://github.com/dependabot) er et verktøy som kan brukes på åpne GitHub-repos (i motsetning til Snyk som også kan brukes på private repos). Dersom man ønsker at Dependabot kun skal sjekke etter sårbarheter, kan dette settes opp i dit repo i GitHub, under _Security_. Ønsker man å også få forslag til oppgraderinger som ikke nødvendigvis er sårbarheter, kan man be om det via `dependabot.yml`. Les mer om den siste varianten [her](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/enabling-and-disabling-dependabot-version-updates).

![GitHub Security](/img/dependabot.png "GitHub Security")
