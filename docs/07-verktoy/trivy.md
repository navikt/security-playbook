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

([Trivy fra aquasecurity](https://github.com/aquasecurity/trivy)) er omfattende sårbarhetsskanner som er enkel og ta i bruk. 
Ved å integrere Trivy med GitHub Actions kan du skanne Docker-images og laste opp resultatene til Github advanced security for att få alerts i code-scanning seksjonen.

Legg til actionet i ditt workflow ett sted etter du har byggt din docker image.

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
          severity: 'HIGH,CRITICAL'
          limit-severities-for-sarif: true

      - name: Upload results to GitHub Security
        if: inputs.upload-sarif
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy.sarif'
```

Vill du sette opp trivy i ett eget steg må du hente ned imaget med docker pull først, for images fra Google Artifact Registry (GAR) kan det løses slikt:
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

      - name: Pull docker image
        run: docker pull ${{ needs.build.outputs.image }}

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '${{ needs.build.outputs.image }}'
          format: 'sarif'
          output: 'trivy.sarif'
          severity: 'HIGH,CRITICAL'
          limit-severities-for-sarif: true

      - name: Upload results to GitHub Security
        if: inputs.upload-sarif
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy.sarif'
```


```mdx-code-block
import UnderArbeid from '../sikker-utvikling//\_under-arbeid.mdx'

<UnderArbeid />
```

