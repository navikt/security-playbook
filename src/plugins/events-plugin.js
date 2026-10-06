const fs = require("fs");
const path = require("path");
const { parseFrontMatter } = require("./event-frontmatter");
const { normalizeEvents, createFeed } = require("./normalize-events");

const EVENTS_DIR = path.join(__dirname, "../../docs/11-events");

module.exports = function eventsPlugin({ siteConfig }) {
  let events;
  return {
    name: "events-plugin",
    async contentLoaded({ actions }) {
      const files = fs
        .readdirSync(EVENTS_DIR)
        .filter((f) => f.endsWith(".md") && f !== "index.md")
        .sort();

      const items = files.map((filename) => {
        const docId = filename.replace(/\.md$/, "");
        const raw = fs.readFileSync(path.join(EVENTS_DIR, filename), "utf8");
        const frontmatter = parseFrontMatter(raw);
        const customProps = frontmatter.sidebar_custom_props ?? {};

        return {
          docId,
          label: frontmatter.title ?? docId,
          customProps,
          source: `docs/11-events/${filename}`,
        };
      });

      const extraEvents = JSON.parse(
        fs.readFileSync(path.join(EVENTS_DIR, "arrangementer.json"), "utf8"),
      );
      events = normalizeEvents({
        items,
        extraEvents,
        siteUrl: siteConfig.url,
        baseUrl: siteConfig.baseUrl,
      });
      actions.setGlobalData({ events });
    },
    async postBuild({ outDir }) {
      await fs.promises.writeFile(
        path.join(outDir, "events.json"),
        `${JSON.stringify(createFeed(events), null, 2)}\n`,
      );
    },
  };
};
