---
title: Valg av baseimage
description: Grunnmuren avgjør huset, velger du feil blir det bare gruset 🏠.
tags:
  - containere
---

## Generelt

Man kan redusere angrepsflaten sin betydelig ved å basere appen sin på et minimalt baseimage. Jo færre verktøy du har i containeren din, jo mindre spillerom har en angriper til å få fotfeste og eskalere sine rettigheter. En stor bonus er i tillegg at det ofte fører til betydlig mindre støy i form av sårbarheter som må analyseres.

## Chainguard

I Nav betaler vi for Chainguard images som er minimale images med ekstra sikkerhetstiltak. Her får du distroless images med (nesten alltid) null sårbarheter.

Du finner mer informasjon om hvordan ta i bruk Chainguard i [Chainguard docker images](/docs/verktoy/chainguard-dockerimages).

## Migrering fra navikt/baseimages

De gamle [navikt-imagene](https://github.com/navikt/baseimages/) er avviklet og vedlikeholdes ikke lenger.

Mange tror at det er vanskelig og/eller veldig tidkrevende å migrere over til nye og skinnende "distroless" images, men det er det faktisk ikke. Vi har derfor satt sammen en liste over de største forskjellene, og hvordan man bytter over fra gammelt til nytt.

<details>
<summary>Hemmeligheter fra Vault</summary>
<p>
  [Nais](https://doc.nais.io/workloads/application/reference/application-spec/?h=vault#vault) injecter hemmeligheter fra Vault som filer. `navikt` base-images har et shellscript som leser disse filene og lager miljøvariabler av innholdet. Her har man to muligheter:
  - Endre i appen sånn at hemmeligheter leses fra filer istedenfor miljøvariabler. 
  - Flytt hemmelighetene over til [Console](https://console.nav.cloud.nais.io/). De vil da automatisk injiseres som miljøvariabler i poden. Dette er den anbefalte løsningen.
  - Hemmeligheter for on-prem Postgres funker som før, ingen endringer kreves.
</p>
</details>

<details>
<summary>Sertifikater til FSS web proxy m/venner</summary>
<p>
  Disse sertifikatene injiseres automatisk fra plattformen inn i poden din, du trenger ikke å gjøre noe som helst 😎
</p>
</details>

<details>
<summary>Andre miljøvariabler (proxy options m/venner)</summary>
<p>
  Alle "ikke-hemmelige" miljøvariabler, feks `JAVA_OPTS` e.l., kan spesifiseres i [app-manifestet](https://doc.nais.io/workloads/application/reference/application-spec/#env). Her er det også muligheter for [templating](https://doc.nais.io/operate/cli/reference/validate/#templating) sånn at de kan få forskjellig innhold for dev og prod.

Bruker du webproxy og får nettverksfeil er årsaken ofte at JVMen ikke får med seg injecta proxy-options. En enkel løsning er å legge til følgende i din nais.yaml-fil.

```yaml
- name: JDK_JAVA_OPTIONS
  value: $(JAVA_PROXY_OPTIONS)
```

Ref: [Nais webproxy dokumentasjon](https://docs.nais.io/workloads/reference/webproxy/#java)

</p>
</details>

<details>
<summary>Filrettigheter</summary>
<p>
Husk at applikasjoner på nais kjører som user/group 1069 (Ref: [Nais docs](https://doc.nais.io/workloads/reference/container-security/)).
Hvis du for eksempel skal kopiere in en fil som applikasjonen skal lese er det viktig att du setter riktige rettigheter på filen.
Du kan kopiere in en fil med riktige rettigheter med `COPY --chown=1069:1069 fil /path/to/fil`.
</p>
</details>

<details>
<summary>Forskjell på CMD & ENTRYPOINT</summary>
<p>
I navikt/baseimages er ENTRYPOINT konfigurert for å kjøre en app.jar-fil. Det betyr at så lenge du kopierer inn en jar-fil rett sted i dockerimaget starter applikasjonen.

I google distroless og chainguard images er det enten java -jar eller kun java. Ved en migrering må du endre i Dockerfile og legge til en CMD for å finne riktig jar-fil.

For chainguard blir dette f.eks. `CMD ["-jar", "/path/to/app.jar"]`

</p>
</details>

<details>
<summary>Bash-script med initialiserings script</summary>
<p>
Noen applikasjoner har et bash-script som kjører før applikasjonen starter. Dette kan være for å sette opp miljøet, kjøre migreringer eller andre oppgaver.

En måte å bli kvitt dette på er å endre applikasjonen slik at den håndterer dette selv. Det enkleste er ofte å migrere hemmelighetene over til Nais Console/Secrets og sette dem som miljøvariabler i app-manifestet. Hvis du trenger en fil eller annet format som ikke passer i Console kan du ofte løse den samme operasjonen direkte i applikasjonen i stedet for å kjøre et bash-script.

Eksempel for Python:

```python
def copy_license():
    license_source = Path("/var/run/secrets/license/secret-license.lic")
    license_destination = Path(
        "/app/venv/lib/python3.12/site-packages/my-package/license/my-license.lic"
    )

    if license_source.exists():
        try:
            # Resolve any symlinks and copy the actual file
            resolved_source = license_source.resolve()
            shutil.copy2(resolved_source, license_destination)
        except Exception as e:
            print(f"Warning: Failed to copy license file: {e}")
    else:
        print("License file not found, skipping copy")
```

</p>
</details>

<br />
```mdx-code-block
import SavnerDuNoe from '/common/\_savner_du_noe.mdx';

<SavnerDuNoe />
```
