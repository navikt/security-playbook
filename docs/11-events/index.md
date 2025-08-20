---
title: Events 🎉
pagination_next: wordlist
---

# Hva skjer i nettverket?

Har du forslag til arrangementer, kurs, eller lignende? Si ifra til [redaksjonen](https://teamkatalog.nav.no/team/b5915f11-0740-4a2e-b767-6ac5c407e9c7)!

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';
import Kalender from '../../src/components/Kalender'
import arrangementer from './arrangementer.json'

<div>
  <Kalender extraEvents={arrangementer}/>
</div>

<br />
<SavnerDuNoe />
```
