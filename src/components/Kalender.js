import React from "react";
import { useCurrentSidebarCategory } from "@docusaurus/theme-common";

function getEvents() {
  const { items } = useCurrentSidebarCategory();

  return items.map(mapItem);
}

function mapItem(item) {
  const { docId, customProps } = item;
  const dateFromId = parseDate(docId);
  const startDate = customProps?.startDate ?? customProps?.date ?? dateFromId;
  const endDate =
    customProps?.endDate ?? customProps?.date ?? dateFromId ?? startDate;
  const audience = customProps?.audience;

  return {
    ...item,
    startDate,
    endDate,
    audience,
  };
}

function mapExtraEvent(event) {
  const startDate = event.startDate ?? event.date;
  const endDate = event.endDate ?? event.date ?? startDate;
  const docId = event.docId ?? `${startDate}_${endDate}_${event.label}`;
  return {
    ...event,
    startDate,
    endDate,
    docId,
  };
}

function parseDate(string) {
  const m = /(\d{4}-\d{2}-\d{2})/.exec(string);
  return m ? m[1] : null;
}

const months = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

function getDateParts(dateString) {
  const [year, month, day] = dateString.split("-").map((e) => parseInt(e, 10));
  return { year, month, day };
}

function formatDate(event) {
  const currentYear = new Date().getFullYear();
  const start = getDateParts(event.startDate);
  const end = getDateParts(event.endDate);

  if (event.startDate === event.endDate) {
    const str = `${start.day}. ${months[start.month - 1]}`;
    return currentYear === end.year ? str : `${str} ${start.year}`;
  } else if (start.month === end.month) {
    const str = `${start.day}.–${end.day}. ${months[start.month - 1]}`;
    return currentYear === end.year ? str : `${str} ${start.year}`;
  } else {
    const str = `${start.day}. ${months[start.month - 1]} til ${end.day}. ${
      months[end.month - 1]
    }`;
    return currentYear === end.year ? str : `${str} ${start.year}`;
  }

  return `${event.startDate}`;
}

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
          <tr key={event.docId}>
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

export default function KalenderPage({ extraEvents }) {
  const events = [...getEvents(), ...extraEvents.map(mapExtraEvent)];
  const currentDate = new Date()
    .toISOString()
    .substring(0, "yyyy-mm-dd".length);

  const upcomingEvents = events.filter((item) => item.endDate >= currentDate);
  upcomingEvents.sort((a, b) =>
    a.endDate > b.endDate ? 1 : a.endDate === b.endDate ? 0 : -1
  );

  const pastEvents = events.filter((item) => item.endDate < currentDate);
  pastEvents.sort((a, b) =>
    a.endDate > b.endDate ? -1 : a.endDate === b.endDate ? 0 : 1
  );

  return (
    <>
      <h2>Kommende arrangementer</h2>
      <EventList events={upcomingEvents} />

      <h2>Tidligere arrangementer </h2>
      <EventList events={pastEvents} />
    </>
  );
}
