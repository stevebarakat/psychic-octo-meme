export function array(length: number, filler?: unknown) {
  return Array(length).fill(filler || null);
}

export function roundFourth(num: number): number {
  return parseFloat((Math.round(num * 4) / 4).toFixed(2));
}
