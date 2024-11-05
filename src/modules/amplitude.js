// Setup Amplitude analytics

import * as amplitude from "@amplitude/analytics-browser";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

function initAmplitude() {
  amplitude.init("default", undefined, {
    useBatch: true,
    serverUrl: "https://amplitude.nav.no/collect",
    ingestionMetadata: {
      sourceName: window.location.toString(),
    },
  });
}

function logPageView() {
  amplitude.track("sidevisning", {
    sidetittel: document.title || "Security Champions Playbook",
    platform: window.location.toString(),
  });
}

export default (function amplitudeModule() {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  initAmplitude();

  setTimeout(logPageView, 100);
  return {
    onRouteUpdate() {
      logPageView();
    },
  };
})();
