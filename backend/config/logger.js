const IS_PROD = process.env.NODE_ENV === "production";
const C = { error: "\x1b[31m", warn: "\x1b[33m", info: "\x1b[36m", http: "\x1b[35m", reset: "\x1b[0m" };

const log = (level, msg, meta = {}) => {
  if (IS_PROD) {
    const out = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...meta });
    level === "error" ? process.stderr.write(out + "\n") : process.stdout.write(out + "\n");
  } else {
    const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
    console.log(`${C[level] || ""}[${level.toUpperCase()}]${C.reset} ${msg}${metaStr}`);
  }
};

const logger = {
  info: (msg, meta = {}) => log("info", msg, meta),
  warn: (msg, meta = {}) => log("warn", msg, meta),
  error: (msg, meta = {}) => log("error", msg, meta),
  http: (msg, meta = {}) => log("http", msg, meta),
};

export default logger;
