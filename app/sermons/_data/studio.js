// Local-first content store for the studio dashboard.
// The site reads the base catalogue until a studio draft exists in this browser.
import { sermons as baseSermons } from "./sermons";

export const STUDIO_KEY = "yrpm:studio:v1";
export const STUDIO_TYPES = ["Divine Service", "Sabbath School"];
export const IMAGE_OPTIONS = [
  "divine-sermon-banner.jpg",
  "pastor-sermon.jpg",
  "divine-service.jpg",
  "worship-congregation-hands.jpg",
  "worship-banner.jpg",
  "faith-clinic.jpg",
  "sabbath-study-banner.jpg",
  "sabbath-school.jpg",
  "bible-study.jpg",
  "open-bible-cross.jpg",
  "covenant-prayer.jpg",
  "community-outreach.jpg",
  "thanksgiving.jpg",
  "passover.jpg",
  "apostle-and-evangelist.jpg",
];
const TYPE_ROOT = {
  "Divine Service": "divine-service",
  "Sabbath School": "sabbath-school",
};

const listeners = new Set();
let cache = null;
let storageBound = false;
let serverSeed = null;

const clone = (value) => JSON.parse(JSON.stringify(value));

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export function uniqueSlug(value, list, ignoreId) {
  const root = slugify(value) || "untitled-message";
  const taken = new Set(
    list.filter((item) => item.id !== ignoreId).map((item) => item.slug),
  );
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function cleanParagraphs(value) {
  if (!Array.isArray(value)) return [];
  return value.map((p) => String(p ?? "").trim()).filter(Boolean);
}

function cleanSections(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((section) => ({
      heading: String(section?.heading ?? "").trim() || "Untitled section",
      paragraphs: cleanParagraphs(section?.paragraphs),
      ...(section?.prompt ? { prompt: String(section.prompt).trim() } : {}),
    }))
    .filter((section) => section.heading);
}

export function normalizeSermon(raw, index = 0) {
  if (!raw || typeof raw !== "object") return null;
  const title = String(raw.title ?? "").trim();
  if (!title) return null;
  const type = STUDIO_TYPES.includes(raw.type) ? raw.type : "Divine Service";
  const fallbackSlug = slugify(title) || `message-${index + 1}`;
  const date = typeof raw.date === "string" && raw.date.trim() ? raw.date : null;
  const audioUrl =
    type === "Divine Service" &&
    typeof raw.audioUrl === "string" &&
    raw.audioUrl.trim()
      ? raw.audioUrl.trim()
      : null;
  return {
    id: String(raw.id || raw.slug || fallbackSlug),
    slug: slugify(raw.slug || fallbackSlug) || fallbackSlug,
    title,
    sub: String(raw.sub ?? "").trim(),
    type,
    image: IMAGE_OPTIONS.includes(raw.image) ? raw.image : IMAGE_OPTIONS[0],
    date,
    audioUrl,
    passages: Array.isArray(raw.passages)
      ? raw.passages.map((p) => String(p ?? "").trim()).filter(Boolean)
      : [],
    sections: cleanSections(raw.sections),
    status: raw.status === "draft" ? "draft" : "published",
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : null,
    createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : null,
  };
}

export function seedState() {
  const sermons = baseSermons.map((sermon, index) => {
    const normalized = normalizeSermon(
      {
        ...clone(sermon),
        id: sermon.slug,
        status: "published",
        updatedAt: null,
        createdAt: null,
      },
      index,
    );
    return normalized;
  });
  return { version: 1, sermons: sermons.filter(Boolean), updatedAt: null };
}

function safeStorage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function readStored() {
  const storage = safeStorage();
  if (!storage) return null;
  try {
    const parsed = JSON.parse(storage.getItem(STUDIO_KEY) || "null");
    if (!parsed || !Array.isArray(parsed.sermons)) return null;
    const sermons = parsed.sermons
      .map((sermon, index) => normalizeSermon(sermon, index))
      .filter(Boolean);
    return {
      version: 1,
      sermons,
      updatedAt: Number.isFinite(parsed.updatedAt) ? parsed.updatedAt : null,
    };
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      /* A broken subscriber must not block the others. */
    }
  });
}

