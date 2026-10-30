export function motionEnabled() {
  const mode = document.documentElement.dataset.motion;
  if (mode) return mode === 'on';
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
