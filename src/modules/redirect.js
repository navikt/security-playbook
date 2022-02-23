import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function redirectModule() {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  if (window.location.hostname === "improved-train-2f244007.pages.github.io") {
    const fullPath = window.location.pathname + window.location.hash;
    const newUrl = "https://sikkerhet.nav.no" + fullPath;
    window.location.assign(newUrl);
  }
})();
