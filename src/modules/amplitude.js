import * as amplitude from "@amplitude/analytics-browser";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

function initAmplitude() {
  const AMPLITUDE_PUBLIC_API_KEY = "10798841ebeba333b8ece6c046322d76";

  amplitude
    .init(AMPLITUDE_PUBLIC_API_KEY, undefined, {
      serverUrl: "https://amplitude.nav.no/collect",
      useBatch: false,
      autocapture: {
        attribution: true,
        fileDownloads: false,
        formInteractions: false,
        pageViews: true,
        sessions: false,
        elementInteractions: false,
      },
    })
    .promise.catch((err) => {
      console.error("error initializing amplitude", err);
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