function onStorage(event) {
  if (event.key && event.key !== STUDIO_KEY) return;
  cache = readStored() || seedState();
  emit();
}

function bindStorage() {
  if (storageBound || typeof window === "undefined") return;
  window.addEventListener("storage", onStorage);
  storageBound = true;
}

export function subscribe(listener) {
  listeners.add(listener);
  bindStorage();
  return () => listeners.delete(listener);
}

export function getClientState() {
  if (cache) return cache;
  cache = readStored() || seedState();
  bindStorage();
  return cache;
}

export function getServerState() {
  if (!serverSeed) serverSeed = seedState();
  return serverSeed;
}

function commit(next, { persist = true } = {}) {
  const state = {
    version: 1,
    sermons: next.sermons.map((sermon, index) => normalizeSermon(sermon, index)).filter(Boolean),
    updatedAt: Date.now(),
  };
  cache = state;
  if (persist) {
    const storage = safeStorage();
    try {
      storage?.setItem(STUDIO_KEY, JSON.stringify(state));
    } catch {
      /* Quota or private mode: the session still works in memory. */
    }
  }
  emit();
  return state;
}

export function saveSermon(sermon) {
  const state = getClientState();
  const now = Date.now();
  const clean = normalizeSermon(sermon);
  if (!clean) throw new Error("A message needs a title.");
  const exists = state.sermons.some((item) => item.id === clean.id);
  // Existing URLs stay stable; a brand-new message gets a readable slug.
  clean.slug = exists
    ? uniqueSlug(clean.slug || clean.title, state.sermons, clean.id)
    : uniqueSlug(clean.title, state.sermons);
  const record = {
    ...clean,
    updatedAt: now,
    createdAt:
      state.sermons.find((item) => item.id === clean.id)?.createdAt || now,
  };
  const sermons = exists
    ? state.sermons.map((item) => (item.id === clean.id ? record : item))
    : [record, ...state.sermons];
  commit({ ...state, sermons });
  return record;
}

export function deleteSermon(id) {
  const state = getClientState();
  commit({ ...state, sermons: state.sermons.filter((item) => item.id !== id) });
}

