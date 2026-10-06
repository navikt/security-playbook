const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { parseFrontMatter } = require("./event-frontmatter");
const eventsPlugin = require("./events-plugin");
const { normalizeEvents, createFeed } = require("./normalize-events");
const { formatDate, splitEvents } = require("../components/calendar-events");

const siteConfig = { url: "https://sikkerhet.nav.no", baseUrl: "/" };
const eventsDir = path.join(__dirname, "../../docs/11-events");

function markdown(docId = "2026-10-21-meetup", customProps = {}) {
  return {
    docId,
    label: "Meetup",
    customProps,
    source: `docs/11-events/${docId}.md`,
  };
}

function external(overrides = {}) {
  return {
    id: "conference-2026",
    label: "Conference",
    date: "2026-10-29",
    href: "https://example.org/conference/",
    ...overrides,
  };
}

function normalize(items = [], extraEvents = [], config = siteConfig) {
  return normalizeEvents({
    items,
    extraEvents,
    siteUrl: config.url,
    baseUrl: config.baseUrl,
  });
}

test("Markdown date precedence and end-date fallback use metadata, not the ID", () => {
  const events = normalize([
    markdown("2020-01-01-course", {
      startDate: "2026-10-21",
      date: "2026-10-22",
      endDate: "2026-10-23",
      audience: "Security Champions",
    }),
    markdown("2020-01-02-course", { date: "2026-10-22" }),
    markdown("2020-01-03-course", { startDate: "2026-10-23" }),
    markdown("2020-01-04-course", {
      startDate: "2026-10-21",
      date: "2026-10-22",
    }),
    markdown(),
  ]);
  assert.deepEqual(
    events.map(({ startDate, endDate }) => [startDate, endDate]),
    [
      ["2026-10-21", "2026-10-23"],
      ["2026-10-22", "2026-10-22"],
      ["2026-10-23", "2026-10-23"],
      ["2026-10-21", "2026-10-22"],
      ["2026-10-21", "2026-10-21"],
    ],
  );
  assert.equal(events[0].audience, "Security Champions");
  assert.equal(events[1].audience, "Alle");
});

test("quoted and unquoted YAML frontmatter dates remain date-only", () => {
  for (const value of ['"2024-02-29"', "2024-02-29"]) {
    const data = parseFrontMatter(
      `---\nsidebar_custom_props:\n  date: ${value}\n---\n`,
    );
    const [event] = normalize([
      markdown("2024-02-meetup", data.sidebar_custom_props),
    ]);
    assert.equal(event.startDate, "2024-02-29");
    assert.equal(event.endDate, "2024-02-29");
  }
});

test("invalid unquoted YAML dates are not rolled into a different date", () => {
  for (const date of ["2026-02-29", "2026-04-31"]) {
    const data = parseFrontMatter(
      `---\nsidebar_custom_props:\n  date: ${date}\n---\n`,
    );
    assert.throws(
      () => normalize([markdown("course", data.sidebar_custom_props)]),
      /course\.md: invalid date .*YYYY-MM-DD/,
    );
  }
});

test("JSON single-day and multi-day dates, precedence and missing audience", () => {
  const events = normalize(
    [],
    [
      external(),
      external({
        id: "range",
        startDate: "2026-10-21",
        endDate: "2026-10-23",
      }),
      external({ id: "start-only", date: undefined, startDate: "2026-10-21" }),
      external({ id: "date-end", startDate: "2026-10-21" }),
    ],
  );
  assert.deepEqual(
    events.map(({ startDate, endDate, audience }) => [
      startDate,
      endDate,
      audience,
    ]),
    [
      ["2026-10-29", "2026-10-29", "Alle"],
      ["2026-10-21", "2026-10-23", "Alle"],
      ["2026-10-21", "2026-10-21", "Alle"],
      ["2026-10-21", "2026-10-29", "Alle"],
    ],
  );
});

test("IDs distinguish annual events with shared URLs and survive corrections", () => {
  const original = external();
  const [before, annual] = normalize(
    [],
    [original, external({ id: "conference-2027", date: "2027-10-29" })],
  );
  const [after] = normalize(
    [],
    [
      {
        ...original,
        label: "Corrected title",
        date: "2026-10-30",
        href: "https://example.org/corrected",
      },
    ],
  );
  assert.notEqual(before.id, annual.id);
  assert.equal(before.id, after.id);
  assert.equal(before.id, "external:conference-2026");
  assert.equal(normalize([markdown()])[0].id, "playbook:2026-10-21-meetup");
});

