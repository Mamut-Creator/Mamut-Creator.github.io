import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingProgress } from '../src/lib/reading-progress.mjs';

test('reading progress starts at the article and ends at its bottom',()=>{
 assert.equal(readingProgress(300,3000,1000),0);
 assert.equal(readingProgress(-1000,3000,1000),.5);
 assert.equal(readingProgress(-2000,3000,1000),1);
 assert.equal(readingProgress(-2500,3000,1000),1);
});
test('short articles do not divide by zero or produce negative progress',()=>{
 assert.equal(readingProgress(100,500,1000),0);
 assert.equal(readingProgress(0,500,1000),1);
 assert.equal(readingProgress(0,1000,1000),1);
});
