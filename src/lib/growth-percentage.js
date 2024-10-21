export function getGrowthPercentage(now, last) {
  if (!last || !now) {
    return;
  }

  const change = now - last;
  return Math.round((change / last) * 100);
}
