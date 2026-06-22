---
title: Tredjepartskode
description: 📦 Andres kode trenger ikke gi deg vondt i hodet.
---

Vi drar stadig flere tredjepartsavhengigheter inn i koden vår. Disse avhengighetene har gjerne selv avhengigheter, som igjen har avhengigheter, og så videre. Noen estimater sier at så mye som 85% av koden i en typisk applikasjon (i den grad det finnes typiske applikasjoner) er skrevet av andre enn oss selv. Denne koden har (som all annen kode) feil og sårbarheter. Ulike <abbr title="Open-source software">OSS</abbr>-prosjekter har ulike strukturer og arbeidsformer. Noen av dem forlates, andre overtas av mennesker som ikke har like gode hensikter som de forrige.

### Transitive avhengigheter

Det fleste pakkehåndterere har en mekanisme for å oppdatere transitive/indirekte avhengigheter. 
Dette kan være nødvendig for å få inn viktige sikkerhetsoppdateringer.
Her er hvordan man gjør dette i noen av de mest populære pakkehåndtererne:

<details>
<summary>npm</summary>

## npm update

Kjør `npm update` for å oppdatere alle avhengigheter til de nyeste versjonene.
For mere kontroll kan du spesifisere en pakke, for eksempel `npm update sårbart-bibliotek` for å tvinge oppdatering av denne.

## Overrides

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

Disse kan scanne prosjektene dine jevnlig etter avhengigheter med kjente sårbarheter og varsle dere i form av meldinger på Slack/epost eller ved å lage pull requests som oppdaterer de sårbare versjonene.

## Plugins i ymse verktøy

Veldig mange utviklerverktøy har en eller annen mekanisme for å utvide funksjonaliteten med plugins. Regimet rundt håndteringen av disse pluginsene kan variere veldig fra produkt til produkt. Man kan ha få plugins som må gjennom godkjennelsesprosesser for å bli tatt inn i varmen, eller man kan slippe communityet løs helt uten noen former for kontroll. Når man tar i bruk en plugin tillater man i praksis vilkårlig kjøring av kode man vet svært lite om, så litt "due dilligence" er absolutt å anbefale.

### Due dilligence

Før man tar i bruk plugins er det viktig å kjøre en mini-trusselvurdering. Hvilken kontekst skal denne koden kjøre i, og hvilken informasjon har den potensielt tilgang til? Hva er "worst case" hvis en plugin går "rogue"? Hvem har laget den? Hva slags aktivitet har det vært i GitHub-repoet den siste tiden? Gjør et lite søk etter kjente sårbarheter på Google og på steder som [Snyk](https://security.snyk.io/), [VulDB](https://vuldb.com) eller [Mitre](https://cve.mitre.org/cve/search_cve_list.html)

### Begrense handlingsrommet til tredjeparter

I noen pakke-økosystemer er det lagt opp til at pakker skal kunne kjøre vilkårlige shellscripts når de installeres. I Node/NPM-land kalles disse for "lifecycle scripts" eller "pre/postinstall scripts". Dette er en mekanisme som ofte benyttes av ondsinnede pakker. Svært få pakker trenger _egentlig_ denne funksjonaliteten, og den kan med fordel skrus av. For Node.js gjøres dette ved å legge til linja `ignore-scripts=true` i fila `.npmrc` som man finner i hvert enkelt prosjekt og/eller eller en global fil i `$HOME`.

Noen JavaScript-runtimes har allerede disablet lifecycle scripts som default, i skrivende stund gjelder dette [pnpm](https://pnpm.io/), [Bun](https://bun.sh/) og [Deno](https://deno.com/).

<br />

```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
