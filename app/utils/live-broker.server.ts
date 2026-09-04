import type { LiveSnapshot } from "~/types/live";

interface LiveSubscriberPayload {
  payload: LiveSnapshot;
  updatedAt: string;
}

type Subscriber = (data: LiveSubscriberPayload) => void;

const subscribersBySlug = new Map<string, Set<Subscriber>>();

export function subscribeToLiveMatch(publicSlug: string, subscriber: Subscriber): () => void {
  const current = subscribersBySlug.get(publicSlug) ?? new Set<Subscriber>();
  current.add(subscriber);
  subscribersBySlug.set(publicSlug, current);

  return () => {
    const subs = subscribersBySlug.get(publicSlug);
    if (!subs) return;
    subs.delete(subscriber);
    if (subs.size === 0) {
      subscribersBySlug.delete(publicSlug);
    }
  };
}

export function publishLiveMatch(publicSlug: string, data: LiveSubscriberPayload): void {
  const subs = subscribersBySlug.get(publicSlug);
  if (!subs || subs.size === 0) return;

  for (const subscriber of subs) {
    try {
      subscriber(data);
    } catch {
      // Best-effort push: ignore individual subscriber errors.
    }
  }
}
