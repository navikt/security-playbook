const PRACTICES = [
  {
    id: "nais-defaults",
    short: "Bruk Nais-standarder",
    why: "Plattformen gir deg auth, nettverk og secrets med sikre standardvalg.",
    cat: "Plattform",
    href: "https://doc.nais.io/",
    action: {
      kind: "list",
      items: [
        "Bruk Nais-dokumentasjonen og standardinnstillingene som utgangspunkt.",
        "Bruk plattformens støtte for auth og nettverk fremfor egne mekanismer.",
        "La runtime få hemmeligheter fra plattformen, ikke fra lokale filer.",
      ],
    },
    antiPattern: {
      kind: "list",
      items: [
        "Ikke bygg egen auth-flyt når NAIS allerede støtter behovet.",
        "Ikke håndter prod-hemmeligheter manuelt utenfor plattformen.",
      ],
    },
  },
  {
    id: "client-credentials",
    short: "Bruk client credentials",
    why: "Kortlevde tokens er tryggere enn servicebrukere og manuelt håndterte passord.",
    cat: "Identitet",
    href: "/docs/sikker-utvikling/m2m",
    action: {
      kind: "list",
      items: [
        "Bruk OAuth Client Credentials Flow for maskin-til-maskin-kall.",
        "Hent hemmeligheter dynamisk fra miljøvariabler eller filer levert av runtime.",
        "Bruk støtten som finnes i NAIS og Entra ID.",
      ],
    },
    antiPattern: {
      kind: "list",
      items: [
        "Ikke bruk servicebrukere med langlivede passord.",
        "Ikke bruk den gamle STS-løsningen i nye oppsett.",
      ],
    },
  },
  {
    id: "local-secrets",
    short: "Hold hemmeligheter ute av lokale filer",
    why: "En kompromittert utviklermaskin undergraver resten av verdikjeden.",
    cat: "Hemmeligheter",
    href: "/docs/sikker-utvikling/hemmeligheter",
    action: {
      kind: "code",
      file: "lokal oppstart",
      lang: "bash",
      code: [
        "MY_PW=$(op read op://vault/entry/field)",
        'op run --env-file="my.env" -- node myapp.js',
      ].join("\n"),
    },
    antiPattern: {
      kind: "code",
      file: ".env",
      lang: "dotenv",
      code: ["NPM_TOKEN=ghp_plaintext_token", "DB_PASSWORD=prod-passord"].join(
        "\n",
      ),
    },
  },
  {
    id: "package-manager-hardening",
    short: "Herd pakkebehandleren",
    why: "Stopper vanlige supply chain-angrep før de når prosjektet ditt.",
    cat: "Avhengigheter",
    href: "/docs/sikker-utvikling/supply-chain",
    action: {
      kind: "code",
      file: "~/.npmrc",
      lang: "ini",
      code: [
        "@navikt:registry=https://npm.pkg.github.com",
        "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}",
        "ignore-scripts=true",
        "min-release-age=3",
      ].join("\n"),
    },
    antiPattern: {
      kind: "code",
      file: "~/.npmrc",
      lang: "ini",
      code: [
        "@navikt:registry=https://npm.pkg.github.com",
        "//npm.pkg.github.com/:_authToken=ghp_plaintext_token",
        "ignore-scripts=false",
      ].join("\n"),
    },
  },
  {
    id: "github-hardening",
    short: "Herd GitHub Actions",
    why: "Reduserer risiko i repo, CI og deployflyt.",
    cat: "Kildekode",
    href: "/docs/sikker-utvikling/github",
    action: {
      kind: "list",
      items: [
        "Pin tredjeparts-actions til commit SHA.",
        "Sett minimum permissions i workflowene dine.",
        "Kjør zizmor mot `.github/workflows`.",
        "Legg til schedule på sikkerhetsrelevante scans.",
      ],
    },
    antiPattern: {
      kind: "list",
      items: [
        "Ikke bruk brede PAT-er når `GITHUB_TOKEN` eller GitHub App holder.",
        "Ikke bruk mutable tredjeparts-tags når du kan pinne commit SHA.",
        "Ikke gi `write-all` hvis workflowen bare trenger å lese og teste.",
        "Unngå overprivilegerte triggere som `pull_request_target` og `workflow_run` uten en veldig bevisst vurdering.",
      ],
    },
  },
  {
    id: "dependabot-cooldown",
    short: "Slå på Dependabot med cooldown",
    why: "Gir jevne oppdateringer og bedre signal på faktiske problemer.",
    cat: "Avhengigheter",
    href: "/docs/verktoy/dependabot",
    action: {
      kind: "code",
      file: ".github/dependabot.yaml",
      lang: "yaml",
      code: [
        "version: 2",
        "updates:",
        "  - package-ecosystem: github-actions",
        '    directory: "/"',
        "    schedule:",
        "      interval: daily",
        "    cooldown:",
        "      default-days: 3",
      ].join("\n"),
    },
  },
  {
    id: "docker-build-push",
    short: "Bygg med docker-build-push",
    why: "Du får SBOM og provenance uten ekstra arbeid.",
    cat: "Bygg",
    href: "https://doc.nais.io/build/",
    action: {
      kind: "code",
      file: ".github/workflows/build.yml",
      lang: "yaml",
      code: [
        "- uses: nais/docker-build-push@aed4d69de423d70d995a9fac4bb00dedb7b00f91",
        "  with:",
        "    team: my-team",
        "    identity_provider: ${{ secrets.NAIS_WORKLOAD_IDENTITY_PROVIDER }}",
      ].join("\n"),
    },
    antiPattern: {
      kind: "list",
      items: [
        "Ikke skru av SBOM eller SLSA når standardoppsettet allerede gir dette.",
      ],
    },
  },
  {
    id: "distroless-images",
    short: "Bruk distroless baseimages",
    why: "Mindre image gir mindre angrepsflate og færre sårbarheter.",
    cat: "Bygg",
    href: "/docs/verktoy/chainguard-dockerimages",
    action: {
      kind: "code",
      file: "Dockerfile",
      lang: "docker",
      code: [
        "FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21",
        'ENV TZ="Europe/Oslo"',
        "COPY target/app.jar app.jar",
        'CMD ["-jar","app.jar"]',
      ].join("\n"),
    },
  },
  {
    id: "validate-input",
    short: "Valider input i frontend og backend",
    why: "Uvalidert input er en enkel vei til injeksjon og feil data.",
    cat: "Kode",
    href: "/docs/sikker-utvikling/inputvalidering",
    action: {
      kind: "list",
      items: [
        "Bruk innebygde typer for tall, datoer, enum og e-postadresser.",
        "Lag en allow-liste for gyldige tegn i tekstfelt.",
        "Valider i backend selv om frontend allerede validerer.",
      ],
    },
    antiPattern: {
      kind: "code",
      file: "React",
      lang: "jsx",
      code: "return <div dangerouslySetInnerHTML={{ __html: userInput }} />;",
    },
  },
  {
    id: "sensitive-logging",
    short: "Hold sensitiv info ute av loggene",
    why: "Åpne logger er ikke et sted for FNR, tokens eller prod-hemmeligheter.",
    cat: "Drift",
    href: "/docs/sikker-utvikling/logging",
    action: {
      kind: "list",
      items: [
        "Logg bare det som er nødvendig for feilsøking.",
        "Bruk team logs eller secure logs for skjermede data.",
        "POST queries med sensitiv info i stedet for å legge dem i URL-er.",
      ],
    },
    antiPattern: {
      kind: "list",
      items: [
        "Ikke logg FNR, aktørId, IP-adresser eller JWT-er i åpen logg.",
        "Ikke send sensitiv info i URL-er eller headere som lett logges av mellomledd.",
      ],
    },
  },
];

module.exports = {
  PRACTICES,
};
