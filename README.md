# Security Playbook 🔐

> «Hvordan vi utvikler sikker software i NAV IT»

Playbooken er laget av og for utviklere i NAV, og kan besøkes her: [Sikkerhet NAV](https://sikkerhet.nav.no)

## Hvem kan bidra? 🤔

Alle! 🥳 Utviklere i NAV har full skrivetilgang til koden, og kan selv endre alt. For andre er det bare å sende inn en Pull Request! 😀

Innholdet har kun verdi dersom det holdes oppdatert og relevant,
så det er viktig at det er så lav terskel som mulig å komme med oppdateringer. 💪

### Har du flere spørsmål? 🙋

Still gjerne spørsmål om playbooken i Slack-kanalen `#security-champion` 😃

## Utvikling

Nettsiden er laget med [Docusaurus 2](https://docusaurus.io/), en moderne «statisk side»-generator.

De fleste endringene kan gjøres direkte fra GitHub, ved å trykke `edit this file` direkte fra markdown-filene.

Dersom du ønsker å gjøre større endringer, anbefales det å starte applikasjonen lokalt.

### Lokal utvikling

Krever `node` versjon `>= 16`.

#### Installer lokalt

```console
$ npm install
```

##### Kjør playbooken lokalt i utviklingsmodus

```console
$ npm start
```

**NB**: Ikke alle funksjoner fungerer i utviklingsmodus. Bl.a. søk krever at du i stedet bygger playbooken.

#### Bygg og start en komplett versjon playbooken

```console
$ npm run build
$ npm run serve
```
