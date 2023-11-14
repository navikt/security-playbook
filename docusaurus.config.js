/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Security Playbook",
  tagline: "Hvordan vi utvikler sikker software i NAV",
  url: "https://sikkerhet.nav.no",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/security-champion-logo.ico",
  organizationName: "navikt", // Usually your GitHub org/user name.
  projectName: "security-playbook", // Usually your repo name.
  i18n: {
    defaultLocale: "no",
    locales: ["no"],
  },
  plugins: [
    [
      require.resolve("docusaurus-lunr-search"),
      {
        languages: ["no"], // language codes
      },
    ],

    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/docs/kom-i-gang",
            to: "/docs/sikker-utvikling/",
          },
          {
            from: "/docs/intro",
            to: "/docs/",
          },
        ],
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: "Security Playbook",
      logo: {
        alt: "Security Playbook",
        src: "img/SecurityChampion.svg",
      },
      items: [
        {
          type: "doc",
          docId: "index",
          position: "left",
          label: "Hva er dette? 📚",
        },
        {
          href: "/docs/sikker-utvikling/",
          position: "left",
          label: "Kom i gang 🚀",
        },
        {
          href: "/docs/verktoy/",
          position: "left",
          label: "Verktøy 🧰",
        },
        {
          href: "/docs/events/",
          position: "left",
          label: "Arrangementer 🎉",
        },
        {
          href: "https://github.com/navikt/security-playbook",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Playbook",
              to: "/docs/",
            },
          ],
        },
        {
          title: "NAV Utvikling",
          items: [
            {
              label: "Utvikling",
              href: "https://github.com/navikt/utvikling",
            },
            {
              label: "Nais",
              href: "https://doc.nais.io",
            },
            {
              label: "«Security Champion»-redaksjonen",
              href: "https://teamkatalog.nav.no/team/b5915f11-0740-4a2e-b767-6ac5c407e9c7",
            },
          ],
        },
        {
          title: "Nyttige kilder",
          items: [
            {
              label: "Security Champions Norge",
              to: "https://securitychampions.no/",
            },
            {
              label: "OWASP",
              to: "https://owasp.org/",
            },
            {
              label: "OWASP Security champions playbook",
              href: "https://github.com/c0rdis/security-champions-playbook",
            },
          ],
        },
      ],
      copyright: `${new Date().getFullYear()} NAV. Built with Docusaurus.\n
      <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      `,
    },
    metadata: [
      {
        name: "keywords",
        content: "sikkerhet, nav, security champions, playbook, community",
      },
    ],
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/navikt/security-playbook/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  clientModules: [require.resolve("./src/modules/amplitude.js")],
};
