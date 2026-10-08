# Security Playbook 🔐

> «Hvordan vi utvikler sikker software i Nav IT»

Playbooken er helt åpen for verden, men innholdet er primært laget av og for utviklere i Nav. [Sikkerhet Nav](https://sikkerhet.nav.no)

## Hvem kan bidra? 🤔

Alle! 🥳 Utviklere i Nav har full skrivetilgang til koden, og kan selv endre alt.
For andre er det bare å sende inn en Pull Request! 😀

Innholdet har kun verdi dersom det holdes oppdatert og relevant,
så det er viktig at det er så lav terskel som mulig å komme med oppdateringer. 💪

### Hvem er målgruppen?

Utviklere og andre som driver med sikkerhet i produktutvikling i Nav er hovedmålgruppen til playbooken, men det legges til rette for at innholdet kan benyttes enda bredere.

### Kan jeg publisere Nav-intern/hemmelig informasjon?

Nei, ikke direkte. Playbooken er tilgjengelig for hele verden, så ikke-offentlig informasjon må holdes utenfor. Men det er greit å lenke videre til interne sider bak innlogging fra playbooken!

### Har du flere spørsmål? 🙋

Still gjerne spørsmål om playbooken i Slack-kanalen `#security-champion` 😃

## Utvikling

Nettsiden er laget med [Docusaurus 3](https://docusaurus.io/), en moderne «statisk side»-generator.

De fleste endringene kan gjøres direkte fra GitHub, ved å trykke `edit this file` direkte fra markdown-filene.

Dersom du ønsker å gjøre større endringer, anbefales det å starte applikasjonen lokalt.

### Lokal utvikling

- Krever `node` versjon `>= 22`.
- Anbefaler `pnpm` versjon `>= 10.11.0`

#### Installer lokalt

```console
pnpm install --frozen-lockfile
```

##### Kjør playbooken lokalt i utviklingsmodus

```console
pnpm start
```

**NB**: Ikke alle funksjoner fungerer i utviklingsmodus. Bl.a. søk krever at du i stedet bygger playbooken.

#### Bygg og start en komplett versjon av playbooken

```console
pnpm run build
pnpm run serve
```

### Kategorier for sikker utvikling

`src/secure-development-sidebar.js` definerer kategoriene og rekkefølgen for
sikker utvikling. Sidefeltet og temaoversikten bruker samme inndeling.
Når du legger til en temaside i `docs/08-sikker-utvikling`, må du også legge
dokumentnavnet uten filendelse i en kategori. Manglende eller dupliserte
oppføringer stopper bygget. Artikkelfilene trenger ikke flyttes eller gis nye URL-er.

Kjør `pnpm run test:navigation` for å sjekke inndelingen.

### Statisk arrangementsfeed

Produksjonsbygget publiserer `/events.json` med `schemaVersion: 1` og en
`events`-liste. Hvert arrangement har `id`, `title`, `startDate`, `endDate`,
`audience` og en absolutt `url`. Listen inneholder både tidligere og kommende
arrangementer, sortert etter `startDate` og deretter `id`.

Kalenderen og feeden bruker de samme metadataene fra Markdown-filene i
`docs/11-events` (unntatt `index.md`) og `arrangementer.json`. Markdown bruker
`sidebar_custom_props.startDate`, deretter `date`, deretter en full dato i
filnavnet. Sluttdatoen er `endDate`, deretter `date`, deretter startdatoen.
JSON bruker `startDate` eller `date`, med samme rekkefølge for sluttdatoen.
Datoer må være gyldige og fullstendige (`YYYY-MM-DD`); manglende datoer,
ugyldige datoer og omvendte datointervaller stopper bygget med kildehenvisning.
Innholdet i Markdown eksporteres ikke.

Feed-ID-er har prefikset `playbook:` for dokument-ID-er og `external:` for
JSON-oppføringer. Gi hver ny JSON-oppføring en unik, varig `id`, også når årlige
arrangementer deler URL. Behold ID-en når du retter tittel, dato eller URL.
Dupliserte ID-er og URL-er som ikke bruker HTTP(S), stopper bygget.

`events.json` skrives direkte til byggmappen i pluginens `postBuild`-hook.
Den genereres ikke av `pnpm start`. Kjør `pnpm run build` og `pnpm run serve`
for å lese feeden lokalt. `pnpm run test:events` kjører testene for metadata,
feed og kalender uten å bygge hele nettstedet.
