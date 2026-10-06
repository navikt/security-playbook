const { createRequire } = require("node:module");

// Reuse Docusaurus's installed parsers without relying on pnpm hoisting.
const requireFromDocusaurus = createRequire(
  require.resolve("@docusaurus/core/package.json"),
);
const requireFromUtils = createRequire(
  requireFromDocusaurus.resolve("@docusaurus/utils"),
);
const matter = requireFromUtils("gray-matter");
const requireFromMatter = createRequire(
  requireFromUtils.resolve("gray-matter"),
);
const yaml = requireFromMatter("js-yaml");

function parseFrontMatter(fileContent) {
  return matter(fileContent, {
    engines: {
      // Keep YAML dates as strings: timestamp parsing can roll invalid days
      // into the next month before event validation sees the original value.
      yaml: (content) => yaml.safeLoad(content, { schema: yaml.JSON_SCHEMA }),
    },
  }).data;
}

module.exports = { parseFrontMatter };
