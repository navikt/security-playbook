---
title: zizmor
description: Scanning av Github actions
tags:
  - actions
---

# zizmor

**Relevante tema:**

- [Statisk analyse](../sikker-utvikling/kodeanalyse)

[zizmor](https://woodruffw.github.io/zizmor) er et statisk analyseverktøy for GitHub Actions.
Den kan finne mange vanlige sikkerhetsproblemer i GitHub Actions.

Man kan installere og kjøre zizmor lokalt:

```bash
brew install zizmor

zizmor .github/workflows/main.yml
```

Eller man kan legge det til i din GitHub Actions-workflow for å få det inn i Security tabben der.

```zizmor
name: zizmor GitHub Actions Security Analysis

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["**"]

jobs:
  zizmor:
    name: zizmor latest via PyPI
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      # required for workflows in private repositories
      contents: read
      actions: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
        with:
          persist-credentials: false

      - name: Install the latest version of uv
        uses: astral-sh/setup-uv@v5

      - name: Run zizmor
        run: uvx zizmor --format sarif . > results.sarif
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
          category: zizmor
```

```mdx-code-block
import UnderArbeid from '../07-sikker-utvikling/\_under-arbeid.mdx'

<UnderArbeid />
```
