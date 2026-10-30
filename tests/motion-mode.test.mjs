import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveMotion } from '../src/lib/motion-mode.mjs';
test('por defecto respeta la preferencia del sistema', () => {
  assert.equal(resolveMotion(null, true), false);
  assert.equal(resolveMotion(null, false), true);
});
test('permite activar las animaciones explícitamente con movimiento reducido', () => {
  assert.equal(resolveMotion('on', true), true);
});
test('la pausa manual se conserva aunque el sistema permita animar', () => {
  assert.equal(resolveMotion('off', false), false);
});
