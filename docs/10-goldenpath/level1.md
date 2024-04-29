---
title: Level 1
description: En liste med raske tiltak som alle team burde ta sig tid att implementere
---

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```

## Level 1
Tiltak 5-10 minuter å sette opp og gir høy verdi. Dette er en liste på ting som alle burde sette opp.

### [Kodescanning](/docs/sikker-utvikling/kodeanalyse)
Kodescanning hjelper til å fange opp svakheter i både applikasjon og bygg-pipeline. 

### [Scanne docker images etter sårbarheter og hemmeligheter](/docs/verktoy/trivy)
Trivy fanger opp sårbarheter & hemmeligheter som introduseres i byggprosessen å av baseimaget du bruker for å bygge din applikasjon. Setter man opp scanning av docker imaget før man deployer så får man umiddelbart informasjon om potensielle problemer.

### [Submitte avhengigheter og resultater fra scanning til GHAS](/docs/verktoy/dependabot)
Kan gjøres i samband med 
