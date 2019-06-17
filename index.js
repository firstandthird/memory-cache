
module.exports = (allowStale = false) => {
  let cache = {};
  const stats = { hits: 0, misses: 0, sets: 0, removes: 0 };
  let get
  if (allowStale) {
    // allow stale ignores ttl, so you must refresh the cache manually
    get = function(key) {
      const val = cache[key];
      //if not exists:
      if (!val) {
        stats.misses++;
        return null;
      }
      stats.hits++;
      return val.value;
    };
  } else {
    get = function(key) {
      const val = cache[key];
      //if not exists:
      if (!val) {
        stats.misses++;
        return null;
      }
      // if value has expired and its in the past
      if (val.expires > 0 && val.expires < new Date().getTime()) {
        stats.misses++;
        return null;
      }
      stats.hits++;
      return val.value;
    };
  }
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
    set,
    remove,
    removeAll,
    getStats
  };
};
