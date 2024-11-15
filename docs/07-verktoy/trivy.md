---
title: Trivy
description: Scanning av images
tags:
  - tredjepartskode
  - containere
---

# Trivy

**Relevante tema:**

- [Sikkerhet i og rundt containere](../sikker-utvikling/containere)

[Trivy fra aquasecurity](https://github.com/aquasecurity/trivy) er ett verktøy for å finne sårbarheter, hemmeligheter & feilkonfigurasjon.
Ved å integrere Trivy med GitHub Actions kan du skanne Docker-images for sårbarheter & hemmeligheter i både OS og applikasjon samt laste opp resultatene til Github Advanced Security for å få alerts i "Code Scanning"-seksjonen.

Husk att github advanced security finner hemmeligheter i ditt repo men ikke det du bygger in i dine docker images, derfor er det lurt å sette opp en trivy scan for å søke igjenom alle docker images du bygger.

Hvis din container inneholder en JVM-app (Java, Kotlin, Scala m.fl) vil Trivy detektere appens sammensetning ved å se etter `.jar`-filer. Dersom du har pakket appen i en stor "shadow"-jar vil denne logikken brekke, og sårbarheter kan skli under radaren. I disse tilfellene må du ha andre mekanismer i tillegg, feks å generere en SBOM vha Maven eller Gradle plugins og laste denne opp til GitHub slik at avhengighetsgrafen der blir riktig.

:::note
Det kan være lurt å ha en Trivy scan i en ekstra workflow med en [scheduled trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule). Det er fordi det kan dukke opp nye sårbarheter selv når dere ikke gjør kodeendringer. NB: "In a public repository, scheduled workflows are **automatically disabled** when no repository activity has occurred in 60 days".
:::

Legg til `aquasecurity/trivy-action` i din workflow etter stegene der du bygger Docker-imaget:

```trivy
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write # to write sarif
      security-events: write # push sarif to github security
    steps:

      ......
      <checkout, build etc>
      ......

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '${{ env.IMAGE }}'
          format: 'sarif'
          output: 'trivy.sarif'

      - name: Upload results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy.sarif'
```

Hvis du vil du kjøre Trivy i et eget steg må du autentisere mot docker registry for å laste ned imaget.
For images fra Google Artifact Registry (GAR) kan man bruke nais/login for å sette opp GAR credentials som trivy-actionet plukker opp automagisk.

```trivy-gar
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # for nais/login
      actions: read # for private repositories
    outputs:
      image: ${{ steps.docker-push.outputs.image }}
    steps:

      ......
      <checkout, build etc>
      ......

      - uses: nais/docker-build-push@v0
        id: docker-push
          team: my-team
          pull: true
          project_id: ${{ vars.NAIS_MANAGEMENT_PROJECT_ID }}
          identity_provider: ${{ secrets.NAIS_WORKLOAD_IDENTITY_PROVIDER }}

  trivy:
    runs-on: ubuntu-latest
    permissions:
      contents: write # to write sarif
      security-events: write # push sarif to github security
      id-token: write # for nais/login
      actions: read # for private repositories
    steps:
      - uses: actions/checkout@v4
      - uses: nais/login@v0
        with:
          project_id: ${{ vars.NAIS_MANAGEMENT_PROJECT_ID }}
          identity_provider: ${{ secrets.NAIS_WORKLOAD_IDENTITY_PROVIDER }}
          team: my-team

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '${{ needs.build.outputs.image }}'
          format: 'sarif'
          output: 'trivy.sarif'

      - name: Upload results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy.sarif'
```

```mdx-code-block
import UnderArbeid from '../07-sikker-utvikling/\_under-arbeid.mdx'

<UnderArbeid />
```
