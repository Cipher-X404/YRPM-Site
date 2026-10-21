import test from "node:test";
import assert from "node:assert/strict";
import { parseReference, referencePattern } from "./references.js";

test("chapter search resolves Psalm to the full Psalms chapter", () => {
  assert.equal(parseReference("Psalm 23")?.normalized, "Psalms 23");
});
test("single verse and ranges preserve the requested passage", () => {
  assert.equal(parseReference("John 3:16")?.normalized, "John 3:16");
  assert.equal(
    parseReference("1 Corinthians 5:7–8")?.normalized,
    "1 Corinthians 5:7-8",
  );
});
test("invalid books, chapter boundaries and inverted verse ranges are rejected", () => {
  for (const input of [
    "NotABook 1",
    "John 22",
    "Psalm 151",
    "John 3:18-16",
    "<script> 3:16",
    "John 3:0",
  ])
    assert.equal(parseReference(input), null);
});
test("write-up detection is restricted to actual book names", () => {
  const text =
    "Read Genesis 2:1-3 and Hebrews 4. Meet at 9:00 on Tuesday 3:16.";
  assert.deepEqual(
    [...text.matchAll(referencePattern)].map((match) => match[0]),
    ["Genesis 2:1-3", "Hebrews 4"],
  );
});
