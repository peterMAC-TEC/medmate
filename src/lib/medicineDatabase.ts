/**
 * A curated list of medicine names commonly prescribed/sold in India —
 * brand names (often bundled with their typical strength, the way people
 * actually say them, e.g. "Dolo 650") and generic/molecule names. Used to
 * recognize a medication mentioned in speech with higher confidence than
 * generic grammar patterns alone. Not exhaustive or medical advice — a
 * mock stand-in for what a real drug-database lookup would provide.
 */
export const KNOWN_MEDICINES: string[] = [
  // Pain relief / fever
  "Dolo 650", "Dolo 1000", "Crocin", "Crocin 500", "Crocin Advance", "Calpol", "Calpol 650",
  "Combiflam", "Ibugesic Plus", "Disprin", "Meftal Spas", "Voveran", "Zerodol", "Zerodol-P",
  "Nise", "Flexon",
  // Antibiotics
  "Azithral 500", "Azee 500", "Augmentin 625", "Amoxyclav 625", "Cefixime", "Cifran 500",
  "Norflox", "Ofloxacin", "Doxt", "Taxim-O",
  // Gastro / acidity
  "Pan 40", "Pan-D", "Pantop 40", "Omez", "Rantac 150", "Digene", "Eno", "Gelusil", "Cyclopam",
  // Cold, cough, allergy
  "Cetirizine", "Cetrizine 10", "Allegra 120", "Montair LC", "Sinarest", "Cheston Cold",
  "Ascoril", "Benadryl", "Corex",
  // Diabetes
  "Metformin", "Metformin 500", "Glycomet 500", "Glimepiride", "Januvia", "Galvus Met",
  // Blood pressure / heart
  "Amlodipine", "Amlodipine 5", "Telma 40", "Losar 50", "Ecosprin 75", "Atorvastatin",
  "Atorvastatin 10", "Rosuvas", "Concor",
  // Thyroid
  "Thyronorm", "Eltroxin",
  // Vitamins / supplements
  "Becosules", "Shelcal 500", "Neurobion Forte", "Zincovit", "Limcee", "Calcirol",
  // Topical
  "Volini Gel", "Moov", "Betadine",
];

/**
 * Looks for the longest known medicine name present in the (already
 * number-normalized) text. Longest-match-first avoids "Pan 40" matching
 * only "Pan" when the fuller name is present.
 */
export function findKnownMedicine(text: string): string | undefined {
  const lower = text.toLowerCase();
  const sorted = [...KNOWN_MEDICINES].sort((a, b) => b.length - a.length);
  for (const name of sorted) {
    if (lower.includes(name.toLowerCase())) return name;
  }
  return undefined;
}
