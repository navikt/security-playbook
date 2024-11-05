import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

(() => {
  initializeFaro({
    url: "https://telemetry.nav.no/collect",
    app: {
      name: "security-playbook",
    },
    instrumentations: [
      ...getWebInstrumentations(),
      new TracingInstrumentation(),
    ],
  });
})();
