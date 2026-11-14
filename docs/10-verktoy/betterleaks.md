---
title: Betterleaks
description: Stopp commits som kan inneholde hemmeligheter, med en lokal pre-commit-hook.
tags:
  - hemmeligheter
---

**Relevant tema:** [Hemmeligheter](/docs/sikker-utvikling/hemmeligheter)

[Betterleaks](https://github.com/betterleaks/betterleaks) søker etter mulige hemmeligheter, som passord, tokens og private nøkler. En lokal `pre-commit`-hook i Git kan stoppe en hemmelighet før den havner i Git-historikken.

Bruk dette som et ekstra sikkerhetstiltak, ikke som en erstatning for [GitHub secret scanning og push protection](/docs/verktoy/github-advanced-security). Lokale hooks kan omgås og blir ikke installert når du kloner et repo. De dekker heller ikke commits som du gjør på GitHub eller i klienter som hopper over hooks.

## Installer Betterleaks

Denne oppskriften bruker **Betterleaks v1**. Flaggene for skanningen er kontrollert mot v1.10.1. Betterleaks v2 endrer hvordan du skanner endringer som er lagt til med `git add`. Ikke bytt til v2 uten å oppdatere skannekommandoen. Se [migreringsveiledningen fra Betterleaks](https://github.com/betterleaks/betterleaks/blob/main/docs/v2_migration.md).

Alle shell-kommandoene nedenfor kjøres i en POSIX-kompatibel shell, for eksempel Bash eller Zsh på Linux og macOS. **På Windows bruker du Git Bash**, som følger med [Git for Windows](https://gitforwindows.org/). Du trenger ikke WSL. Hooken er et shell-skript også på Windows, ikke et PowerShell-skript.

### macOS

Installer v1 med Homebrew:

```bash
brew install --cask betterleaks/tap/betterleaks@1
betterleaks-v1 version
```

### Linux

Last ned og pakk ut en v1-release for Linux fra [Betterleaks sine offisielle releaser](https://github.com/betterleaks/betterleaks/releases). Velg arkitekturen som passer maskinen din, vanligvis x64 eller ARM64.

Kjør følgende fra katalogen med den utpakkede binærfilen:

```bash
mkdir -p "$HOME/.local/bin"
install -m 755 ./betterleaks "$HOME/.local/bin/betterleaks-v1"
export PATH="$HOME/.local/bin:$PATH"
betterleaks-v1 version
```

Vi bruker navnet `betterleaks-v1` for å ha samme kommando på alle plattformene. Legg også katalogen til i `PATH` i shell-oppsettet ditt, slik at nye terminaler finner programmet.

### Windows

Installer Git for Windows hvis du ikke allerede har det. Last ned og pakk ut en v1-release for Windows fra [Betterleaks sine offisielle releaser](https://github.com/betterleaks/betterleaks/releases). Velg arkitekturen som passer maskinen din.

Gi `betterleaks.exe` navnet `betterleaks-v1.exe`, og legg filen i en fast katalog, for eksempel `C:\Users\<brukernavn>\bin`. Legg denne katalogen til i brukervariabelen `Path` gjennom Windows sine innstillinger for miljøvariabler. Ikke legg selve filnavnet til i `Path`.

Åpne Git Bash på nytt, og kontroller at programmet er tilgjengelig:

```bash
betterleaks-v1 version
```

Git Bash finner `.exe`-filen uten at du skriver filendelsen. Start også IDE-en på nytt hvis den var åpen da du endret `Path`.

## Sett opp hooken

Oppsettet gjelder **ett lokalt repo**. Gjenta det for hvert repo du vil beskytte.

Sjekk først om repoet allerede har et hook-oppsett. Kjør kommandoene fra rotkatalogen i repoet:

```bash
git config --show-origin --get core.hooksPath
git rev-parse --git-path hooks/pre-commit
```

Den første kommandoen skriver ikke ut noe hvis `core.hooksPath` ikke er satt. Den andre skriver ut filstien til hooken.

:::caution Behold eksisterende hooks
Hvis repoet bruker Husky, pre-commit-rammeverket eller et annet verktøy som administrerer hooks, må du legge til sjekken gjennom det oppsettet. Ikke erstatt hooken som verktøyet har generert. Med Husky legger du sjekken i `.husky/pre-commit`, før de eksisterende sjekkene, ikke i `.husky/_/pre-commit`.

Har du en eksisterende shell-hook, beholder du de andre sjekkene og legger sjekken nedenfor foran dem. Ikke endre `core.hooksPath` bare for å installere Betterleaks. Det kan deaktivere hookene som repoet allerede bruker.
:::

Hvis repoet ikke bruker et verktøy som administrerer hooks, oppretter eller redigerer du `pre-commit`-filen på filstien du fikk ovenfor. Filen skal hete `pre-commit` uten filendelse, ikke `.sh`, `.ps1` eller `.txt`.

Lagre filen som **UTF-8 uten BOM og med LF-linjeskift**, også på Windows. Bruk hele skriptet for en ny hook. Utvider du en eksisterende shell-hook, beholder du shebang-linjen og legger bare til `if ... fi`-blokken:

```sh
#!/bin/sh

if [ "${SKIP_BETTERLEAKS:-}" = "1" ]; then
    printf '%s\n' 'ADVARSEL: Hopper over Betterleaks for denne commiten. Andre sjekker kjører fortsatt.' >&2
elif ! command -v betterleaks-v1 >/dev/null 2>&1; then
    printf '%s\n' 'Commit stoppet: Finner ikke betterleaks-v1 i PATH. Installer programmet og prøv igjen.' >&2
    exit 1
elif ! betterleaks-v1 git . --pre-commit --staged --redact --verbose; then
    cat >&2 <<'MESSAGE'
Commit stoppet: Betterleaks fant en mulig hemmelighet eller kunne ikke fullføre skanningen.
Les resultatet ovenfor. Fjern ekte hemmeligheter og legg til de rettede filene med git add.
Bare ved et bekreftet falskt positivt funn kan du gjenta commit-kommandoen med:
  SKIP_BETTERLEAKS=1 git commit ...
Dette hopper bare over Betterleaks for denne kjøringen. Ikke eksporter variabelen.
Bruk aldri dette til å committe en ekte hemmelighet.
MESSAGE
    exit 1
fi
```

Gjør en manuelt installert hook kjørbar. På Windows kjører du også dette i Git Bash:

```bash
chmod +x "$(git rev-parse --git-path hooks/pre-commit)"
```

Sjekken skanner **endringer som er lagt til med `git add`**, også før den første commiten. Den skanner ikke hele arbeidskatalogen eller Git-historikken. Dette fungerer også når du bare har lagt til deler av en fil. En rettelse som du ikke har lagt til med `git add`, skjuler ikke en hemmelighet som fortsatt ligger klar til commit.

Hooken stopper commiten ved funn, hvis skanneren mangler, eller hvis skanningen feiler. Skanningen skjuler verdiene den finner i utskriften, og aktiverer ikke validering mot eksterne tjenester.

Hvis du committer fra en IDE, må skanneren også ligge i IDE-ens `PATH`. Rett opp miljøet i IDE-en hvis programmet mangler, i stedet for å omgå sjekken til vanlig.

## Kontroller oppsettet

Legg til en ufarlig endring med `git add`, og kjør skanningen direkte:

```bash
betterleaks-v1 git . --pre-commit --staged --redact --verbose
```

Test at skanneren finner hemmeligheter i et midlertidig repo med hooken installert. Lag en fil med et **oppdiktet token som ikke virker**, men som matcher en av de [innebygde reglene](https://github.com/betterleaks/betterleaks/blob/v1.x/config/betterleaks.toml). Legg til filen med `git add`, og forsøk å committe. Hooken skal stoppe commiten og skrive ut advarselen om hvordan du kan omgå sjekken. Bruk aldri ekte hemmeligheter til testing.

Fjern testfilen fra både indeksen og arbeidskatalogen etterpå. En direkte skanning kontrollerer skanneren. Et commit-forsøk kontrollerer også at Git faktisk kjører hooken.

## Håndter funn og falske positiver

Hvis funnet er en ekte hemmelighet, fjerner du den fra filen og legger til den rettede versjonen med `git add` før du prøver igjen. Har hemmeligheten allerede havnet i Git-historikken, må du regne den som kompromittert og følge [rådene ved lekkasje](/docs/sikker-utvikling/hemmeligheter#ved-lekkasje). Det er ikke nok å slette den i en senere commit.

:::warning Omgå sjekken bare etter at du har vurdert funnet
Hvis du har bekreftet at funnet ikke er en ekte hemmelighet, setter du `SKIP_BETTERLEAKS=1` foran den opprinnelige commit-kommandoen. På Windows kjører du kommandoen i Git Bash, ikke i PowerShell eller cmd:

```bash
SKIP_BETTERLEAKS=1 git commit -m "Legg til testdata uten hemmeligheter"
```

Dette hopper over Betterleaks-sjekken for denne kjøringen og skriver ut en advarsel. De andre sjekkene i hooken kjører fortsatt.

Unngå `git commit --no-verify`. Den hopper over hele pre-commit-hooken og commit-msg-hooken, ikke bare Betterleaks. Det finnes ingen tilsvarende `git commit --force` for å overstyre sjekken. Selv om du omgår den lokale sjekken, gjelder fortsatt GitHub push protection og sjekker på serveren.
:::

Ved gjentatte falske positiver bør dere lage et avgrenset unntak i [konfigurasjonen for Betterleaks v1](https://github.com/betterleaks/betterleaks/blob/v1.x/docs/config.md). Få unntaket gjennomgått, og forklar hvorfor verdien er ufarlig. Ikke slå av skanning for en hel katalog eller regel bare for å fjerne ett funn.

Denne hooken bruker de innebygde reglene som standard. Betterleaks v1.10.1 laster ikke inn konfigurasjon fra repoet automatisk. Velg derfor en eventuell gjennomgått konfigurasjonsfil eksplisitt med `--config`.
