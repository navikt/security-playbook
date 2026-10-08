const DOC_PREFIX = "sikker-utvikling/";
const INDEX_ID = `${DOC_PREFIX}index`;

const categories = [
  {
    label: "Risiko",
    key: "risiko",
    description: "Vurder risiko og planlegg hva dere gjør når noe går galt.",
    docs: ["trusselmodellering", "tryggnok", "beredskap"],
  },
  {
    label: "Utviklermiljø",
    key: "utviklermiljo",
    description:
      "Sikre utviklermaskinen, verktøyene og avhengighetene du bruker.",
    docs: [
      "klientsikkerhet",
      "seopoisoning",
      "ki",
      "tredjepartskode",
      "supply-chain",
    ],
  },
  {
    label: "Bygg og drift",
    key: "bygg-og-drift",
    description: "Sikre kode, bygg og miljøet applikasjonen kjører i.",
    docs: ["github", "baseimages", "containere", "webapp"],
  },
  {
    label: "Tilgang",
    key: "tilgang",
    description: "Styr hvem som får tilgang, og beskytt hemmelighetene.",
    docs: ["tilgangsstyring", "hemmeligheter", "m2m"],
  },
  {
    label: "App-sikkerhet",
    key: "app-sikkerhet",
    description: "Håndter input, filer og trafikk som kan skade applikasjonen.",
    docs: ["inputvalidering", "filopplasting", "ddos"],
  },
  {
    label: "Logging",
    key: "logging",
    description:
      "Logg hendelser, oppslag og endringer uten å lekke personopplysninger.",
    docs: ["logging", "oppslagslogg", "auditlogg_db_endring", "juridisk_logg"],
  },
  {
    label: "Testing",
    key: "testing",
    description: "Finn sårbarheter i kildekoden og i applikasjoner som kjører.",
    docs: ["kodeanalyse", "dynamiskanalyse", "pentesting"],
  },
];

function groupTopics(items) {
  const topics = new Map();
  for (const item of items) {
    if (item.type !== "doc") {
      throw new Error(
        "Secure development topics must be document sidebar items.",
      );
    }
    if (topics.has(item.id)) {
      throw new Error(`Duplicate secure development topic: ${item.id}`);
    }
    topics.set(item.id, item);
  }

  const grouped = categories.map(({ label, key, description, docs }) => ({
    type: "category",
    label,
    description,
    collapsible: true,
    collapsed: true,
    customProps: { overviewId: key },
    items: docs.map((name) => {
      const id = `${DOC_PREFIX}${name}`;
      const item = topics.get(id);
      if (!item) {
        throw new Error(`Missing or duplicate secure development topic: ${id}`);
      }
      topics.delete(id);
      return item;
    }),
  }));

  if (topics.size > 0) {
    throw new Error(
      `Uncategorized secure development topics: ${[...topics.keys()].join(", ")}. Add them to src/secure-development-sidebar.js.`,
    );
  }

  return grouped;
}

module.exports = async function secureDevelopmentSidebar({
  defaultSidebarItemsGenerator,
  ...args
}) {
  const sidebar = await defaultSidebarItemsGenerator(args);

  function group(items) {
    return items.map((item) => {
      if (item.type !== "category") {
        return item;
      }
      if (item.link?.type === "doc" && item.link.id === INDEX_ID) {
        return { ...item, items: groupTopics(item.items) };
      }
      return { ...item, items: group(item.items) };
    });
  }

  return group(sidebar);
};
