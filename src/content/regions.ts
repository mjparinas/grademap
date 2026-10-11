/** "British Columbia, Ontario and the Northwest Territories" */
export function listRegions(frameworks: readonly { region: string }[]): string {
  const names = frameworks.map((f) => (f.region === "Northwest Territories" ? "the Northwest Territories" : f.region));
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
