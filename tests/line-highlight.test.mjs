import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHighlightedLines } from '../src/plugins/line-highlight.mjs';
test('mezcla de líneas y rangos sin duplicados',()=>assert.deepEqual([...parseHighlightedLines('{1,3-5,4}')],[1,3,4,5]));
test('bloque sin selección',()=>assert.equal(parseHighlightedLines('bash').size,0));
test('rechaza rangos invertidos, cero y rangos excesivos',()=>{for(const meta of ['{0}','{5-2}','{1-10001}'])assert.throws(()=>parseHighlightedLines(meta));});
