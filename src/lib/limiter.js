import { RateLimitError } from "./errors";
import { getIp } from "./get-ip";

const PRUNE_INTERVAL = 60 * 1000;

const trackers = new Map();

function pruneTrackers() {
  const now = Date.now();

  for (const [k, v] of trackers.entries()) {
    if (v.expiresAt < now) {
      trackers.delete(k);
    }
  }
}

setInterval(pruneTrackers, PRUNE_INTERVAL);

export async function RateLimitByIp({
  key = "global",
  limit = 1,
  window = 10000,
}) {
  const ip = getIp();
  if (!ip) {
    throw new RateLimitError();
  }
  await rateLimitByKey({
    key: `${ip}-${key}`,
    limit,
    window,
  });
}

export async function rateLimitByKey({
  key = "global",
  limit = 1,
  window = 10000,
}) {
  let tracker = trackers.get(key) || { count: 0, expiresAt: 0 };
  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker.count > limit) {
    throw new RateLimitError();
  }

  trackers.set(key, tracker);
}
