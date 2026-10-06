function normalizeDate(value, field, source) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  ) {
    throw new Error(
      `${source}: invalid ${field} (${String(value)}); provide a real date in YYYY-MM-DD format.`,
    );
  }
  return value;
}

function normalizeRange(props, fallback, source) {
  const dates = {};
  for (const field of ["date", "startDate", "endDate"]) {
    if (props[field] != null) {
      dates[field] = normalizeDate(props[field], field, source);
    }
  }
  const startDate = normalizeDate(
    dates.startDate ?? dates.date ?? fallback,
    "startDate",
    source,
  );
  const endDate = dates.endDate ?? dates.date ?? startDate;
  if (endDate < startDate) {
    throw new Error(
      `${source}: endDate ${endDate} precedes startDate ${startDate}; correct the event's date range.`,
    );
  }
  return { startDate, endDate };
}

function validateUrl(value, source) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `${source}: invalid URL (${value}); provide an HTTP(S) URL.`,
    );
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${source}: URL (${value}) must use HTTP(S).`);
  }
  return value;
}

function normalizeEvents({ items, extraEvents, siteUrl, baseUrl }) {
  const ids = new Map();
  function register(event, source) {
    if (ids.has(event.id)) {
      throw new Error(
        `${source}: duplicate feed ID "${event.id}", also used by ${ids.get(event.id)}; assign a unique persistent ID.`,
      );
    }
    ids.set(event.id, source);
    return event;
  }

  const internalEvents = items.map(({ docId, label, customProps, source }) => {
    const href = `${baseUrl}docs/events/${docId}`;
    return register(
      {
        id: `playbook:${docId}`,
        label,
        href,
        url: validateUrl(new URL(href, siteUrl).href, source),
        ...normalizeRange(
          customProps,
          /(?:^|[^\d])(\d{4}-\d{2}-\d{2})(?!\d)/.exec(docId)?.[1],
          source,
        ),
        audience: customProps.audience ?? "Alle",
      },
      source,
    );
  });
  const externalEvents = extraEvents.map((event, index) => {
    const source = `docs/11-events/arrangementer.json entry ${index + 1} (${event.id ?? event.label})`;
    if (typeof event.id !== "string" || !event.id.trim()) {
      throw new Error(`${source}: provide a unique persistent id.`);
    }
    return register(
      {
        id: `external:${event.id}`,
        label: event.label,
        href: validateUrl(event.href, source),
        url: event.href,
        ...normalizeRange(event, undefined, source),
        audience: event.audience ?? "Alle",
      },
      source,
    );
  });
  return [...internalEvents, ...externalEvents];
}

function createFeed(events) {
  return {
    schemaVersion: 1,
    events: events
      .map(({ id, label, startDate, endDate, audience, url }) => ({
        id,
        title: label,
        startDate,
        endDate,
        audience,
        url,
      }))
      .sort((a, b) =>
        a.startDate === b.startDate
          ? compare(a.id, b.id)
          : compare(a.startDate, b.startDate),
      ),
  };
}

function compare(a, b) {
  return a > b ? 1 : a === b ? 0 : -1;
}

module.exports = { normalizeEvents, createFeed };