test("feed URLs use site URL/baseUrl and preserve external HTTP(S) URLs", () => {
  const externalUrl = "http://example.org/event?b=2&a=1#registration";
  const events = normalize([markdown()], [external({ href: externalUrl })], {
    url: "https://example.org",
    baseUrl: "/playbook/",
  });
  assert.equal(events[0].href, "/playbook/docs/events/2026-10-21-meetup");
  assert.equal(
    events[0].url,
    "https://example.org/playbook/docs/events/2026-10-21-meetup",
  );
  assert.equal(events[1].href, externalUrl);
  assert.equal(events[1].url, externalUrl);
  for (const href of [
    "javascript:alert(1)",
    "ftp://example.org",
    "/relative",
  ]) {
    assert.throws(
      () => normalize([], [external({ href })]),
      /arrangementer\.json entry 1.*HTTP\(S\)/,
    );
  }
});

test("invalid, missing and partial dates identify their source and field", () => {
  for (const date of [
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-00-10",
    "2026-10-00",
    "2026-10",
    "2026",
    "2026-1-2",
    "2026-10-21T12:00:00Z",
    "",
    2026,
  ]) {
    assert.throws(
      () => normalize([markdown("course", { date })]),
      /docs\/11-events\/course\.md: invalid date .*YYYY-MM-DD/,
    );
    assert.throws(
      () => normalize([], [external({ date })]),
      /arrangementer\.json entry 1.*invalid date .*YYYY-MM-DD/,
    );
  }
  for (const docId of ["undated", "2026-10-meetup", "2026-02-30-meetup"]) {
    assert.throws(
      () => normalize([markdown(docId)]),
      /invalid startDate .*YYYY-MM-DD/,
    );
  }
  assert.throws(
    () => normalize([], [external({ date: undefined })]),
    /arrangementer\.json entry 1.*invalid startDate/,
  );
  assert.throws(
    () =>
      normalize([markdown("course", { date: "2026-10-21", endDate: "bad" })]),
    /course\.md: invalid endDate/,
  );
});

test("reversed ranges, missing external IDs and duplicate IDs fail clearly", () => {
  const range = { startDate: "2026-10-23", endDate: "2026-10-21" };
  assert.throws(
    () => normalize([markdown("course", range)]),
    /course\.md: endDate 2026-10-21 precedes startDate 2026-10-23/,
  );
  assert.throws(
    () => normalize([], [external(range)]),
    /arrangementer\.json entry 1.*precedes startDate/,
  );
  for (const id of [undefined, "", " ", 1]) {
    assert.throws(
      () => normalize([], [external({ id })]),
      /arrangementer\.json entry 1.*unique persistent id/,
    );
  }
  assert.throws(
    () => normalize([markdown(), markdown()]),
    /duplicate feed ID "playbook:2026-10-21-meetup".*also used by/,
  );
  assert.throws(
    () => normalize([], [external(), external()]),
    /entry 2.*duplicate feed ID "external:conference-2026".*entry 1/,
  );
});

test("feed has exactly the public contract and deterministic date/ID ordering", () => {
  const events = normalize(
    [markdown()],
    [
      external({ id: "z", date: "2026-10-21" }),
      external({ id: "a", date: "2026-10-21" }),
      external({ id: "past", date: "2020-01-01" }),
    ],
  );
  const feed = createFeed(events);
  assert.deepEqual(Object.keys(feed), ["schemaVersion", "events"]);
  assert.equal(feed.schemaVersion, 1);
  assert.deepEqual(
    feed.events.map(({ id }) => id),
    ["external:past", "external:a", "external:z", "playbook:2026-10-21-meetup"],
  );
  assert.deepEqual(createFeed([...events].reverse()), feed);
  for (const event of feed.events) {
    assert.deepEqual(Object.keys(event), [
      "id",
      "title",
      "startDate",
      "endDate",
      "audience",
      "url",
    ]);
  }
  assert.equal(events[0].id, "playbook:2026-10-21-meetup");
});

