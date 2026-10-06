import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { formatDate, splitEvents } from "./calendar-events";

function EventList({ events }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Når</th>
          <th>Hva</th>
          <th>Hvem</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{formatDate(event)}</td>
            <td>
              <a href={event.href}>{event.label}</a>
            </td>
            <td>{event.audience ?? "Alle"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function KalenderPage() {
  const { events } = usePluginData("events-plugin");
  const { upcomingEvents, pastEvents } = splitEvents(events);

  return (
    <>
      <h2>Kommende arrangementer</h2>
      <EventList events={upcomingEvents} />

      <h2>Tidligere arrangementer </h2>
      <EventList events={pastEvents} />
    </>
  );
}
