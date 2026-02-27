const store = new Map();
const ttlMap = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [k, exp] of ttlMap) {
    if (exp < now) { store.delete(k); ttlMap.delete(k); }
  }
}, 30000);

export const connectCache = () => {
  console.log("[CACHE] In-process cache active (set REDIS_URL env for Redis in production)");
};

export const cache = {
  get: async (key) => {
    const exp = ttlMap.get(key);
    if (exp && exp < Date.now()) { store.delete(key); ttlMap.delete(key); return null; }
    return store.get(key) ?? null;
  },
  set: async (key, val, ttlSeconds = 60) => {
    store.set(key, val);
    ttlMap.set(key, Date.now() + ttlSeconds * 1000);
  },
  del: async (key) => { store.delete(key); ttlMap.delete(key); },
  clear: async (prefix) => {
    for (const k of store.keys()) {
      if (k.startsWith(prefix)) { store.delete(k); ttlMap.delete(k); }
    }
  },
};
