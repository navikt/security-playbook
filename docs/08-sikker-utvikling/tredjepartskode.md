---
title: Tredjepartskode
description: 📦 Andres kode trenger ikke gi deg vondt i hodet.
---

Vi drar stadig flere tredjepartsavhengigheter inn i koden vår. Disse avhengighetene har gjerne selv avhengigheter, som igjen har avhengigheter, og så videre. Noen estimater sier at så mye som 85% av koden i en typisk applikasjon (i den grad det finnes typiske applikasjoner) er skrevet av andre enn oss selv. Denne koden har (som all annen kode) feil og sårbarheter. Ulike <abbr title="Open-source software">OSS</abbr>-prosjekter har ulike strukturer og arbeidsformer. Noen av dem forlates, andre overtas av mennesker som ikke har like gode hensikter som de forrige.

Med avhengigheter mener vi alt prosjektet henter inn utenfra: biblioteker og pakker fra npm, Maven og Gradle, Docker-images, GitHub Actions og bygg- og utviklerverktøy. Rådene på denne siden gjelder alle disse. Se også [Valg av baseimage](/docs/sikker-utvikling/baseimages) og [Pin tredjeparts-actions](/docs/sikker-utvikling/github#pin-tredjeparts-actions).

## Vurder nye avhengigheter

Hver avhengighet må oppdateres, testes og følges opp så lenge den er i bruk. Gå gjennom spørsmålene under før du legger til en ny. Still dem også jevnlig om avhengighetene dere allerede har.

### Trenger vi den?

En avhengighet kan få opptil et par oppdateringer i uka. Med mange avhengigheter blir det fort tusenvis av oppdateringer i året, og hver av dem må merges, bygges og testes. Jo større og mer kompleks avhengigheten er, jo mer vedlikehold krever den. Har ikke teamet tid til å følge den opp, bør dere la være å ta den inn.

### Blir den vedlikeholdt?

Når ingen vedlikeholder et prosjekt, blir heller ingen bugs eller sårbarheter fikset. En pakke kan ha millioner av nedlastinger og likevel være forlatt. Dette kan du se etter i GitHub-repoet til prosjektet:

- Legg til `/pulse/monthly` på slutten av URL-en, for eksempel `https://github.com/nais/naiserator/pulse/monthly`. Her ser du hvor mange issues og pull requests som er åpnet og lukket den siste måneden, hvor mange releaser som er publisert og hvor mange som har bidratt.
- Mange åpne issues og pull requests som ingen lukker, tyder på at ingen følger opp prosjektet.
- Mange bidragsytere betyr at prosjektet ikke står og faller på én person.
- Legg til `/community` på slutten av URL-en for å se om prosjektet har filer som `CONTRIBUTING.md` og `CODE_OF_CONDUCT.md`. Mangler de, er det et dårlig tegn.

[OpenSSF Scorecard](https://scorecard.dev/) gir prosjekter en score ut fra blant annet vedlikehold, code review og sikkerhetspraksis. [deps.dev](https://deps.dev/) viser Scorecard-resultater, kjente sårbarheter og avhengighetstreet for pakker fra npm, Maven, PyPI, Go, Cargo og NuGet.

### Hva bruker andre i Nav?

Søk etter avhengigheten i [koden til navikt på GitHub](https://github.com/search?q=org%3Anavikt&type=code) for å se om andre team bruker den, eller spør i [#utviklerrommet](https://nav-it.slack.com/archives/C60FFACN5) på Slack. For større valg, som rammeverk, kan [Teknologiradaren](https://teknologiradaren.intern.nav.no/) ha en anbefaling. Finner du den ikke der, kan du foreslå den i [#teknologiradar](https://nav-it.slack.com/archives/CEHSHMNBF).

### Er den trygg nok?

Et prosjekt som blir vedlikeholdt, er som regel tryggere enn et som ikke blir det, men det er ingen garanti. Søk opp pakken i [GitHub Advisory Database](https://github.com/advisories) eller [OSV](https://osv.dev/) for å se om den har kjente sårbarheter. Har den det, må dere vurdere om risikoen er verdt det.

Legg til `/security` på slutten av URL-en til repoet for å se om prosjektet har en sikkerhetspolicy og har publisert security advisories.

Se [Supply chain-sikkerhet](/docs/sikker-utvikling/supply-chain) for hvordan du beskytter deg mot ondsinnede pakker når du installerer dem.

### Lisens og ytelse

Lisens og ytelse er ikke sikkerhetsspørsmål, men hører med i vurderingen. Les om lisenser på [Åpen kildekode og lisenser](https://utvikling.intern.nav.no/teknisk/open-source-licenses.html) i utviklerhåndboka.

## Transitive avhengigheter

Det fleste pakkehåndterere har en mekanisme for å oppdatere transitive/indirekte avhengigheter. 
Dette kan være nødvendig for å få inn viktige sikkerhetsoppdateringer.
Her er hvordan man gjør dette i noen av de mest populære pakkehåndtererne:

<details>
<summary>pnpm</summary>

<h2>pnpm update</h2>

Kjør `pnpm update` for å oppdatere alle avhengigheter til de nyeste versjonene.
For mere kontroll kan du spesifisere en pakke, for eksempel `pnpm update <sårbart-bibliotek>` for å tvinge oppdatering av denne.

<h2>Overrides</h2>

Du kan tvinge en spesifikk versjon av en transitiv avhengighet ved å bruke `overrides`-feltet i `package.json`.
Dette vil overskrive den versjonen som er spesifisert via den direkte avhengigheten. 

```json
{
  "overrides": {
    "sårbart-bibliotek": "1.2.3"
  }
}
```

</details>

<details>
<summary>Maven</summary>

Du kan tvinge en spesifikk versjon av en transitiv avhengighet ved å bruke `dependencyManagement`-seksjonen i `pom.xml`.
Dette vil overskrive den versjonen som er spesifisert via den direkte avhengigheten.

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>sårbart-bibliotek</artifactId>
            <version>1.2.3</version>
        </dependency>
    </dependencies>
</dependencyManagement>
<dependencies>
    <dependency>
        direkte dependencies her
    </dependency>
</dependencies>
```

</details>

<details>
<summary>Gradle</summary>

Du kan tvinge en spesifikk versjon av en transitiv avhengighet ved å bruke `constraints` i `build-gradle`.
Dette vil overskrive den versjonen som er spesifisert via den direkte avhengigheten.

```json
dependencies {
    implementation("com.example.direkte-avhengighet:1.1.0")
    constraints {
        implementation("com.example:sårbart-bibliotek:1.2.3") {
            because("en tekst som beskriver hvorfor denne må oppdateres")
        }
    }
}
```
</details>

## Verktøy

Det er en uoverkommelig oppgave å skulle holde oversikt over slike ting selv. Det har derfor dukket opp tjenester som kontinuerlig monitorerer og systematiserer info om kjente sårbarheter og hvilke produkter som er rammet av dem.

Disse konkrete produktene brukes mye i Nav og kan anbefales:

- [GitHub Advanced Security](/docs/verktoy/github-advanced-security)
- [Dependabot](/docs/verktoy/dependabot)
- [NAIS Console & Dependency-Track](/docs/verktoy/nais-console-dp-track)

Disse kan scanne prosjektene dine jevnlig etter avhengigheter med kjente sårbarheter og varsle dere i form av meldinger på Slack/epost eller ved å lage pull requests som oppdaterer de sårbare versjonene. Med [dependency review](/docs/verktoy/github-advanced-security#dependency-review) kan du i tillegg stoppe pull requests som legger til sårbare avhengigheter.

Vil du sjekke avhengighetene lokalt eller i en egen CI-jobb, har de fleste økosystemer egne verktøy:

- `pnpm audit` og `npm audit` for JavaScript
- [govulncheck](https://go.dev/doc/tutorial/govulncheck) for Go
- [cargo-audit](https://github.com/rustsec/rustsec/tree/main/cargo-audit) for Rust
- [pip-audit](https://github.com/pypa/pip-audit) for Python
- [OSV-Scanner](https://google.github.io/osv-scanner/) og [Trivy](/docs/verktoy/trivy) på tvers av økosystemer

## Plugins i ymse verktøy

Veldig mange utviklerverktøy har en eller annen mekanisme for å utvide funksjonaliteten med plugins. Regimet rundt håndteringen av disse pluginsene kan variere veldig fra produkt til produkt. Man kan ha få plugins som må gjennom godkjennelsesprosesser for å bli tatt inn i varmen, eller man kan slippe communityet løs helt uten noen former for kontroll. Når man tar i bruk en plugin tillater man i praksis vilkårlig kjøring av kode man vet svært lite om, så litt "due dilligence" er absolutt å anbefale.

### Due dilligence

Før man tar i bruk plugins er det viktig å kjøre en mini-trusselvurdering. Hvilken kontekst skal denne koden kjøre i, og hvilken informasjon har den potensielt tilgang til? Hva er "worst case" hvis en plugin går "rogue"? Hvem har laget den? Hva slags aktivitet har det vært i GitHub-repoet den siste tiden? Gjør et lite søk etter kjente sårbarheter på Google og på steder som [GitHub Advisory Database](https://github.com/advisories), [OSV](https://osv.dev/), [VulDB](https://vuldb.com) eller [Mitre](https://cve.mitre.org/cve/search_cve_list.html)

### Begrense handlingsrommet til tredjeparter

I noen pakke-økosystemer er det lagt opp til at pakker skal kunne kjøre vilkårlige shellscripts når de installeres. I Node/NPM-land kalles disse for "lifecycle scripts" eller "pre/postinstall scripts". Dette er en mekanisme som ofte benyttes av ondsinnede pakker. Svært få pakker trenger _egentlig_ denne funksjonaliteten, og den kan med fordel skrus av. For Node.js gjøres dette ved å legge til linja `ignore-scripts=true` i fila `.npmrc` som man finner i hvert enkelt prosjekt og/eller eller en global fil i `$HOME`.

Noen JavaScript-runtimes har allerede disablet lifecycle scripts som default, i skrivende stund gjelder dette [pnpm](https://pnpm.io/), [Bun](https://bun.sh/) og [Deno](https://deno.com/).

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
