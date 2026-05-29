---
title: Tilgangsstyring
description: 💂 Hvem som slipper inn bør være på toppen av ditt sinn.
---

![You shall not pass!](../../static/img/You-Shall-Not-Pass.png)

Tilgangskontroll består av to hoveddeler. Først må man finne ut hvem brukeren er (autentisering), deretter må man ta
avgjørelser om tilgang basert på hvilke egenskaper denne brukeren har (autorisering). På engelsk omtales dette ofte som
«AuthNZ» (**Auth**e**N**tication og **Auth**ori**Z**ation).

I Nav har vi valgt å ta i bruk [OAuth 2.0](https://oauth.net/2/) og [OpenID Connect (OIDC)](https://openid.net/connect/)
for dette formålet. En introduksjon til disse samt tilhørende begrep og uttrykk finner
du [her](https://nais.io/blog/posts/oauth1/). Dette er veletablerte standarder med god industristøtte.

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
finnes på [NAIS-bloggen](https://nais.io/blog/posts/oauth2/).

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

Se også [tokenvalidering](https://doc.nais.io/security/auth/concepts/tokens/#token-validation) for utdypende info.

## Testing

For å gjøre testing av «AuthNZ» enklere og minske behovet for dedikerte testmiljøer, kan man
benytte [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server). Denne kan enkelt spinnes opp i f.eks.
JUnit-tester eller som en Docker-container. Den kan også konfigureres til å støtte ting som custom «claims» og HTTPS med
egne sertifikater.

## Grupper i Entra ID og on-premise AD i tilgangskontroll

For å gjøre tilgangskontroll i applikasjoner med interne brukere benyttes primært gruppemedlemskap i Entra ID. For legacyapplikasjoner benyttes gruppemedlemskap i on-premise Active Directory. Ved veldig spesielle behov benyttes Axsys og evnt andre løsninger.

For noen utvalgte tilgangstyper er det felles grupper som skal benyttes for alle nye applikasjoner. De er dokumentert på Confluence: [Hvordan gjøre tilgangsstyring og tilgangskontroll](https://confluence.adeo.no/x/IJO9IQ)

Ellers bør ikke grupper i AD/Entra ID gjenbrukes i nye applikasjoner med mindre teamet selv er eiere av gruppene og har full kontroll på eierskapet, innsikt i bruken og hvordan medlemskap tildeles. Hva grupper representerer, hvilke brukerkontoer som er medlem, hvem som eier grupper og om grupper er i bruk eller avvikles kan endre seg over tid. Det er dermed anbefalt å opprette nye grupper for nye applikasjoner eller å gjenbruke grupper som teamet selv kontrollerer.
Tilsvarende så bestill sletting av både tilgangsstyring og selve gruppene som dere slutter å bruke.

Nye grupper i Entra ID bestilles etter [Rutine for bestilling av Entra-ID grupper og tilgangsstyring i Mine Tilganger (Omada)](https://confluence.adeo.no/x/BaKwK).

Nye grupper i on premise AD bestilles via Jira sak i IKT spacet på tjeneste "AD/Azure AD" og  ansvarlig gruppe "Team Arbeidsflate".

## Tilgangsstyring for grupper beregnet for personlige brukerkontoer (og RA kontoer)
Dvs dette gjelder ikke grupper beregnet på maskinkontoer.

I utgangspunktet skal alle tilganger beregnet for personlige brukerkontoer (og RA kontoer) sentralt styres via Mine Tilganger. 
Dette gir en sentral oversikt og felles løsning for bestilling, godkjenning, tilgangsrevisjon, lisenshåndtering, nødnedstenging med mer.
Det kan finnes unntak, i så fall ta kontakt via #tilgang-og-identitet på Slack for en dialog. 

Bestilling av styring av nye tilganger og endring av styring på eksisterende tilganger: [Overordnet bestillings- og endringsprosess for tilganger i Mine Tilganger](https://navno.sharepoint.com/sites/intranett-it/SitePages/Overordnet-bestillings--og-endringsprosess-for-tilganger.aspx)

### "Just in time"-tilganger
"Just in time"-tilganger er tilganger som gis for korte perioder. En "just in time"-tilgang i Mine tilganger vil si en tilgang som bestilles ved behov, og med en kort gyldighetsperiode. Når gyldighetsperioden er over, trekkes tilgangen automatisk tilbake. Hvis behovet for tilgangen oppstår igjen, må tilgangen dermed bestilles på nytt for en ny avgrenset periode.

Teamene som eier slike tilganger kan bestemme hvem som kan bestille tilgangen og hvilke utvalgte personer som skal godkjenne bestillinger (man kan ikke godkjenne egne bestillinger).

Hvis et team ønsker en "Just in time"-tilgang, presiseres dette i bestillingsprosessen.

## Gode ressurser

- [NAIS - Authentication and Authorization](https://doc.nais.io/security/auth/)

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
