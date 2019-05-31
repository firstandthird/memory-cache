const tap = require('tap');
const { get, set, remove, removeAll, getStats, memo } = require('../');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

tap.test('set/get', async t => {
  set('key', 1);
  const r = get('key');
  t.equal(r, 1);
  t.end();
});

tap.test('set/get with ttl', async t => {
  set('key2', 1, 500);
  let r = get('key2');
  t.ok(r);
  await wait(501);
  r = get('key2');
  t.notOk(r);
  t.end();
});

tap.test('remove', async t => {
  set('key3', 1);
  remove('key3');
  const r = get('key2');
  t.notOk(r);
  t.end();
});

tap.test('removeAll', async t => {
  set('key3', 1);
  set('key4', 1);
  removeAll();
  const r = get('key3');
  t.notOk(r);
  const r2 = get('key4');
  t.notOk(r2);
  t.end();
});

tap.test('getStats', async t => {
  set('key3', 1);
  set('key4', 1);
  remove('key3');
  const s = getStats();
  t.match(s, { hits: 2, misses: 4, sets: 7, removes: 2 });
  t.end();
});

tap.test('memo', async t => {
  let called = 0;
  const fP = async() => {
    called++;
    await wait(100);
    return 21;
  };
  let r1 = await memo('memo1', fP);
  t.equal(called, 1);
  t.equal(r1, 21);
  r1 = await memo('memo1', fP);
  t.equal(called, 1);
  t.equal(r1, 21);
  r1 = await memo('memo1', fP, 100, true);
  t.equal(called, 2);
  t.equal(r1, 21);
  await wait(110);
  r1 = await memo('memo1', fP);
  t.equal(called, 3);
  t.equal(r1, 21);
  t.end();
});
