import amplitude from "amplitude-js";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

function initAmplitude() {
  amplitude.getInstance().init("default", "", {
    apiEndpoint: "amplitude.nav.no/collect-auto",
    saveEvents: false,
    includeUtm: true,
    includeReferrer: true,
    platform: window.location.toString(),
  });
}

function logPageView() {
  amplitude.getInstance().logEvent("sidevisning", {
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
