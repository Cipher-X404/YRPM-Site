// Canonical Protestant book names and chapter counts keep chapter navigation in bounds.
const books = [
  ["Genesis", 50],
  ["Exodus", 40],
  ["Leviticus", 27],
  ["Numbers", 36],
  ["Deuteronomy", 34],
  ["Joshua", 24],
  ["Judges", 21],
  ["Ruth", 4],
  ["1 Samuel", 31],
  ["2 Samuel", 24],
  ["1 Kings", 22],
  ["2 Kings", 25],
  ["1 Chronicles", 29],
  ["2 Chronicles", 36],
  ["Ezra", 10],
  ["Nehemiah", 13],
  ["Esther", 10],
  ["Job", 42],
  ["Psalms", 150],
  ["Proverbs", 31],
  ["Ecclesiastes", 12],
  ["Song of Solomon", 8],
  ["Isaiah", 66],
  ["Jeremiah", 52],
  ["Lamentations", 5],
  ["Ezekiel", 48],
  ["Daniel", 12],
  ["Hosea", 14],
  ["Joel", 3],
  ["Amos", 9],
  ["Obadiah", 1],
  ["Jonah", 4],
  ["Micah", 7],
  ["Nahum", 3],
  ["Habakkuk", 3],
  ["Zephaniah", 3],
  ["Haggai", 2],
  ["Zechariah", 14],
  ["Malachi", 4],
  ["Matthew", 28],
  ["Mark", 16],
  ["Luke", 24],
  ["John", 21],
  ["Acts", 28],
  ["Romans", 16],
  ["1 Corinthians", 16],
  ["2 Corinthians", 13],
  ["Galatians", 6],
  ["Ephesians", 6],
  ["Philippians", 4],
  ["Colossians", 4],
  ["1 Thessalonians", 5],
  ["2 Thessalonians", 3],
  ["1 Timothy", 6],
  ["2 Timothy", 4],
  ["Titus", 3],
  ["Philemon", 1],
  ["Hebrews", 13],
  ["James", 5],
  ["1 Peter", 5],
  ["2 Peter", 3],
  ["1 John", 5],
  ["2 John", 1],
  ["3 John", 1],
  ["Jude", 1],
  ["Revelation", 22],
];
export const chaptersByBook = Object.fromEntries(books);
const names = new Map(books.map(([name]) => [name.toLowerCase(), name]));
names.set("psalm", "Psalms");
names.set("song of songs", "Song of Solomon");
const escaped = [...names.keys()]
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
// Only explicitly named books followed by chapter (and optionally verses) are linked.
export const referencePattern = new RegExp(
  `\\b(?:${escaped.join("|")})\\s+\\d{1,3}(?::\\d{1,3}(?:\\s*[-–]\\s*\\d{1,3})?)?\\b`,
  "gi",
);

export function parseReference(input) {
  if (typeof input !== "string" || input.length > 100) return null;
  const match =
    /^((?:[1-3]\s*)?[a-z]+(?:\s+[a-z]+){0,3})\s+(\d{1,3})(?::(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?)?$/i.exec(
      input.trim().replace(/\s+/g, " "),
    );
  if (!match) return null;
  const book = names.get(
    match[1].replace(/([1-3])(?=[A-Za-z])/, "$1 ").toLowerCase(),
  );
  const chapter = Number(match[2]);
  const verse = match[3] ? Number(match[3]) : null;
  const endVerse = match[4] ? Number(match[4]) : null;
  if (
    !book ||
    chapter < 1 ||
    chapter > chaptersByBook[book] ||
    (verse !== null && (verse < 1 || verse > 176)) ||
    (endVerse !== null && (endVerse < verse || endVerse > 176))
  )
    return null;
  return {
    book,
    chapter,
    verse,
    endVerse,
    normalized: `${book} ${chapter}${verse === null ? "" : `:${verse}${endVerse === null ? "" : `-${endVerse}`}`}`,
  };
}
