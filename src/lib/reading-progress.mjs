export function readingProgress(top, height, viewport) {
  const distance = height - viewport;
  if (distance <= 0) return top <= 0 ? 1 : 0;
  return Math.max(0, Math.min(1, -top / distance));
}