export function duplicateSermon(id) {
  const state = getClientState();
  const source = state.sermons.find((item) => item.id === id);
  if (!source) return null;
  const copy = {
    ...clone(source),
    id: makeId(),
    slug: uniqueSlug(`${source.title} copy`, state.sermons),
    title: `${source.title} (copy)`,
    status: "draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  commit({ ...state, sermons: [copy, ...state.sermons] });
  return copy;
}

export function resetStudio() {
  const state = seedState();
  cache = state;
  const storage = safeStorage();
  try {
    storage?.removeItem(STUDIO_KEY);
  } catch {
    /* ignore */
  }
  emit();
  return state;
}

export function createSermon(type = "Divine Service", overrides = {}) {
  const state = getClientState();
  const isDivine = type === "Divine Service";
  const now = Date.now();
  // Deliberately not normalized yet: the editor may start with an empty title.
  return {
    id: makeId(),
    slug: uniqueSlug(overrides.title || "untitled-message", state.sermons),
    title: "",
    sub: "",
    type,
    image: isDivine ? "divine-sermon-banner.jpg" : "sabbath-study-banner.jpg",
    date: null,
    audioUrl: null,
    passages: [],
    sections: [
      {
        heading: isDivine ? "A foundation that remains" : "Reading together",
        paragraphs: [""],
      },
    ],
    status: "draft",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function publicSermons(state = getClientState()) {
  return state.sermons.filter((sermon) => sermon.status !== "draft");
}

export function findPublicSermon(type, slug, state) {
  return publicSermons(state).find(
    (sermon) => sermon.type === type && sermon.slug === slug,
  );
}

export function findAnySermon(type, slug, state) {
  return (state || getClientState()).sermons.find(
    (sermon) => sermon.type === type && sermon.slug === slug,
  );
}

export function studioStats(state = getClientState()) {
  const sermons = state.sermons;
  return {
    total: sermons.length,
    divine: sermons.filter((s) => s.type === "Divine Service").length,
    sabbath: sermons.filter((s) => s.type === "Sabbath School").length,
    published: sermons.filter((s) => s.status !== "draft").length,
    drafts: sermons.filter((s) => s.status === "draft").length,
    withAudio: sermons.filter((s) => s.audioUrl).length,
    missingAudio: sermons.filter(
      (s) => s.type === "Divine Service" && !s.audioUrl,
    ).length,
    missingDate: sermons.filter((s) => !s.date).length,
    missingPassages: sermons.filter((s) => !s.passages.length).length,
    emptySections: sermons.filter(
      (s) =>
        !s.sections.length ||
        s.sections.some((section) => !section.paragraphs.length),
    ).length,
    updatedAt: state.updatedAt,
  };
}

export function studioIssues(state = getClientState()) {
  const issues = [];
  const sermons = state.sermons;
  sermons.forEach((sermon) => {
    if (sermon.type === "Divine Service" && !sermon.audioUrl)
      issues.push({
        id: `audio-${sermon.id}`,
        severity: "info",
        label: "No audio yet",
        detail: sermon.title,
        sermonId: sermon.id,
      });
    if (!sermon.date)
      issues.push({
        id: `date-${sermon.id}`,
        severity: "info",
        label: "Date not set",
        detail: sermon.title,
        sermonId: sermon.id,
      });
    if (!sermon.passages.length)
      issues.push({
        id: `passages-${sermon.id}`,
        severity: "warn",
        label: "No scripture passages",
        detail: sermon.title,
        sermonId: sermon.id,
      });
    if (sermon.sections.some((section) => !section.paragraphs.length))
      issues.push({
        id: `empty-${sermon.id}`,
        severity: "warn",
        label: "An empty study section",
        detail: sermon.title,
        sermonId: sermon.id,
      });
    if (sermon.status === "draft")
      issues.push({
        id: `draft-${sermon.id}`,
        severity: "info",
        label: "Draft not published",
        detail: sermon.title,
        sermonId: sermon.id,
      });
  });
  // Warnings first so the overview surfaces structural gaps before housekeeping.
  return issues.sort(
    (a, b) => (a.severity === "warn" ? 0 : 1) - (b.severity === "warn" ? 0 : 1),
  );
}

export function formatDate(value, style = "long") {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: style,
    timeZone: "UTC",
  }).format(date);
}

export function sermonHref(sermon) {
  return `/sermons/${TYPE_ROOT[sermon.type] || "divine-service"}/${sermon.slug}`;
}

const exportShape = (sermon) => ({
  slug: sermon.slug,
  title: sermon.title,
  sub: sermon.sub,
  type: sermon.type,
  image: sermon.image,
  date: sermon.date,
  ...(sermon.type === "Divine Service"
    ? { audioUrl: sermon.audioUrl }
    : {}),
  passages: sermon.passages,
  sections: sermon.sections,
  ...(sermon.status === "draft" ? { status: "draft" } : {}),
});

export function exportJSON(state = getClientState()) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      note: "Browser-local audio (local:*) is not included. Add a hosted audioUrl before publishing.",
      sermons: state.sermons.map(exportShape),
    },
    null,
    2,
  );
}

export function exportSource(state = getClientState()) {
  const array = JSON.stringify(state.sermons.map(exportShape), null, 2);
  return `// Generated by the YRPM content studio.\n// Replace the \`sermons\` array in app/sermons/_data/sermons.js with this list.\nexport const sermons = ${array};\n`;
}

export function importJSON(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  const list = Array.isArray(parsed) ? parsed : parsed?.sermons;
  if (!Array.isArray(list))
    return { ok: false, error: "No sermon list was found in this file." };
  const sermons = list
    .map((sermon, index) => normalizeSermon(sermon, index))
    .filter(Boolean);
  if (!sermons.length)
    return { ok: false, error: "No valid messages were found in this file." };
  const unique = [];
  sermons.forEach((sermon) => {
    unique.push({
      ...sermon,
      id: makeId(),
      slug: uniqueSlug(sermon.slug || sermon.title, unique),
    });
  });
  commit({ version: 1, sermons: unique });
  return { ok: true, count: unique.length };
}
