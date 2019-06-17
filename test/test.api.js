const tap = require('tap');
const spawn = require('../');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

tap.test('set/get', t => {
  const { get, set } = spawn();
  set('key', 1);
  const r = get('key');
  t.equal(r, 1);
  t.end();
});

tap.test('set/get with ttl', async t => {
  const { get, set } = spawn();
  set('key2', 1, 500);
  let r = get('key2');
  t.ok(r);
  await wait(501);
  r = get('key2');
  t.notOk(r);
  t.end();
});

tap.test('remove', t => {
  const { get, set, remove } = spawn();
  set('key3', 1);
  remove('key3');
  const r = get('key2');
  t.notOk(r);
  t.end();
});

tap.test('removeAll', t => {
  const { get, set, removeAll } = spawn();
  set('key3', 1);
  set('key4', 1);
  removeAll();
  const r = get('key3');
  t.notOk(r);
  const r2 = get('key4');
  t.notOk(r2);
  t.end();
});

tap.test('getStats', t => {
  const { set, remove, getStats } = spawn();
  set('key3', 1);
  set('key4', 1);
  remove('key3');
  const s = getStats();
  t.match(s, { hits: 0, misses: 0, sets: 2, removes: 1 });
  t.end();
});

tap.test('instances do not collide', t => {
  const cache1 = spawn();
  const cache2 = spawn();
  cache1.set('key1', 1);
  cache2.set('key1', 2);
  const r1 = cache1.get('key1');
  const r2 = cache2.get('key1');
  t.equal(r1, 1);
  t.equal(r2, 2);
  t.end();
});

tap.test('set/get with allowStale', async t => {
  const { get, set } = spawn();
  set('key2', 1, 500);
  let r = get('key2');
  t.ok(r);
  await wait(501);
  r = get('key2');
  t.ok(r, 'in allowStale mode the cache has to be manually refreshed');
  t.end();
});
