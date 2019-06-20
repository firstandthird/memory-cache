class MemoryCache {
  constructor() {
    this.cache = {};
    this.stats = { hits: 0, misses: 0, sets: 0, removes: 0 };
  }

  getCacheObject(key) {
    const val = this.cache[key];
    //if not exists:
    if (!val) {
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return val;
  }

  get(key) {
    const val = this.getCacheObject(key);
    // if value exists but has expired:
    if (val === null || (val.expires > 0 && val.expires < new Date().getTime())) {
      return null;
    }
    return val.value;
  }

  set(key, value, ttl) {
    this.stats.sets++;
    this.cache[key] = {
      value,
      expires: ttl > 0 ? new Date().getTime() + ttl : -1
    };
  }

  remove(key) {
    this.stats.removes++;
    delete this.cache[key];
  }

  removeAll() {
    this.cache = {};
  }

  getStats() {
    return this.stats;
  }
}

module.exports = MemoryCache;
