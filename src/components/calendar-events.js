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

function formatDate(event, currentYear = new Date().getFullYear()) {
  const start = getDateParts(event.startDate);
  const end = getDateParts(event.endDate);

  if (!start.day || !end.day) {
    return "TBA";
  }

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
}

function splitEvents(
  events,
  currentDate = new Date().toISOString().substring(0, "yyyy-mm-dd".length),
) {
  const upcomingEvents = events.filter((item) => item.endDate >= currentDate);
  upcomingEvents.sort((a, b) =>
    a.endDate > b.endDate ? 1 : a.endDate === b.endDate ? 0 : -1,
  );

  const pastEvents = events.filter((item) => item.endDate < currentDate);
  pastEvents.sort((a, b) =>
    a.endDate > b.endDate ? -1 : a.endDate === b.endDate ? 0 : 1,
  );
  return { upcomingEvents, pastEvents };
}

module.exports = { formatDate, splitEvents };
