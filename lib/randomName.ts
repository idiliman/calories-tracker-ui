/**
 * Generates a random name in the format: adjective-noun-number
 * @returns string Example: "bold-water-1234"
 */
export function generateRandomName(): string {
  const adjectives = [
    "bold",
    "quiet",
    "rapid",
    "gentle",
    "wild",
    "proud",
    "calm",
    "brave",
    "wise",
    "swift",
    "eager",
    "kind",
    "pure",
    "bright",
    "cool",
    "autumn",
    "winter",
    "summer",
    "spring",
    "morning",
    "evening",
    "twilight",
    "midnight",
    "dawn",
    "dusk",
    "crimson",
    "azure",
    "golden",
    "silver",
    "cosmic",
  ];

  const nouns = [
    "water",
    "river",
    "cloud",
    "wind",
    "star",
    "moon",
    "sun",
    "bird",
    "tree",
    "leaf",
    "wave",
    "hill",
    "lake",
    "rain",
    "snow",
    "forest",
    "mountain",
    "ocean",
    "desert",
    "meadow",
    "valley",
    "thunder",
    "lightning",
    "storm",
    "breeze",
    "dawn",
    "dusk",
    "shadow",
    "light",
    "mist",
  ];

  // Generate random indices
  const adjectiveIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);

  // Generate a random 4-digit number
  const number = Math.floor(Math.random() * 9000) + 1000;

  return `${adjectives[adjectiveIndex]}-${nouns[nounIndex]}-${number}`;
}
