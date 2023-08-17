export function array(length: number, filler?: unknown) {
  return Array(length).fill(filler || null);
}
