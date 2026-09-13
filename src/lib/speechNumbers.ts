/**
 * Converts number words spoken the way people actually say medicine
 * strengths ("Dolo six fifty", "Crocin five hundred", "for five days")
 * into digits, so downstream dosage/duration parsing — which looks for
 * plain numbers — works whether the speaker said "650" or "six fifty".
 */

const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
};
const TEENS: Record<string, number> = {
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

function tensOrTeens(word: string): number | undefined {
  return TEENS[word] ?? TENS[word];
}

function isNumberWord(word: string): boolean {
  return word in ONES || word in TEENS || word in TENS || word === "hundred";
}

/** Resolves one run of consecutive number-words to its numeric value. */
function resolveRun(words: string[]): number | undefined {
  if (words.length === 0) return undefined;
  if (words.length === 1) {
    const w = words[0];
    return ONES[w] ?? TEENS[w] ?? TENS[w];
  }
  if (words.length === 2) {
    const [a, b] = words;
    if (a in ONES && b === "hundred") return ONES[a] * 100;
    if (a in TENS && b in ONES) return TENS[a] + ONES[b]; // "fifty six" -> 56
    if (a in ONES && tensOrTeens(b) !== undefined) {
      // Colloquial compact reading: "six fifty" -> 650, "two fifteen" -> 215
      return Number(`${ONES[a]}${tensOrTeens(b)}`);
    }
    return undefined;
  }
  if (words.length === 3) {
    const [a, b, c] = words;
    if (a in ONES && b === "hundred" && (c in ONES || tensOrTeens(c) !== undefined)) {
      return ONES[a] * 100 + (ONES[c] ?? tensOrTeens(c)!);
    }
    if (a in ONES && b in TENS && c in ONES) {
      // "one twenty five" -> 1 then (20+5=25) -> "125"
      return Number(`${ONES[a]}${TENS[b] + ONES[c]}`);
    }
    return undefined;
  }
  return undefined;
}

export function normalizeSpokenNumbers(text: string): string {
  const tokens = text.split(/(\s+)/); // keep whitespace so we can rejoin exactly
  const out: string[] = [];
  let run: string[] = [];
  let runHadWhitespace: string[] = [];

  function flush() {
    if (run.length === 0) return;
    const trailingSpace = runHadWhitespace[run.length - 1]; // whitespace after the run's last word
    const value = resolveRun(run);
    if (value !== undefined) {
      out.push(String(value));
      if (trailingSpace) out.push(trailingSpace);
    } else {
      // Couldn't resolve as one number — emit the words as-is.
      for (let i = 0; i < run.length; i++) {
        out.push(run[i]);
        if (runHadWhitespace[i]) out.push(runHadWhitespace[i]);
      }
    }
    run = [];
    runHadWhitespace = [];
  }

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      if (run.length > 0) runHadWhitespace[run.length - 1] = token;
      else out.push(token);
      continue;
    }
    const lower = token.toLowerCase();
    if (isNumberWord(lower)) {
      run.push(lower);
    } else {
      flush();
      out.push(token);
    }
  }
  flush();

  return out.join("");
}
