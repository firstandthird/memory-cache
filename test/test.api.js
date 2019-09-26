const tap = require('tap');
const MemoryCache = require('../');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

tap.test('set/get', t => {
  const cache = new MemoryCache();
  cache.set('key', 1);
  const r = cache.get('key');
  t.equal(r, 1);
  t.end();
});

tap.test('set/get with ttl', async t => {
  const cache = new MemoryCache();
  cache.set('key2', 1, 500);
  let r = cache.get('key2');
  t.ok(r);
  await wait(501);
  r = cache.get('key2');
  t.notOk(r);
  t.end();
});

tap.test('remove', t => {
  const cache = new MemoryCache();
  cache.set('key3', 1);
  cache.remove('key3');
  const r = cache.get('key2');
  t.notOk(r);
  t.end();
});

tap.test('removeAll', t => {
  const cache = new MemoryCache();
  cache.set('key3', 1);
  cache.set('key4', 1);
  cache.removeAll();
  const r = cache.get('key3');
  t.notOk(r);
  const r2 = cache.get('key4');
  t.notOk(r2);
  t.end();
});

tap.test('getStats', t => {
  const cache = new MemoryCache();
  cache.set('key3', 1);
  cache.set('key4', 1);
  cache.remove('key3');
  const s = cache.getStats();
  t.match(s, { hits: 0, misses: 0, sets: 2, removes: 1 });
  t.end();
});

tap.test('instances do not collide', t => {
  const cache1 = new MemoryCache();
  const cache2 = new MemoryCache();
  cache1.set('key1', 1);
  cache2.set('key1', 2);
  const r1 = cache1.get('key1');
  const r2 = cache2.get('key1');
  t.equal(r1, 1);
  t.equal(r2, 2);
  t.end();
});

tap.test('getCacheObject', async t => {
  const cache = new MemoryCache();
  cache.set('key2', 1, 500);
  let r = cache.getCacheObject('key2');
  t.ok(r.value);
  t.ok(r.expires);
  await wait(501);
  r = cache.getCacheObject('key2');
  t.ok(r, 'in allowStale mode the cache has to be manually refreshed');
  t.end();
});

tap.test('set/get with ttl -1', async t => {
  const cache = new MemoryCache();
  cache.set('key2', 1, -1);
  let r = cache.get('key2');
  t.ok(r);
  await wait(501);
  r = cache.get('key2');
  t.ok(r);
  const obj = cache.getCacheObject('key2');
  t.equal(obj.expires, -1);
  t.end();
});
