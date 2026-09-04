/**
 * Converts a full UUID to a short ID (first 8 characters)
 * @param id Full UUID (e.g., "e525c291-be7d-4176-8f0c-c8e741b80642")
 * @returns Short ID (e.g., "e525c291")
 */
export function toShortId(id: string | undefined | null): string {
  if (!id) return "";
  return id.slice(0, 8);
}

/**
 * Finds a full ID from a short ID in an array of objects
 * @param shortId Short ID (e.g., "e525c291")
 * @param items Array of items with id property
 * @returns Full ID if found, null otherwise
 */
export function findFullId<T extends { id: string }>(shortId: string | undefined, items: T[]): string | null {
  if (!shortId) return null;
  const found = items.find((item) => item.id.startsWith(shortId));
  return found?.id ?? null;
}