test("calendar retains Norwegian date formatting and end-date classification", () => {
  const date = (startDate, endDate = startDate) => ({ startDate, endDate });
  assert.equal(formatDate(date("2026-10-21"), 2026), "21. oktober");
  assert.equal(formatDate(date("2025-10-21"), 2026), "21. oktober 2025");
  assert.equal(
    formatDate(date("2026-10-21", "2026-10-23"), 2026),
    "21.–23. oktober",
  );
  assert.equal(
    formatDate(date("2025-10-21", "2025-11-02"), 2026),
    "21. oktober til 2. november 2025",
  );
  assert.equal(formatDate(date("2026-10"), 2026), "TBA");
  const events = normalize(
    [],
    [
      external({ id: "later", date: "2026-11-01" }),
      external({ id: "past-early", date: "2026-09-01" }),
      external({
        id: "ongoing",
        startDate: "2026-10-01",
        endDate: "2026-10-06",
      }),
      external({ id: "past-late", date: "2026-10-05" }),
      external({ id: "same-end", date: "2026-10-06" }),
    ],
  );
  const { upcomingEvents, pastEvents } = splitEvents(events, "2026-10-06");
  assert.deepEqual(
    upcomingEvents.map(({ id }) => id),
    ["external:ongoing", "external:same-end", "external:later"],
  );
  assert.deepEqual(
    pastEvents.map(({ id }) => id),
    ["external:past-late", "external:past-early"],
  );
});

test("plugin includes each source exactly once, preserves calendar data and writes to outDir", async (t) => {
  let events;
  const plugin = eventsPlugin({ siteConfig });
  await plugin.contentLoaded({
    actions: {
      setGlobalData(data) {
        events = data.events;
      },
    },
  });
  const filenames = fs
    .readdirSync(eventsDir)
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .sort();
  const extraEvents = JSON.parse(
    fs.readFileSync(path.join(eventsDir, "arrangementer.json"), "utf8"),
  );
  const original = [
    ...filenames.map((filename) => {
      const docId = filename.slice(0, -3);
      const data = parseFrontMatter(
        fs.readFileSync(path.join(eventsDir, filename), "utf8"),
      );
      const props = data.sidebar_custom_props ?? {};
      const fallback = /(\d{4}-\d{2}-\d{2})/.exec(docId)?.[1] ?? null;
      const startDate = props.startDate ?? props.date ?? fallback;
      return {
        label: data.title ?? docId,
        href: `/docs/events/${docId}`,
        startDate,
        endDate: props.endDate ?? props.date ?? fallback ?? startDate,
        audience: props.audience ?? "Alle",
      };
    }),
    ...extraEvents.map((event) => {
      const startDate = event.startDate ?? event.date;
      return {
        label: event.label,
        href: event.href,
        startDate,
        endDate: event.endDate ?? event.date ?? startDate,
        audience: event.audience ?? "Alle",
      };
    }),
  ];
  assert.deepEqual(
    events.map(({ label, href, startDate, endDate, audience }) => ({
      label,
      href,
      startDate,
      endDate,
      audience,
    })),
    original,
  );
  assert.equal(events.length, filenames.length + extraEvents.length);
  assert.equal(new Set(events.map(({ id }) => id)).size, events.length);
  assert.equal(
    events.filter(({ id }) => id.startsWith("playbook:")).length,
    filenames.length,
  );
  assert.equal(
    events.filter(({ id }) => id.startsWith("external:")).length,
    extraEvents.length,
  );
  const outDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "playbook-events-test-"),
  );
  t.after(() => fs.rmSync(outDir, { recursive: true }));
  await plugin.postBuild({ outDir });
  const feed = JSON.parse(
    fs.readFileSync(path.join(outDir, "events.json"), "utf8"),
  );
  assert.deepEqual(feed, createFeed(events));
  assert.deepEqual(
    feed.events.find(({ id }) => id === "playbook:2026-10-21-meetup"),
    {
      id: "playbook:2026-10-21-meetup",
      title: "Meetup – Oktober 2026",
      startDate: "2026-10-21",
      endDate: "2026-10-21",
      audience: "Security Champions",
      url: "https://sikkerhet.nav.no/docs/events/2026-10-21-meetup",
    },
  );
});
