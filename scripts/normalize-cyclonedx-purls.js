const fs = require("node:fs");

const sbomPath = process.argv[2] ?? "build/cyclonedx/bom.json";
const sbom = JSON.parse(fs.readFileSync(sbomPath, "utf8"));

if (sbom.bomFormat !== "CycloneDX") {
  throw new Error(`Expected a CycloneDX SBOM in ${sbomPath}`);
}

function removeNpmVcsQualifier(value) {
  if (typeof value === "string" && value.startsWith("pkg:npm/")) {
    const purl = new URL(value);
    purl.searchParams.delete("vcs_url");
    return purl.toString();
  }

  return value;
}

function normalizePurls(value) {
  if (Array.isArray(value)) {
    value.forEach(normalizePurls);
    return;
  }

  if (value === null || typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "purl") {
      value[key] = removeNpmVcsQualifier(child);
    } else {
      normalizePurls(child);
    }
  }
}

normalizePurls(sbom);
fs.writeFileSync(sbomPath, `${JSON.stringify(sbom, null, 2)}\n`);
