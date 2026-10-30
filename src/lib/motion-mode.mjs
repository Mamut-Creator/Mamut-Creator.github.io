export function resolveMotion(choice, systemReducesMotion) {
  if (choice === 'on') return true;
  if (choice === 'off') return false;
  return !systemReducesMotion;
}
