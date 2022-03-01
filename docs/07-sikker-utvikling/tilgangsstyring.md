---
title: Tilgangsstyring
description: 💂 Hvem som slipper inn bør være på toppen av ditt sinn
---

![You shall not pass!](../../static/img/You-Shall-Not-Pass.png)

Tilgangskontroll består av to hoveddeler. Først må man finne ut hvem brukeren er (autentisering), deretter må man ta
avgjørelser om tilgang basert på hvilke egenskaper denne brukeren har (autorisering). På engelsk omtales dette ofte som
«AuthNZ» (**Auth**e**N**tication og **Auth**ori**Z**ation).

I NAV har vi valgt å ta i bruk [OAuth 2.0](https://oauth.net/2/) og [OpenID Connect (OIDC)](https://openid.net/connect/)
for dette formålet. En introduksjon til disse samt tilhørende begrep og uttrykk finner
du [her](https://nais.io/blog/posts/2020/09/oauth1). Dette er veletablerte standarder med god industristøtte.

Standardene muliggjør bruken av eksterne tilbydere som kan abstrahere vekk og konsolidere funksjonalitet som man
tradisjonelt sett har måttet håndtere selv. Vi benytter eksterne tilbydere i form
av [ID-porten](https://eid.difi.no/nb/id-porten)
og [Microsoft Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols)
for henholdsvis publikum og egne ansatte.

I tråd med prinsippene om [Zero Trust](https://doc.nais.io/appendix/zero-trust/), har vi også valgt å ta i
bruk [OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html) spesifikasjonen. Måten vi bruker denne
spesifikasjonen på innebærer at vi ønsker smalt scopede tokens. Det vil si at et access token kun har én tiltenkt
mottaker, og at tokenet altså ikke er gyldig mot noen andre applikasjoner enn denne. I tillegg må de involverte appene
på forhånd godkjenne at de kan snakke med hverandre for å kunne få utstedt korrekt token fra identitetstilbyderen. Smalt
scopede tokens minsker også skadepotensialet betraktelig hvis de skulle komme på avveie.

Token exchange muliggjør også propagering av _subjektet_ i tokenet. I praksis betyr det at informasjonen om
sluttbrukeren som startet kallkjeden er bevart hele veien gjennom dersom man bruker token exchange mellom hvert ledd.
Til sammenligning så har man tradisjonelt sett brukt systembrukere mellom de ulike leddene som i praksis fjerner
informasjon om sluttbrukeren (eller påtvinger krav om å inkludere den på andre måter). Azure AD støtter token exchange
via sin «on behalf of»-flyt, mens for ID-porten har vi laget et tilsvarende opplegg som vi har kalt TokenX. Mer info
finnes på [NAIS-bloggen](https://nais.io/blog/posts/2020/09/oauth2).

## Eksempler og implementasjon

I [eksempel-repoet](https://github.com/nais/examples) til NAIS finnes det eksempler på apper som tar i bruk disse
tingene i flere språk og rammeverk.

NAIS har også laget en «auth-as-a-service»-løsning i form av en Kubernetes-sidecar
kalt [Wonderwall](https://github.com/nais/wonderwall) for
henholdsvis [ID-porten](https://doc.nais.io/security/auth/idporten/sidecar/)
og [Azure AD](https://doc.nais.io/security/auth/azure-ad/sidecar/).

## Validering av tokens

Når man skal validere tokens, kan man benytte et [tredjepartsbibliotek](https://jwt.io/libraries), eller vårt
egenproduserte [token-support](https://github.com/navikt/token-support/) som kan plugges rett inn i Spring og Ktor.

Se også [tokenvalidering](https://security.labs.nais.io/pages/tokenvalidering/) for utdypende info.

## Testing

For å gjøre testing av «AuthNZ» enklere og minske behovet for dedikerte testmiljøer, kan man
benytte [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server). Denne kan enkelt spinnes opp i f.eks.
JUnit-tester eller som en Docker-container. Den kan også konfigureres til å støtte ting som custom «claims» og HTTPS med
egne sertifikater.

## Gode ressurser

- [Veiviser for innlogging og bruk av tokens](https://security.labs.nais.io/pages/guide/)
- [NAIS - Authentication and Authorization](https://doc.nais.io/security/auth/)

```mdx-code-block
import UnderArbeid from './\_under-arbeid.mdx'

<UnderArbeid />
```
