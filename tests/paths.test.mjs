import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from '../src/lib/paths.mjs';
test('root and repository deployment paths', () => {
  assert.equal(withBase('/', '/'), '/');
  assert.equal(withBase('/acerca/', '/portfolio/'), '/portfolio/acerca/');
  assert.equal(withBase('/#archivo', '/portfolio/'), '/portfolio/#archivo');
  assert.equal(withBase('/fonts/font.woff2', '/portfolio'), '/portfolio/fonts/font.woff2');
});
test('external URLs and local fragment links remain intact', () => {
  for (const path of ['https://example.org/a', 'mailto:a@example.org', '#contenido', '//example.org/a']) {
    assert.equal(withBase(path, '/portfolio/'), path);
  }
});
