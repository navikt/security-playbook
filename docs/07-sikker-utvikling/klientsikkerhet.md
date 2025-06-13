---
title: Klientsikkerhet
description: Det er mye å passe på - også din egen maskin
---

## Kortreist sikkerhet

I Nav IT, som i de aller fleste IT-organisasjoner, så finnes det en drøss av sikkerhetsmekanismer som er designet for å beskytte brukere fra seg selv. Sagt litt annerledes: Maskinene som benyttes til "kontorarbeid" eller utvikling av applikasjoner er oftere enn ikke underlagt kontroll og styring. Dette gir noen utfordringer.

- Policiene som settes er ofte ikke kommunisert noe sted.
- Policiene er til heft of plunder for avanserte brukere.
- Policiene tar ikke høyde for "the human element".
- Policiene er satt med "bred pensel" av noen som ikke kjenner _din_ arbeidsflyt eller kompetansenivå.
- Policiene fungerer som sovepute da du som bruker får et inntrykk av sikkerheten er ivaretatt for deg.

Hensikten med overskriften er fortsatt kanskje ikke helt åpenbar?
Store deler av denne playbooken handler om kodescanning og validering av koden som skal settes i produksjon. Alt dette er vel og bra, men dersom din maskin, altså du som aktør i [verdikjeden er kompromittert](https://sikkerhet.nav.no/docs/wordlist/#supply-chain-attack) så hjelper alle våre andre mekanismer svært lite.

Så for å parafrasere et utrykk som er aktuelt i samtiden; Kortreist sikkerhet er den lavest hengende frukten hva gjelder bærekraftig utvikling i Nav.

- Prøv å orientere deg i hva (og hvorfor noe) er gjort med maskinen din via policies så du kan gjøre opplyste avgjørelser om å gå rundt eller disable policies.
- Sett deg inn i [Do's and Don´ts](https://naisdevice-approval.external.prod-gcp.nav.cloud.nais.io/) (Kun tilgjengelig i Naisdevice). De er der for å hjelpe deg gjøre riktige valg.

### Konkrete og effektive tiltak for sikring av egen maskin og egne brukerkontoer:

- Hold softwaren din oppdatert. Ikke bare operativsystemet og web-browseren, men også de andre verktøyene du bruker.
- Ha sterke og unike passord på hver tjeneste du bruker. Den eneste måten å oppnå dette på i praksis er ved å bruke en passord-manager. Om du bruker [LastPass](https://www.lastpass.com/), [1Password](https://1password.com/), [Bitwarden](https://bitwarden.com/) eller en annen spiller ikke så stor rolle, men bruk en av dem.
- Skru på 2-faktor autentisering (2FA, av og til omtalt som multifaktor-autentisering eller MFA) alle steder som støtter dette (og det er de fleste). [WebAuthn](https://webauthn.io/) med [Yubikeys](https://www.yubico.com/why-yubico/) eller tilsvarende er bedre enn engangspassord fra en "authenticator app", app er bedre enn SMS, men SMS er mye bedre enn ingenting.
- Sett opp signering av commits til github. Alle utviklere bør bruke signerte commits på kode som commites til Nav sine repoer. Tilsvarende bør alle Navs repoer kreve signerte commits. Les mer om å sette opp [signering av commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#gpg-commit-signature-verification)
- Ikke kjør med flere tillatelser enn du trenger til vanlig, det er ikke så ofte man faktisk trenger å være root. På en standard Nav-oppsatt Mac har du tilgang til et verktøy som heter [Privileges](https://github.com/SAP/macOS-enterprise-privileges) som kan benyttes til å gi seg selv ekstra tilgang ved behov.

Og ikke minst; Vi har mange eksperter i Nav - og når det gjelder sikkerhet så anser vi alle spørsmål som smarte, så hvis du er i tvil; spør en venn.

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
