const XSS = /<script[\s\S]*?>[\s\S]*?<\/script>|javascript:|on\w+\s*=|<[^>]+>/gi;
const BAD_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const clean = (val) => {
  if (typeof val === "string") return val.replace(XSS, "").trim();
  if (Array.isArray(val)) return val.map(clean);
  if (val && typeof val === "object") {
    const out = {};
    for (const k of Object.keys(val)) {
      if (!BAD_KEYS.has(k) && !k.startsWith("$")) out[k] = clean(val[k]);
    }
    return out;
  }
  return val;
};

const sanitize = (req, res, next) => {
  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);
  next();
};

export default sanitize;
