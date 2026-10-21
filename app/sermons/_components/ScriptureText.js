import { referencePattern, parseReference } from "../_data/references";
import styles from "../sermon-pages.module.css";

// Text fragments only: never turn write-up copy into HTML or match generic numbers.
export default function ScriptureText({ children }) {
  const text = String(children);
  const result = [];
  let last = 0;
  for (const match of text.matchAll(referencePattern)) {
    if (!parseReference(match[0])) continue;
    if (match.index > last) result.push(text.slice(last, match.index));
    result.push(
      <button
        key={`${match.index}-${match[0]}`}
        type="button"
        className={styles.refLink}
        data-ref={match[0]}
        aria-label={`Read ${match[0]} in the Bible`}
      >
        {match[0]}
      </button>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) result.push(text.slice(last));
  return result.length ? result : text;
}
