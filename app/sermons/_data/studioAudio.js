// Audio is kept out of localStorage: IndexedDB stores the blob, the studio stores a
// `local:<id>` reference. It stays in this browser only and is never uploaded.
const DB_NAME = "yrpm-studio-audio";
const DB_VERSION = 1;
const CLIPS = "clips";
const META = "meta";
export const MAX_AUDIO_BYTES = 80 * 1024 * 1024;

let dbPromise = null;

export function isLocalAudio(url) {
  return typeof url === "string" && url.startsWith("local:");
}

export function localAudioId(url) {
  return isLocalAudio(url) ? url.slice(6) : null;
}

function openDB() {
  if (typeof indexedDB === "undefined")
    return Promise.reject(new Error("Audio storage is unavailable here."));
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CLIPS)) db.createObjectStore(CLIPS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open audio storage."));
  });
  return dbPromise;
}

function run(storeName, mode, work) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        let result;
        try {
          result = work(store);
        } catch (error) {
          reject(error);
          return;
        }
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error("Audio storage was interrupted."));
      }),
  );
}

export async function saveAudioFile(file) {
  if (!file) throw new Error("Choose an audio file first.");
  if (!file.type.startsWith("audio/"))
    throw new Error("That file is not an audio recording.");
  if (file.size > MAX_AUDIO_BYTES)
    throw new Error("Audio files must be smaller than 80 MB.");
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const meta = {
    id,
    name: file.name || "recording",
    size: file.size,
    type: file.type,
    savedAt: Date.now(),
    url: `local:${id}`,
  };
  await run([CLIPS, META], "readwrite", (store) => {
    store.objectStore(CLIPS).put({ id, blob: file });
    store.objectStore(META).put(meta);
  });
  return meta;
}

export async function getAudioBlob(url) {
  const id = localAudioId(url);
  if (!id) return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(CLIPS, "readonly").objectStore(CLIPS).get(id);
    request.onsuccess = () => resolve(request.result?.blob || null);
    request.onerror = () => reject(request.error);
  });
}

export async function listLocalAudio() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(META, "readonly").objectStore(META).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteLocalAudio(url) {
  const id = localAudioId(url);
  if (!id) return;
  await run([CLIPS, META], "readwrite", (tx) => {
    tx.objectStore(CLIPS).delete(id);
    tx.objectStore(META).delete(id);
  });
}

export async function clearLocalAudio() {
  await run([CLIPS, META], "readwrite", (tx) => {
    tx.objectStore(CLIPS).clear();
    tx.objectStore(META).clear();
  });
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
