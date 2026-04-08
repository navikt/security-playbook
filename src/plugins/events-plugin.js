const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const EVENTS_DIR = path.join(__dirname, "../../docs/11-events");

module.exports = function eventsPlugin() {
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
        const { data: frontmatter } = matter(raw);
        const customProps = frontmatter.sidebar_custom_props ?? {};

        return {
          docId,
          label: frontmatter.title ?? docId,
          href: `/docs/events/${docId}`,
          customProps,
        };
      });

      actions.setGlobalData({ items });
    },
  };
};
