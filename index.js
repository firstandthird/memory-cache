
module.exports = () => {
  let cache = {};
  const stats = { hits: 0, misses: 0, sets: 0, removes: 0 };
  const getCacheObject = function(key) {
    const val = cache[key];
    //if not exists:
    if (!val) {
      stats.misses++;
      return null;
    }
    stats.hits++;
    return val;
  };
  const get = function(key) {
    const val = getCacheObject(key);
    // if value exists but has expired:
    if (val === null || (val.expires > 0 && val.expires < new Date().getTime())) {
      return null;
    }
    return val.value;
  };
  const set = function(key, value, ttl) {
    stats.sets++;
    cache[key] = {
      value,
      expires: ttl > 0 ? new Date().getTime() + ttl : -1
    };
  };

  const remove = function(key) {
    stats.removes++;
    delete cache[key];
  };

  const removeAll = function() {
    cache = {};
  };

  const getStats = function() {
    return stats;
  };
  return {
    get,
    getCacheObject,
    set,
    remove,
    removeAll,
    getStats
  };
};
