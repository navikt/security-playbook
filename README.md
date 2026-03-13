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
