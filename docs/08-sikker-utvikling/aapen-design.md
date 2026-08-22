---
title: Åpen design og transparens
description: Sikkerheten skal ikke avhenge av at designet er hemmelig — dokumenter, del og la andre reviewe.
tags:
  - arkitektur
  - transparens
  - open-design
---

Åpen design betyr at sikkerheten i systemet ditt ikke avhenger av at noen holder designet hemmelig. Kontrollene skal fungere selv om en angriper forstår nøyaktig hvordan systemet er bygget. Det betyr også at du dokumenterer sikkerhetsvalgene dine slik at andre kan reviewe og forbedre dem.

## Dokumenter sikkerhetsbeslutninger

Hvert team bør ha en kort sikkerhetsbeskrivelse (1–2 sider) som dekker:

- **Tillitsgrenser:** Hvem snakker med hvem? Hva er tiltrodd vs. utiltrodd?
- **Auth-modell:** Hvilken identitetstilbyder brukes? Hvordan valideres tokens?
- **Kryptografi:** Hva krypteres, med hva? (Spoiler: bruk standardbibliotekene)
- **Oppdateringsmekanisme:** Hvordan deployes sikkerhetsfikser?
- **Logging og audit:** Hva logges, og hvem har tilgang?
- **Sikre defaults:** Hva er utgangspunktet for nye brukere/integrasjoner?

:::tip Hvor legger man dette?
En `SECURITY.md` i repoet, en side i team-wikien, eller en ADR (Architecture Decision Record). Formatet er mindre viktig enn at det finnes og holdes oppdatert.
:::

### Mal for sikkerhetsbeskrivelse

```markdown
# Sikkerhetsbeskrivelse — [appnavn]

## Tillitsgrenser
- Eksponert mot internett: ja/nei
- Inbound: [liste over kallere]
- Outbound: [liste over avhengigheter]

## Autentisering og autorisering
- Sluttbruker: ID-porten / Azure AD
- Maskin-til-maskin: TokenX / Azure AD client credentials
- Autorisering: [roller, ABAC, eller annen mekanisme]

## Kryptografi
- Data i transit: mTLS (Nais service mesh)
- Data i rest: GCP-kryptering + [evt. ekstra for PII]
- Secrets: Google Secret Manager

## Sensitive data
- [Hvilke personopplysninger behandles?]
- [Oppbevaringstid og slettepolicy]

## Kjente risikoer og aksepterte avvik
- [Evt. aksepterte risikoer med eier og utløpsdato]

Sist oppdatert: [dato]
```

## Bruk åpne standarder — ikke hjemmesnekret krypto

- **Autentisering:** OAuth 2.0 / OIDC via Nais-tilbyderne (ID-porten, Azure AD, TokenX)
- **Kryptering:** TLS 1.2+ (håndteres av Nais), standard biblioteker for applikasjonskrypto
- **Signering:** Cosign/Sigstore for images, standard JWT-biblioteker for tokens

:::danger Aldri gjør dette
- Implementer egen krypteringsalgoritme
- Bruk egendefinerte token-formater i stedet for JWT
- Stol på «security through obscurity» (hemmelige URL-er, obfuskert kode som eneste beskyttelse)
:::

## SBOM — Software Bill of Materials

Nais Console genererer automatisk SBOM for images som deployes. Sjekk at:

1. Teamet ditt har aktivert [Dependency-Track i Nais Console](https://doc.nais.io/services/dependency-track/)
2. Du ser appens avhengigheter og kjente sårbarheter i dashboardet
3. SBOM genereres for hvert bygg (skjer automatisk med Nais deploy)

Les mer i [verktøy-seksjonen](/docs/verktoy/nais-console-dp-track).

## Sårbarhetshåndtering — vulnerability disclosure

Nav har en prosess for å motta og håndtere sikkerhetsfunn:

- **Ekstern rapportering:** [nav.no/sikkerhet](https://www.nav.no/sikkerhet) (responsible disclosure)
- **Intern rapportering:** [#security-champion](https://nav-it.slack.com/archives/CN8N938K1) på Slack, eller direkte til Security Operations
- **GitHub Security Advisories:** Aktiver i repoets Security-tab for å motta og publisere advisories

Sørg for at repoet ditt har en `SECURITY.md` som peker til riktig kanal:

```markdown
# Security

If you discover a security vulnerability, please report it via
[nav.no/sikkerhet](https://www.nav.no/sikkerhet).

Do not open a public GitHub issue for security vulnerabilities.
```

## Peer review for sikkerhetskritiske endringer

Bruk CODEOWNERS til å kreve review fra sikkerhetskompetente personer på kritiske filer:

```bash
# .github/CODEOWNERS
# Krev review for auth-konfigurasjon
nais.yaml @mitt-team/security-champions
**/auth/** @mitt-team/security-champions
**/token/** @mitt-team/security-champions
```

I tillegg: aktiver branch protection med krav om minst én godkjenning for `main`.

## Sikkerhets-changelog

Når du merger en PR som fikser en sårbarhet eller endrer sikkerhetsoppførsel:

- Merk PRen med label `security`
- Inkluder en linje i release notes: «Sikkerhetsfiks: [kort beskrivelse]»
- For alvorlige funn: publiser en GitHub Security Advisory

## Sjekkliste

- [ ] Teamet har en sikkerhetsbeskrivelse som er oppdatert siste 6 måneder
- [ ] Ingen egendefinert krypto eller hemmelige sikkerhetsmekanismer
- [ ] SBOM genereres og er synlig i Nais Console / Dependency-Track
- [ ] Repoet har en `SECURITY.md` med kontaktinformasjon
- [ ] Sikkerhetskritiske filer har CODEOWNERS-beskyttelse
- [ ] Sikkerhetsfikser dokumenteres i release notes

## Les mer

- [Nais Console og Dependency-Track](/docs/verktoy/nais-console-dp-track)
- [GitHub best practices](/docs/sikker-utvikling/github)
- [Trusselmodellering](/docs/sikker-utvikling/trusselmodellering)

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
